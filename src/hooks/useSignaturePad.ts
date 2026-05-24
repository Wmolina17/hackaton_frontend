import { useCallback, useEffect, useRef, useState } from "react";

interface UseSignaturePadOptions {
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
}

export function useSignaturePad({
  width = 400,
  height = 160,
  strokeColor = "#0f172a",
  strokeWidth = 2,
}: UseSignaturePadOptions = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [isEmpty, setIsEmpty] = useState(true);

  const getPoint = useCallback(
    (e: MouseEvent | TouchEvent): { x: number; y: number } | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      if ("touches" in e) {
        const touch = e.touches[0];
        if (!touch) return null;
        return {
          x: (touch.clientX - rect.left) * scaleX,
          y: (touch.clientY - rect.top) * scaleY,
        };
      }
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    },
    []
  );

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, [width, height, strokeColor, strokeWidth]);

  useEffect(() => {
    setupCanvas();
  }, [setupCanvas]);

  const startDraw = useCallback(
    (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      const point = getPoint(e);
      if (!ctx || !point) return;
      drawing.current = true;
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
    },
    [getPoint]
  );

  const draw = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!drawing.current) return;
      e.preventDefault();
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      const point = getPoint(e);
      if (!ctx || !point) return;
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
      setIsEmpty(false);
    },
    [getPoint]
  );

  const endDraw = useCallback(() => {
    drawing.current = false;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", endDraw);
    canvas.addEventListener("mouseleave", endDraw);
    canvas.addEventListener("touchstart", startDraw, { passive: false });
    canvas.addEventListener("touchmove", draw, { passive: false });
    canvas.addEventListener("touchend", endDraw);

    return () => {
      canvas.removeEventListener("mousedown", startDraw);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", endDraw);
      canvas.removeEventListener("mouseleave", endDraw);
      canvas.removeEventListener("touchstart", startDraw);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", endDraw);
    };
  }, [startDraw, draw, endDraw]);

  const clear = useCallback(() => {
    setupCanvas();
    setIsEmpty(true);
  }, [setupCanvas]);

  const toDataUrl = useCallback((): string | null => {
    if (isEmpty) return null;
    return canvasRef.current?.toDataURL("image/png") ?? null;
  }, [isEmpty]);

  const loadFromDataUrl = useCallback(
    (dataUrl: string | null) => {
      setupCanvas();
      if (!dataUrl) {
        setIsEmpty(true);
        return;
      }
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setIsEmpty(false);
      };
      img.src = dataUrl;
    },
    [setupCanvas]
  );

  return { canvasRef, isEmpty, clear, toDataUrl, loadFromDataUrl };
}

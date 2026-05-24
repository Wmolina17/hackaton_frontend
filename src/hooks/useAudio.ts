import { useCallback, useEffect, useRef, useState } from "react";
import type { ConsultStatus } from "@/types/consult";

const MIME_TYPES = ["audio/webm", "audio/mp4", "audio/ogg"];

function getSupportedMimeType(): string {
  for (const type of MIME_TYPES) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return "";
}

export function useAudio() {
  const [status, setStatus] = useState<ConsultStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [frequencyData, setFrequencyData] = useState<Uint8Array>(
    () => new Uint8Array(0)
  );
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const isPreviewRef = useRef(false);
  const isRecordingRef = useRef(false);

  const stopAnimation = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const releaseStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const closeAudioContext = useCallback(() => {
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      void audioContextRef.current.close();
    }
    audioContextRef.current = null;
    analyserRef.current = null;
  }, []);

  const cleanup = useCallback(() => {
    stopAnimation();
    if (mediaRecorderRef.current?.state !== "inactive") {
      mediaRecorderRef.current?.stop();
    }
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    isPreviewRef.current = false;
    isRecordingRef.current = false;
    releaseStream();
    closeAudioContext();
  }, [closeAudioContext, releaseStream, stopAnimation]);

  const setupAnalyser = useCallback((stream: MediaStream) => {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 64;
    source.connect(analyser);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    setFrequencyData(new Uint8Array(analyser.frequencyBinCount));
  }, []);

  const runVisualization = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const buffer = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      analyser.getByteFrequencyData(buffer);
      setFrequencyData(new Uint8Array(buffer));
      animationFrameRef.current = requestAnimationFrame(tick);
    };

    stopAnimation();
    animationFrameRef.current = requestAnimationFrame(tick);
  }, [stopAnimation]);

  const requestMicrophone = useCallback(async (): Promise<MediaStream> => {
    if (streamRef.current?.active) {
      return streamRef.current;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setError(null);
      return stream;
    } catch {
      const message =
        "No se pudo acceder al micrófono. Comprueba los permisos del navegador.";
      setError(message);
      setStatus("error");
      throw new Error(message);
    }
  }, []);

  const startPreview = useCallback(async () => {
    if (isRecordingRef.current) return;

    try {
      const stream = await requestMicrophone();
      if (!analyserRef.current) {
        setupAnalyser(stream);
      }
      isPreviewRef.current = true;
      setStatus("listening");
      runVisualization();
    } catch {
      // error already set in requestMicrophone
    }
  }, [requestMicrophone, runVisualization, setupAnalyser]);

  const stopPreview = useCallback(() => {
    if (isRecordingRef.current) return;

    isPreviewRef.current = false;
    stopAnimation();
    releaseStream();
    closeAudioContext();
    setFrequencyData(new Uint8Array(0));
    setStatus((current) =>
      current === "processing" || current === "error" ? current : "idle"
    );
  }, [closeAudioContext, releaseStream, stopAnimation]);

  const startRecording = useCallback(async () => {
    if (isRecordingRef.current) return;

    try {
      const stream = await requestMicrophone();
      if (!analyserRef.current) {
        setupAnalyser(stream);
      }
      runVisualization();

      const mimeType = getSupportedMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        setAudioBlob(blob);
        chunksRef.current = [];
        isRecordingRef.current = false;
      };

      recorder.onerror = () => {
        setError("Error al grabar audio.");
        setStatus("error");
        isRecordingRef.current = false;
      };

      mediaRecorderRef.current = recorder;
      isPreviewRef.current = false;
      isRecordingRef.current = true;
      recorder.start();
      setStatus("listening");
      setAudioBlob(null);
      setError(null);
    } catch {
      // handled in requestMicrophone
    }
  }, [requestMicrophone, runVisualization, setupAnalyser]);

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive") return;

    recorder.stop();
    stopAnimation();
    releaseStream();
    closeAudioContext();
    setFrequencyData(new Uint8Array(0));
    setStatus("processing");
  }, [closeAudioContext, releaseStream, stopAnimation]);

  const reset = useCallback(() => {
    cleanup();
    setStatus("idle");
    setError(null);
    setAudioBlob(null);
    setFrequencyData(new Uint8Array(0));
  }, [cleanup]);

  const setProcessing = useCallback(() => {
    setStatus("processing");
    setError(null);
  }, []);

  const setIdle = useCallback(() => {
    setStatus("idle");
    setError(null);
  }, []);

  const setFailed = useCallback((message: string) => {
    setError(message);
    setStatus("error");
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    status,
    error,
    frequencyData,
    audioBlob,
    startPreview,
    stopPreview,
    startRecording,
    stopRecording,
    reset,
    setProcessing,
    setIdle,
    setFailed,
  };
}

import { useMemo } from "react";
import "./WaveformVisualizer.css";

interface WaveformVisualizerProps {
  frequencyData: Uint8Array;
  barCount?: number;
  className?: string;
}

export function WaveformVisualizer({
  frequencyData,
  barCount = 32,
  className = "",
}: WaveformVisualizerProps) {
  const bars = useMemo(() => {
    if (frequencyData.length === 0) {
      return Array.from({ length: barCount }, () => 0.12);
    }

    const step = Math.max(1, Math.floor(frequencyData.length / barCount));
    const values: number[] = [];

    for (let i = 0; i < barCount; i++) {
      const index = Math.min(i * step, frequencyData.length - 1);
      values.push(frequencyData[index] / 255);
    }

    return values;
  }, [barCount, frequencyData]);

  return (
    <div
      className={`waveform ${className}`.trim()}
      role="img"
      aria-label="Visualizador de onda de audio"
    >
      {bars.map((value, index) => (
        <span
          key={index}
          className="waveform__bar"
          style={{ transform: `scaleY(${Math.max(0.12, value)})` }}
        />
      ))}
    </div>
  );
}

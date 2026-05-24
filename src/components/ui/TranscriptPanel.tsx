import "./TranscriptPanel.css";

interface TranscriptPanelProps {
  transcript: string | null;
}

export function TranscriptPanel({ transcript }: TranscriptPanelProps) {
  if (!transcript) return null;

  return (
    <aside className="transcript-panel" aria-live="polite">
      <p className="transcript-panel__label">Transcripción de voz</p>
      <p className="transcript-panel__text">{transcript}</p>
    </aside>
  );
}

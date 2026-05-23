import type { ConsultStatus } from "@/types/consult";
import "./AudioRecordButton.css";

interface AudioRecordButtonProps {
  status: ConsultStatus;
  disabled?: boolean;
  onStart: () => void;
  onStop: () => void;
}

export function AudioRecordButton({
  status,
  disabled = false,
  onStart,
  onStop,
}: AudioRecordButtonProps) {
  const isRecording = status === "listening";
  const isBusy = status === "processing" || disabled;

  const handleClick = () => {
    if (isBusy) return;
    if (isRecording) {
      onStop();
    } else {
      onStart();
    }
  };

  return (
    <button
      type="button"
      className={`audio-record-btn ${isRecording ? "audio-record-btn--active" : ""}`}
      onClick={handleClick}
      disabled={isBusy}
      aria-label={isRecording ? "Detener grabación" : "Iniciar grabación de voz"}
      aria-pressed={isRecording}
    >
      <span className="audio-record-btn__icon" aria-hidden="true">
        {isRecording ? (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2zm-5 7a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" />
          </svg>
        )}
      </span>
    </button>
  );
}

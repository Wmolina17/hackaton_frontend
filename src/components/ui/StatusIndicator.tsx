import type { ConsultStatus } from "@/types/consult";
import "./StatusIndicator.css";

interface StatusIndicatorProps {
  status: ConsultStatus;
  error?: string | null;
}

const LABELS: Record<Exclude<ConsultStatus, "idle">, string> = {
  listening: "Grabando consulta…",
  processing: "Procesando audio e IA…",
  error: "Error",
};

export function StatusIndicator({ status, error }: StatusIndicatorProps) {
  if (status === "idle") {
    return (
      <div className="status-indicator status-indicator--idle" aria-live="polite">
        <span className="status-indicator__dot status-indicator__dot--idle" />
        Listo
      </div>
    );
  }

  const label =
    status === "error" ? error || LABELS.error : LABELS[status];

  return (
    <div
      className={`status-indicator status-indicator--${status}`}
      role="status"
      aria-live="polite"
    >
      {status === "processing" && (
        <span className="status-indicator__spinner" aria-hidden="true" />
      )}
      {status === "listening" && (
        <span className="status-indicator__dot" aria-hidden="true" />
      )}
      {status === "error" && (
        <span className="status-indicator__dot status-indicator__dot--error" aria-hidden="true" />
      )}
      <span>{label}</span>
    </div>
  );
}

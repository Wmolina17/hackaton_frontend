import type { Slot } from "@/types/agendar";
import "./SlotPicker.css";

interface SlotPickerProps {
  slots: Slot[];
  selectedId?: number;
  onSelect: (slot: Slot) => void;
  loading?: boolean;
  error?: string | null;
}

function formatSlot(datetime: string): string {
  return new Date(datetime).toLocaleString("es-CO", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SlotPicker({
  slots,
  selectedId,
  onSelect,
  loading,
  error,
}: SlotPickerProps) {
  if (!slots.length && !loading) {
    return (
      <p className="slot-picker__hint">Selecciona un médico para ver horarios.</p>
    );
  }

  if (loading) {
    return <p className="slot-picker__hint">Cargando horarios…</p>;
  }

  if (error) {
    return <p className="slot-picker__error">{error}</p>;
  }

  if (!slots.length) {
    return (
      <p className="slot-picker__hint">No hay cupos disponibles para este médico.</p>
    );
  }

  return (
    <div className="slot-picker">
      {slots.map((slot) => (
        <button
          key={slot.id}
          type="button"
          className={`slot-picker__slot ${
            selectedId === slot.id ? "slot-picker__slot--selected" : ""
          }`}
          aria-pressed={selectedId === slot.id}
          onClick={() => onSelect(slot)}
        >
          {formatSlot(slot.datetime)}
        </button>
      ))}
    </div>
  );
}

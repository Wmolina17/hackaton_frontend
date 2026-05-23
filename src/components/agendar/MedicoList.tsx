import type { Medico } from "@/types/agendar";
import "./MedicoList.css";

interface MedicoListProps {
  medicos: Medico[];
  selectedId?: number;
  onSelect: (medico: Medico) => void;
  loading?: boolean;
}

export function MedicoList({
  medicos,
  selectedId,
  onSelect,
  loading,
}: MedicoListProps) {
  if (loading) {
    return <p className="medico-list__hint">Cargando médicos…</p>;
  }

  if (!medicos.length) {
    return <p className="medico-list__hint">No hay médicos disponibles.</p>;
  }

  return (
    <ul className="medico-list">
      {medicos.map((m) => (
        <li key={m.id}>
          <button
            type="button"
            className={`medico-list__card ${
              selectedId === m.id ? "medico-list__card--selected" : ""
            }`}
            aria-pressed={selectedId === m.id}
            onClick={() => onSelect(m)}
          >
            <span className="medico-list__avatar">{m.nombre.charAt(0)}</span>
            <div>
              <strong>{m.nombre}</strong>
              <span>{m.especialidad}</span>
              {m.eps && <span className="medico-list__eps">EPS: {m.eps}</span>}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}

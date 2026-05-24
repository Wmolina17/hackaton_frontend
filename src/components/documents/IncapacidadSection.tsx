import type { HistorialClinico } from "@/types/historial";
import { DEFAULT_INCAPACIDAD_DIAS, DEFAULT_INCAPACIDAD_RECOMENDACIONES } from "@/types/documents";
import "./IncapacidadSection.css";

interface IncapacidadSectionProps {
  historial: HistorialClinico;
  onChange: (historial: HistorialClinico) => void;
  disabled?: boolean;
}

export function IncapacidadSection({
  historial,
  onChange,
  disabled,
}: IncapacidadSectionProps) {
  const dias = historial.incapacidad_dias ?? DEFAULT_INCAPACIDAD_DIAS;
  const recomendaciones =
    historial.incapacidad_recomendaciones ?? DEFAULT_INCAPACIDAD_RECOMENDACIONES;

  return (
    <section className="incap-section" aria-labelledby="incap-heading">
      <h3 id="incap-heading">Incapacidad médica</h3>
      <p className="incap-section__hint">
        Configura los días y recomendaciones. El documento se actualiza automáticamente.
      </p>
      <div className="incap-section__fields">
        <label>
          Días de incapacidad
          <input
            type="number"
            min={1}
            max={90}
            value={dias}
            disabled={disabled}
            onChange={(e) =>
              onChange({
                ...historial,
                incapacidad_dias: Math.max(1, Number(e.target.value) || 1),
              })
            }
          />
        </label>
        <label>
          Recomendaciones
          <textarea
            rows={3}
            value={recomendaciones}
            disabled={disabled}
            onChange={(e) =>
              onChange({ ...historial, incapacidad_recomendaciones: e.target.value })
            }
          />
        </label>
      </div>
    </section>
  );
}

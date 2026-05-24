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
  const aplica = historial.requiere_incapacidad ?? false;
  const dias = historial.incapacidad_dias ?? DEFAULT_INCAPACIDAD_DIAS;
  const recomendaciones =
    historial.incapacidad_recomendaciones ?? DEFAULT_INCAPACIDAD_RECOMENDACIONES;

  function toggleAplica(checked: boolean) {
    onChange({
      ...historial,
      requiere_incapacidad: checked,
      incapacidad_dias: checked ? dias : undefined,
      incapacidad_recomendaciones: checked ? recomendaciones : undefined,
    });
  }

  return (
    <section className="incap-section" aria-labelledby="incap-heading">
      <div className="incap-section__head">
        <div>
          <h3 id="incap-heading">Incapacidad médica</h3>
          <p className="incap-section__hint">
            Confirma si el paciente requiere incapacidad. El documento se genera solo si aplica.
          </p>
        </div>
        <label className="incap-section__toggle">
          <input
            type="checkbox"
            checked={aplica}
            disabled={disabled}
            onChange={(e) => toggleAplica(e.target.checked)}
          />
          <span>Aplica incapacidad</span>
        </label>
      </div>

      {aplica && (
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
                  requiere_incapacidad: true,
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
                onChange({
                  ...historial,
                  requiere_incapacidad: true,
                  incapacidad_recomendaciones: e.target.value,
                })
              }
            />
          </label>
        </div>
      )}
    </section>
  );
}

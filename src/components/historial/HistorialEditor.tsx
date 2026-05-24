import type { HistorialClinico } from "@/types/historial";
import "./HistorialEditor.css";

interface HistorialEditorProps {
  historial: HistorialClinico;
  onChange: (historial: HistorialClinico) => void;
  disabled?: boolean;
}

export function HistorialEditor({
  historial,
  onChange,
  disabled,
}: HistorialEditorProps) {
  function update<K extends keyof HistorialClinico>(
    field: K,
    value: HistorialClinico[K]
  ) {
    onChange({ ...historial, [field]: value });
  }

  function updateSintoma(index: number, value: string) {
    const sintomas = [...historial.sintomas];
    sintomas[index] = value;
    update("sintomas", sintomas);
  }

  return (
    <div className="historial-editor">
      <label>
        Motivo de consulta
        <textarea
          value={historial.motivo}
          onChange={(e) => update("motivo", e.target.value)}
          rows={2}
          disabled={disabled}
        />
      </label>

      <fieldset className="historial-editor__fieldset" disabled={disabled}>
        <legend>Síntomas</legend>
        {historial.sintomas.map((s, i) => (
          <div key={i} className="historial-editor__row">
            <input
              type="text"
              value={s}
              onChange={(e) => updateSintoma(i, e.target.value)}
              placeholder={`Síntoma ${i + 1}`}
            />
            <button
              type="button"
              onClick={() =>
                update(
                  "sintomas",
                  historial.sintomas.filter((_, idx) => idx !== i)
                )
              }
              aria-label="Quitar síntoma"
            >
              −
            </button>
          </div>
        ))}
        <button
          type="button"
          className="historial-editor__add"
          onClick={() => update("sintomas", [...historial.sintomas, ""])}
        >
          + Agregar síntoma
        </button>
      </fieldset>

      <label>
        Diagnóstico
        <textarea
          value={historial.diagnostico}
          onChange={(e) => update("diagnostico", e.target.value)}
          rows={2}
          disabled={disabled}
        />
      </label>

      <label>
        Plan de tratamiento
        <textarea
          value={historial.plan}
          onChange={(e) => update("plan", e.target.value)}
          rows={3}
          disabled={disabled}
        />
      </label>

      {historial.alergias !== undefined && (
        <label>
          Alergias
          <input
            type="text"
            value={historial.alergias}
            onChange={(e) => update("alergias", e.target.value)}
            disabled={disabled}
          />
        </label>
      )}
    </div>
  );
}

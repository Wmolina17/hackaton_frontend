import { Button } from "@/components/ui/Button";
import type { MedicamentoHistorial } from "@/types/historial";
import "./MedicamentosSection.css";

interface MedicamentosSectionProps {
  medicamentos: MedicamentoHistorial[];
  eps: string;
  onChange: (meds: MedicamentoHistorial[]) => void;
  onRefreshCobertura?: () => void;
  loadingCobertura?: boolean;
  disabled?: boolean;
}

export function MedicamentosSection({
  medicamentos,
  eps,
  onChange,
  onRefreshCobertura,
  loadingCobertura,
  disabled,
}: MedicamentosSectionProps) {
  function updateMed(index: number, field: keyof MedicamentoHistorial, value: string | boolean) {
    const next = medicamentos.map((m, i) =>
      i === index ? { ...m, [field]: value } : m
    );
    onChange(next);
  }

  return (
    <section className="meds-section" aria-labelledby="meds-heading">
      <div className="meds-section__head">
        <h3 id="meds-heading">Medicamentos y cobertura EPS</h3>
        {!disabled && onRefreshCobertura && (
          <Button
            variant="secondary"
            type="button"
            disabled={loadingCobertura}
            onClick={onRefreshCobertura}
          >
            {loadingCobertura
              ? "Consultando EPS…"
              : `Actualizar cobertura (${eps})`}
          </Button>
        )}
      </div>

      {!medicamentos.length ? (
        <>
          <p className="meds-section__empty">Sin medicamentos registrados.</p>
          {!disabled && (
            <button
              type="button"
              className="meds-section__add"
              onClick={() =>
                onChange([
                  ...medicamentos,
                  { nombre: "", cubierto: true, generico_alternativa: "" },
                ])
              }
            >
              + Agregar medicamento
            </button>
          )}
        </>
      ) : (
        <>
          <ul className="meds-section__list">
            {medicamentos.map((med, i) => (
              <li key={i} className="meds-section__card">
                <div className="meds-section__card-head">
                  <strong>{med.nombre || `Medicamento ${i + 1}`}</strong>
                  <span
                    className={
                      med.cubierto
                        ? "meds-section__tag meds-section__tag--ok"
                        : "meds-section__tag"
                    }
                  >
                    {med.cubierto ? "Cubierto" : "No cubierto"}
                  </span>
                </div>
                {!disabled && (
                  <>
                    <label>
                      Nombre
                      <input
                        type="text"
                        value={med.nombre}
                        onChange={(e) => updateMed(i, "nombre", e.target.value)}
                      />
                    </label>
                    <label className="meds-section__check">
                      <input
                        type="checkbox"
                        checked={med.cubierto}
                        onChange={(e) =>
                          updateMed(i, "cubierto", e.target.checked)
                        }
                      />
                      Cubierto por EPS
                    </label>
                    <label>
                      Alternativa genérica
                      <input
                        type="text"
                        value={med.generico_alternativa ?? ""}
                        onChange={(e) =>
                          updateMed(i, "generico_alternativa", e.target.value)
                        }
                      />
                    </label>
                  </>
                )}
              </li>
            ))}
          </ul>
          {!disabled && (
            <button
              type="button"
              className="meds-section__add"
              onClick={() =>
                onChange([
                  ...medicamentos,
                  { nombre: "", cubierto: true, generico_alternativa: "" },
                ])
              }
            >
              + Agregar medicamento
            </button>
          )}
        </>
      )}
    </section>
  );
}

import type { MedicamentoHistorial } from "@/types/historial";
import "./MedicamentosSection.css";

interface MedicamentosSectionProps {
  medicamentos: MedicamentoHistorial[];
  onChange?: (meds: MedicamentoHistorial[]) => void;
  loadingCobertura?: boolean;
  disabled?: boolean;
}

export function MedicamentosSection({
  medicamentos,
  onChange,
  loadingCobertura,
  disabled,
}: MedicamentosSectionProps) {
  function updateNombre(index: number, value: string) {
    if (!onChange) return;
    const next = medicamentos.map((m, i) =>
      i === index ? { ...m, nombre: value } : m
    );
    onChange(next);
  }

  function addMedicamento() {
    if (!onChange) return;
    onChange([
      ...medicamentos,
      { nombre: "", cubierto: false, generico_alternativa: "" },
    ]);
  }

  function removeMedicamento(index: number) {
    if (!onChange) return;
    onChange(medicamentos.filter((_, i) => i !== index));
  }

  return (
    <section className="meds-section" aria-labelledby="meds-heading">
      <div className="meds-section__head">
        <div>
          <h3 id="meds-heading">Medicamentos propuestos</h3>
          <p className="meds-section__hint">
            La disponibilidad la determina el sistema al revisar cada medicamento.
          </p>
        </div>
        {loadingCobertura && (
          <span className="meds-section__checking" role="status">
            Verificando…
          </span>
        )}
      </div>

      {!medicamentos.length ? (
        <>
          <p className="meds-section__empty">Sin medicamentos registrados.</p>
          {!disabled && onChange && (
            <button type="button" className="meds-section__add" onClick={addMedicamento}>
              + Proponer medicamento
            </button>
          )}
        </>
      ) : (
        <>
          <ul className="meds-section__list">
            {medicamentos.map((med, i) => (
              <li key={i} className="meds-section__card">
                <div className="meds-section__card-head">
                  {!disabled && onChange ? (
                    <label className="meds-section__name-field">
                      <span className="sr-only">Nombre del medicamento</span>
                      <input
                        type="text"
                        value={med.nombre}
                        onChange={(e) => updateNombre(i, e.target.value)}
                        placeholder="Nombre del medicamento"
                      />
                    </label>
                  ) : (
                    <strong>{med.nombre || `Medicamento ${i + 1}`}</strong>
                  )}
                  <span
                    className={
                      med.cubierto
                        ? "meds-section__tag meds-section__tag--ok"
                        : "meds-section__tag"
                    }
                  >
                    {med.cubierto ? "Disponible" : "No disponible"}
                  </span>
                </div>
                {med.generico_alternativa && !med.cubierto && (
                  <p className="meds-section__alt">
                    {med.generico_alternativa}
                  </p>
                )}
                {(med.dosis || med.frecuencia) && (
                  <p className="meds-section__dose">
                    {[med.dosis, med.frecuencia].filter(Boolean).join(" · ")}
                  </p>
                )}
                {!disabled && onChange && (
                  <button
                    type="button"
                    className="meds-section__remove"
                    onClick={() => removeMedicamento(i)}
                  >
                    Quitar
                  </button>
                )}
              </li>
            ))}
          </ul>
          {!disabled && onChange && (
            <button type="button" className="meds-section__add" onClick={addMedicamento}>
              + Proponer medicamento
            </button>
          )}
        </>
      )}
    </section>
  );
}

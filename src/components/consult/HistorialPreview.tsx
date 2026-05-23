import type { HistorialMedico } from "@/types/consult";
import "./HistorialPreview.css";

interface HistorialPreviewProps {
  historial: HistorialMedico;
}

export function HistorialPreview({ historial }: HistorialPreviewProps) {
  return (
    <section className="historial-preview" aria-label="Vista previa del historial generado por IA">
      <header className="historial-preview__header">
        <h2>Historial generado</h2>
        <p>El médico podrá revisar y editar estos campos en el siguiente paso.</p>
      </header>

      <dl className="historial-preview__fields">
        <div className="historial-preview__field">
          <dt>Motivo de consulta</dt>
          <dd>{historial.motivo_consulta}</dd>
        </div>
        <div className="historial-preview__field">
          <dt>Síntomas</dt>
          <dd>
            <ul>
              {historial.sintomas.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div className="historial-preview__field">
          <dt>Diagnóstico</dt>
          <dd>{historial.diagnostico}</dd>
        </div>
        <div className="historial-preview__field">
          <dt>Plan de tratamiento</dt>
          <dd>{historial.plan_tratamiento}</dd>
        </div>
        <div className="historial-preview__field">
          <dt>Alergias</dt>
          <dd>{historial.alergias}</dd>
        </div>
        <div className="historial-preview__field">
          <dt>Notas adicionales</dt>
          <dd>{historial.notas_adicionales}</dd>
        </div>
      </dl>

      <div className="historial-preview__meds">
        <h3>Medicamentos disponibles</h3>
        <ul>
          {historial.medicamentos.disponibles_eps.map((med) => (
            <li key={med.nombre}>
              <strong>{med.nombre}</strong> — {med.dosis}, {med.frecuencia}
            </li>
          ))}
        </ul>
      </div>

      <div className="historial-preview__meds historial-preview__meds--ideal">
        <h3>Alternativas sugeridas</h3>
        <ul>
          {historial.medicamentos.ideales_sugeridos.map((med) => (
            <li key={med.nombre}>
              <strong>{med.nombre}</strong> — {med.razon}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

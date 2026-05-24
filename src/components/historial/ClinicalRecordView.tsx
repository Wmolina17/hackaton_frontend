import type { HistorialClinico } from "@/types/historial";
import { MedicamentosSection } from "@/components/historial/MedicamentosSection";
import "./ClinicalRecordView.css";

interface ClinicalRecordViewProps {
  historial: HistorialClinico;
}

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value?.trim()) return null;
  return (
    <div className="clinical-record__field">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export function ClinicalRecordView({ historial }: ClinicalRecordViewProps) {
  const sintomas = historial.sintomas.filter(Boolean).join("; ");

  return (
    <article className="clinical-record mn-panel">
      <header className="clinical-record__header">
        <div>
          <p className="clinical-record__eyebrow">Historia clínica de consulta</p>
          <h3>{historial.paciente_nombre ?? "Paciente"}</h3>
          {historial.paciente_documento && (
            <p className="clinical-record__meta">CC {historial.paciente_documento}</p>
          )}
        </div>
        {historial.firmado && (
          <span className="clinical-record__badge">Firmado por el médico</span>
        )}
      </header>

      <section className="clinical-record__section">
        <h4>Información clínica</h4>
        <dl className="clinical-record__grid">
          <Field label="Motivo de consulta" value={historial.motivo} />
          <Field label="Enfermedad actual" value={sintomas} />
          <Field label="Diagnóstico" value={historial.diagnostico} />
          <Field label="Plan de tratamiento" value={historial.plan} />
          <Field label="Alergias" value={historial.alergias} />
          <Field label="Observaciones" value={historial.notas_adicionales} />
        </dl>
      </section>

      {(historial.medicamentos?.length ?? 0) > 0 && (
        <section className="clinical-record__section">
          <h4>Medicamentos</h4>
          <MedicamentosSection medicamentos={historial.medicamentos} disabled />
        </section>
      )}

      {historial.requiere_incapacidad && (historial.incapacidad_dias ?? 0) > 0 && (
        <section className="clinical-record__section">
          <h4>Incapacidad médica</h4>
          <dl className="clinical-record__grid">
            <Field label="Días de incapacidad" value={String(historial.incapacidad_dias)} />
            <Field label="Recomendaciones" value={historial.incapacidad_recomendaciones} />
          </dl>
        </section>
      )}
    </article>
  );
}

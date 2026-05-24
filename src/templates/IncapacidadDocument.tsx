import type { DocumentBundle } from "@/types/documents";
import { formatClinicalDate } from "@/services/clinicalDocuments";
import { DocumentShell } from "./DocumentShell";
import "./DocumentShell.css";

interface IncapacidadDocumentProps {
  bundle: DocumentBundle;
  documentId?: string;
}

export function IncapacidadDocument({
  bundle,
  documentId = "doc-incapacidad",
}: IncapacidadDocumentProps) {
  const { paciente, medico, incapacidad, fechaEmision } = bundle;
  if (!incapacidad) return null;

  return (
    <DocumentShell
      title="Certificado de Incapacidad Médica"
      medico={medico}
      fechaEmision={fechaEmision}
      documentId={documentId}
      subtitle="Certificado laboral — Reposo médico"
    >
      <div className="doc-paciente-grid">
        <div>
          <span>Paciente</span>
          <strong>{paciente.nombre}</strong>
        </div>
        <div>
          <span>Documento</span>
          <strong>{paciente.documento}</strong>
        </div>
      </div>

      <dl>
        <div className="doc-field">
          <dt>Período de incapacidad</dt>
          <dd>
            Desde <strong>{formatClinicalDate(incapacidad.fechaInicio)}</strong> hasta{" "}
            <strong>{formatClinicalDate(incapacidad.fechaFin)}</strong>{" "}
            (<strong>{incapacidad.dias} días calendario</strong>)
          </dd>
        </div>
        <div className="doc-field">
          <dt>Diagnóstico que fundamenta la incapacidad</dt>
          <dd>{incapacidad.diagnostico}</dd>
        </div>
        <div className="doc-field">
          <dt>Recomendaciones médicas durante el reposo</dt>
          <dd>{incapacidad.recomendaciones}</dd>
        </div>
      </dl>

      <p style={{ fontSize: "0.84rem", color: "#475569", marginTop: "1.5rem", lineHeight: 1.6 }}>
        Por medio del presente certificado se deja constancia de que el paciente identificado
        requiere reposo médico por el período indicado, conforme a la evaluación clínica
        realizada. El paciente debe acatar las recomendaciones descritas y asistir a control
        médico si los síntomas persisten o empeoran.
      </p>
    </DocumentShell>
  );
}

import type { DocumentBundle } from "@/types/documents";
import { DocumentShell } from "./DocumentShell";
import "./DocumentShell.css";

interface IncapacidadDocumentProps {
  bundle: DocumentBundle;
  documentId?: string;
}

function formatDate(iso: string): string {
  return new Date(iso + "T12:00:00").toLocaleDateString("es-CO", {
    dateStyle: "long",
  });
}

export function IncapacidadDocument({
  bundle,
  documentId = "doc-incapacidad",
}: IncapacidadDocumentProps) {
  const { paciente, medico, incapacidad, fechaEmision } = bundle;

  return (
    <DocumentShell
      title="Incapacidad Médica"
      medico={medico}
      fechaEmision={fechaEmision}
      documentId={documentId}
    >
      <div className="doc-paciente-grid">
        <div>
          <span>Paciente: </span>
          <strong>{paciente.nombre}</strong>
        </div>
        <div>
          <span>Documento: </span>
          <strong>{paciente.documento}</strong>
        </div>
      </div>

      <dl>
        <div className="doc-field">
          <dt>Período de incapacidad</dt>
          <dd>
            {formatDate(incapacidad.fechaInicio)} — {formatDate(incapacidad.fechaFin)}{" "}
            <strong>({incapacidad.dias} días)</strong>
          </dd>
        </div>
        <div className="doc-field">
          <dt>Diagnóstico</dt>
          <dd>{incapacidad.diagnostico}</dd>
        </div>
        <div className="doc-field">
          <dt>Recomendaciones</dt>
          <dd>{incapacidad.recomendaciones}</dd>
        </div>
      </dl>

      <p style={{ fontSize: "0.82rem", color: "#64748b", marginTop: "1.5rem" }}>
        Se expide la presente incapacidad médica conforme a la evaluación clínica
        realizada. El paciente debe acatar las recomendaciones indicadas.
      </p>
    </DocumentShell>
  );
}

import type { DocumentBundle } from "@/types/documents";
import { DocumentShell } from "./DocumentShell";
import "./DocumentShell.css";

interface HistoriaClinicaDocumentProps {
  bundle: DocumentBundle;
  documentId?: string;
}

export function HistoriaClinicaDocument({
  bundle,
  documentId = "doc-historia-clinica",
}: HistoriaClinicaDocumentProps) {
  const { paciente, historial, medico, fechaEmision } = bundle;
  const enfermedadActual = historial.sintomas.filter(Boolean).join("; ") || "—";

  return (
    <DocumentShell
      title="Historia Clínica"
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
        {paciente.telefono && (
          <div>
            <span>Teléfono: </span>
            <strong>{paciente.telefono}</strong>
          </div>
        )}
        {paciente.fechaNacimiento && (
          <div>
            <span>F. nacimiento: </span>
            <strong>
              {new Date(paciente.fechaNacimiento + "T12:00:00").toLocaleDateString("es-CO")}
            </strong>
          </div>
        )}
      </div>

      <dl>
        <div className="doc-field">
          <dt>Motivo de consulta</dt>
          <dd>{historial.motivo || "—"}</dd>
        </div>
        <div className="doc-field">
          <dt>Enfermedad actual</dt>
          <dd>{enfermedadActual}</dd>
        </div>
        <div className="doc-field">
          <dt>Diagnóstico</dt>
          <dd>{historial.diagnostico || "—"}</dd>
        </div>
        <div className="doc-field">
          <dt>Tratamiento</dt>
          <dd>{historial.plan || "—"}</dd>
        </div>
        {historial.alergias && (
          <div className="doc-field">
            <dt>Alergias</dt>
            <dd>{historial.alergias}</dd>
          </div>
        )}
        {historial.notas_adicionales && (
          <div className="doc-field">
            <dt>Observaciones</dt>
            <dd>{historial.notas_adicionales}</dd>
          </div>
        )}
      </dl>
    </DocumentShell>
  );
}

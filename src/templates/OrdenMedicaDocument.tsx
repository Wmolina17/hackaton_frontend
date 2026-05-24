import type { DocumentBundle } from "@/types/documents";
import { DocumentShell } from "./DocumentShell";
import "./DocumentShell.css";

interface OrdenMedicaDocumentProps {
  bundle: DocumentBundle;
  documentId?: string;
}

export function OrdenMedicaDocument({
  bundle,
  documentId = "doc-orden-medica",
}: OrdenMedicaDocumentProps) {
  const { paciente, medico, medicamentosOrden, historial, fechaEmision } = bundle;

  return (
    <DocumentShell
      title="Orden Médica"
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

      {historial.diagnostico && (
        <div className="doc-field">
          <dt>Diagnóstico</dt>
          <dd>{historial.diagnostico}</dd>
        </div>
      )}

      {medicamentosOrden.length === 0 ? (
        <p style={{ color: "#64748b" }}>Sin medicamentos prescritos.</p>
      ) : (
        <table className="doc-table">
          <thead>
            <tr>
              <th>Medicamento</th>
              <th>Dosis</th>
              <th>Frecuencia</th>
              <th>Duración</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {medicamentosOrden.map((med) => (
              <tr key={med.nombre}>
                <td>{med.nombre}</td>
                <td>{med.dosis}</td>
                <td>{med.frecuencia}</td>
                <td>{med.duracion}</td>
                <td>{med.observaciones ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {historial.plan && (
        <div className="doc-field" style={{ marginTop: "1rem" }}>
          <dt>Indicaciones generales</dt>
          <dd>{historial.plan}</dd>
        </div>
      )}
    </DocumentShell>
  );
}

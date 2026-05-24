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
  const { paciente, historial, fechaEmision } = bundle;
  const enfermedadActual = historial.sintomas.filter(Boolean).join("; ") || "—";

  return (
    <DocumentShell
      title="Historia Clínica"
      medico={bundle.medico}
      fechaEmision={fechaEmision}
      documentId={documentId}
      subtitle="Formato HC — Atención ambulatoria"
    >
      <div className="doc-paciente-grid">
        <div>
          <span>Paciente</span>
          <strong>{paciente.nombre}</strong>
        </div>
        <div>
          <span>Documento de identidad</span>
          <strong>{paciente.documento}</strong>
        </div>
        {paciente.telefono && (
          <div>
            <span>Teléfono</span>
            <strong>{paciente.telefono}</strong>
          </div>
        )}
        {paciente.fechaNacimiento && (
          <div>
            <span>Fecha de nacimiento</span>
            <strong>
              {new Date(paciente.fechaNacimiento + "T12:00:00").toLocaleDateString("es-CO")}
            </strong>
          </div>
        )}
        {historial.paciente_eps && (
          <div>
            <span>EPS</span>
            <strong>{historial.paciente_eps}</strong>
          </div>
        )}
      </div>

      <h2 className="doc-section-title">Anamnesis y evaluación</h2>
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
          <dt>Diagnóstico principal</dt>
          <dd>{historial.diagnostico || "—"}</dd>
        </div>
        <div className="doc-field">
          <dt>Plan terapéutico</dt>
          <dd>{historial.plan || "—"}</dd>
        </div>
        {historial.alergias && (
          <div className="doc-field">
            <dt>Alergias e intolerancias</dt>
            <dd>{historial.alergias}</dd>
          </div>
        )}
        {historial.notas_adicionales && (
          <div className="doc-field">
            <dt>Observaciones adicionales</dt>
            <dd>{historial.notas_adicionales}</dd>
          </div>
        )}
      </dl>

      {(historial.medicamentos?.length ?? 0) > 0 && (
        <>
          <h2 className="doc-section-title">Medicamentos formulados</h2>
          <table className="doc-table">
            <thead>
              <tr>
                <th>Medicamento</th>
                <th>Dosis</th>
                <th>Frecuencia</th>
                <th>Cobertura EPS</th>
              </tr>
            </thead>
            <tbody>
              {historial.medicamentos.map((med) => (
                <tr key={med.nombre}>
                  <td>{med.nombre}</td>
                  <td>{med.dosis ?? "—"}</td>
                  <td>{med.frecuencia ?? "—"}</td>
                  <td>{med.cubierto ? "Disponible" : "No disponible"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </DocumentShell>
  );
}

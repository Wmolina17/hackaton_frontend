import type { ReactNode } from "react";
import type { MedicoConfig } from "@/types/documents";
import { formatClinicalDate } from "@/services/clinicalDocuments";
import "./DocumentShell.css";

interface DocumentShellProps {
  title: string;
  medico: MedicoConfig;
  fechaEmision: string;
  children: ReactNode;
  documentId?: string;
  subtitle?: string;
}

export function DocumentShell({
  title,
  medico,
  fechaEmision,
  children,
  documentId,
  subtitle = "Documento clínico — uso profesional",
}: DocumentShellProps) {
  return (
    <article className="doc-shell" id={documentId}>
      <div className="doc-shell__header-band">
        <div className="doc-shell__brand">
          {medico.logoDataUrl ? (
            <img
              src={medico.logoDataUrl}
              alt={`Logo ${medico.clinica}`}
              className="doc-shell__logo"
            />
          ) : (
            <div className="doc-shell__logo-placeholder">{medico.clinica.charAt(0)}</div>
          )}
          <div>
            <strong className="doc-shell__clinica">{medico.clinica}</strong>
            <span className="doc-shell__meta">{subtitle}</span>
            <span className="doc-shell__fecha">
              Fecha de emisión: {formatClinicalDate(fechaEmision)}
            </span>
          </div>
        </div>
      </div>

      <div className="doc-shell__title-wrap">
        <h1 className="doc-shell__title">{title}</h1>
      </div>

      <div className="doc-shell__body">{children}</div>

      <footer className="doc-shell__footer">
        <div className="doc-shell__medico-info">
          <strong>{medico.nombre}</strong>
          <span>{medico.especialidad}</span>
          <span>Registro médico: {medico.registroMedico}</span>
        </div>
        <div className="doc-shell__firma">
          {medico.firmaDataUrl ? (
            <img src={medico.firmaDataUrl} alt="Firma del médico" />
          ) : (
            <div className="doc-shell__firma-empty">Pendiente de firma</div>
          )}
          <span>Firma del médico tratante</span>
        </div>
        <p className="doc-shell__legal">
          Documento generado electrónicamente en Monwe. La información contenida tiene carácter
          clínico confidencial y debe ser utilizada exclusivamente con fines de atención médica
          conforme a la normativa colombiana vigente (Ley 1581 de 2012, Res. 1995 de 1999).
        </p>
      </footer>
    </article>
  );
}

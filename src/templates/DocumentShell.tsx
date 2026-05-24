import type { ReactNode } from "react";
import type { MedicoConfig } from "@/types/documents";
import "./DocumentShell.css";

interface DocumentShellProps {
  title: string;
  medico: MedicoConfig;
  fechaEmision: string;
  children: ReactNode;
  documentId?: string;
}

export function DocumentShell({
  title,
  medico,
  fechaEmision,
  children,
  documentId,
}: DocumentShellProps) {
  return (
    <article className="doc-shell" id={documentId}>
      <header className="doc-shell__header">
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
            <span className="doc-shell__fecha">
              Fecha:{" "}
              {new Date(fechaEmision + "T12:00:00").toLocaleDateString("es-CO", {
                dateStyle: "long",
              })}
            </span>
          </div>
        </div>
        <h1 className="doc-shell__title">{title}</h1>
      </header>

      <div className="doc-shell__body">{children}</div>

      <footer className="doc-shell__footer">
        <div className="doc-shell__medico-info">
          <strong>{medico.nombre}</strong>
          <span>{medico.especialidad}</span>
          <span>Reg. médico: {medico.registroMedico}</span>
        </div>
        <div className="doc-shell__firma">
          {medico.firmaDataUrl ? (
            <img src={medico.firmaDataUrl} alt="Firma del médico" />
          ) : (
            <div className="doc-shell__firma-empty">Sin firma</div>
          )}
          <span>Firma del médico tratante</span>
        </div>
      </footer>
    </article>
  );
}

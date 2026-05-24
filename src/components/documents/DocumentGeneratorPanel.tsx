import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { buildDocumentBundle } from "@/services/documentBuilder";
import { printDocument } from "@/services/documentExport";
import type { DocumentBundle, DocumentType } from "@/types/documents";
import type { HistorialClinico } from "@/types/historial";
import type { MedicoConfig } from "@/types/documents";
import { HistoriaClinicaDocument } from "@/templates/HistoriaClinicaDocument";
import { OrdenMedicaDocument } from "@/templates/OrdenMedicaDocument";
import { IncapacidadDocument } from "@/templates/IncapacidadDocument";
import "./DocumentGeneratorPanel.css";

interface DocumentGeneratorPanelProps {
  historial: HistorialClinico;
  medico: MedicoConfig;
  pacienteId?: string;
}

const DOC_LABELS: Record<DocumentType, string> = {
  historia: "Historia Clínica",
  orden: "Orden Médica",
  incapacidad: "Incapacidad",
};

const DOC_IDS: Record<DocumentType, string> = {
  historia: "doc-historia-clinica",
  orden: "doc-orden-medica",
  incapacidad: "doc-incapacidad",
};

export function DocumentGeneratorPanel({
  historial,
  medico,
  pacienteId,
}: DocumentGeneratorPanelProps) {
  const [activeDoc, setActiveDoc] = useState<DocumentType>("historia");
  const previewRef = useRef<HTMLDivElement>(null);

  const bundle: DocumentBundle = useMemo(
    () => buildDocumentBundle(historial, medico, pacienteId),
    [historial, medico, pacienteId]
  );

  function handleGenerate(type: DocumentType) {
    setActiveDoc(type);
    requestAnimationFrame(() => {
      previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function handlePrint() {
    printDocument(DOC_IDS[activeDoc]);
  }

  return (
    <section className="doc-generator" aria-labelledby="doc-gen-heading">
      <div className="doc-generator__head">
        <div>
          <h3 id="doc-gen-heading">Documentos clínicos</h3>
          <p>
            Se generan automáticamente con la información del historial. Se actualizan
            en tiempo real al editar.
          </p>
        </div>
      </div>

      <div className="doc-generator__actions">
        {(Object.keys(DOC_LABELS) as DocumentType[]).map((type) => (
          <Button
            key={type}
            variant={activeDoc === type ? "primary" : "secondary"}
            type="button"
            onClick={() => handleGenerate(type)}
          >
            Generar {DOC_LABELS[type]}
          </Button>
        ))}
        <Button variant="secondary" type="button" onClick={handlePrint}>
          Imprimir / PDF
        </Button>
      </div>

      <div className="doc-generator__tabs" role="tablist">
        {(Object.keys(DOC_LABELS) as DocumentType[]).map((type) => (
          <button
            key={type}
            type="button"
            role="tab"
            aria-selected={activeDoc === type}
            className={`doc-generator__tab ${activeDoc === type ? "doc-generator__tab--active" : ""}`}
            onClick={() => setActiveDoc(type)}
          >
            {DOC_LABELS[type]}
          </button>
        ))}
      </div>

      <div ref={previewRef} className="doc-generator__preview">
        {activeDoc === "historia" && (
          <HistoriaClinicaDocument bundle={bundle} documentId={DOC_IDS.historia} />
        )}
        {activeDoc === "orden" && (
          <OrdenMedicaDocument bundle={bundle} documentId={DOC_IDS.orden} />
        )}
        {activeDoc === "incapacidad" && (
          <IncapacidadDocument bundle={bundle} documentId={DOC_IDS.incapacidad} />
        )}
      </div>
    </section>
  );
}

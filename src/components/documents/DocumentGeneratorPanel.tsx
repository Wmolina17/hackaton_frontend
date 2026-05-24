import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { buildDocumentBundle } from "@/services/documentBuilder";
import {
  CLINICAL_DOCUMENT_IDS,
  CLINICAL_DOCUMENT_LABELS,
  type ClinicalDocumentType,
} from "@/services/clinicalDocuments";
import { printDocument } from "@/services/documentExport";
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

export function DocumentGeneratorPanel({
  historial,
  medico,
  pacienteId,
}: DocumentGeneratorPanelProps) {
  const availableDocs = useMemo(() => {
    const docs: ClinicalDocumentType[] = ["historia", "orden"];
    if (historial.requiere_incapacidad && historial.incapacidad_dias) {
      docs.push("incapacidad");
    }
    return docs;
  }, [historial.requiere_incapacidad, historial.incapacidad_dias]);

  const [activeDoc, setActiveDoc] = useState<ClinicalDocumentType>("historia");
  const previewRef = useRef<HTMLDivElement>(null);

  const bundle = useMemo(
    () => buildDocumentBundle(historial, medico, pacienteId),
    [historial, medico, pacienteId]
  );

  const safeActiveDoc = availableDocs.includes(activeDoc) ? activeDoc : availableDocs[0];

  function handleGenerate(type: ClinicalDocumentType) {
    setActiveDoc(type);
    requestAnimationFrame(() => {
      previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function handlePrint() {
    printDocument(CLINICAL_DOCUMENT_IDS[safeActiveDoc], CLINICAL_DOCUMENT_LABELS[safeActiveDoc]);
  }

  return (
    <section className="doc-generator" aria-labelledby="doc-gen-heading">
      <div className="doc-generator__head">
        <div>
          <h3 id="doc-gen-heading">Documentos clínicos</h3>
          <p>
            Formato profesional institucional. Se actualizan en tiempo real al editar el historial.
          </p>
        </div>
      </div>

      <div className="doc-generator__actions">
        {availableDocs.map((type) => (
          <Button
            key={type}
            variant={safeActiveDoc === type ? "primary" : "secondary"}
            type="button"
            onClick={() => handleGenerate(type)}
          >
            {CLINICAL_DOCUMENT_LABELS[type]}
          </Button>
        ))}
        <Button variant="secondary" type="button" onClick={handlePrint}>
          Imprimir / PDF
        </Button>
      </div>

      <div className="doc-generator__tabs" role="tablist">
        {availableDocs.map((type) => (
          <button
            key={type}
            type="button"
            role="tab"
            aria-selected={safeActiveDoc === type}
            className={`doc-generator__tab ${safeActiveDoc === type ? "doc-generator__tab--active" : ""}`}
            onClick={() => setActiveDoc(type)}
          >
            {CLINICAL_DOCUMENT_LABELS[type]}
          </button>
        ))}
      </div>

      <div ref={previewRef} className="doc-generator__preview">
        {safeActiveDoc === "historia" && (
          <HistoriaClinicaDocument bundle={bundle} documentId={CLINICAL_DOCUMENT_IDS.historia} />
        )}
        {safeActiveDoc === "orden" && (
          <OrdenMedicaDocument bundle={bundle} documentId={CLINICAL_DOCUMENT_IDS.orden} />
        )}
        {safeActiveDoc === "incapacidad" && bundle.incapacidad && (
          <IncapacidadDocument bundle={bundle} documentId={CLINICAL_DOCUMENT_IDS.incapacidad} />
        )}
      </div>
    </section>
  );
}

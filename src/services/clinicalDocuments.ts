/** Estilos y utilidades compartidas para documentos clínicos (impresión / PDF). */

export const CLINICAL_DOCUMENT_PRINT_CSS = `
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body {
    font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    margin: 0;
    padding: 24px;
    color: #0f172a;
    background: #fff;
    font-size: 11pt;
    line-height: 1.55;
  }
  .doc-shell {
    max-width: 100%;
    border: none;
    box-shadow: none;
    padding: 0;
  }
  .doc-shell__header-band {
    background: #0f172a !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .doc-table th {
    background: #e2e8f0 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  @media print {
    body { padding: 0; }
  }
`;

export function formatClinicalDate(iso: string, style: "long" | "short" = "long"): string {
  const date = new Date(iso.includes("T") ? iso : `${iso}T12:00:00`);
  return date.toLocaleDateString("es-CO", style === "long" ? { dateStyle: "long" } : { dateStyle: "short" });
}

export function formatClinicalDateTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" });
}

export const CLINICAL_DOCUMENT_LABELS = {
  historia: "Historia Clínica",
  orden: "Orden Médica",
  incapacidad: "Certificado de Incapacidad Médica",
} as const;

export type ClinicalDocumentType = keyof typeof CLINICAL_DOCUMENT_LABELS;

export const CLINICAL_DOCUMENT_IDS: Record<ClinicalDocumentType, string> = {
  historia: "doc-historia-clinica",
  orden: "doc-orden-medica",
  incapacidad: "doc-incapacidad",
};

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

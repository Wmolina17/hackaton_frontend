/** Utilidades de exportación de documentos clínicos. */

import { CLINICAL_DOCUMENT_PRINT_CSS } from "@/services/clinicalDocuments";

export function printDocument(elementId: string, title = "Documento clínico"): void {
  const el = document.getElementById(elementId);
  if (!el) return;

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    window.print();
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="es"><head>
      <meta charset="UTF-8" />
      <title>${title}</title>
      <style>${CLINICAL_DOCUMENT_PRINT_CSS}</style>
    </head><body>${el.outerHTML}</body></html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

export async function exportPdfFromElement(_elementId: string): Promise<Blob | null> {
  return null;
}

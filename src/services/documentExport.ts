/** Utilidades de exportación — preparadas para integración con jsPDF / backend. */

export function printDocument(elementId: string): void {
  const el = document.getElementById(elementId);
  if (!el) return;

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    window.print();
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html><head>
      <title>Documento clínico</title>
      <style>
        body { font-family: "Segoe UI", system-ui, sans-serif; margin: 0; padding: 24px; color: #0f172a; }
        @media print { body { padding: 0; } }
      </style>
    </head><body>${el.innerHTML}</body></html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

/** Reservado: generación PDF real vía backend o jsPDF. */
export async function exportPdfFromElement(_elementId: string): Promise<Blob | null> {
  // TODO: integrar jsPDF o endpoint /documentos/pdf
  return null;
}

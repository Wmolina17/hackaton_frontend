import { useMemo } from "react";
import { buildDocumentBundle } from "@/services/documentBuilder";
import type { HistorialClinico } from "@/types/historial";
import type { MedicoConfig } from "@/types/documents";

/** Hook reutilizable para obtener el bundle de documentos actualizado. */
export function useDocumentBundle(
  historial: HistorialClinico,
  medico: MedicoConfig,
  pacienteId?: string
) {
  return useMemo(
    () => buildDocumentBundle(historial, medico, pacienteId),
    [historial, medico, pacienteId]
  );
}

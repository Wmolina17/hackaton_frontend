import { httpRequest } from "@/api/http";
import type { GenerarDocumentoResponse, RadicacionJob } from "@/types/radicado";

export const radicadoApi = {
  generarDocumento: (
    historialId: string | number,
    body?: { incapacidad_dias?: number }
  ) =>
    httpRequest<GenerarDocumentoResponse>(
      `/radicado/historiales/${historialId}/documento`,
      {
        method: "POST",
        body: JSON.stringify(body ?? {}),
      }
    ),

  downloadDocumentoPdf: (historialId: string | number) =>
    httpRequest<Blob>(`/radicado/historiales/${historialId}/documento/pdf`),

  iniciarRadicacion: (historialId: number) =>
    httpRequest<RadicacionJob>("/radicado/incapacidades", {
      method: "POST",
      body: JSON.stringify({ historial_id: historialId }),
    }),

  getJob: (jobId: string) =>
    httpRequest<RadicacionJob>(`/radicado/incapacidades/${jobId}`),

  getJobByHistorial: (historialId: string | number) =>
    httpRequest<RadicacionJob>(`/radicado/historial/${historialId}`),
};

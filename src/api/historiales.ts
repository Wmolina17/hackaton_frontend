import { httpRequest } from "@/api/http";
import type { HistorialClinico } from "@/types/historial";

export const historialesApi = {
  get: (id: string | number) =>
    httpRequest<HistorialClinico>(`/historiales/${id}`),
  update: (id: string | number, historial: HistorialClinico) =>
    httpRequest<HistorialClinico>(`/historiales/${id}`, {
      method: "PUT",
      body: JSON.stringify(historial),
    }),
  firmar: (id: string | number) =>
    httpRequest<HistorialClinico>(`/historiales/${id}/firmar`, {
      method: "POST",
    }),
  downloadPdf: (id: string | number) =>
    httpRequest<Blob>(`/historiales/${id}/pdf`),
};

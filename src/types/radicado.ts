export type RadicacionEstado =
  | "pendiente"
  | "ocr"
  | "rethus"
  | "adres"
  | "reporte"
  | "completo"
  | "error";

export interface RadicacionPasos {
  ocr: Record<string, unknown> | null;
  rethus: Record<string, unknown> | null;
  adres: Record<string, unknown> | null;
  reporte: RadicacionReporte | null;
}

export interface RadicacionReporte {
  score_global?: number;
  status?: string;
  recomendacion?: string;
  validaciones?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface RadicacionJob {
  job_id: string;
  historial_id: number;
  medico_id: number;
  estado: RadicacionEstado;
  paso_actual: number;
  pdf_path?: string | null;
  score?: number | null;
  recomendacion?: string | null;
  error?: string | null;
  pasos: RadicacionPasos;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface GenerarDocumentoResponse {
  historial_id: number;
  pdf_url: string;
  metadata: Record<string, unknown>;
}

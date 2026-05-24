import type { HistorialClinico } from "@/types/historial";

/** Configuración profesional del médico — preparada para persistencia en DB. */
export interface MedicoConfig {
  medicoId: number;
  nombre: string;
  especialidad: string;
  registroMedico: string;
  clinica: string;
  logoDataUrl: string | null;
  firmaDataUrl: string | null;
}

export interface DocumentPaciente {
  id: string;
  nombre: string;
  documento: string;
  telefono?: string;
  fechaNacimiento?: string;
}

export interface MedicamentoOrden {
  nombre: string;
  dosis: string;
  frecuencia: string;
  duracion: string;
  observaciones?: string;
}

export interface IncapacidadDocumento {
  dias: number;
  fechaInicio: string;
  fechaFin: string;
  diagnostico: string;
  recomendaciones: string;
}

export interface DocumentBundle {
  paciente: DocumentPaciente;
  historial: HistorialClinico;
  medico: MedicoConfig;
  medicamentosOrden: MedicamentoOrden[];
  incapacidad: IncapacidadDocumento;
  fechaEmision: string;
}

export type DocumentType = "historia" | "orden" | "incapacidad";

export const DEFAULT_INCAPACIDAD_DIAS = 3;

export const DEFAULT_INCAPACIDAD_RECOMENDACIONES =
  "Reposo absoluto en domicilio. Evitar esfuerzos físicos. Control médico si persisten síntomas.";

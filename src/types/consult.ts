export type ConsultStatus = "idle" | "listening" | "processing" | "error";

export type CitaEstado = "pendiente" | "activa" | "terminada" | "programada";

export interface CitaActiva {
  id: string;
  paciente_id: string;
  paciente_nombre: string;
  medico_nombre: string;
  especialidad: string;
  fecha_hora: string;
  estado: CitaEstado;
}

export interface MedicamentoDisponible {
  nombre: string;
  dosis: string;
  frecuencia: string;
}

export interface MedicamentoIdeal {
  nombre: string;
  razon: string;
}

export interface HistorialMedico {
  motivo_consulta: string;
  sintomas: string[];
  diagnostico: string;
  plan_tratamiento: string;
  alergias: string;
  notas_adicionales: string;
  medicamentos: {
    disponibles_eps: MedicamentoDisponible[];
    ideales_sugeridos: MedicamentoIdeal[];
  };
}

export interface ProcesarConsultaRequest {
  audio: Blob;
  paciente_id: string;
  cita_id: string;
}

export interface ProcesarConsultaResponse {
  consulta_id: string;
  historial_id: number;
  transcripcion: string;
  historial: HistorialMedico;
}

export const CONSULT_STORAGE_KEYS = {
  pacienteId: "consultPacienteId",
  citaId: "consultCitaId",
} as const;

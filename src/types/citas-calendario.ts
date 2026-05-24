import type { CitaEstado } from "@/types/consult";

export interface CitaCalendario {
  id: string;
  paciente_id: string;
  paciente_nombre: string;
  paciente_documento: string;
  paciente_eps: string;
  medico_id: number;
  medico_nombre: string;
  especialidad: string;
  fecha_hora: string;
  estado: CitaEstado;
  motivo?: string;
  historial_id?: number;
}

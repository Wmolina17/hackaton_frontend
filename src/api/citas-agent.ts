import { httpRequest } from "@/api/http";
import type { CitaConfirmada } from "@/features/chat/types";

export interface CitaFromAgentResponse {
  id: number;
  cita_id: string;
  historial_id: number;
  paciente_id: string;
  medico_id: number;
  estado: string;
}

export const citasAgentApi = {
  /**
   * Registra una cita creada por el agente IA dentro del mock store.
   * Hace que la cita aparezca en el calendario del médico (/consultas)
   * y en /mis-citas del paciente.
   */
  fromAgent: (cita: CitaConfirmada) =>
    httpRequest<CitaFromAgentResponse>("/citas/from-agent", {
      method: "POST",
      body: JSON.stringify(cita),
    }),
};

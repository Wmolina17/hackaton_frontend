import { httpRequest } from "@/api/http";

export interface MiCita {
  id: number;
  paciente_id: number;
  medico_id: number;
  fecha_hora: string;
  motivo?: string;
  estado: string;
}

export const misCitasApi = {
  list: () => httpRequest<MiCita[]>("/pacientes/me/citas"),
};


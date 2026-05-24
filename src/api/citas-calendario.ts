import { httpRequest } from "@/api/http";
import type { CitaCalendario } from "@/types/citas-calendario";

export const citasCalendarioApi = {
  list: (medicoId?: number) => {
    const q = medicoId ? `?medico_id=${medicoId}` : "";
    return httpRequest<CitaCalendario[]>(`/citas/calendario${q}`);
  },
  get: (citaId: string) => httpRequest<CitaCalendario>(`/citas/${citaId}`),
};

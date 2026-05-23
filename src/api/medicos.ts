import { httpRequest } from "@/api/http";
import type { Medico, Slot } from "@/types/agendar";

export const medicosApi = {
  list: () => httpRequest<Medico[]>("/medicos"),
  slots: (medicoId: number) =>
    httpRequest<Slot[]>(`/medicos/${medicoId}/slots`),
};

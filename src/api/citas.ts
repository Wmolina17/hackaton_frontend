import { httpRequest } from "@/api/http";
import type { Cita } from "@/types/agendar";

export const citasApi = {
  create: (payload: {
    paciente_id: number;
    medico_id: number;
    slot_id: number;
  }) =>
    httpRequest<Cita>("/citas", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

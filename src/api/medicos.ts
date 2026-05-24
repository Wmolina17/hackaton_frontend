import { httpRequest } from "@/api/http";
import type { Medico, Slot } from "@/types/agendar";

type SlotsResponse = Slot[] | { slots: Slot[] };

function normalizeSlots(data: SlotsResponse | null): Slot[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.slots ?? [];
}

export const medicosApi = {
  list: () => httpRequest<Medico[]>("/medicos"),
  slots: async (medicoId: number) => {
    const result = await httpRequest<SlotsResponse>(`/medicos/${medicoId}/slots`);
    return {
      ...result,
      data: normalizeSlots(result.data),
    };
  },
};

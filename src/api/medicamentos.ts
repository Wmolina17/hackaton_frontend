import { httpRequest } from "@/api/http";
import type { MedicamentoCobertura } from "@/types/historial";
import type { Medicamento } from "@/types/medicamentos";

export const medicamentosApi = {
  list: (medicoId?: number) => {
    const q = medicoId ? `?medico_id=${medicoId}` : "";
    return httpRequest<Medicamento[]>(`/medicamentos${q}`);
  },
  cobertura: (eps: string, nombres: string[]) => {
    const params = new URLSearchParams({
      eps,
      nombres: nombres.join(","),
    });
    return httpRequest<MedicamentoCobertura[]>(
      `/medicamentos/cobertura?${params}`
    );
  },
};

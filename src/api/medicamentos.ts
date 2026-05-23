import { httpRequest } from "@/api/http";
import type { MedicamentoCobertura } from "@/types/historial";

export const medicamentosApi = {
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

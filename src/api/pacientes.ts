import { httpRequest } from "@/api/http";
import type { Paciente } from "@/types/agendar";
import type { PacienteDetalle, PacienteResumen } from "@/types/pacientes";

export const pacientesListApi = {
  list: () => httpRequest<PacienteResumen[]>("/pacientes"),
  get: (id: string) => httpRequest<PacienteDetalle>(`/pacientes/${id}`),
  monitor: (id: string) => httpRequest<unknown>(`/pacientes/${id}/monitor`),
};

export const pacientesApi = {
  create: (paciente: Omit<Paciente, "id">) =>
    httpRequest<Paciente>("/pacientes", {
      method: "POST",
      body: JSON.stringify(paciente),
    }),
};

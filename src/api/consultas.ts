import { httpRequest } from "@/api/http";
import type { CitaActiva, ProcesarConsultaResponse } from "@/types/consult";

export const consultasApi = {
  getCitaActiva: () => httpRequest<CitaActiva>("/consultas/activa"),

  processar: (audio: Blob, pacienteId: string, citaId: string) => {
    const formData = new FormData();
    formData.append("audio", audio, "consulta.webm");
    formData.append("paciente_id", pacienteId);
    formData.append("cita_id", citaId);

    return httpRequest<ProcesarConsultaResponse>("/consultas/procesar", {
      method: "POST",
      body: formData,
    });
  },
};

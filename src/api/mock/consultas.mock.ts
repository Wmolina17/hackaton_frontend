import type {
  CitaActiva,
  HistorialMedico,
  ProcesarConsultaResponse,
} from "@/types/consult";

export const MOCK_CITA_ACTIVA: CitaActiva = {
  id: "cita-7f2a",
  paciente_id: "pac-001",
  paciente_nombre: "María García López",
  medico_nombre: "Dr. Carlos Ruiz",
  especialidad: "Medicina general",
  fecha_hora: "2026-05-23T10:00:00",
  estado: "activa",
};

export const MOCK_HISTORIAL: HistorialMedico = {
  motivo_consulta: "Control por cefalea recurrente de 5 días",
  sintomas: [
    "Cefalea pulsátil frontal",
    "Fotofobia leve",
    "Sin fiebre reportada",
  ],
  diagnostico: "Cefalea tensional",
  plan_tratamiento:
    "Hidratación, analgesia según tolerancia, control en 7 días si persiste",
  alergias: "Penicilina",
  notas_adicionales: "Paciente refiere estrés laboral reciente",
  medicamentos: {
    disponibles_eps: [
      {
        nombre: "Acetaminofén 500 mg",
        dosis: "500 mg",
        frecuencia: "Cada 8 horas si dolor",
      },
      {
        nombre: "Ibuprofeno 400 mg",
        dosis: "400 mg",
        frecuencia: "Cada 12 horas con alimentos",
      },
    ],
    ideales_sugeridos: [
      {
        nombre: "Naproxeno 250 mg",
        razon: "Alternativa antiinflamatoria si no hay respuesta a acetaminofén",
      },
    ],
  },
};

export const MOCK_TRANSCRIPCION = `Paciente refiere cefalea frontal de cinco días de evolución, de carácter pulsátil, 
con leve fotofobia y sin fiebre. Niega traumatismo. Alergia conocida a penicilina. 
Solicita manejo del dolor y orientación sobre signos de alarma.`;

export function buildMockProcesarResponse(
  historialId = 1
): ProcesarConsultaResponse {
  return {
    consulta_id: `cons-${historialId}`,
    historial_id: historialId,
    transcripcion: MOCK_TRANSCRIPCION.trim(),
    historial: MOCK_HISTORIAL,
  };
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

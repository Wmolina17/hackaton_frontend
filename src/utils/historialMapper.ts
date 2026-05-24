import type { HistorialMedico } from "@/types/consult";
import type { HistorialClinico, MedicamentoHistorial } from "@/types/historial";
import { DEFAULT_INCAPACIDAD_DIAS, DEFAULT_INCAPACIDAD_RECOMENDACIONES } from "@/types/documents";

export function historialIaToClinico(
  ia: HistorialMedico & {
    requiere_incapacidad?: boolean;
    incapacidad_dias?: number | null;
    incapacidad_recomendaciones?: string | null;
  },
  eps = "Sura"
): HistorialClinico {
  const medicamentos: MedicamentoHistorial[] = [
    ...ia.medicamentos.disponibles_eps.map((m) => ({
      nombre: m.nombre,
      cubierto: true,
      dosis: m.dosis,
      frecuencia: m.frecuencia,
      generico_alternativa: m.dosis && m.frecuencia ? `${m.dosis} — ${m.frecuencia}` : undefined,
    })),
    ...ia.medicamentos.ideales_sugeridos.map((m) => ({
      nombre: m.nombre,
      cubierto: false,
      generico_alternativa: m.razon,
    })),
  ];

  const requiereIncapacidad = Boolean(ia.requiere_incapacidad);

  return {
    motivo: ia.motivo_consulta,
    sintomas: ia.sintomas,
    diagnostico: ia.diagnostico,
    plan: ia.plan_tratamiento,
    alergias: ia.alergias,
    notas_adicionales: ia.notas_adicionales,
    medicamentos,
    firmado: false,
    paciente_eps: eps,
    requiere_incapacidad: requiereIncapacidad,
    incapacidad_dias: requiereIncapacidad
      ? ia.incapacidad_dias ?? DEFAULT_INCAPACIDAD_DIAS
      : undefined,
    incapacidad_recomendaciones: requiereIncapacidad
      ? ia.incapacidad_recomendaciones ?? DEFAULT_INCAPACIDAD_RECOMENDACIONES
      : undefined,
  };
}

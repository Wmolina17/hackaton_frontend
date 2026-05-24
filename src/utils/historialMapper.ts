import type { HistorialMedico } from "@/types/consult";
import type { HistorialClinico, MedicamentoHistorial } from "@/types/historial";

export function historialIaToClinico(
  ia: HistorialMedico,
  eps = "Sura"
): HistorialClinico {
  const medicamentos: MedicamentoHistorial[] = [
    ...ia.medicamentos.disponibles_eps.map((m) => ({
      nombre: m.nombre,
      cubierto: true,
      generico_alternativa: `${m.dosis} — ${m.frecuencia}`,
    })),
    ...ia.medicamentos.ideales_sugeridos.map((m) => ({
      nombre: m.nombre,
      cubierto: false,
      generico_alternativa: m.razon,
    })),
  ];

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
  };
}

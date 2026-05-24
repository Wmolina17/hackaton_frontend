import { MOCK_PACIENTES } from "@/api/mock/data";
import type {
  DocumentBundle,
  DocumentPaciente,
  IncapacidadDocumento,
  MedicoConfig,
  MedicamentoOrden,
} from "@/types/documents";
import {
  DEFAULT_INCAPACIDAD_DIAS,
  DEFAULT_INCAPACIDAD_RECOMENDACIONES,
} from "@/types/documents";
import type { HistorialClinico, MedicamentoHistorial } from "@/types/historial";

function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatIsoDate(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function resolvePaciente(
  historial: HistorialClinico,
  pacienteId?: string
): DocumentPaciente {
  const mock =
    MOCK_PACIENTES.find((p) => p.id === pacienteId) ?? MOCK_PACIENTES[0];

  return {
    id: pacienteId ?? mock.id,
    nombre: historial.paciente_nombre ?? mock.nombre,
    documento: historial.paciente_documento ?? mock.documento,
    telefono: historial.paciente_telefono ?? mock.telefono,
    fechaNacimiento: historial.paciente_fecha_nacimiento ?? "1990-03-15",
  };
}

export function buildMedicamentosOrden(
  medicamentos: MedicamentoHistorial[]
): MedicamentoOrden[] {
  const defaults = [
    { dosis: "500 mg", frecuencia: "Cada 8 horas", duracion: "5 días" },
    { dosis: "400 mg", frecuencia: "Cada 12 horas", duracion: "3 días" },
    { dosis: "1 tableta", frecuencia: "Cada 24 horas", duracion: "7 días" },
  ];

  return medicamentos
    .filter((m) => m.nombre.trim())
    .map((med, i) => {
      const def = defaults[i % defaults.length];
      return {
        nombre: med.nombre,
        dosis: med.dosis ?? def.dosis,
        frecuencia: med.frecuencia ?? def.frecuencia,
        duracion: med.duracion ?? def.duracion,
        observaciones: med.cubierto
          ? "Disponible en formulación"
          : med.generico_alternativa
            ? `Alternativa: ${med.generico_alternativa}`
            : "Verificar disponibilidad",
      };
    });
}

export function buildIncapacidad(historial: HistorialClinico): IncapacidadDocumento {
  const dias = historial.incapacidad_dias ?? DEFAULT_INCAPACIDAD_DIAS;
  const fechaInicio = formatIsoDate();
  return {
    dias,
    fechaInicio,
    fechaFin: addDays(fechaInicio, dias),
    diagnostico: historial.diagnostico || "—",
    recomendaciones:
      historial.incapacidad_recomendaciones ?? DEFAULT_INCAPACIDAD_RECOMENDACIONES,
  };
}

export function buildDocumentBundle(
  historial: HistorialClinico,
  medico: MedicoConfig,
  pacienteId?: string
): DocumentBundle {
  const fechaEmision = formatIsoDate();
  return {
    paciente: resolvePaciente(historial, pacienteId),
    historial,
    medico,
    medicamentosOrden: buildMedicamentosOrden(historial.medicamentos ?? []),
    incapacidad: buildIncapacidad(historial),
    fechaEmision,
  };
}

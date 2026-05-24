import type { CitaActiva } from "@/types/consult";
import type { HistorialClinico } from "@/types/historial";
import { createEmptyHistorial } from "@/types/historial";

export const mockHistoriales = new Map<number, HistorialClinico>();

let mockPacienteSeq = 1;
let mockCitaSeq = 1;
let mockHistorialSeq = 1;

export let activeCitaForConsulta: CitaActiva | null = null;
let lastPacienteNombre = "María García López";
let lastPacienteEps = "Sura";

export function setLastPacienteInfo(nombre: string, eps: string): void {
  lastPacienteNombre = nombre;
  lastPacienteEps = eps;
}

export function getLastPacienteNombre(): string {
  return lastPacienteNombre;
}

export function getLastPacienteEps(): string {
  return lastPacienteEps;
}

export function nextHistorialId(): number {
  return mockHistorialSeq++;
}

export function nextCitaId(): number {
  return mockCitaSeq++;
}

export function nextPacienteId(): number {
  return mockPacienteSeq++;
}

export function getMockHistorial(id: number): HistorialClinico {
  if (!mockHistoriales.has(id)) {
    mockHistoriales.set(id, {
      ...createEmptyHistorial(),
      id,
      motivo: "Consulta por cefalea y fiebre de 2 días",
      sintomas: ["Cefalea", "Fiebre 38.2°C", "Malestar general"],
      diagnostico: "Cuadro viral respiratorio alto",
      plan: "Reposo, hidratación, control en 48 h si persiste fiebre",
      alergias: "Ninguna conocida",
      notas_adicionales: "Paciente orientada, signos vitales estables al egreso.",
      paciente_eps: "Sura",
      paciente_nombre: "María García López",
      paciente_documento: "1023456789",
      incapacidad_dias: 3,
      medicamentos: [
        {
          nombre: "Acetaminofén 500 mg",
          cubierto: true,
          generico_alternativa: "Dolex genérico",
        },
        {
          nombre: "Ibuprofeno 400 mg",
          cubierto: false,
          generico_alternativa: "Advil genérico EPS",
        },
      ],
    });
  }
  return mockHistoriales.get(id)!;
}

export function saveMockHistorial(
  id: number,
  historial: HistorialClinico
): HistorialClinico {
  mockHistoriales.set(id, { ...historial, id });
  return mockHistoriales.get(id)!;
}

export function setActiveCita(cita: CitaActiva): void {
  activeCitaForConsulta = cita;
}


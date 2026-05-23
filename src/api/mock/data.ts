import type { CitaCalendario } from "@/types/citas-calendario";
import type { PacienteDetalle, PacienteResumen } from "@/types/pacientes";

export const MOCK_PACIENTES: PacienteResumen[] = [
  {
    id: "pac-001",
    nombre: "María García López",
    documento: "1023456789",
    eps: "Sura",
    telefono: "3001234567",
    ultima_consulta: "2026-05-22T10:00:00",
    total_consultas: 4,
  },
  {
    id: "pac-002",
    nombre: "Juan Pérez Ortiz",
    documento: "1098765432",
    eps: "Sanitas",
    telefono: "3109876543",
    ultima_consulta: "2026-05-20T14:30:00",
    total_consultas: 2,
  },
  {
    id: "pac-003",
    nombre: "Ana Sofía Muñoz",
    documento: "1034567890",
    eps: "Nueva EPS",
    telefono: "3205551234",
    ultima_consulta: "2026-05-18T09:15:00",
    total_consultas: 6,
  },
  {
    id: "pac-004",
    nombre: "Carlos Eduardo Ríos",
    documento: "1045678901",
    eps: "Sura",
    telefono: "3154448899",
    ultima_consulta: "2026-05-15T11:00:00",
    total_consultas: 1,
  },
];

function buildCitas(): CitaCalendario[] {
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  const medicos = [
    { id: 1, nombre: "Dra. Ana Ruiz", esp: "Medicina general" },
    { id: 2, nombre: "Dr. Carlos Mejía", esp: "Medicina interna" },
    { id: 3, nombre: "Dra. Laura Gómez", esp: "Pediatría" },
  ];
  const pacientes = MOCK_PACIENTES;
  const citas: CitaCalendario[] = [];
  let idx = 0;

  for (let day = 0; day < 7; day++) {
    for (const med of medicos) {
      for (let h = 0; h < 2; h++) {
        const d = new Date(base);
        d.setDate(d.getDate() + day);
        d.setHours(8 + h * 3, 0, 0, 0);
        const pac = pacientes[idx % pacientes.length];
        idx++;
        citas.push({
          id: `cita-${med.id}-${day}-${h}`,
          paciente_id: pac.id,
          paciente_nombre: pac.nombre,
          paciente_documento: pac.documento,
          paciente_eps: pac.eps,
          medico_id: med.id,
          medico_nombre: med.nombre,
          especialidad: med.esp,
          fecha_hora: d.toISOString(),
          estado: day === 0 && h === 0 ? "activa" : day < 2 ? "pendiente" : "terminada",
          historial_id: idx,
        });
      }
    }
  }
  return citas;
}

export const MOCK_CITAS_CALENDARIO = buildCitas();

export function getPacienteDetalle(pacienteId: string): PacienteDetalle | null {
  const pac = MOCK_PACIENTES.find((p) => p.id === pacienteId);
  if (!pac) return null;

  const consultas = MOCK_CITAS_CALENDARIO.filter(
    (c) => c.paciente_id === pacienteId && c.estado === "terminada"
  )
    .slice(0, 5)
    .map((c, i) => ({
      id: i + 1,
      historial_id: c.historial_id ?? i + 1,
      fecha: c.fecha_hora,
      diagnostico:
        i % 2 === 0 ? "Cefalea tensional" : "Cuadro viral respiratorio alto",
      medico_nombre: c.medico_nombre,
      estado: c.estado,
    }));

  if (consultas.length === 0) {
    consultas.push({
      id: 1,
      historial_id: 1,
      fecha: pac.ultima_consulta,
      diagnostico: "Control general",
      medico_nombre: "Dra. Ana Ruiz",
      estado: "terminada",
    });
  }

  return { ...pac, consultas };
}

export function getCitaById(citaId: string): CitaCalendario | null {
  return MOCK_CITAS_CALENDARIO.find((c) => c.id === citaId) ?? null;
}

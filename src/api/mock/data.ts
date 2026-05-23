import type { CitaCalendario } from "@/types/citas-calendario";
import type { Medicamento } from "@/types/medicamentos";
import type { PacienteDetalle, PacienteResumen } from "@/types/pacientes";

export const MOCK_EPS = [
  { id: 1, nombre: "Sura" },
  { id: 2, nombre: "Sanitas" },
  { id: 3, nombre: "Nueva EPS" },
];

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

const MOTIVOS = [
  "Control general",
  "Cefalea recurrente",
  "Dolor abdominal",
  "Seguimiento hipertensión",
  "Cuadro respiratorio",
  "Control pediátrico",
];

function buildCitas(): CitaCalendario[] {
  const base = startOfWeek(new Date());
  const medicos = [
    { id: 1, nombre: "Dra. Ana Ruiz", esp: "Medicina general" },
    { id: 2, nombre: "Dr. Carlos Mejía", esp: "Medicina interna" },
    { id: 3, nombre: "Dra. Laura Gómez", esp: "Pediatría" },
  ];
  const pacientes = MOCK_PACIENTES;
  const citas: CitaCalendario[] = [];
  let idx = 0;

  const slots = [
    { day: 0, hour: 8 },
    { day: 0, hour: 10 },
    { day: 0, hour: 14 },
    { day: 1, hour: 9 },
    { day: 1, hour: 11 },
    { day: 1, hour: 15 },
    { day: 2, hour: 8 },
    { day: 2, hour: 10 },
    { day: 3, hour: 9 },
    { day: 3, hour: 14 },
    { day: 4, hour: 8 },
    { day: 4, hour: 11 },
    { day: 4, hour: 16 },
    { day: 5, hour: 9 },
    { day: 6, hour: 10 },
  ];

  for (const med of medicos) {
    for (const slot of slots) {
      const d = new Date(base);
      d.setDate(d.getDate() + slot.day);
      d.setHours(slot.hour, 0, 0, 0);
      const pac = pacientes[idx % pacientes.length];
      const isToday = slot.day === 0;
      idx++;
      citas.push({
        id: `cita-${med.id}-${slot.day}-${slot.hour}`,
        paciente_id: pac.id,
        paciente_nombre: pac.nombre,
        paciente_documento: pac.documento,
        paciente_eps: pac.eps,
        medico_id: med.id,
        medico_nombre: med.nombre,
        especialidad: med.esp,
        fecha_hora: d.toISOString(),
        motivo: MOTIVOS[idx % MOTIVOS.length],
        estado: isToday && slot.hour === 8 ? "activa" : slot.day < 2 ? "programada" : "terminada",
        historial_id: idx,
      });
    }
  }
  return citas;
}

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export const MOCK_CITAS_CALENDARIO = buildCitas();

export const MOCK_MEDICAMENTOS: Medicamento[] = [
  {
    id: 1,
    nombre: "Acetaminofén 500 mg",
    descripcion: "Analgésico y antipirético de uso común.",
    nombre_generico: "Paracetamol",
    nombre_comercial: "Dolex",
    categoria: "Analgésicos",
    diagnosticos_aplica: ["Cefalea", "Dolor leve", "Fiebre"],
    disponible: true,
    eps_id: 1,
    eps_nombre: "Sura",
  },
  {
    id: 2,
    nombre: "Ibuprofeno 400 mg",
    descripcion: "Antiinflamatorio no esteroideo.",
    nombre_generico: "Ibuprofeno",
    nombre_comercial: "Advil",
    categoria: "Antiinflamatorios",
    diagnosticos_aplica: ["Dolor muscular", "Inflamación articular"],
    disponible: true,
    eps_id: 1,
    eps_nombre: "Sura",
  },
  {
    id: 3,
    nombre: "Amoxicilina 500 mg",
    descripcion: "Antibiótico de amplio espectro.",
    nombre_generico: "Amoxicilina",
    nombre_comercial: "Amoxil",
    categoria: "Antibióticos",
    diagnosticos_aplica: ["Infección respiratoria", "Faringitis"],
    disponible: true,
    eps_id: 1,
    eps_nombre: "Sura",
  },
  {
    id: 4,
    nombre: "Losartán 50 mg",
    descripcion: "Antagonista del receptor de angiotensina II.",
    nombre_generico: "Losartán",
    nombre_comercial: "Cozaar",
    categoria: "Antihipertensivos",
    diagnosticos_aplica: ["Hipertensión arterial", "Protección renal"],
    disponible: true,
    eps_id: 1,
    eps_nombre: "Sura",
  },
  {
    id: 5,
    nombre: "Metformina 850 mg",
    descripcion: "Biguanida para control glucémico.",
    nombre_generico: "Metformina",
    nombre_comercial: "Glucophage",
    categoria: "Antidiabéticos",
    diagnosticos_aplica: ["Diabetes mellitus tipo 2"],
    disponible: true,
    eps_id: 1,
    eps_nombre: "Sura",
  },
  {
    id: 6,
    nombre: "Omeprazol 20 mg",
    descripcion: "Inhibidor de la bomba de protones.",
    nombre_generico: "Omeprazol",
    nombre_comercial: "Losec",
    categoria: "Analgésicos",
    diagnosticos_aplica: ["Gastritis", "Reflujo gastroesofágico"],
    disponible: false,
    eps_id: 1,
    eps_nombre: "Sura",
  },
  {
    id: 7,
    nombre: "Diclofenaco 50 mg",
    descripcion: "AINE para dolor e inflamación moderada.",
    nombre_generico: "Diclofenaco",
    nombre_comercial: "Voltaren",
    categoria: "Antiinflamatorios",
    diagnosticos_aplica: ["Artritis", "Dolor postoperatorio"],
    disponible: true,
    eps_id: 2,
    eps_nombre: "Sanitas",
  },
  {
    id: 8,
    nombre: "Azitromicina 500 mg",
    descripcion: "Macrólido para infecciones bacterianas.",
    nombre_generico: "Azitromicina",
    nombre_comercial: "Zithromax",
    categoria: "Antibióticos",
    diagnosticos_aplica: ["Neumonía", "Infección de vías respiratorias"],
    disponible: true,
    eps_id: 3,
    eps_nombre: "Nueva EPS",
  },
];

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
      diagnostico: c.motivo ?? (i % 2 === 0 ? "Cefalea tensional" : "Cuadro viral respiratorio alto"),
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

export function getMedicamentosByMedico(medicoId: number): Medicamento[] {
  const epsByMedico: Record<number, number> = { 1: 1, 2: 2, 3: 3 };
  const epsId = epsByMedico[medicoId] ?? 1;
  return MOCK_MEDICAMENTOS.filter((m) => m.eps_id === epsId);
}

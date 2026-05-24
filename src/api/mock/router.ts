import {
  getCitaById,
  getMedicamentosByMedico,
  getPacienteDetalle,
  MOCK_CITAS_CALENDARIO,
  MOCK_PACIENTES,
} from "@/api/mock/data";
import { MOCK_CITA_ACTIVA, MOCK_HISTORIAL, MOCK_TRANSCRIPCION } from "@/api/mock/consultas.mock";
import type { CitaActiva, HistorialMedico } from "@/types/consult";
import type { HistorialClinico } from "@/types/historial";
import { historialIaToClinico } from "@/utils/historialMapper";
import {
  activeCitaForConsulta,
  getLastPacienteEps,
  getLastPacienteNombre,
  getMockHistorial,
  nextCitaId,
  nextHistorialId,
  nextPacienteId,
  saveMockHistorial,
  setActiveCita,
  setLastPacienteInfo,
} from "./store";

export type HttpResult<T> = { data: T | null; error: string | null };

const MOCK_MEDICOS = [
  { id: 1, nombre: "Dra. Ana Ruiz", especialidad: "Medicina general", eps: "Sura" },
  {
    id: 2,
    nombre: "Dr. Carlos Mejía",
    especialidad: "Medicina interna",
    eps: "Sanitas",
  },
  { id: 3, nombre: "Dra. Laura Gómez", especialidad: "Pediatría", eps: "Nueva EPS" },
];

const MOCK_COBERTURA_BY_EPS: Record<
  string,
  { nombre: string; cubierto: boolean; generico_alternativa: string }[]
> = {
  Sura: [
    {
      nombre: "Acetaminofén 500 mg",
      cubierto: true,
      generico_alternativa: "Dolex genérico Sura",
    },
    {
      nombre: "Ibuprofeno 400 mg",
      cubierto: true,
      generico_alternativa: "Ibuprofeno genérico Sura",
    },
  ],
  Sanitas: [
    {
      nombre: "Acetaminofén 500 mg",
      cubierto: true,
      generico_alternativa: "Genérico Sanitas",
    },
    {
      nombre: "Ibuprofeno 400 mg",
      cubierto: false,
      generico_alternativa: "No POS — autorización",
    },
  ],
  "Nueva EPS": [
    {
      nombre: "Acetaminofén 500 mg",
      cubierto: true,
      generico_alternativa: "Nueva EPS genérico",
    },
    {
      nombre: "Ibuprofeno 400 mg",
      cubierto: false,
      generico_alternativa: "Copago aplicable",
    },
  ],
};

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function mockSlots(medicoId: number) {
  const base = new Date();
  base.setHours(8, 0, 0, 0);
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(base);
    d.setDate(d.getDate() + (i % 3));
    d.setHours(8 + (i % 4) * 2);
    return { id: medicoId * 100 + i + 1, datetime: d.toISOString() };
  });
}

export async function mockRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<HttpResult<T>> {
  await delay(path.includes("procesar") ? 1800 : 320);

  if (path === "/medicos") {
    return { data: MOCK_MEDICOS as T, error: null };
  }

  const slotsMatch = path.match(/^\/medicos\/(\d+)\/slots$/);
  if (slotsMatch) {
    return {
      data: mockSlots(Number(slotsMatch[1])) as T,
      error: null,
    };
  }

  if (path === "/pacientes" && options.method === "POST") {
    const body = JSON.parse(options.body as string) as Record<string, string>;
    setLastPacienteInfo(
      body.nombre || getLastPacienteNombre(),
      body.eps || getLastPacienteEps()
    );
    return {
      data: { id: nextPacienteId(), ...body } as T,
      error: null,
    };
  }

  if (path === "/pacientes") {
    return { data: MOCK_PACIENTES as T, error: null };
  }

  const pacienteMatch = path.match(/^\/pacientes\/([^/]+)$/);
  if (pacienteMatch && (!options.method || options.method === "GET")) {
    const detalle = getPacienteDetalle(pacienteMatch[1]);
    if (!detalle) return { data: null, error: "Paciente no encontrado" };
    return { data: detalle as T, error: null };
  }

  if (path.startsWith("/citas/calendario")) {
    const url = new URL(path, "http://local");
    const medicoId = url.searchParams.get("medico_id");
    let list = MOCK_CITAS_CALENDARIO;
    if (medicoId) {
      list = list.filter((c) => c.medico_id === Number(medicoId));
    }
    return { data: list as T, error: null };
  }

  const citaDetailMatch = path.match(/^\/citas\/([^/?]+)$/);
  if (citaDetailMatch) {
    const cita = getCitaById(citaDetailMatch[1]);
    if (!cita) return { data: null, error: "Cita no encontrada" };
    return { data: cita as T, error: null };
  }

  if (path === "/consultas/activa") {
    const cita: CitaActiva = activeCitaForConsulta ?? MOCK_CITA_ACTIVA;
    return { data: cita as T, error: null };
  }

  // Cita creada por el agente: registra en el mock store y se refleja en el calendario del médico
  if (path === "/citas/from-agent" && options.method === "POST") {
    const body = JSON.parse(options.body as string) as {
      id?: string;
      paciente: { nombre: string; documento?: string; telefono?: string; eps?: string };
      medico_id?: string;
      medico: string;
      especialidad: string;
      fecha: string;
      hora: string;
      motivo?: string;
      estado?: string;
    };

    // Resolver el medico del frontend principal (id numerico)
    const medicoLocal =
      MOCK_MEDICOS.find((m) => m.nombre === body.medico) ??
      MOCK_MEDICOS.find((m) =>
        m.especialidad.toLowerCase().includes((body.especialidad || "").toLowerCase())
      ) ??
      MOCK_MEDICOS[0];

    const citaId = nextCitaId();
    const historialId = nextHistorialId();
    getMockHistorial(historialId);

    const pacienteId = `pac-${nextPacienteId()}`;
    setLastPacienteInfo(body.paciente.nombre, body.paciente.eps || "Sura");

    // Construir fecha_hora ISO desde fecha (yyyy-mm-dd) + hora (HH:MM)
    const fechaIso = new Date(`${body.fecha}T${body.hora}:00`).toISOString();

    // Pushear al calendario del médico (lo que ve /consultas)
    MOCK_CITAS_CALENDARIO.push({
      id: `cita-${citaId}`,
      paciente_id: pacienteId,
      paciente_nombre: body.paciente.nombre,
      paciente_documento: body.paciente.documento || "",
      paciente_eps: body.paciente.eps || "Sura",
      medico_id: medicoLocal.id,
      medico_nombre: medicoLocal.nombre,
      especialidad: medicoLocal.especialidad,
      fecha_hora: fechaIso,
      motivo: body.motivo || "Consulta agendada por asistente IA",
      estado: "programada",
      historial_id: historialId,
    });

    // Cita activa para el médico (próxima consulta)
    setActiveCita({
      id: `cita-${citaId}`,
      paciente_id: pacienteId,
      paciente_nombre: body.paciente.nombre,
      medico_nombre: medicoLocal.nombre,
      especialidad: medicoLocal.especialidad,
      fecha_hora: fechaIso,
      estado: "programada",
    });

    return {
      data: {
        id: citaId,
        cita_id: `cita-${citaId}`,
        historial_id: historialId,
        paciente_id: pacienteId,
        medico_id: medicoLocal.id,
        estado: "confirmada",
      } as T,
      error: null,
    };
  }

  // Citas del paciente (cliente -> /mis-citas)
  const pacienteCitasMatch = path.match(/^\/citas\/paciente\/([^/?]+)/);
  if (pacienteCitasMatch) {
    const pid = pacienteCitasMatch[1];
    const list = MOCK_CITAS_CALENDARIO.filter((c) => c.paciente_id === pid);
    return { data: list as T, error: null };
  }

  if (path === "/citas" && options.method === "POST") {
    const body = JSON.parse(options.body as string) as {
      paciente_id: number;
      medico_id: number;
      slot_id: number;
    };
    const citaId = nextCitaId();
    const historialId = nextHistorialId();
    getMockHistorial(historialId);

    const medico = MOCK_MEDICOS.find((m) => m.id === body.medico_id);
    setActiveCita({
      id: `cita-${citaId}`,
      paciente_id: `pac-${body.paciente_id}`,
      paciente_nombre: getLastPacienteNombre(),
      medico_nombre: medico?.nombre ?? "Médico",
      especialidad: medico?.especialidad ?? "General",
      fecha_hora: new Date().toISOString(),
      estado: "activa",
    });

    return {
      data: {
        id: citaId,
        ...body,
        historial_id: historialId,
        estado: "confirmada",
      } as T,
      error: null,
    };
  }

  const historialGet = path.match(/^\/historiales\/(\d+)$/);
  if (historialGet && (!options.method || options.method === "GET")) {
    const hid = Number(historialGet[1]);
    return { data: getMockHistorial(hid) as T, error: null };
  }

  if (historialGet && options.method === "PUT") {
    const hid = Number(historialGet[1]);
    const updated = JSON.parse(options.body as string) as HistorialClinico;
    return { data: saveMockHistorial(hid, updated) as T, error: null };
  }

  const firmarMatch = path.match(/^\/historiales\/(\d+)\/firmar$/);
  if (firmarMatch && options.method === "POST") {
    const hid = Number(firmarMatch[1]);
    const current = getMockHistorial(hid);
    current.firmado = true;
    return { data: { ...current, firmado: true } as T, error: null };
  }

  const pdfMatch = path.match(/^\/historiales\/(\d+)\/pdf$/);
  if (pdfMatch) {
    const text = `Historial clínico #${pdfMatch[1]} — MediNote AI (mock PDF)`;
    return {
      data: new Blob([text], { type: "application/pdf" }) as T,
      error: null,
    };
  }

  if (path.startsWith("/medicamentos/cobertura")) {
    const url = new URL(path, "http://local");
    const eps = url.searchParams.get("eps") || "Sura";
    const nombres = (url.searchParams.get("nombres") || "")
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);
    let data = MOCK_COBERTURA_BY_EPS[eps] ?? MOCK_COBERTURA_BY_EPS.Sura;
    if (nombres.length) {
      const set = new Set(nombres.map((n) => n.toLowerCase()));
      data = data.filter((m) => set.has(m.nombre.toLowerCase()));
    }
    return { data: data as T, error: null };
  }

  if (path.startsWith("/medicamentos")) {
    const url = new URL(path, "http://local");
    const medicoId = url.searchParams.get("medico_id");
    const list = medicoId
      ? getMedicamentosByMedico(Number(medicoId))
      : getMedicamentosByMedico(1);
    return { data: list as T, error: null };
  }

  if (path === "/consultas/procesar" && options.method === "POST") {
    const historialId = nextHistorialId();
    const ia: HistorialMedico = MOCK_HISTORIAL;
    const eps = getLastPacienteEps() || "Sura";
    const clinico = historialIaToClinico(ia, eps);
    saveMockHistorial(historialId, clinico);

    if (activeCitaForConsulta) {
      setActiveCita({ ...activeCitaForConsulta, estado: "terminada" });
    }

    return {
      data: {
        consulta_id: `cons-${historialId}`,
        historial_id: historialId,
        transcripcion: MOCK_TRANSCRIPCION.trim(),
        historial: ia,
      } as T,
      error: null,
    };
  }

  return { data: null, error: `Mock: ruta no implementada (${path})` };
}

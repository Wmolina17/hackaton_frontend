import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { citasCalendarioApi } from "@/api/citas-calendario";
import { medicosApi } from "@/api/medicos";
import { WeekCalendar } from "@/components/consult/WeekCalendar";
import { useAuth } from "@/context/AuthContext";
import { CONSULT_STORAGE_KEYS } from "@/types/consult";
import type { CitaCalendario } from "@/types/citas-calendario";
import type { Medico } from "@/types/agendar";
import { setActiveCita } from "@/api/mock/store";
import "./ConsultasPage.css";

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatWeekRange(start: Date): string {
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  return `${start.toLocaleDateString("es-CO", opts)} – ${end.toLocaleDateString("es-CO", { ...opts, year: "numeric" })}`;
}

export function ConsultasPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [medico, setMedico] = useState<Medico | null>(null);
  const [citas, setCitas] = useState<CitaCalendario[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);

  const weekStart = useMemo(() => {
    const base = startOfWeek(new Date());
    base.setDate(base.getDate() + weekOffset * 7);
    return base;
  }, [weekOffset]);

  useEffect(() => {
    if (!user?.medicoId) return;
    void (async () => {
      const { data } = await medicosApi.list();
      const found = (data ?? []).find((m) => m.id === user.medicoId);
      if (found) setMedico(found);
    })();
  }, [user?.medicoId]);

  useEffect(() => {
    if (!user?.medicoId) return;
    const loadCitas = async () => {
      setLoading(true);
      const { data } = await citasCalendarioApi.list(user.medicoId);
      setCitas(data ?? []);
      setLoading(false);
    };
    void loadCitas();
    window.addEventListener("medinote:appointment-created", loadCitas);
    return () => window.removeEventListener("medinote:appointment-created", loadCitas);
  }, [user?.medicoId]);

  const weekCitas = useMemo(() => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    return citas.filter((c) => {
      const d = new Date(c.fecha_hora);
      return d >= weekStart && d < weekEnd;
    });
  }, [citas, weekStart]);

  const stats = useMemo(() => {
    const activas = weekCitas.filter((c) => c.estado === "activa").length;
    const pendientes = weekCitas.filter(
      (c) => c.estado === "pendiente" || c.estado === "programada"
    ).length;
    const terminadas = weekCitas.filter((c) => c.estado === "terminada").length;
    return { activas, pendientes, terminadas, total: weekCitas.length };
  }, [weekCitas]);

  function handleSelectCita(cita: CitaCalendario) {
    setActiveCita({
      id: cita.id,
      paciente_id: cita.paciente_id,
      paciente_nombre: cita.paciente_nombre,
      medico_nombre: cita.medico_nombre,
      especialidad: cita.especialidad,
      fecha_hora: cita.fecha_hora,
      estado: cita.estado,
    });
    sessionStorage.setItem(CONSULT_STORAGE_KEYS.pacienteId, cita.paciente_id);
    sessionStorage.setItem(CONSULT_STORAGE_KEYS.citaId, cita.id);
    navigate(`/consulta/${cita.id}`);
  }

  return (
    <div className="mn-page consultas-page">
      <header className="consultas-page__hero">
        <div>
          <h2>Mis consultas</h2>
          <p className="consultas-page__subtitle">
            {user?.medicoNombre} · {user?.medicoEspecialidad}
          </p>
        </div>
        {medico?.eps && (
          <span className="consultas-page__eps-tag">{medico.eps}</span>
        )}
      </header>

      <div className="consultas-page__stats">
        <div className="consultas-page__stat">
          <span className="consultas-page__stat-value">{stats.total}</span>
          <span className="consultas-page__stat-label">Esta semana</span>
        </div>
        <div className="consultas-page__stat consultas-page__stat--active">
          <span className="consultas-page__stat-value">{stats.activas}</span>
          <span className="consultas-page__stat-label">En curso</span>
        </div>
        <div className="consultas-page__stat consultas-page__stat--pending">
          <span className="consultas-page__stat-value">{stats.pendientes}</span>
          <span className="consultas-page__stat-label">Programadas</span>
        </div>
        <div className="consultas-page__stat consultas-page__stat--done">
          <span className="consultas-page__stat-value">{stats.terminadas}</span>
          <span className="consultas-page__stat-label">Completadas</span>
        </div>
      </div>

      <div className="consultas-page__week-nav">
        <button type="button" onClick={() => setWeekOffset((w) => w - 1)}>
          ← Semana anterior
        </button>
        <span>{formatWeekRange(weekStart)}</span>
        <button type="button" onClick={() => setWeekOffset((w) => w + 1)}>
          Semana siguiente →
        </button>
      </div>

      <div className="mn-panel consultas-page__calendar">
        {loading ? (
          <p className="consultas-page__loading">Cargando calendario…</p>
        ) : (
          <WeekCalendar
            citas={weekCitas}
            onSelect={handleSelectCita}
            weekStart={weekStart}
          />
        )}
      </div>
    </div>
  );
}

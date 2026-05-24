import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { medicosApi } from "@/api/medicos";
import { misCitasApi, type MiCita } from "@/api/mis-citas";
import { Button } from "@/components/ui/Button";
import "./MisCitasPage.css";

type MedicoLite = {
  id: number;
  nombre: string;
  especialidad: string;
};

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("es-CO", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatHour(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
}

function statusClass(estado: string) {
  const s = estado.toLowerCase();
  if (s === "confirmada" || s === "programada") return "mis-citas__badge--success";
  if (s === "pendiente" || s === "activa") return "mis-citas__badge--info";
  if (s === "cancelada") return "mis-citas__badge--warning";
  return "mis-citas__badge--muted";
}

export function MisCitasPage() {
  const [loading, setLoading] = useState(true);
  const [citas, setCitas] = useState<MiCita[]>([]);
  const [medicos, setMedicos] = useState<Record<number, MedicoLite>>({});

  useEffect(() => {
    setLoading(true);
    void (async () => {
      const [citasRes, medicosRes] = await Promise.all([
        misCitasApi.list(),
        medicosApi.list(),
      ]);

      const citasData = citasRes.data ?? [];
      setCitas(citasData);

      const medicosMap: Record<number, MedicoLite> = {};
      for (const m of medicosRes.data ?? []) {
        medicosMap[m.id] = { id: m.id, nombre: m.nombre, especialidad: m.especialidad };
      }
      setMedicos(medicosMap);
      setLoading(false);
    })();
  }, []);

  const proximas = useMemo(
    () =>
      [...citas]
        .filter((c) => {
          const t = new Date(c.fecha_hora).getTime();
          return !Number.isNaN(t);
        })
        .sort((a, b) => new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime()),
    [citas]
  );

  const nextId = proximas[0]?.id;

  if (loading) return <p className="paciente-detalle__loading">Cargando citas...</p>;

  return (
    <div className="mn-page mis-citas-page">
      <header className="paciente-detalle__header mn-panel">
        <span className="paciente-detalle__avatar">C</span>
        <div className="paciente-detalle__header-info">
          <h2>Mis proximas citas medicas</h2>
          <p>Agenda confirmada y sincronizada con el sistema</p>
          <p className="paciente-detalle__stats">{proximas.length} cita(s) registrada(s)</p>
        </div>
        <Link to="/agendar">
          <Button variant="secondary">Agendar nueva cita</Button>
        </Link>
      </header>

      <section className="mis-citas__section">
        <h3 className="mis-citas__section-title">Proximas citas</h3>
        {!proximas.length ? (
          <div className="mis-citas__empty">
            <p>Aun no tienes citas registradas.</p>
            <Link to="/agendar">
              <Button>Ir al asistente</Button>
            </Link>
          </div>
        ) : (
          <div className="mis-citas__grid">
            {proximas.map((cita) => {
              const medico = medicos[cita.medico_id];
              const isNext = cita.id === nextId;
              return (
                <article
                  key={cita.id}
                  className={`mis-citas__card ${isNext ? "mis-citas__card--highlight" : ""}`}
                >
                  <Link to={`/mis-citas/${cita.id}`} className="mis-citas__card-link">
                    <div className="mis-citas__card-header">
                      <div>
                        <h4>{medico?.nombre ?? `Medico #${cita.medico_id}`}</h4>
                        <p className="mis-citas__card-esp">
                          {medico?.especialidad ?? "Especialidad no disponible"}
                        </p>
                      </div>
                      <span className={`mis-citas__badge ${statusClass(cita.estado)}`}>
                        {cita.estado}
                      </span>
                    </div>
                    <div className="mis-citas__card-body">
                      <div className="mis-citas__simple">
                        <span className="mis-citas__simple-label">Tipo</span>
                        <span className="mis-citas__simple-value">{cita.motivo || "Consulta general"}</span>
                      </div>
                      <div className="mis-citas__simple">
                        <span className="mis-citas__simple-label">Medico</span>
                        <span className="mis-citas__simple-value">{medico?.nombre ?? `Medico #${cita.medico_id}`}</span>
                      </div>
                      <div className="mis-citas__simple">
                        <span className="mis-citas__simple-label">Hora</span>
                        <span className="mis-citas__simple-value">
                          {formatDate(cita.fecha_hora)} - {formatHour(cita.fecha_hora)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

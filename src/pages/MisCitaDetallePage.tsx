import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { medicosApi } from "@/api/medicos";
import { misCitasApi, type MiCita } from "@/api/mis-citas";
import { Button } from "@/components/ui/Button";
import "./MisCitaDetallePage.css";

type MedicoLite = {
  id: number;
  nombre: string;
  especialidad: string;
};

function formatDateTime(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return {
    fecha: d.toLocaleDateString("es-CO", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    hora: d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
  };
}

export function MisCitaDetallePage() {
  const { citaId } = useParams();
  const [loading, setLoading] = useState(true);
  const [cita, setCita] = useState<MiCita | null>(null);
  const [medicos, setMedicos] = useState<Record<number, MedicoLite>>({});

  useEffect(() => {
    setLoading(true);
    void (async () => {
      const [citasRes, medicosRes] = await Promise.all([
        misCitasApi.list(),
        medicosApi.list(),
      ]);
      const found = (citasRes.data ?? []).find((c) => String(c.id) === String(citaId)) ?? null;
      setCita(found);
      const medicosMap: Record<number, MedicoLite> = {};
      for (const m of medicosRes.data ?? []) {
        medicosMap[m.id] = { id: m.id, nombre: m.nombre, especialidad: m.especialidad };
      }
      setMedicos(medicosMap);
      setLoading(false);
    })();
  }, [citaId]);

  const medico = useMemo(
    () => (cita ? medicos[cita.medico_id] : undefined),
    [cita, medicos]
  );
  const dateData = cita ? formatDateTime(cita.fecha_hora) : null;

  if (loading) return <p className="paciente-detalle__loading">Cargando cita...</p>;
  if (!cita) return <p className="paciente-detalle__loading">Cita no encontrada.</p>;

  return (
    <div className="mn-page mis-cita-detalle">
      <Link to="/mis-citas" className="mis-cita-detalle__back">← Volver a Mis citas</Link>

      <header className="paciente-detalle__header mn-panel">
        <span className="paciente-detalle__avatar">C</span>
        <div className="paciente-detalle__header-info">
          <h2>Detalle de cita medica</h2>
          <p>cita-{cita.id}</p>
          <p className="paciente-detalle__stats">{cita.estado}</p>
        </div>
      </header>

      <section className="mn-panel mis-cita-detalle__form">
        <h3>Informacion completa</h3>
        <div className="mis-cita-detalle__grid">
          <Field label="Tipo de consulta" value={cita.motivo || "Consulta general"} />
          <Field label="Medico" value={medico?.nombre ?? `Medico #${cita.medico_id}`} />
          <Field label="Especialidad" value={medico?.especialidad ?? "No disponible"} />
          <Field label="Fecha" value={typeof dateData === "string" ? dateData : (dateData?.fecha ?? "-")} />
          <Field label="Hora" value={typeof dateData === "string" ? "-" : (dateData?.hora ?? "-")} />
          <Field label="Estado" value={cita.estado} />
        </div>
        <div className="mis-cita-detalle__actions">
          <Link to="/agendar">
            <Button>Agendar otra cita</Button>
          </Link>
          <Link to="/mis-citas">
            <Button variant="secondary">Ver todas</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="mis-cita-detalle__field">
      <label>{label}</label>
      <input value={value} readOnly />
    </div>
  );
}


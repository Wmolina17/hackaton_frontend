import type { CitaActiva } from "@/types/consult";
import "./ActiveCitaCard.css";

interface ActiveCitaCardProps {
  cita: CitaActiva;
}

function formatFecha(iso: string): string {
  try {
    return new Intl.DateTimeFormat("es-CO", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function ActiveCitaCard({ cita }: ActiveCitaCardProps) {
  return (
    <article className="active-cita">
      <div className="active-cita__header">
        <span
          className={`active-cita__badge ${
            cita.estado === "terminada" ? "active-cita__badge--terminada" : ""
          }`}
        >
          {cita.estado}
        </span>
        <time className="active-cita__time" dateTime={cita.fecha_hora}>
          {formatFecha(cita.fecha_hora)}
        </time>
      </div>
      <h2 className="active-cita__patient">{cita.paciente_nombre}</h2>
      <p className="active-cita__meta">
        {cita.medico_nombre} · {cita.especialidad}
      </p>
      <p className="active-cita__id">Cita #{cita.id}</p>
    </article>
  );
}

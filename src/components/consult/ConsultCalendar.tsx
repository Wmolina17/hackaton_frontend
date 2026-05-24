import type { CitaCalendario } from "@/types/citas-calendario";
import "./ConsultCalendar.css";

interface ConsultCalendarProps {
  citas: CitaCalendario[];
  onSelect: (cita: CitaCalendario) => void;
}

function groupByDay(citas: CitaCalendario[]): Map<string, CitaCalendario[]> {
  const map = new Map<string, CitaCalendario[]>();
  for (const cita of citas) {
    const day = cita.fecha_hora.slice(0, 10);
    const list = map.get(day) ?? [];
    list.push(cita);
    map.set(day, list);
  }
  return new Map([...map.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

function formatDay(iso: string): string {
  return new Date(iso + "T12:00:00").toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ConsultCalendar({ citas, onSelect }: ConsultCalendarProps) {
  const byDay = groupByDay(citas);

  if (!citas.length) {
    return <p className="consult-cal__empty">No hay citas en este periodo.</p>;
  }

  return (
    <div className="consult-cal">
      {[...byDay.entries()].map(([day, dayCitas]) => (
        <section key={day} className="consult-cal__day">
          <h3 className="consult-cal__day-title">{formatDay(day)}</h3>
          <div className="consult-cal__slots">
            {dayCitas
              .sort(
                (a, b) =>
                  new Date(a.fecha_hora).getTime() -
                  new Date(b.fecha_hora).getTime()
              )
              .map((cita) => (
                <button
                  key={cita.id}
                  type="button"
                  className={`consult-cal__cita consult-cal__cita--${cita.estado}`}
                  onClick={() => onSelect(cita)}
                >
                  <span className="consult-cal__time">
                    {formatTime(cita.fecha_hora)}
                  </span>
                  <span className="consult-cal__patient">{cita.paciente_nombre}</span>
                  <span className="consult-cal__meta">{cita.especialidad}</span>
                  <span className={`consult-cal__status consult-cal__status--${cita.estado}`}>
                    {cita.estado}
                  </span>
                </button>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}

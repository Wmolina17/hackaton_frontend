import type { CitaCalendario } from "@/types/citas-calendario";
import "./WeekCalendar.css";

interface WeekCalendarProps {
  citas: CitaCalendario[];
  onSelect: (cita: CitaCalendario) => void;
  weekStart?: Date;
}

const HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDayHeader(date: Date): { weekday: string; day: string } {
  return {
    weekday: date.toLocaleDateString("es-CO", { weekday: "short" }),
    day: date.toLocaleDateString("es-CO", { day: "numeric", month: "short" }),
  };
}

function formatHour(h: number): string {
  return `${h.toString().padStart(2, "0")}:00`;
}

const ESTADO_LABEL: Record<string, string> = {
  activa: "En curso",
  pendiente: "Programada",
  terminada: "Completada",
  programada: "Programada",
};

export function WeekCalendar({ citas, onSelect, weekStart }: WeekCalendarProps) {
  const start = weekStart ?? startOfWeek(new Date());
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const today = new Date();

  function citasForSlot(day: Date, hour: number): CitaCalendario[] {
    return citas.filter((c) => {
      const d = new Date(c.fecha_hora);
      return sameDay(d, day) && d.getHours() === hour;
    });
  }

  if (!citas.length) {
    return <p className="week-cal__empty">No hay citas programadas esta semana.</p>;
  }

  return (
    <div className="week-cal">
      <div className="week-cal__header">
        <div className="week-cal__corner" />
        {days.map((day) => {
          const { weekday, day: dayLabel } = formatDayHeader(day);
          const isToday = sameDay(day, today);
          return (
            <div
              key={day.toISOString()}
              className={`week-cal__day-head ${isToday ? "week-cal__day-head--today" : ""}`}
            >
              <span className="week-cal__weekday">{weekday}</span>
              <span className="week-cal__date">{dayLabel}</span>
            </div>
          );
        })}
      </div>

      <div className="week-cal__body">
        {HOURS.map((hour) => (
          <div key={hour} className="week-cal__row">
            <div className="week-cal__time">{formatHour(hour)}</div>
            {days.map((day) => {
              const slotCitas = citasForSlot(day, hour);
              return (
                <div
                  key={`${day.toISOString()}-${hour}`}
                  className="week-cal__cell"
                >
                  {slotCitas.map((cita) => (
                    <button
                      key={cita.id}
                      type="button"
                      className={`week-cal__event week-cal__event--${cita.estado}`}
                      onClick={() => onSelect(cita)}
                    >
                      <span className="week-cal__event-time">
                        {new Date(cita.fecha_hora).toLocaleTimeString("es-CO", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="week-cal__event-patient">{cita.paciente_nombre}</span>
                      <span className="week-cal__event-status">
                        {ESTADO_LABEL[cita.estado] ?? cita.estado}
                      </span>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

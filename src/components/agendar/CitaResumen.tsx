import type { Medico, Paciente, Slot } from "@/types/agendar";
import "./CitaResumen.css";

interface CitaResumenProps {
  medico: Medico;
  slot: Slot;
  paciente: Paciente;
}

export function CitaResumen({ medico, slot, paciente }: CitaResumenProps) {
  const fecha = new Date(slot.datetime).toLocaleString("es-CO", {
    dateStyle: "full",
    timeStyle: "short",
  });

  return (
    <div className="cita-resumen">
      <h3>Confirmar cita</h3>
      <dl>
        <div>
          <dt>Médico</dt>
          <dd>
            {medico.nombre} — {medico.especialidad}
          </dd>
        </div>
        <div>
          <dt>Fecha y hora</dt>
          <dd>{fecha}</dd>
        </div>
        <div>
          <dt>Paciente</dt>
          <dd>
            {paciente.nombre} ({paciente.documento})
          </dd>
        </div>
        <div>
          <dt>EPS</dt>
          <dd>{paciente.eps}</dd>
        </div>
      </dl>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { citasCalendarioApi } from "@/api/citas-calendario";
import { medicosApi } from "@/api/medicos";
import { ConsultCalendar } from "@/components/consult/ConsultCalendar";
import { CONSULT_STORAGE_KEYS } from "@/types/consult";
import type { CitaCalendario } from "@/types/citas-calendario";
import type { Medico } from "@/types/agendar";
import { setActiveCita } from "@/api/mock/store";
import "./ConsultasPage.css";

export function ConsultasPage() {
  const navigate = useNavigate();
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [medicoId, setMedicoId] = useState<number | null>(null);
  const [citas, setCitas] = useState<CitaCalendario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const { data } = await medicosApi.list();
      const list = data ?? [];
      setMedicos(list);
      if (list.length) setMedicoId(list[0].id);
    })();
  }, []);

  useEffect(() => {
    if (!medicoId) return;
    void (async () => {
      setLoading(true);
      const { data } = await citasCalendarioApi.list(medicoId);
      setCitas(data ?? []);
      setLoading(false);
    })();
  }, [medicoId]);

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

  const medicoActual = medicos.find((m) => m.id === medicoId);

  return (
    <div className="mn-page consultas-page">
      <header className="mn-page__hero">
        <h2>Consultas del médico</h2>
        <p>
          Calendario de citas por profesional. Selecciona una cita para confirmar
          al paciente e iniciar la consulta.
        </p>
      </header>

      <div className="consultas-page__tabs">
        {medicos.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`consultas-page__tab ${
              medicoId === m.id ? "consultas-page__tab--active" : ""
            }`}
            onClick={() => setMedicoId(m.id)}
          >
            {m.nombre}
          </button>
        ))}
      </div>

      {medicoActual && (
        <p className="consultas-page__medico-meta">
          {medicoActual.especialidad}
          {medicoActual.eps ? ` · EPS ref: ${medicoActual.eps}` : ""}
        </p>
      )}

      <div className="mn-panel">
        {loading ? (
          <p className="consultas-page__loading">Cargando calendario…</p>
        ) : (
          <ConsultCalendar citas={citas} onSelect={handleSelectCita} />
        )}
      </div>
    </div>
  );
}

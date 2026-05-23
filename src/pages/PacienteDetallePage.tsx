import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { pacientesListApi } from "@/api/pacientes";
import { Button } from "@/components/ui/Button";
import type { PacienteDetalle } from "@/types/pacientes";
import "./PacienteDetallePage.css";

export function PacienteDetallePage() {
  const { pacienteId } = useParams();
  const [paciente, setPaciente] = useState<PacienteDetalle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pacienteId) return;
    void (async () => {
      const { data, error } = await pacientesListApi.get(pacienteId);
      if (data) setPaciente(data);
      if (error) console.error(error);
      setLoading(false);
    })();
  }, [pacienteId]);

  if (loading) {
    return <p className="paciente-detalle__loading">Cargando historial del paciente…</p>;
  }

  if (!paciente) {
    return <p className="paciente-detalle__loading">Paciente no encontrado.</p>;
  }

  return (
    <div className="mn-page paciente-detalle">
      <Link to="/historial" className="paciente-detalle__back">
        ← Todos los pacientes
      </Link>

      <header className="paciente-detalle__header mn-panel">
        <span className="paciente-detalle__avatar">{paciente.nombre.charAt(0)}</span>
        <div>
          <h2>{paciente.nombre}</h2>
          <p>
            CC {paciente.documento} · {paciente.eps}
            {paciente.telefono ? ` · ${paciente.telefono}` : ""}
          </p>
          <p className="paciente-detalle__stats">
            {paciente.total_consultas} consultas registradas
          </p>
        </div>
      </header>

      <section>
        <h3 className="paciente-detalle__section-title">Consultas anteriores</h3>
        <ul className="paciente-detalle__consultas">
          {paciente.consultas.map((c) => (
            <li key={c.id} className="mn-panel paciente-detalle__consulta-card">
              <div>
                <time dateTime={c.fecha}>
                  {new Date(c.fecha).toLocaleString("es-CO", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </time>
                <p className="paciente-detalle__diag">{c.diagnostico}</p>
                <p className="paciente-detalle__medico">{c.medico_nombre}</p>
              </div>
              <Link to={`/historial/editar/${c.historial_id}`}>
                <Button variant="secondary">Ver historial IA</Button>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

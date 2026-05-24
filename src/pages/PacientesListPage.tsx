import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { pacientesListApi } from "@/api/pacientes";
import type { PacienteResumen } from "@/types/pacientes";
import "./PacientesListPage.css";

export function PacientesListPage() {
  const [pacientes, setPacientes] = useState<PacienteResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const loadPacientes = async () => {
      const { data, error } = await pacientesListApi.list();
      if (data) setPacientes(data);
      if (error) console.error(error);
      setLoading(false);
    };
    void loadPacientes();
    window.addEventListener("medinote:patient-created", loadPacientes);
    window.addEventListener("medinote:patient-monitored", loadPacientes);
    return () => {
      window.removeEventListener("medinote:patient-created", loadPacientes);
      window.removeEventListener("medinote:patient-monitored", loadPacientes);
    };
  }, []);

  const filtered = pacientes.filter(
    (p) =>
      p.nombre.toLowerCase().includes(query.toLowerCase()) ||
      p.documento.includes(query)
  );

  return (
    <div className="mn-page pacientes-page">
      <header className="mn-page__hero">
        <h2>Pacientes</h2>
        <p>Consulta el historial clínico de tus pacientes atendidos.</p>
      </header>

      <input
        type="search"
        className="pacientes-page__search"
        placeholder="Buscar por nombre o documento…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading ? (
        <p className="pacientes-page__loading">Cargando pacientes…</p>
      ) : (
        <ul className="pacientes-page__list">
          {filtered.map((p) => (
            <li key={p.id}>
              <Link to={`/historial/paciente/${p.id}`} className="pacientes-page__card">
                <span className="pacientes-page__avatar">{p.nombre.charAt(0)}</span>
                <div className="pacientes-page__info">
                  <strong>{p.nombre}</strong>
                  <span>CC {p.documento}</span>
                  <span className="pacientes-page__meta">
                    {p.total_consultas} consultas · Última:{" "}
                    {new Date(p.ultima_consulta).toLocaleDateString("es-CO")}
                  </span>
                </div>
                <span className="pacientes-page__arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

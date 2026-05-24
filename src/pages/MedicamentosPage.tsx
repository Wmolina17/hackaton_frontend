import { useEffect, useMemo, useState } from "react";
import { medicamentosApi } from "@/api/medicamentos";
import { useAuth } from "@/context/AuthContext";
import type { Medicamento } from "@/types/medicamentos";
import "./MedicamentosPage.css";

const CATEGORIAS = [
  "Todos",
  "Analgésicos",
  "Antiinflamatorios",
  "Antibióticos",
  "Antihipertensivos",
  "Antidiabéticos",
];

export function MedicamentosPage() {
  const { user } = useAuth();
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("Todos");

  useEffect(() => {
    void (async () => {
      const { data } = await medicamentosApi.list(user?.medicoId);
      setMedicamentos(data ?? []);
      setLoading(false);
    })();
  }, [user?.medicoId]);

  const filtered = useMemo(() => {
    return medicamentos.filter((m) => {
      const matchQuery =
        !query ||
        m.nombre.toLowerCase().includes(query.toLowerCase()) ||
        (m.nombre_generico?.toLowerCase().includes(query.toLowerCase()) ?? false) ||
        (m.nombre_comercial?.toLowerCase().includes(query.toLowerCase()) ?? false);
      const matchCat =
        categoria === "Todos" || m.categoria === categoria;
      return matchQuery && matchCat;
    });
  }, [medicamentos, query, categoria]);

  const disponibles = filtered.filter((m) => m.disponible).length;

  return (
    <div className="mn-page medicamentos-page">
      <header className="mn-page__hero">
        <h2>Formulario disponible</h2>
        <p>
          Medicamentos autorizados para tu práctica. Filtra por categoría o busca
          por nombre.
        </p>
      </header>

      <div className="medicamentos-page__toolbar">
        <input
          type="search"
          className="medicamentos-page__search"
          placeholder="Buscar medicamento…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="medicamentos-page__filters">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`medicamentos-page__filter ${
                categoria === cat ? "medicamentos-page__filter--active" : ""
              }`}
              onClick={() => setCategoria(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <p className="medicamentos-page__count">
        {disponibles} de {filtered.length} disponibles
      </p>

      {loading ? (
        <p className="medicamentos-page__loading">Cargando medicamentos…</p>
      ) : (
        <div className="medicamentos-page__grid">
          {filtered.map((med) => (
            <article key={med.id} className="medicamentos-page__card mn-panel">
              <div className="medicamentos-page__card-head">
                <h3>{med.nombre}</h3>
                <span
                  className={
                    med.disponible
                      ? "medicamentos-page__badge medicamentos-page__badge--ok"
                      : "medicamentos-page__badge"
                  }
                >
                  {med.disponible ? "Disponible" : "No disponible"}
                </span>
              </div>
              {med.nombre_comercial && (
                <p className="medicamentos-page__commercial">
                  {med.nombre_comercial}
                </p>
              )}
              <p className="medicamentos-page__desc">{med.descripcion}</p>
              <dl className="medicamentos-page__meta">
                {med.nombre_generico && (
                  <>
                    <dt>Genérico</dt>
                    <dd>{med.nombre_generico}</dd>
                  </>
                )}
                {med.categoria && (
                  <>
                    <dt>Categoría</dt>
                    <dd>{med.categoria}</dd>
                  </>
                )}
                {med.diagnosticos_aplica && med.diagnosticos_aplica.length > 0 && (
                  <>
                    <dt>Indicaciones</dt>
                    <dd>{med.diagnosticos_aplica.join(", ")}</dd>
                  </>
                )}
              </dl>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { healthApi } from "@/api/client";
import type { HealthCheckResponse } from "@/types";
import "./HomePage.css";

export function HomePage() {
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    healthApi
      .check()
      .then((res) => setHealth(res.data ?? null))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="home">
      <h2>Bienvenido al Hackaton</h2>
      <p>Frontend conectado con el backend. Empieza a construir desde aquí.</p>

      {loading && <p>Cargando estado del API...</p>}

      {health && (
        <div className="home__status home__status--ok">
          <strong>API:</strong> {health.status} — uptime: {Math.round(health.uptime)}s
        </div>
      )}

      {error && (
        <div className="home__status home__status--error">
          <strong>Error:</strong> {error}
        </div>
      )}
    </section>
  );
}

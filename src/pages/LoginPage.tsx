import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { USE_MOCK } from "@/api/config";
import { MOCK_AUTH_USERS } from "@/api/mock/auth.mock";
import { BackgroundScene } from "@/components/layout/BackgroundScene";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import "./LoginPage.css";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [cedula, setCedula] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(cedula, password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    navigate(result.role === "cliente" ? "/agendar" : "/consultas");
  }

  const demoPaciente = USE_MOCK
    ? MOCK_AUTH_USERS.find((u) => u.role === "cliente")
    : { cedula: "2001", password: "paciente123" };
  const demoMedico = USE_MOCK
    ? MOCK_AUTH_USERS.find((u) => u.role === "medico")
    : { cedula: "1001", password: "medico123" };

  return (
    <div className="login-page">
      <BackgroundScene />
      <div className="login-page__card">
        <div className="login-page__brand">
          <span className="login-page__logo">MN</span>
          <div>
            <h1>MediNote</h1>
            <p>Plataforma clínica asistida por IA</p>
          </div>
        </div>

        <p className="login-page__intro">
          Ingresa con tu cédula y contraseña para acceder a la plataforma.
        </p>

        <form className="login-page__form" onSubmit={handleSubmit}>
          <label className="login-page__field">
            Cédula
            <input
              type="text"
              inputMode="numeric"
              autoComplete="username"
              placeholder="Ej. 1023456789"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
            />
          </label>

          <label className="login-page__field">
            Contraseña
            <input
              type="password"
              autoComplete="current-password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error && (
            <p className="login-page__error" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>

        <div className="login-page__demo">
          <p className="login-page__demo-title">Credenciales de prueba</p>
          <ul>
            <li>
              <strong>Paciente:</strong> {demoPaciente?.cedula} / {demoPaciente?.password}
            </li>
            <li>
              <strong>Médico:</strong> {demoMedico?.cedula} / {demoMedico?.password}
            </li>
          </ul>
        </div>

        <Button variant="secondary" onClick={() => navigate("/")}>
          Volver al inicio
        </Button>
      </div>
    </div>
  );
}

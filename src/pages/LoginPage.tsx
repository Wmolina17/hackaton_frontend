import { useNavigate } from "react-router-dom";
import { BackgroundScene } from "@/components/layout/BackgroundScene";
import { Button } from "@/components/ui/Button";
import { useAuth, type UserRole } from "@/context/AuthContext";
import "./LoginPage.css";

export function LoginPage() {
  const navigate = useNavigate();
  const { loginAs } = useAuth();

  function enterAs(role: UserRole) {
    loginAs(role);
    navigate(role === "cliente" ? "/agendar" : "/consultas");
  }

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
          Selecciona tu perfil para continuar. No se requieren credenciales en esta
          demostración.
        </p>

        <div className="login-page__options">
          <button
            type="button"
            className="login-page__option"
            onClick={() => enterAs("cliente")}
          >
            <span className="login-page__option-icon login-page__option-icon--client">
              P
            </span>
            <div>
              <strong>Soy paciente</strong>
              <span>Agendar citas y consultar mi historial clínico</span>
            </div>
          </button>

          <button
            type="button"
            className="login-page__option"
            onClick={() => enterAs("medico")}
          >
            <span className="login-page__option-icon login-page__option-icon--doctor">
              M
            </span>
            <div>
              <strong>Soy médico</strong>
              <span>Gestionar consultas, historiales y formulación</span>
            </div>
          </button>
        </div>

        <Button variant="secondary" onClick={() => navigate("/")}>
          Volver al inicio
        </Button>
      </div>
    </div>
  );
}

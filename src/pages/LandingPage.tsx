import { Link } from "react-router-dom";
import { BackgroundScene } from "@/components/layout/BackgroundScene";
import { Button } from "@/components/ui/Button";
import "./LandingPage.css";

export function LandingPage() {
  return (
    <div className="landing">
      <BackgroundScene />
      <header className="landing__nav">
        <Link to="/" className="landing__logo">
          <span className="landing__logo-icon">MN</span>
          MediNote
        </Link>
      </header>

      <main className="landing__hero">
        <p className="landing__eyebrow">Consultas médicas inteligentes</p>
        <h1>
          Historial clínico
          <br />
          asistido por voz e IA
        </h1>
        <p className="landing__subtitle">
          Transcripción en tiempo real, generación automática de historiales y
          gestión de consultas en una plataforma diseñada para médicos y pacientes.
        </p>
        <div className="landing__features">
          <div className="landing__feature">
            <span className="landing__feature-num">01</span>
            <div>
              <strong>Consulta por voz</strong>
              <p>Graba la sesión y obtén un historial estructurado al instante.</p>
            </div>
          </div>
          <div className="landing__feature">
            <span className="landing__feature-num">02</span>
            <div>
              <strong>Agenda integrada</strong>
              <p>Los pacientes reservan citas; los médicos las ven en su calendario.</p>
            </div>
          </div>
          <div className="landing__feature">
            <span className="landing__feature-num">03</span>
            <div>
              <strong>Formulación clara</strong>
              <p>Accede al catálogo de medicamentos disponibles para tu práctica.</p>
            </div>
          </div>
        </div>
        <div className="landing__cta">
          <Link to="/acceso">
            <Button>Iniciar sesión</Button>
          </Link>
        </div>
      </main>

      <footer className="landing__footer">
        <span>MediNote · Plataforma clínica</span>
      </footer>
    </div>
  );
}

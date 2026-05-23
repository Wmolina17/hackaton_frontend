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
          medinote
        </Link>
        <nav className="landing__links">
          <Link to="/consultas">Consultas</Link>
          <Link to="/historial">Historial</Link>
          <Link to="/agendar">Agendar</Link>
        </nav>
        <Link to="/consultas">
          <Button>Entrar al panel</Button>
        </Link>
      </header>

      <main className="landing__hero">
        <p className="landing__eyebrow">Nueva era de consultas médicas</p>
        <h1>
          Voz, IA y historial clínico
          <br />
          en un solo flujo
        </h1>
        <p className="landing__subtitle">
          MediNote AI transcribe la consulta, genera el historial estructurado y
          ayuda al médico a revisar medicamentos según la EPS — sin fricción.
        </p>
        <div className="landing__cta">
          <Link to="/consultas">
            <Button>Comenzar consulta</Button>
          </Link>
          <Link to="/agendar">
            <button type="button" className="landing__cta-secondary">
              Agendar cita
            </button>
          </Link>
        </div>
      </main>

      <footer className="landing__footer">
        <span>MediNote AI · Hackathon MVP</span>
      </footer>
    </div>
  );
}

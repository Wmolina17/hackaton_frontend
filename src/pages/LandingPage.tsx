import { Link } from "react-router-dom";
import { BackgroundScene } from "@/components/layout/BackgroundScene";
import { Button } from "@/components/ui/Button";
import "./LandingPage.css";

const FEATURES = [
  {
    icon: "01",
    title: "Consulta por voz",
    desc: "Graba la sesión clínica. La IA transcribe y estructura motivo, síntomas, diagnóstico y plan de tratamiento.",
  },
  {
    icon: "02",
    title: "Agenda y calendario",
    desc: "Los pacientes agendan citas en línea. Los médicos ven su semana completa con estados en tiempo real.",
  },
  {
    icon: "03",
    title: "Formulación inteligente",
    desc: "Propón medicamentos y el sistema verifica automáticamente su disponibilidad en tu catálogo.",
  },
  {
    icon: "04",
    title: "Historial clínico",
    desc: "Revisa, firma y envía el historial al paciente. Exporta el consolidado en PDF cuando lo necesites.",
  },
];

const ROLES = [
  {
    role: "Paciente",
    items: ["Agendar citas médicas", "Consultar mi historial clínico", "Descargar historial en PDF"],
  },
  {
    role: "Médico",
    items: [
      "Calendario semanal de consultas",
      "Consulta asistida por voz e IA",
      "Firma y envío de historiales",
      "Catálogo de medicamentos",
    ],
  },
];

export function LandingPage() {
  return (
    <div className="landing">
      <BackgroundScene />

      <header className="landing__nav">
        <Link to="/" className="landing__logo">
          <span className="landing__logo-icon">MN</span>
          MediNote
        </Link>
        <Link to="/acceso" className="landing__nav-cta">
          <Button>Iniciar sesión</Button>
        </Link>
      </header>

      <main>
        <section className="landing__hero">
          <p className="landing__eyebrow">Plataforma clínica asistida por IA</p>
          <h1>
            De la consulta
            <br />
            al historial firmado
          </h1>
          <p className="landing__subtitle">
            MediNote conecta pacientes y médicos en un flujo continuo: cita,
            consulta por voz, historial generado por IA, verificación de
            medicamentos y entrega al paciente.
          </p>
          <div className="landing__cta">
            <Link to="/acceso">
              <Button>Comenzar ahora</Button>
            </Link>
          </div>
        </section>

        <section className="landing__grid" aria-label="Funcionalidades">
          {FEATURES.map((f) => (
            <article key={f.title} className="landing__card">
              <span className="landing__card-icon" aria-hidden="true">
                {f.icon}
              </span>
              <h2>{f.title}</h2>
              <p>{f.desc}</p>
            </article>
          ))}
        </section>

        <section className="landing__roles">
          <h2>Diseñado para cada rol</h2>
          <div className="landing__roles-grid">
            {ROLES.map((r) => (
              <article key={r.role} className="landing__role-card">
                <h3>{r.role}</h3>
                <ul>
                  {r.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="landing__flow">
          <h2>Cómo funciona</h2>
          <ol className="landing__steps">
            <li>
              <span>1</span>
              <div>
                <strong>Agenda</strong>
                <p>El paciente reserva cita con el médico de su preferencia.</p>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <strong>Consulta</strong>
                <p>El médico atiende, graba la sesión y la IA genera el historial.</p>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <strong>Revisión</strong>
                <p>Se verifican medicamentos y el médico firma el documento.</p>
              </div>
            </li>
            <li>
              <span>4</span>
              <div>
                <strong>Entrega</strong>
                <p>El historial llega al paciente, disponible también en PDF.</p>
              </div>
            </li>
          </ol>
        </section>
      </main>

      <footer className="landing__footer">
        <span>MediNote · Consultas inteligentes</span>
        <Link to="/acceso">Acceder a la plataforma</Link>
      </footer>
    </div>
  );
}

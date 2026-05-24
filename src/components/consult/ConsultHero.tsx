import "./ConsultHero.css";

interface ConsultHeroProps {
  title?: string;
  subtitle?: string;
}

export function ConsultHero({
  title = "Monwe · Consulta",
  subtitle = "Inicia la grabación, conduce la consulta con el paciente y al terminar el audio se procesará con IA.",
}: ConsultHeroProps) {
  return (
    <header className="consult-hero">
      <p className="consult-hero__badge">Panel médico · FE1</p>
      <h1 className="consult-hero__title">{title}</h1>
      <p className="consult-hero__subtitle">{subtitle}</p>
    </header>
  );
}

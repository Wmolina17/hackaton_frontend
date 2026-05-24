import logoImg from "@/images/logo.png";
import "./AppLogo.css";

type AppLogoSize = "sm" | "md" | "lg" | "xl" | "hero";

interface AppLogoProps {
  size?: AppLogoSize;
  showText?: boolean;
  text?: string;
  className?: string;
}

export function AppLogo({
  size = "md",
  showText = false,
  text = "Monwe",
  className = "",
}: AppLogoProps) {
  return (
    <div className={`app-logo app-logo--${size}${className ? ` ${className}` : ""}`}>
      <img src={logoImg} alt="Monwe" className="app-logo__image" />
      {showText && <span className="app-logo__text">{text}</span>}
    </div>
  );
}

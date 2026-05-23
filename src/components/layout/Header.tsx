import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Layout.css";

export function Header() {
  return (
    <header className="layout__header">
      <Link to="/" className="layout__brand">
        <span className="layout__logo">MN</span>
        <div>
          <h1>MediNote AI</h1>
          <p>Panel médico</p>
        </div>
      </Link>
      <nav className="layout__nav" aria-label="Principal">
        <NavLink
          to="/consultas"
          className={({ isActive }) =>
            isActive ? "layout__nav-link layout__nav-link--active" : "layout__nav-link"
          }
        >
          Consultas
        </NavLink>
        <NavLink
          to="/historial"
          className={({ isActive }) =>
            isActive ? "layout__nav-link layout__nav-link--active" : "layout__nav-link"
          }
        >
          Historial
        </NavLink>
        <NavLink
          to="/agendar"
          className={({ isActive }) =>
            isActive ? "layout__nav-link layout__nav-link--active" : "layout__nav-link"
          }
        >
          Agendar
        </NavLink>
      </nav>
    </header>
  );
}

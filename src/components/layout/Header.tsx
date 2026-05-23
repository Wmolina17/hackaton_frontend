import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import "./Layout.css";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/acceso");
  }

  const navLinks =
    user?.role === "cliente"
      ? [
          { to: "/agendar", label: "Agendar cita" },
          { to: "/mi-historial", label: "Mi historial" },
        ]
      : [
          { to: "/consultas", label: "Consultas" },
          { to: "/historial", label: "Pacientes" },
          { to: "/medicamentos", label: "Medicamentos" },
        ];

  return (
    <header className="layout__header">
      <Link to={user ? (user.role === "cliente" ? "/agendar" : "/consultas") : "/"} className="layout__brand">
        <span className="layout__logo">MN</span>
        <div>
          <h1>MediNote</h1>
          <p>
            {user?.role === "cliente"
              ? user.pacienteNombre
              : user?.role === "medico"
                ? user.medicoNombre
                : "Plataforma clínica"}
          </p>
        </div>
      </Link>
      {user && (
        <nav className="layout__nav" aria-label="Principal">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive ? "layout__nav-link layout__nav-link--active" : "layout__nav-link"
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      )}
      {user && (
        <Button variant="secondary" onClick={handleLogout}>
          Salir
        </Button>
      )}
    </header>
  );
}

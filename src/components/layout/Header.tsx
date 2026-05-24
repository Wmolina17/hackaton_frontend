import { NavLink, Link, useNavigate } from "react-router-dom";
import { AppLogo } from "@/components/brand/AppLogo";
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

  const historialPacientePath = user?.pacienteId
    ? `/historial/paciente/${user.pacienteId}`
    : "/historial/paciente/pac-001";

  const navLinks =
    user?.role === "cliente"
      ? [
          { to: "/agendar", label: "Asistente" },
          { to: "/mis-citas", label: "Mis citas" },
          { to: historialPacientePath, label: "Mi historial" },
        ]
      : [
          { to: "/consultas", label: "Consultas" },
          { to: "/historial", label: "Pacientes" },
          { to: "/medicamentos", label: "Medicamentos" },
        ];

  return (
    <header className="layout__header">
      <Link
        to={user ? (user.role === "cliente" ? "/agendar" : "/consultas") : "/"}
        className="layout__brand"
      >
        <AppLogo size="md" />
        <div>
          <h1>Monwe</h1>
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

import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

/** Redirección legacy de /mi-historial a la ruta unificada. */
export function RedirectMiHistorial() {
  const { user } = useAuth();
  return (
    <Navigate
      to={`/historial/paciente/${user?.pacienteId ?? "pac-001"}`}
      replace
    />
  );
}

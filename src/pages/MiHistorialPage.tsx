import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { PacienteDetallePage } from "./PacienteDetallePage";

/** Vista de historial para el paciente: solo sus propios registros. */
export function MiHistorialPage() {
  const { user } = useAuth();

  if (!user?.pacienteId) {
    return <Navigate to="/acceso" replace />;
  }

  return <PacienteDetallePage pacienteIdOverride={user.pacienteId} isOwnHistory />;
}

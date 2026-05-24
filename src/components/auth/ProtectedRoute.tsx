import { Navigate, useLocation } from "react-router-dom";
import { useAuth, type UserRole } from "@/context/AuthContext";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: UserRole[];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/acceso" state={{ from: location.pathname }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    const fallback = user.role === "cliente" ? "/agendar" : "/consultas";
    return <Navigate to={fallback} replace />;
  }

  return children;
}

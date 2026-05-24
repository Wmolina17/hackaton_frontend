import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type UserRole = "cliente" | "medico";

export interface AuthUser {
  role: UserRole;
  pacienteId: string;
  pacienteNombre: string;
  medicoId: number;
  medicoNombre: string;
  medicoEspecialidad: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loginAs: (role: UserRole) => void;
  logout: () => void;
}

const STORAGE_KEY = "medinote:auth";

const DEMO_CLIENTE: AuthUser = {
  role: "cliente",
  pacienteId: "pac-001",
  pacienteNombre: "María García López",
  medicoId: 1,
  medicoNombre: "Dra. Ana Ruiz",
  medicoEspecialidad: "Medicina general",
};

const DEMO_MEDICO: AuthUser = {
  role: "medico",
  pacienteId: "pac-001",
  pacienteNombre: "María García López",
  medicoId: 1,
  medicoNombre: "Dra. Ana Ruiz",
  medicoEspecialidad: "Medicina general",
};

function readStoredUser(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());

  const loginAs = useCallback((role: UserRole) => {
    const next = role === "cliente" ? DEMO_CLIENTE : DEMO_MEDICO;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setUser(next);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loginAs, logout }),
    [user, loginAs, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authApi } from "@/api/auth";
import { AUTH_STORAGE_KEY, USE_MOCK } from "@/api/config";
import { findMockAuthUser } from "@/api/mock/auth.mock";

export type UserRole = "cliente" | "medico";

export interface AuthUser {
  role: UserRole;
  cedula: string;
  token?: string;
  pacienteId?: string;
  pacienteNombre?: string;
  medicoId?: number;
  medicoNombre?: string;
  medicoEspecialidad?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (
    cedula: string,
    password: string
  ) => Promise<
    { ok: true; role: UserRole } | { ok: false; error: string }
  >;
  logout: () => void;
}
type LoginResult = { ok: true; role: UserRole } | { ok: false; error: string };

function readStoredUser(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function recordToUser(record: ReturnType<typeof findMockAuthUser>): AuthUser | null {
  if (!record) return null;
  return {
    role: record.role,
    cedula: record.cedula,
    pacienteId: record.pacienteId,
    pacienteNombre: record.pacienteNombre,
    medicoId: record.medicoId,
    medicoNombre: record.medicoNombre,
    medicoEspecialidad: record.medicoEspecialidad,
  };
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());

  const login = useCallback(async (cedula: string, password: string): Promise<LoginResult> => {
    const trimmedCedula = cedula.trim();
    if (!trimmedCedula || !password) {
      return { ok: false as const, error: "Ingresa cédula y contraseña" };
    }

    if (USE_MOCK) {
      const record = findMockAuthUser(trimmedCedula, password);
      if (!record) {
        return { ok: false as const, error: "Cédula o contraseña incorrectos" };
      }
      const next = recordToUser(record)!;
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
      setUser(next);
      return { ok: true as const, role: next.role as UserRole };
    }

    const medicoRes = await authApi.loginMedico(trimmedCedula, password);
    if (medicoRes.data) {
      const next: AuthUser = {
        role: "medico",
        cedula: trimmedCedula,
        token: medicoRes.data.access_token,
        medicoId: medicoRes.data.user_id,
        medicoNombre: medicoRes.data.nombre,
        medicoEspecialidad: medicoRes.data.especialidad,
      };
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
      setUser(next);
      return { ok: true as const, role: "medico" };
    }

    const pacienteRes = await authApi.loginPaciente(trimmedCedula, password);
    if (pacienteRes.data) {
      const next: AuthUser = {
        role: "cliente",
        cedula: trimmedCedula,
        token: pacienteRes.data.access_token,
        pacienteId: String(pacienteRes.data.user_id),
        pacienteNombre: pacienteRes.data.nombre,
      };
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
      setUser(next);
      return { ok: true as const, role: "cliente" };
    }

    return {
      ok: false as const,
      error: pacienteRes.error ?? medicoRes.error ?? "Cédula o contraseña incorrectos",
    };
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, login, logout }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}

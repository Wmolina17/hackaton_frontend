import { API_URL } from "@/api/config";
import type { HttpResult } from "@/api/http";

interface LoginResponse {
  access_token: string;
  token_type: string;
  role: "medico" | "paciente";
  user_id: number;
  nombre: string;
  email?: string;
  especialidad?: string;
}

function parseError(body: unknown, status: number): string {
  const err = (body as { error?: { message?: string } | string }).error;
  if (typeof err === "object" && err?.message) return err.message;
  if (typeof err === "string") return err;
  const detail = (body as { detail?: string }).detail;
  if (detail) return detail;
  return `Error ${status}`;
}

async function login(
  endpoint: string,
  cedula: string,
  password: string
): Promise<HttpResult<LoginResponse>> {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cedula: cedula.trim(), password }),
    });
    const body = await res.json();
    if (!res.ok) {
      return { data: null, error: parseError(body, res.status) };
    }
    if (body.error) {
      return { data: null, error: parseError(body, res.status) };
    }
    return { data: (body.data ?? body) as LoginResponse, error: null };
  } catch {
    return { data: null, error: "No se pudo conectar con el servidor" };
  }
}

export const authApi = {
  loginMedico: (cedula: string, password: string) =>
    login("/auth/medico/login", cedula, password),
  loginPaciente: (cedula: string, password: string) =>
    login("/auth/paciente/login", cedula, password),
};

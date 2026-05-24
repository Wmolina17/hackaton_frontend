import { API_URL, AUTH_STORAGE_KEY, USE_MOCK } from "@/api/config";
import { mockRequest } from "@/api/mock/router";

function authHeaders(): Record<string, string> {
  try {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return {};
    const user = JSON.parse(raw) as { token?: string };
    return user.token ? { Authorization: `Bearer ${user.token}` } : {};
  } catch {
    return {};
  }
}

function parseApiError(body: unknown, status: number): string {
  const err = (body as { error?: { message?: string } | string }).error;
  if (typeof err === "object" && err?.message) return err.message;
  if (typeof err === "string") return err;
  const detail = (body as { detail?: string }).detail;
  if (detail) return detail;
  return `Error ${status}`;
}

export type HttpResult<T> = { data: T | null; error: string | null };

export async function httpRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<HttpResult<T>> {
  if (USE_MOCK) {
    return mockRequest<T>(path, options);
  }

  try {
    const isForm = options.body instanceof FormData;
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: isForm
        ? { ...authHeaders(), ...options.headers }
        : {
            "Content-Type": "application/json",
            ...authHeaders(),
            ...options.headers,
          },
    });

    if (res.headers.get("content-type")?.includes("application/pdf")) {
      if (!res.ok) {
        return { data: null, error: `Error ${res.status} al descargar PDF` };
      }
      const blob = await res.blob();
      return { data: blob as T, error: null };
    }

    const body = await res.json();
    if (!res.ok) {
      return { data: null, error: parseApiError(body, res.status) };
    }
    if ((body as { error?: unknown }).error) {
      return { data: null, error: parseApiError(body, res.status) };
    }
    if ((body as { data?: T }).data !== undefined) {
      return { data: (body as { data: T }).data, error: null };
    }
    return { data: body as T, error: null };
  } catch {
    return { data: null, error: "No se pudo conectar con el servidor" };
  }
}

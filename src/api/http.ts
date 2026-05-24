import { mockRequest } from "@/api/mock/router";

const BASE_URL = import.meta.env.VITE_API_URL || "";
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

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
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: isForm
        ? { ...options.headers }
        : {
            "Content-Type": "application/json",
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
      return {
        data: null,
        error:
          (body as { error?: string }).error ??
          (body as { detail?: string }).detail ??
          `Error ${res.status}`,
      };
    }
    if ((body as { error?: string }).error) {
      return { data: null, error: (body as { error: string }).error };
    }
    if ((body as { data?: T }).data !== undefined) {
      return { data: (body as { data: T }).data, error: null };
    }
    return { data: body as T, error: null };
  } catch {
    return { data: null, error: "No se pudo conectar con el servidor" };
  }
}

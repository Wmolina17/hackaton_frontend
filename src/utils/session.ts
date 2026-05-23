export const SESSION_KEYS = {
  LAST_HISTORIAL_ID: "medinote_last_historial_id",
  LAST_EPS: "medinote_last_eps",
  PENDING_BOOKING: "medinote_pending_booking",
} as const;

export function getLastHistorialPath(): string {
  const id = sessionStorage.getItem(SESSION_KEYS.LAST_HISTORIAL_ID);
  return id ? `/historial/editar/${id}` : "/historial";
}

export function getLastEps(): string {
  return sessionStorage.getItem(SESSION_KEYS.LAST_EPS) || "";
}

export function saveAfterBooking(payload: {
  historialId: number | string;
  eps?: string;
}): void {
  if (payload.historialId != null) {
    sessionStorage.setItem(
      SESSION_KEYS.LAST_HISTORIAL_ID,
      String(payload.historialId)
    );
  }
  if (payload.eps) {
    sessionStorage.setItem(SESSION_KEYS.LAST_EPS, payload.eps);
  }
  window.dispatchEvent(new Event("medinote:session"));
}

export function readPendingBooking(): Record<string, unknown> | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEYS.PENDING_BOOKING);
    return raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export function clearPendingBooking(): void {
  sessionStorage.removeItem(SESSION_KEYS.PENDING_BOOKING);
  window.dispatchEvent(new Event("medinote:session"));
}

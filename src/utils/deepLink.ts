import type { BookingDeepLink, Medico } from "@/types/agendar";

export function parseBookingDeepLink(
  searchParams: URLSearchParams,
  pendingFromSession: Record<string, unknown> | null = null
): BookingDeepLink {
  const fromUrl: BookingDeepLink = {
    medicoId: num(searchParams.get("medicoId") ?? searchParams.get("medico_id")),
    slotId: num(searchParams.get("slotId") ?? searchParams.get("slot_id")),
    eps: searchParams.get("eps")?.trim() || null,
    especialidad: searchParams.get("especialidad")?.trim() || null,
    fromChat: searchParams.get("from") === "chat",
  };

  const fromSession = pendingFromSession
    ? {
        medicoId: num(
          pendingFromSession.medicoId ?? pendingFromSession.medico_id
        ),
        slotId: num(pendingFromSession.slotId ?? pendingFromSession.slot_id),
        eps:
          typeof pendingFromSession.eps === "string"
            ? pendingFromSession.eps.trim() || null
            : null,
        especialidad:
          typeof pendingFromSession.especialidad === "string"
            ? pendingFromSession.especialidad.trim() || null
            : null,
        fromChat: true,
      }
    : null;

  return mergeDeepLink(fromUrl, fromSession);
}

function mergeDeepLink(
  a: BookingDeepLink,
  b: BookingDeepLink | null
): BookingDeepLink {
  if (!b) return a;
  return {
    medicoId: a.medicoId ?? b.medicoId,
    slotId: a.slotId ?? b.slotId,
    eps: a.eps ?? b.eps,
    especialidad: a.especialidad ?? b.especialidad,
    fromChat: a.fromChat || b.fromChat,
  };
}

function num(value: unknown): number | null {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function findMedicoForDeepLink(
  medicos: Medico[],
  params: Pick<BookingDeepLink, "medicoId" | "especialidad">
): Medico | null {
  if (params.medicoId) {
    return medicos.find((m) => m.id === params.medicoId) ?? null;
  }
  if (params.especialidad) {
    const q = params.especialidad.toLowerCase();
    return (
      medicos.find((m) => m.especialidad.toLowerCase().includes(q)) ??
      medicos.find((m) => m.nombre.toLowerCase().includes(q)) ??
      null
    );
  }
  return null;
}

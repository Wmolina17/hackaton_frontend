import type {
  MedicamentoCobertura,
  MedicamentoHistorial,
} from "@/types/historial";

export function mergeMedicamentosWithCobertura(
  existing: MedicamentoHistorial[],
  cobertura: MedicamentoCobertura[]
): MedicamentoHistorial[] {
  const base = existing?.length ? existing : [];
  if (!cobertura?.length) return base;

  if (!base.length) {
    return cobertura.map((m) => ({ ...m }));
  }

  const byName = new Map(
    cobertura
      .filter((m) => m.nombre)
      .map((m) => [m.nombre.toLowerCase(), m])
  );

  return base.map((med) => {
    const key = med.nombre?.toLowerCase();
    const cov = key ? byName.get(key) : null;
    if (!cov) return med;
    return {
      ...med,
      cubierto: cov.cubierto,
      generico_alternativa:
        cov.generico_alternativa ?? med.generico_alternativa,
    };
  });
}

export function extractNombresMedicamentos(
  medicamentos: MedicamentoHistorial[]
): string[] {
  return medicamentos.map((m) => m.nombre).filter(Boolean);
}

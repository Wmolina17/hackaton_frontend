import type { Paciente } from "@/types/agendar";

export function validatePaciente(paciente: Paciente): {
  valid: boolean;
  errors: Partial<Record<keyof Paciente, string>>;
} {
  const errors: Partial<Record<keyof Paciente, string>> = {};
  const doc = (paciente.documento ?? "").trim();
  const nombre = (paciente.nombre ?? "").trim();
  const tel = (paciente.telefono ?? "").trim();

  if (!doc) errors.documento = "Documento requerido";
  else if (!/^\d{5,12}$/.test(doc)) errors.documento = "Documento: 5 a 12 dígitos";

  if (!nombre) errors.nombre = "Nombre requerido";
  else if (nombre.length < 3) errors.nombre = "Nombre muy corto";

  if (!tel) errors.telefono = "Teléfono requerido";
  else if (!/^\d{7,15}$/.test(tel.replace(/\s/g, ""))) {
    errors.telefono = "Teléfono: solo números (7-15 dígitos)";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

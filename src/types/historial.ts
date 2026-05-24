export interface MedicamentoHistorial {
  nombre: string;
  cubierto: boolean;
  generico_alternativa?: string;
  dosis?: string;
  frecuencia?: string;
  duracion?: string;
}

export interface HistorialClinico {
  id?: number;
  motivo: string;
  sintomas: string[];
  diagnostico: string;
  plan: string;
  alergias?: string;
  notas_adicionales?: string;
  medicamentos: MedicamentoHistorial[];
  firmado?: boolean;
  paciente_eps?: string;
  paciente_nombre?: string;
  paciente_documento?: string;
  paciente_telefono?: string;
  paciente_fecha_nacimiento?: string;
  incapacidad_dias?: number;
  incapacidad_recomendaciones?: string;
}

export interface MedicamentoCobertura {
  nombre: string;
  cubierto: boolean;
  generico_alternativa?: string;
}

export function createEmptyHistorial(): HistorialClinico {
  return {
    motivo: "",
    sintomas: [],
    diagnostico: "",
    plan: "",
    medicamentos: [],
    firmado: false,
  };
}

export interface MedicamentoHistorial {
  nombre: string;
  cubierto: boolean;
  generico_alternativa?: string;
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

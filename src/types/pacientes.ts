export interface PacienteResumen {
  id: string;
  nombre: string;
  documento: string;
  eps: string;
  telefono?: string;
  ultima_consulta: string;
  total_consultas: number;
}

export interface ConsultaResumen {
  id: number;
  historial_id: number;
  fecha: string;
  diagnostico: string;
  medico_nombre: string;
  estado: "pendiente" | "activa" | "terminada";
}

export interface PacienteDetalle extends PacienteResumen {
  consultas: ConsultaResumen[];
}

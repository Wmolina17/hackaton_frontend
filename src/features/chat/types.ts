export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
  intent?: string
  historial?: HistorialClinico | null
  toolCalls?: ToolCall[]
  timestamp: number
  cita?: CitaConfirmada | null
}

export interface CitaConfirmada {
  id: string
  paciente: {
    nombre: string
    documento?: string
    telefono?: string
    eps?: string
  }
  medico_id?: string
  medico: string
  especialidad: string
  slot_id?: string
  fecha: string
  hora: string
  motivo?: string
  estado: string
  creada_en?: string
}

export interface ToolCall {
  id: string
  name: string
  status: 'running' | 'done' | 'error'
  result?: string
}

export interface HistorialClinico {
  motivo_consulta: string
  sintomas: string[]
  diagnostico: string
  plan_tratamiento: string
  medicamentos_sugeridos: MedicamentoItem[]
}

export interface MedicamentoItem {
  nombre: string
  dosis: string
  frecuencia: string
  duracion: string
}

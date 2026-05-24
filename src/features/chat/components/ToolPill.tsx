import { motion } from 'framer-motion'
import type { ToolCall } from '../types'

const TOOL_LABELS: Record<string, string> = {
  crear_paciente:       'Registrando paciente...',
  monitor_paciente:     'Consultando historial del paciente...',
  generar_historial:    'Generando historial clinico...',
  buscar_medico:        'Buscando medicos disponibles...',
  crear_cita:           'Agendando cita...',
  schedule_appointment: 'Verificando disponibilidad...',
  medical_query:        'Analizando consulta...',
  process_message:      'Procesando...',
  consulta_medica:      'Analizando tu mensaje...',
}

interface ToolPillProps {
  tool: ToolCall & { label?: string }
}

export function ToolPill({ tool }: ToolPillProps) {
  const isRunning = tool.status === 'running'
  const label = TOOL_LABELS[tool.name] || (tool.label ? `${tool.label}...` : 'Procesando...')

  if (!isRunning) return null

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        fontSize: '0.72rem',
        color: 'rgba(100,116,139,0.75)',
        fontStyle: 'italic',
        margin: '0 0 4px 0',
        background: 'linear-gradient(90deg, rgba(100,116,139,0.35) 0%, rgba(100,116,139,0.9) 40%, rgba(100,116,139,0.35) 100%)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: 'shimmer-text 1.8s linear infinite',
      }}
    >
      {label}
    </motion.p>
  )
}

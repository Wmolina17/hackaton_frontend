import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Loader2, XCircle, Stethoscope, Calendar, FileText, Zap } from 'lucide-react'
import type { ToolCall } from '../types'

const TOOL_ICONS: Record<string, React.ReactNode> = {
  schedule_appointment: <Calendar className="w-3.5 h-3.5" />,
  medical_query:        <Stethoscope className="w-3.5 h-3.5" />,
  generate_historial:   <FileText className="w-3.5 h-3.5" />,
  process_message:      <Zap className="w-3.5 h-3.5" />,
}

const TOOL_LABELS: Record<string, string> = {
  schedule_appointment: 'Buscando disponibilidad',
  medical_query:        'Analizando consulta médica',
  generate_historial:   'Generando historial clínico',
  process_message:      'Procesando mensaje',
}

interface ToolPillProps {
  tool: ToolCall & { label?: string }
}

export function ToolPill({ tool }: ToolPillProps) {
  const label = tool.label || TOOL_LABELS[tool.name] || tool.name
  const icon = TOOL_ICONS[tool.name] || <Zap className="w-3.5 h-3.5" />

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="tool-pill inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium select-none"
      style={{
        backgroundColor: 'transparent',
        border: 'none',
        padding: '0',
        color: tool.status === 'error' ? 'rgba(239,68,68,0.9)' : 'rgba(71,85,105,1)',
      }}
    >
      <span style={{ color: tool.status === 'error' ? 'rgba(239,68,68,0.9)' : 'rgba(100,116,139,0.85)' }}>
        {icon}
      </span>
      <span>{label}</span>
      <AnimatePresence mode="wait">
        {tool.status === 'running' && (
          <motion.span key="run" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Loader2 className="w-3 h-3 animate-spin" />
          </motion.span>
        )}
        {tool.status === 'done' && (
          <motion.span key="done" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <CheckCircle2 className="w-3 h-3" style={{ color: 'rgba(74,222,128,0.8)' }} />
          </motion.span>
        )}
        {tool.status === 'error' && (
          <motion.span key="err" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <XCircle className="w-3 h-3" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

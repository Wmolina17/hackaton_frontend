import type { ToolCall } from '../types'

const TOOL_TITLES: Record<string, string> = {
  crear_paciente: 'Registro de paciente',
  monitor_paciente: 'Monitoreo de paciente',
  generar_historial: 'Generacion de historial',
  buscar_medico: 'Busqueda de medicos',
  crear_cita: 'Creacion de cita medica',
}

function getToolTitle(name: string) {
  return TOOL_TITLES[name] || name
}

function asObj(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
}

export function ToolEvidenceCard({ tool }: { tool: ToolCall }) {
  if (tool.status === 'running') return null
  const result = asObj(tool.resultData)
  const cita = asObj(result.cita)
  const patient = asObj(result.patient)
  const missing = Array.isArray(result.missing_fields) ? result.missing_fields.join(', ') : ''

  const evidenceLines: string[] = []
  if (typeof cita.id === 'string' && cita.id) evidenceLines.push(`Cita ID: ${cita.id}`)
  if (typeof patient.id === 'string' && patient.id) evidenceLines.push(`Paciente ID: ${patient.id}`)
  if (typeof result.error === 'string' && result.error) evidenceLines.push(`Error: ${result.error}`)
  if (missing) evidenceLines.push(`Faltan datos: ${missing}`)
  if (!evidenceLines.length && tool.success) evidenceLines.push('Tool ejecutada y confirmada por backend.')

  return (
    <div
      className="mt-2 rounded-xl border px-3 py-2 text-xs"
      style={{
        borderColor: tool.success ? 'rgba(34,197,94,0.24)' : 'rgba(239,68,68,0.24)',
        backgroundColor: tool.success ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.05)',
        color: 'rgba(15,23,42,0.86)',
      }}
    >
      <p className="font-semibold">
        {tool.success ? 'Tool confirmada' : 'Tool con error'}: {getToolTitle(tool.name)}
      </p>
      <p className="mt-1" style={{ color: 'rgba(51,65,85,0.9)' }}>
        {evidenceLines.join(' | ')}
      </p>
    </div>
  )
}


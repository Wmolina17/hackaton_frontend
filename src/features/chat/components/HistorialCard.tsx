import { motion } from 'framer-motion'
import { FileText, Pill, ClipboardList, Stethoscope, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import type { HistorialClinico } from '../types'

interface HistorialCardProps {
  historial: HistorialClinico
}

export function HistorialCard({ historial }: HistorialCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 rounded-xl overflow-hidden"
      style={{ border: '1px solid rgba(226,232,240,0.7)', backgroundColor: '#f8fafc' }}
    >
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-slate-100"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f1f5f9' }}>
            <FileText className="w-4 h-4" style={{ color: '#0f172a' }} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: '#0f172a' }}>Historial Clínico Generado</p>
            <p className="text-xs" style={{ color: 'rgba(100,116,139,0.85)' }}>{historial.motivo_consulta}</p>
          </div>
        </div>
        {expanded
          ? <ChevronUp className="w-4 h-4" style={{ color: 'rgba(100,116,139,0.85)' }} />
          : <ChevronDown className="w-4 h-4" style={{ color: 'rgba(100,116,139,0.85)' }} />
        }
      </button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="px-4 pb-4 space-y-3"
        >
          <div className="h-px" style={{ backgroundColor: '#f1f5f9' }} />

          <Section icon={<Stethoscope className="w-3.5 h-3.5" />} title="Diagnóstico">
            <p className="text-sm" style={{ color: 'rgba(15,23,42,0.85)' }}>{historial.diagnostico}</p>
          </Section>

          {historial.sintomas.length > 0 && (
            <Section icon={<ClipboardList className="w-3.5 h-3.5" />} title="Síntomas">
              <div className="flex flex-wrap gap-1.5">
                {historial.sintomas.map((s, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: '#f1f5f9', color: 'rgba(15,23,42,0.8)', border: '1px solid rgba(226,232,240,0.6)' }}>
                    {s}
                  </span>
                ))}
              </div>
            </Section>
          )}

          <Section icon={<ClipboardList className="w-3.5 h-3.5" />} title="Plan de tratamiento">
            <p className="text-sm" style={{ color: 'rgba(15,23,42,0.85)' }}>{historial.plan_tratamiento}</p>
          </Section>

          {historial.medicamentos_sugeridos.length > 0 && (
            <Section icon={<Pill className="w-3.5 h-3.5" />} title="Medicamentos">
              <div className="space-y-1.5">
                {historial.medicamentos_sugeridos.map((m, i) => (
                  <div key={i} className="text-xs rounded-lg px-3 py-2" style={{ backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                    <span className="font-semibold" style={{ color: '#0f172a' }}>{m.nombre}</span>
                    <span style={{ color: 'rgba(100,116,139,1)' }}> Â· {m.dosis} Â· {m.frecuencia}</span>
                    {m.duracion && <span style={{ color: 'rgba(100,116,139,0.75)' }}> Â· {m.duracion}</span>}
                  </div>
                ))}
              </div>
            </Section>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <span style={{ color: 'rgba(100,116,139,0.6)' }}>{icon}</span>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(100,116,139,0.6)' }}>{title}</span>
      </div>
      {children}
    </div>
  )
}

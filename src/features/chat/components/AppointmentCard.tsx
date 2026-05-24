import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarCheck, Stethoscope, User, Building2, Clock, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { citasAgentApi } from '@/api/citas-agent'
import type { CitaConfirmada } from '../types'

interface AppointmentCardProps {
  cita: CitaConfirmada
}

export function AppointmentCard({ cita }: AppointmentCardProps) {
  const navigate = useNavigate()
  const [syncStatus, setSyncStatus] = useState<'pending' | 'synced' | 'error'>('pending')
  const registeredRef = useRef(false)

  // Registrar la cita en el mock store del frontend principal
  useEffect(() => {
    if (registeredRef.current) return
    registeredRef.current = true
    void (async () => {
      const { data, error } = await citasAgentApi.fromAgent(cita)
      if (error || !data) {
        setSyncStatus('error')
        console.error('Error registrando cita:', error)
      } else {
        setSyncStatus('synced')
      }
    })()
  }, [cita])

  const fechaFormatted = (() => {
    try {
      const d = new Date(`${cita.fecha}T${cita.hora}:00`)
      return d.toLocaleDateString('es-CO', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    } catch {
      return cita.fecha
    }
  })()

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="mt-3 rounded-2xl overflow-hidden"
      style={{
        backgroundColor: 'rgba(74,222,128,0.06)',
        border: '1px solid rgba(74,222,128,0.25)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2.5 px-4 py-3"
        style={{
          backgroundColor: 'rgba(74,222,128,0.08)',
          borderBottom: '1px solid rgba(74,222,128,0.18)',
        }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(74,222,128,0.15)' }}
        >
          <CheckCircle2 className="w-4 h-4" style={{ color: '#4ade80' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold" style={{ color: '#0f172a' }}>
            Cita confirmada
          </div>
          <div className="text-[11px] font-mono" style={{ color: 'rgba(100,116,139,0.6)' }}>
            ID: {cita.id}
          </div>
        </div>
        <span
          className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium"
          style={{
            backgroundColor: 'rgba(74,222,128,0.15)',
            color: '#4ade80',
            border: '1px solid rgba(74,222,128,0.3)',
          }}
        >
          {cita.estado}
        </span>
      </div>

      {/* Body */}
      <div className="px-4 py-3.5 space-y-2.5">
        <Row icon={<CalendarCheck className="w-4 h-4" />} label="Fecha">
          <span className="capitalize">{fechaFormatted}</span> a las <strong>{cita.hora}</strong>
        </Row>
        <Row icon={<Stethoscope className="w-4 h-4" />} label="Médico">
          {cita.medico} <span style={{ color: 'rgba(100,116,139,0.85)' }}>· {cita.especialidad}</span>
        </Row>
        <Row icon={<User className="w-4 h-4" />} label="Paciente">
          {cita.paciente.nombre}
          {cita.paciente.documento && (
            <span style={{ color: 'rgba(100,116,139,0.85)' }}> · CC {cita.paciente.documento}</span>
          )}
        </Row>
        {cita.paciente.eps && (
          <Row icon={<Building2 className="w-4 h-4" />} label="EPS">
            {cita.paciente.eps}
          </Row>
        )}
        {cita.motivo && (
          <Row icon={<Clock className="w-4 h-4" />} label="Motivo">
            <span style={{ color: 'rgba(71,85,105,1)' }}>{cita.motivo}</span>
          </Row>
        )}
      </div>

      {/* Action */}
      <div
        className="px-4 py-3 flex items-center justify-between gap-3"
        style={{ borderTop: '1px solid rgba(74,222,128,0.15)' }}
      >
        <div className="flex items-center gap-1.5 text-[11px]" style={{ color: '#64748b' }}>
          {syncStatus === 'pending' && (
            <><Loader2 className="w-3 h-3 animate-spin" /> Registrando en el sistema...</>
          )}
          {syncStatus === 'synced' && (
            <><CheckCircle2 className="w-3 h-3" style={{ color: '#16a34a' }} /> Registrada en tu historial</>
          )}
          {syncStatus === 'error' && (
            <span style={{ color: '#dc2626' }}>Error al sincronizar</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => navigate('/mi-historial')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors"
          style={{
            backgroundColor: 'var(--mn-primary)',
            color: '#ffffff',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--mn-primary-dark)'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--mn-primary)'
          }}
        >
          Ver mis citas <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  )
}

interface RowProps {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}

function Row({ icon, label, children }: RowProps) {
  return (
    <div className="flex gap-2.5 text-xs">
      <span
        className="shrink-0 mt-0.5"
        style={{ color: 'rgba(100,116,139,0.6)' }}
      >
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div
          className="text-[10px] uppercase tracking-wider mb-0.5"
          style={{ color: 'rgba(100,116,139,0.6)' }}
        >
          {label}
        </div>
        <div style={{ color: '#0f172a' }}>{children}</div>
      </div>
    </div>
  )
}

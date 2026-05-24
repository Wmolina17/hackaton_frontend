import { useCallback, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Activity, LogOut } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useChat } from './hooks/useChat'
import { MessageBubble } from './components/MessageBubble'
import { ChatInput } from './components/ChatInput'
import './ChatPanel.css'

const WELCOME_SUGGESTIONS_CLIENTE = [
  'Quiero agendar una cita con medicina general',
  'Necesito un pediatra para mi hijo',
  'Muéstrame los médicos disponibles',
  '¿Cuándo es mi próxima cita?',
]

const WELCOME_SUGGESTIONS_DEFAULT = [
  'Quiero agendar una cita médica',
  'Tengo dolor de cabeza desde hace 2 días',
  'Genera el historial de esta consulta',
  '¿Cuáles son los síntomas del dengue?',
]

export function ChatPanel() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { messages, isLoading, sendMessage, stopStreaming } = useChat()
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    logout()
    navigate('/acceso')
  }

  const navLinks = user?.role === 'cliente'
    ? [
        { to: '/agendar', label: 'Agendar cita' },
        { to: '/mi-historial', label: 'Mi historial' },
      ]
    : [
        { to: '/consultas', label: 'Consultas' },
        { to: '/historial', label: 'Pacientes' },
        { to: '/medicamentos', label: 'Medicamentos' },
      ]

  // Paciente preload para que el bot no pregunte todo
  const pacientePayload = user?.role === 'cliente'
    ? {
        paciente: {
          nombre: user.pacienteNombre,
          documento: '1023456789',
          telefono: '3001234567',
          eps: 'Sura',
        },
      }
    : {}

  const handleSend = useCallback((text: string, generateHistorial = false) => {
    sendMessage(text, generateHistorial, pacientePayload)
  }, [sendMessage, pacientePayload])

  // Auto-scroll al recibir mensajes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const WELCOME_SUGGESTIONS = user?.role === 'cliente'
    ? WELCOME_SUGGESTIONS_CLIENTE
    : WELCOME_SUGGESTIONS_DEFAULT

  const hasMessages = messages.length > 0

  return (
    <div
      className="medinote-chat medinote-chat-shell flex flex-col w-full overflow-hidden"
      style={{ height: '100vh', fontFamily: 'var(--mn-font)' }}
    >
      {/* Header */}
      <header className="medinote-chat__header flex items-center justify-between px-6 py-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--mn-primary-light)' }}
          >
            <Activity className="w-4 h-4" style={{ color: 'var(--mn-primary)' }} />
          </div>
          <div>
            <h1 className="medinote-chat__brand-title text-sm font-semibold">MediNote AI</h1>
            <p className="medinote-chat__brand-sub text-xs">Asistente médico inteligente</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `medinote-chat__nav-link text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${isActive ? 'medinote-chat__nav-link--active' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
          <div className="medinote-chat__status flex items-center gap-1.5 ml-2 pl-3">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#4ade80' }} />
            <span className="text-xs">En línea</span>
          </div>
          <button
            onClick={handleLogout}
            className="medinote-chat__logout flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ml-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            Salir
          </button>
        </div>
      </header>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar">
        {!hasMessages ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center h-full px-6 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="medinote-chat-welcome__orb w-16 h-16 rounded-full flex items-center justify-center mb-6"
            >
              <Activity className="w-8 h-8" style={{ color: 'var(--mn-primary)' }} />
            </motion.div>

            <h2 className="medinote-chat-welcome__title text-2xl font-semibold mb-2">MediNote AI</h2>
            <p className="medinote-chat-welcome__copy text-sm mb-8 max-w-sm">
              Tu asistente médico inteligente. Transcribe consultas, detecta intenciones y genera historiales clínicos.
            </p>

            <div className="medinote-chat-welcome__grid grid grid-cols-2 gap-2 w-full max-w-md">
              {WELCOME_SUGGESTIONS.map((s, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.3 }}
                  onClick={() => handleSend(s)}
                  className="medinote-chat-welcome__card text-left text-sm transition-all duration-200"
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="max-w-2xl mx-auto px-4 pt-6 pb-4">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Floating input */}
      <div className="shrink-0 px-4 pb-5 pt-3">
        <ChatInput onSend={handleSend} onStop={stopStreaming} isLoading={isLoading} />
        <p className="text-center text-xs mt-2.5" style={{ color: '#94a3b8' }}>
          MediNote puede cometer errores. Verifica información médica importante.
        </p>
      </div>
    </div>
  )
}

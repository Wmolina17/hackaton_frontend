import { useCallback, useEffect, useRef } from 'react'

import { AnimatePresence, motion } from 'framer-motion'

import { AppLogo } from '@/components/brand/AppLogo'

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

  const { user } = useAuth()

  const { messages, isLoading, sendMessage, stopStreaming } = useChat()

  const scrollRef = useRef<HTMLDivElement>(null)



  const pacientePayload = user?.role === 'cliente'

    ? {

        paciente: {

          nombre: user.pacienteNombre ?? '',

          documento: user.cedula,

          telefono: '3001234567',

          eps: 'Sura',

        },

      }

    : {}



  const handleSend = useCallback((text: string, generateHistorial = false) => {

    sendMessage(text, generateHistorial, pacientePayload)

  }, [sendMessage, pacientePayload])



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

    <div className="medinote-chat medinote-chat-shell flex flex-col w-full flex-1 overflow-hidden">

      <div ref={scrollRef} className="medinote-chat__messages flex-1 overflow-y-auto custom-scrollbar">

        {!hasMessages ? (

          <motion.div

            initial={{ opacity: 0, y: 16 }}

            animate={{ opacity: 1, y: 0 }}

            transition={{ duration: 0.4 }}

            className="medinote-chat-welcome flex flex-col items-center justify-center h-full px-6 text-center"

          >

            <motion.div
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="medinote-chat-welcome__orb"
            >
              <AppLogo size="xl" />
            </motion.div>


            <div className="medinote-chat-welcome__grid grid grid-cols-2 w-full">

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



      <div className="medinote-chat__composer shrink-0 px-4 pb-0 pt-0">

        <ChatInput onSend={handleSend} onStop={stopStreaming} isLoading={isLoading} />

        <p
          className="medinote-chat__footnote text-center text-xs mt-2.5"
          style={{ color: '#94a3b8', display: hasMessages ? 'block' : 'none' }}
        >

          Monwe puede cometer errores. Verifica información médica importante.

        </p>

      </div>

    </div>

  )

}


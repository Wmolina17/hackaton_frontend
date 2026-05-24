import { motion } from 'framer-motion'
import { Copy, Check, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import type { Message } from '../types'
import { StreamingText } from './StreamingText'
import { HistorialCard } from './HistorialCard'
import { AppointmentCard } from './AppointmentCard'
import { ThinkingDots } from './ThinkingDots'

interface MessageBubbleProps {
  message: Message
  onRegenerate?: () => void
}

export function MessageBubble({ message, onRegenerate }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)
  const [showToolLog, setShowToolLog] = useState(false)
  const isUser = message.role === 'user'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex justify-end mb-4"
      >
        <div
          className="max-w-[75%] px-4 py-3 rounded-2xl rounded-tr-sm text-sm leading-relaxed"
          style={{
            backgroundColor: '#f1f5f9',
            border: '1px solid rgba(226,232,240,0.7)',
            color: '#0f172a',
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          {message.content}
        </div>
      </motion.div>
    )
  }

  const hasActiveTool = Boolean(message.toolCalls?.some(tool => tool.status === 'running'))
  const runningTools = (message.toolCalls || []).filter(tool => tool.status === 'running')
  const executedTools = (message.toolCalls || []).filter(tool => tool.status !== 'running')
  const showThinking = message.isStreaming && !message.content && !hasActiveTool

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex gap-3 mb-4 group"
    >


      <div className="flex-1 min-w-0">
        {(executedTools.length > 0 || runningTools.length > 0) && (
          <div className="mb-2">
            {runningTools.length > 0 ? (
              <p
                className="text-xs tool-log__running"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  margin: 0,
                }}
              >
                Ejecutando tool{runningTools.length > 1 ? 's' : ''}...
              </p>
            ) : (
              <button
                type="button"
                onClick={() => setShowToolLog(v => !v)}
                className="text-xs"
                style={{
                  color: 'rgba(100,116,139,0.9)',
                  fontFamily: 'Poppins, sans-serif',
                  textDecoration: 'none',
                }}
              >
                {`Tools ejecutadas (${executedTools.length}) ${showToolLog ? '▾' : '▸'}`}
              </button>
            )}
            {showToolLog && runningTools.length === 0 && (
              <div className="mt-1">
                {executedTools.map((tool) => (
                  <p
                    key={`log-${tool.id}`}
                    className="text-xs leading-relaxed"
                    style={{ color: 'rgba(100,116,139,0.88)', fontFamily: 'Poppins, sans-serif' }}
                  >
                    {tool.name}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {showThinking ? (
          <ThinkingDots />
        ) : (
          <StreamingText content={message.content} isStreaming={message.isStreaming} />
        )}

        {message.historial && !message.isStreaming && (
          <HistorialCard historial={message.historial} />
        )}

        {message.cita && !message.isStreaming && (
          <AppointmentCard cita={message.cita} />
        )}

        {!message.isStreaming && message.content && (
          <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg transition-colors hover:bg-slate-100"
              style={{ color: 'rgba(100,116,139,0.6)' }}
            >
              {copied
                ? <><Check className="w-3 h-3" /> Copiado</>
                : <><Copy className="w-3 h-3" /> Copiar</>
              }
            </button>
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg transition-colors hover:bg-slate-100"
                style={{ color: 'rgba(100,116,139,0.6)' }}
              >
                <RefreshCw className="w-3 h-3" /> Regenerar
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

import { motion } from 'framer-motion'
import { Brain, Copy, Check, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import type { Message } from '../types'
import { StreamingText } from './StreamingText'
import { ToolPill } from './ToolPill'
import { HistorialCard } from './HistorialCard'
import { AppointmentCard } from './AppointmentCard'
import { ThinkingDots } from './ThinkingDots'

interface MessageBubbleProps {
  message: Message
  onRegenerate?: () => void
}

export function MessageBubble({ message, onRegenerate }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)
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
  const showThinking = message.isStreaming && !message.content && !hasActiveTool

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex gap-3 mb-4 group"
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={{ backgroundColor: '#f1f5f9', border: '1px solid rgba(226,232,240,0.7)' }}
      >
        <Brain className="w-4 h-4" style={{ color: '#0f172a' }} />
      </div>

      <div className="flex-1 min-w-0">
        {message.toolCalls?.some(t => t.status === 'running') && (
          <div className="mb-1">
            {message.toolCalls.filter(t => t.status === 'running').slice(0,1).map(tool => (
              <ToolPill key={tool.id} tool={tool as any} />
            ))}
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

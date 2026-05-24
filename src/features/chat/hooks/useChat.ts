import { useCallback, useRef, useState } from 'react'
import { WS_URL } from '@/api/config'
import type { Message, ToolCall } from '../types'

const CHATBOT_WS_BASE = WS_URL

function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const abortRef = useRef(false)
  const bookingContextRef = useRef<Record<string, unknown>>({})

  const addMessage = useCallback((msg: Message) => {
    setMessages(prev => [...prev, msg])
  }, [])


  const stopStreaming = useCallback(() => {
    abortRef.current = true
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    setIsLoading(false)
    setMessages(prev => {
      const next = [...prev]
      if (next.length && next[next.length - 1].isStreaming) {
        next[next.length - 1] = { ...next[next.length - 1], isStreaming: false }
      }
      return next
    })
  }, [])

  const sendMessage = useCallback(
    async (text: string, generateHistorial = false, extras: Record<string, unknown> = {}) => {
      if (!text.trim() || isLoading) return

      abortRef.current = false

      const userMsg: Message = {
        id: generateId(),
        role: 'user',
        content: text.trim(),
        timestamp: Date.now(),
      }
      addMessage(userMsg)

      const assistantId = generateId()
      const toolId = generateId()

      setIsLoading(true)

      const pendingAssistant: Message = {
        id: assistantId,
        role: 'assistant',
        content: '',
        isStreaming: true,
        timestamp: Date.now(),
        toolCalls: [
          {
            id: toolId,
            name: 'process_message',
            label: 'Procesando mensaje...',
            status: 'running',
          } as ToolCall & { label: string },
        ],
      }
      addMessage(pendingAssistant)

      const ws = new WebSocket(`${ CHATBOT_WS_BASE }/chat`)
      wsRef.current = ws

      ws.onopen = () => {
        const history = messages
          .slice(-12)
          .map((m) => ({
            role: m.role,
            content: m.content || '',
          }))
          .filter((m) => m.content.trim().length > 0)

        ws.send(JSON.stringify({
          text,
          generate_historial: generateHistorial,
          history,
          ...bookingContextRef.current,
          ...extras,
        }))
      }

      ws.onmessage = (event) => {
        if (abortRef.current) return
        const data = JSON.parse(event.data)

        // Tool empieza a ejecutarse
        if (data.type === 'tool_start') {
          setMessages(prev => {
            const next = [...prev]
            const last = next[next.length - 1]
            if (last.id === assistantId) {
              next[next.length - 1] = {
                ...last,
                toolCalls: [
                  {
                    id: data.tool.id,
                    name: data.tool.name,
                    label: data.tool.label,
                    status: 'running',
                  } as ToolCall & { label: string },
                ],
              }
            }
            return next
          })
        }

        // Tool terminÃ³
        if (data.type === 'tool_result') {
          const result = data.result ?? {}
          const medicos = Array.isArray(result.medicos) ? result.medicos : []
          const slots = Array.isArray(result.slots) ? result.slots : []
          if (medicos.length > 0) {
            const firstMedico = medicos[0] as Record<string, unknown>
            if (firstMedico?.id != null) {
              bookingContextRef.current.medico_id = firstMedico.id
            }
          }
          if (slots.length > 0) {
            const firstSlot = slots[0] as Record<string, unknown>
            if (firstSlot?.id != null) {
              bookingContextRef.current.slot_id = firstSlot.id
            }
          }
          if (result.patient && typeof result.patient === 'object') {
            const p = result.patient as Record<string, unknown>
            if (p.id != null) bookingContextRef.current.paciente_id = p.id
            if (p.documento != null) bookingContextRef.current.documento = p.documento
            if (p.nombre != null) bookingContextRef.current.nombre = p.nombre
            if (p.telefono != null) bookingContextRef.current.telefono = p.telefono
            if (p.eps != null) bookingContextRef.current.eps = p.eps
          }

          setMessages(prev => {
            const next = [...prev]
            const last = next[next.length - 1]
            if (last.id === assistantId) {
              next[next.length - 1] = {
                ...last,
                toolCalls: last.toolCalls?.map(t =>
                  t.id === data.tool_id
                    ? {
                        ...t,
                        status: data.success ? 'done' : 'error',
                        success: Boolean(data.success),
                        executedAt: Date.now(),
                        resultData: data.result ?? {},
                      }
                    : t
                ),
              }
            }
            return next
          })
        }

        if (data.type === 'chunk') {
          setMessages(prev => {
            const next = [...prev]
            const last = next[next.length - 1]
            if (last.id === assistantId) {
              next[next.length - 1] = { ...last, content: last.content + data.text }
            }
            return next
          })
        }

        if (data.type === 'done') {
          setMessages(prev => {
            const next = [...prev]
            const last = next[next.length - 1]
            if (last.id === assistantId) {
              next[next.length - 1] = {
                ...last,
                isStreaming: false,
                intent: data.intent,
                historial: data.historial ?? null,
                cita: data.cita ?? null,
              }
            }
            return next
          })
          setIsLoading(false)
          wsRef.current = null
        }

        if (data.type === 'error') {
          setMessages(prev => {
            const next = [...prev]
            const last = next[next.length - 1]
            if (last.id === assistantId) {
              next[next.length - 1] = {
                ...last,
                isStreaming: false,
                content: last.content || 'Error al procesar el mensaje.',
                toolCalls: last.toolCalls?.map(t => ({ ...t, status: 'error' as const })),
              }
            }
            return next
          })
          setIsLoading(false)
          wsRef.current = null
        }
      }

      ws.onerror = () => {
        setMessages(prev => {
          const next = [...prev]
          const last = next[next.length - 1]
          if (last.id === assistantId) {
            next[next.length - 1] = {
              ...last,
              isStreaming: false,
              content: last.content || 'No se pudo conectar con el servidor.',
              toolCalls: last.toolCalls?.map(t =>
                t.id === toolId ? { ...t, status: 'error' } : t
              ),
            }
          }
          return next
        })
        setIsLoading(false)
        wsRef.current = null
      }

      ws.onclose = () => {
        if (abortRef.current) return
        setIsLoading(false)
        wsRef.current = null
      }
    },
    [isLoading, addMessage, messages]
  )

  return { messages, isLoading, sendMessage, stopStreaming }
}

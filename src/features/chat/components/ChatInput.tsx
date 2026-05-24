import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUp, Square } from 'lucide-react'

interface ChatInputProps {
  onSend: (text: string, generateHistorial?: boolean) => void
  onStop: () => void
  isLoading: boolean
}

export function ChatInput({ onSend, onStop, isLoading }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    const next = Math.min(Math.max(ta.scrollHeight, 24), 180)
    ta.style.height = `${next}px`
    ta.style.overflowY = next >= 180 ? 'auto' : 'hidden'
  }, [value])

  const handleSend = useCallback(() => {
    if (!value.trim() || isLoading) return
    onSend(value.trim(), false)
    setValue('')
  }, [value, isLoading, onSend])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  const canSend = value.trim().length > 0 || isLoading

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div
        className="relative flex flex-col gap-1.5 px-3 py-2.5 rounded-[1.4rem]"
        style={{
          backgroundColor: '#ffffff',
          border: '1.5px solid rgba(203,213,225,1)',
          boxShadow: '0 4px 18px rgba(15,23,42,0.08)',
        }}
      >
        <div className="pl-2 pt-1.5">
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading && !value}
            placeholder="Enviar un mensaje a Monwe..."
            className="w-full custom-scrollbar text-sm font-normal leading-relaxed placeholder:opacity-40"
            style={{
              fontFamily: 'Poppins, sans-serif',
              color: '#0f172a',
              caretColor: '#0f172a',
              minHeight: '24px',
              maxHeight: '180px',
            }}
          />
        </div>

        <div className="flex items-center justify-end">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={isLoading ? onStop : handleSend}
            disabled={!canSend && !isLoading}
            className="h-11 w-11 flex items-center justify-center rounded-full transition-all duration-200"
            style={{
              border: '1.5px solid rgba(100,116,139,0.85)',
              backgroundColor: canSend ? '#f8fafc' : 'transparent',
              color: '#0f172a',
              opacity: canSend || isLoading ? 1 : 0.3,
              cursor: canSend || isLoading ? 'pointer' : 'not-allowed',
            }}
          >
            {isLoading
              ? <Square className="w-4 h-4" fill="currentColor" />
              : <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
            }
          </motion.button>
        </div>
      </div>
    </div>
  )
}

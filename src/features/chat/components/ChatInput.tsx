import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp, Square, Mic, StopCircle, Loader2, Plus, Stethoscope } from 'lucide-react'
import { useAudio } from '../hooks/useAudio'

interface ChatInputProps {
  onSend: (text: string, generateHistorial?: boolean) => void
  onStop: () => void
  isLoading: boolean
}

export function ChatInput({ onSend, onStop, isLoading }: ChatInputProps) {
  const [value, setValue] = useState('')
  const [generateHistorial, setGenerateHistorial] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const optionsRef = useRef<HTMLDivElement>(null)

  const { audioState, toggleRecording } = useAudio((transcript) => {
    setValue(prev => (prev ? prev + ' ' + transcript : transcript))
  })

  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    const next = Math.min(Math.max(ta.scrollHeight, 24), 180)
    ta.style.height = `${next}px`
    ta.style.overflowY = next >= 180 ? 'auto' : 'hidden'
  }, [value])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(e.target as Node)) {
        setShowOptions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSend = useCallback(() => {
    if (!value.trim() || isLoading) return
    onSend(value.trim(), generateHistorial)
    setValue('')
    setGenerateHistorial(false)
  }, [value, isLoading, onSend, generateHistorial])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  const canSend = value.trim().length > 0 || isLoading

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <AnimatePresence>
        {showOptions && (
          <motion.div
            ref={optionsRef}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-2 left-0 rounded-2xl p-2 min-w-[220px] z-50"
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid rgba(226,232,240,0.6)',
              boxShadow: '0 12px 28px rgba(15,23,42,0.12)',
            }}
          >
            <button
              onClick={() => { setGenerateHistorial(g => !g); setShowOptions(false) }}
              className="flex items-center justify-between w-full h-10 px-3 rounded-xl transition-colors text-sm hover:bg-slate-100"
              style={{ color: '#0f172a' }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f1f5f9' }}>
                  <Stethoscope className="w-4 h-4" style={{ opacity: 0.7 }} />
                </div>
                <span>Generar historial</span>
              </div>
              <div
                className={`relative w-10 h-5 rounded-full transition-colors ${generateHistorial ? '' : ''}`}
                style={{ backgroundColor: generateHistorial ? 'rgba(226,232,240,0.9)' : '#f1f5f9', border: '1px solid rgba(226,232,240,0.85)' }}
              >
                <div
                  className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform"
                  style={{
                    backgroundColor: '#0f172a',
                    transform: generateHistorial ? 'translateX(20px)' : 'translateX(0)',
                  }}
                />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="relative flex flex-col gap-1.5 px-3 py-2.5 rounded-[1.4rem] transition-all duration-200"
        style={{
          backgroundColor: '#ffffff',
          border: audioState === 'recording'
            ? '1.5px solid rgba(239,68,68,0.5)'
            : '1.5px solid rgba(203,213,225,1)',
          boxShadow: audioState === 'recording'
            ? '0 0 20px rgba(239,68,68,0.25)'
            : '0 4px 18px rgba(15,23,42,0.08)',
        }}
      >
        {generateHistorial && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-center gap-1.5 px-2"
          >
            <Stethoscope className="w-3 h-3" style={{ color: 'rgba(100,116,139,0.75)' }} />
            <span className="text-xs" style={{ color: 'rgba(100,116,139,0.75)' }}>Modo historial clínico activo</span>
          </motion.div>
        )}

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

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowOptions(o => !o)}
              className="h-9 w-9 flex items-center justify-center rounded-full transition-colors hover:bg-slate-100"
              style={{ color: '#0f172a' }}
            >
              <Plus
                className="w-5 h-5 transition-transform duration-200"
                style={{ transform: showOptions ? 'rotate(45deg)' : 'rotate(0deg)', opacity: 0.8 }}
              />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleRecording}
              disabled={audioState === 'transcribing'}
              className={`h-9 w-9 flex items-center justify-center rounded-full transition-colors ${audioState === 'recording' ? 'record-pulse' : 'hover:bg-slate-100'}`}
              style={{ color: '#0f172a' }}
            >
              {audioState === 'recording' && <StopCircle className="w-5 h-5 text-red-400" />}
              {audioState === 'transcribing' && <Loader2 className="w-5 h-5 animate-spin" style={{ opacity: 0.7 }} />}
              {audioState === 'idle' && <Mic className="w-5 h-5" style={{ opacity: 0.8 }} />}
            </button>

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
    </div>
  )
}

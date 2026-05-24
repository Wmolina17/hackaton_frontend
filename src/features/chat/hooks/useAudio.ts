import { useCallback, useRef, useState } from 'react'

export type AudioState = 'idle' | 'recording' | 'transcribing'

// Codec preferido: opus low-bitrate => menos bytes en el wire => menor latencia STT
function pickMimeType(): string {
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/ogg;codecs=opus',
    'audio/webm',
    'audio/mp4',
  ]
  for (const m of candidates) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported?.(m)) return m
  }
  return ''
}

export function useAudio(onTranscript: (text: string) => void) {
  const [audioState, setAudioState] = useState<AudioState>('idle')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  const startRecording = useCallback(async () => {
    if (!navigator.mediaDevices) return
    try {
      // Constraints optimizados para voz: mono 16kHz + supresión de eco/ruido
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })
      streamRef.current = stream

      const mimeType = pickMimeType()
      // 32 kbps opus es más que suficiente para voz y reduce ~50% el payload
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType, audioBitsPerSecond: 32000 })
        : new MediaRecorder(stream)

      mediaRecorderRef.current = recorder
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = async () => {
        const type = recorder.mimeType || mimeType || 'audio/webm'
        const blob = new Blob(chunksRef.current, { type })
        streamRef.current?.getTracks().forEach(t => t.stop())
        streamRef.current = null

        if (blob.size < 1000) {
          setAudioState('idle')
          return
        }

        try {
          setAudioState('transcribing')
          // Multipart directo (sin base64) -> mínima latencia y CPU
          const ext = type.includes('ogg') ? 'ogg' : type.includes('mp4') ? 'm4a' : 'webm'
          const fd = new FormData()
          fd.append('file', blob, `audio.${ext}`)
          fd.append('language', 'es')

          const res = await fetch('/api/transcribe', { method: 'POST', body: fd })
          if (res.ok) {
            const data = await res.json()
            const transcript: string = data?.data?.transcript || ''
            if (transcript) onTranscript(transcript)
          } else {
            console.error('STT error', res.status, await res.text())
          }
        } catch (err) {
          console.error('Transcription error', err)
        } finally {
          setAudioState('idle')
        }
      }

      recorder.start()
      setAudioState('recording')
    } catch (err) {
      console.error('Mic error', err)
      setAudioState('idle')
    }
  }, [onTranscript])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && audioState === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }, [audioState])

  const toggleRecording = useCallback(() => {
    if (audioState === 'recording') stopRecording()
    else if (audioState === 'idle') startRecording()
  }, [audioState, startRecording, stopRecording])

  return { audioState, toggleRecording }
}

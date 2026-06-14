import { useCallback, useEffect, useMemo, useState } from 'react'

const VOICE_STORAGE_KEY = 'codingisfun:voiceURI'

function hasSpeech(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

/** Skor preferensi voice: makin tinggi makin diutamakan sebagai default. */
function scoreVoice(v: SpeechSynthesisVoice): number {
  const name = v.name.toLowerCase()
  let score = 0
  if (v.lang.toLowerCase().startsWith('id')) score += 100
  // Hindari voice Google (sesuai permintaan) — turunkan prioritas.
  if (name.includes('google')) score -= 50
  // Utamakan voice lokal/offline & Microsoft (mis. "Microsoft Andika").
  if (v.localService) score += 20
  if (name.includes('microsoft')) score += 15
  if (name.includes('andika') || name.includes('ardi') || name.includes('male')) score += 10
  return score
}

export interface SpeechController {
  speak: (text: string) => void
  cancel: () => void
  voices: SpeechSynthesisVoice[]
  selectedVoiceURI: string | null
  setSelectedVoiceURI: (uri: string) => void
}

/**
 * Narasi teks via Web Speech API (Bahasa Indonesia).
 * Menghindari voice Google secara default & mengizinkan pemilihan voice.
 */
export function useSpeech(enabled: boolean): SpeechController {
  const [allVoices, setAllVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoiceURI, setSelected] = useState<string | null>(() => {
    if (!hasSpeech()) return null
    return localStorage.getItem(VOICE_STORAGE_KEY)
  })

  useEffect(() => {
    if (!hasSpeech()) return
    const loadVoices = () => setAllVoices(window.speechSynthesis.getVoices())
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
    return () => {
      window.speechSynthesis.onvoiceschanged = null
    }
  }, [])

  // Voice yang ditawarkan ke user: Indonesia dulu, lalu sisanya; Google ditaruh belakang.
  const voices = useMemo(() => {
    const idVoices = allVoices.filter((v) => v.lang.toLowerCase().startsWith('id'))
    const pool = idVoices.length > 0 ? idVoices : allVoices
    return [...pool].sort((a, b) => scoreVoice(b) - scoreVoice(a))
  }, [allVoices])

  const defaultVoice = voices[0] ?? null

  const resolveVoice = useCallback((): SpeechSynthesisVoice | null => {
    if (selectedVoiceURI) {
      const match = allVoices.find((v) => v.voiceURI === selectedVoiceURI)
      if (match) return match
    }
    return defaultVoice
  }, [selectedVoiceURI, allVoices, defaultVoice])

  const setSelectedVoiceURI = useCallback((uri: string) => {
    setSelected(uri)
    if (hasSpeech()) localStorage.setItem(VOICE_STORAGE_KEY, uri)
  }, [])

  const speak = useCallback(
    (text: string) => {
      if (!hasSpeech()) return
      window.speechSynthesis.cancel()
      if (!enabled || !text) return

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'id-ID'
      const voice = resolveVoice()
      if (voice) utterance.voice = voice
      utterance.pitch = 0.9
      utterance.rate = 0.95

      window.speechSynthesis.speak(utterance)
    },
    [enabled, resolveVoice],
  )

  const cancel = useCallback(() => {
    if (hasSpeech()) window.speechSynthesis.cancel()
  }, [])

  return { speak, cancel, voices, selectedVoiceURI, setSelectedVoiceURI }
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { extractPageText, type TtsTextScope } from '../utils/extractPageText'
import { checkTtsAvailable, fetchSpeech, hashText, type TtsError } from '../services/ttsClient'
import { DEFAULT_TTS_VOICE, TTS_VOICES, type TtsVoiceOption } from '../services/ttsVoices'

export type TtsStatus =
  | 'ready'
  | 'loading'
  | 'starting'
  | 'playing'
  | 'paused'
  | 'stopped'
  | 'error'

export interface UseTextToSpeech {
  status: TtsStatus
  isAvailable: boolean | null // null = belum dicek
  error: string | null
  notice: string | null
  currentTime: number
  duration: number
  progress: number
  selectedVoice: string
  voices: TtsVoiceOption[]
  setVoice: (voice: string) => void
  play: (scope?: TtsTextScope) => Promise<void>
  pause: () => void
  resume: () => void
  stop: () => void
  seek: (time: number) => void
  retry: () => void
}

const TTS_VOICE_STORAGE_KEY = 'codingisfun:ttsVoice'
export const MAX_TTS_TEXT_CHARS = 5_000

function isKnownVoice(voice: string | null): voice is string {
  return Boolean(voice && TTS_VOICES.some((option) => option.name === voice))
}

function readStoredVoice(): string {
  try {
    const stored = localStorage.getItem(TTS_VOICE_STORAGE_KEY)
    return isKnownVoice(stored) ? stored : DEFAULT_TTS_VOICE
  } catch {
    return DEFAULT_TTS_VOICE
  }
}

export function useTextToSpeech(): UseTextToSpeech {
  const [status, setStatus] = useState<TtsStatus>('ready')
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [selectedVoice, setSelectedVoice] = useState(readStoredVoice)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const lastScopeRef = useRef<TtsTextScope>('page')
  // Cache blob-URL per hash teks agar tidak request ulang konten sama.
  const cacheRef = useRef<Map<string, string>>(new Map())

  // Cek ketersediaan server TTS saat mount.
  useEffect(() => {
    let active = true
    checkTtsAvailable().then((ok) => {
      if (active) setIsAvailable(ok)
    })
    return () => {
      active = false
    }
  }, [])

  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }
  }, [])

  const stop = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    cleanupAudio()
    setCurrentTime(0)
    setStatus('stopped')
  }, [cleanupAudio])

  const playUrl = useCallback((url: string) => {
    cleanupAudio()
    const audio = new Audio(url)
    audioRef.current = audio
    setCurrentTime(0)
    setDuration(0)
    setStatus('starting')
    audio.onended = () => {
      setCurrentTime(audio.duration || 0)
      setStatus('stopped')
    }
    audio.onerror = () => {
      setError('Gagal memutar audio.')
      setStatus('error')
    }
    audio.onplay = () => setStatus('playing')
    audio.onpause = () => {
      // Hanya tandai paused bila belum selesai.
      if (audioRef.current && !audioRef.current.ended) setStatus('paused')
    }
    audio.ondurationchange = () => {
      if (Number.isFinite(audio.duration)) setDuration(audio.duration)
    }
    audio.ontimeupdate = () => {
      if (Number.isFinite(audio.currentTime)) setCurrentTime(audio.currentTime)
    }
    void audio.play().catch(() => {
      setError('Browser menolak memutar audio. Coba klik lagi.')
      setStatus('error')
    })
  }, [cleanupAudio])

  const setVoice = useCallback((voice: string) => {
    if (!isKnownVoice(voice)) return
    setSelectedVoice(voice)
    try {
      localStorage.setItem(TTS_VOICE_STORAGE_KEY, voice)
    } catch {
      /* localStorage bisa tidak tersedia pada mode privasi/test tertentu. */
    }
  }, [])

  const play = useCallback(async (scope: TtsTextScope = 'page') => {
    setError(null)
    setNotice(null)
    lastScopeRef.current = scope
    const extractedText = extractPageText(scope)
    const text =
      extractedText.length > MAX_TTS_TEXT_CHARS
        ? extractedText.slice(0, MAX_TTS_TEXT_CHARS).trim()
        : extractedText
    if (extractedText.length > MAX_TTS_TEXT_CHARS) {
      setNotice('Teks terlalu panjang, jadi audio dipersingkat agar tetap cepat diputar.')
    }
    if (!text) {
      setError('Tidak ada teks yang bisa dibacakan di halaman ini.')
      setStatus('error')
      return
    }

    const key = `${selectedVoice}:${hashText(text)}`
    const cached = cacheRef.current.get(key)
    if (cached) {
      playUrl(cached)
      return
    }

    setStatus('loading')
    const controller = new AbortController()
    abortRef.current = controller
    try {
      const blob = await fetchSpeech(text, controller.signal, selectedVoice)
      const url = URL.createObjectURL(blob)
      cacheRef.current.set(key, url)
      if (controller.signal.aborted) return
      playUrl(url)
    } catch (err) {
      if (controller.signal.aborted) return
      const e = err as TtsError
      if (e.code === 'NO_API_KEY') setIsAvailable(false)
      setError(e.message || 'Terjadi kesalahan saat membuat audio.')
      setStatus('error')
    }
  }, [playUrl, selectedVoice])

  const pause = useCallback(() => {
    audioRef.current?.pause()
  }, [])

  const resume = useCallback(() => {
    if (audioRef.current) void audioRef.current.play()
  }, [])

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return
    const nextTime = Math.max(0, Math.min(time, audioRef.current.duration || time))
    audioRef.current.currentTime = nextTime
    setCurrentTime(nextTime)
  }, [])

  const retry = useCallback(() => {
    setStatus('ready')
    void play(lastScopeRef.current)
  }, [play])

  // Bersihkan audio & object URL saat unmount (pindah halaman/komponen lepas).
  useEffect(() => {
    const cache = cacheRef.current
    return () => {
      abortRef.current?.abort()
      cleanupAudio()
      cache.forEach((url) => URL.revokeObjectURL(url))
      cache.clear()
    }
  }, [cleanupAudio])

  return {
    status,
    isAvailable,
    error,
    notice,
    currentTime,
    duration,
    progress: duration > 0 ? Math.min(100, Math.round((currentTime / duration) * 100)) : 0,
    selectedVoice,
    voices: TTS_VOICES,
    setVoice,
    play,
    pause,
    resume,
    stop,
    seek,
    retry,
  }
}

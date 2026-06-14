import { useCallback, useRef } from 'react'

type WindowWithWebkitAudio = Window &
  typeof globalThis & { webkitAudioContext?: typeof AudioContext }

/**
 * Efek suara tersintesis (Web Audio API) untuk ketikan dan keberhasilan.
 * AudioContext dibuat lazy & dipakai ulang antar pemanggilan.
 */
export function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null)

  const getCtx = useCallback((): AudioContext | null => {
    const w = window as WindowWithWebkitAudio
    const Ctor = w.AudioContext ?? w.webkitAudioContext
    if (!Ctor) return null
    if (!ctxRef.current) {
      ctxRef.current = new Ctor()
    }
    if (ctxRef.current.state === 'suspended') {
      void ctxRef.current.resume()
    }
    return ctxRef.current
  }, [])

  const playTyping = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'square'
      osc.frequency.setValueAtTime(150 + Math.random() * 50, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.03)
      gain.gain.setValueAtTime(0.05, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.03)
    } catch {
      /* abaikan kegagalan audio */
    }
  }, [getCtx])

  const playSuccess = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    try {
      const playNote = (freq: number, startTime: number) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.value = freq
        gain.gain.setValueAtTime(0, startTime)
        gain.gain.linearRampToValueAtTime(0.15, startTime + 0.05)
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(startTime)
        osc.stop(startTime + 0.4)
      }
      const now = ctx.currentTime
      playNote(523.25, now) // C5
      playNote(659.25, now + 0.1) // E5
      playNote(783.99, now + 0.2) // G5
      playNote(1046.5, now + 0.3) // C6
    } catch {
      /* abaikan kegagalan audio */
    }
  }, [getCtx])

  return { playTyping, playSuccess }
}

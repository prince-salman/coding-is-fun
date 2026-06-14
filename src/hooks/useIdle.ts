import { useCallback, useEffect, useRef, useState } from 'react'

const ACTIVITY_EVENTS = ['keydown', 'pointerdown', 'pointermove', 'wheel'] as const

/**
 * Mendeteksi ketika user tidak aktif selama `delayMs`.
 * Aktivitas (ketik, klik, gerak mouse, scroll) mereset hitungan.
 * Mengembalikan `isIdle` dan `reset` untuk mereset manual dari luar.
 */
export function useIdle(delayMs: number, enabled = true): { isIdle: boolean; reset: () => void } {
  const [isIdle, setIsIdle] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const startTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setIsIdle(true), delayMs)
  }, [delayMs])

  const reset = useCallback(() => {
    setIsIdle(false)
    startTimer()
  }, [startTimer])

  useEffect(() => {
    if (!enabled) return

    startTimer()
    const handleActivity = () => reset()
    for (const evt of ACTIVITY_EVENTS) {
      window.addEventListener(evt, handleActivity, { passive: true })
    }
    return () => {
      for (const evt of ACTIVITY_EVENTS) {
        window.removeEventListener(evt, handleActivity)
      }
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [startTimer, reset, enabled])

  // Ketika dinonaktifkan, jangan pernah laporkan idle (nilai diturunkan, bukan via setState).
  return { isIdle: enabled && isIdle, reset }
}

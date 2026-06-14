// Klien frontend untuk endpoint TTS internal (/api/tts).
// Tidak pernah memegang API key — hanya memanggil server.

/** Hash string sederhana (djb2) untuk kunci cache audio per-teks. */
export function hashText(text: string): string {
  let hash = 5381
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 33) ^ text.charCodeAt(i)
  }
  return (hash >>> 0).toString(36)
}

/** Cek apakah server punya API key (untuk fallback UI). */
export async function checkTtsAvailable(): Promise<boolean> {
  try {
    const res = await fetch('/api/tts/health')
    if (!res.ok) return false
    const data = (await res.json()) as { available?: boolean }
    return Boolean(data.available)
  } catch {
    return false
  }
}

export interface TtsError extends Error {
  code?: string
}

/**
 * Minta audio dari server untuk teks tertentu.
 * @returns Blob audio (WAV).
 */
export async function fetchSpeech(
  text: string,
  signal?: AbortSignal,
  voice?: string,
): Promise<Blob> {
  const res = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, ...(voice ? { voice } : {}) }),
    signal,
  })

  if (!res.ok) {
    let message = `Gagal membuat audio (HTTP ${res.status}).`
    let code: string | undefined
    try {
      const data = (await res.json()) as { error?: string; code?: string }
      if (data.error) message = data.error
      code = data.code
    } catch {
      /* abaikan parse error */
    }
    const err = new Error(message) as TtsError
    err.code = code
    throw err
  }

  return res.blob()
}

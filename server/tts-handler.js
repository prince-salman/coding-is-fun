// Handler HTTP agnostik framework untuk endpoint TTS.
// Dipakai oleh middleware Vite (dev) maupun Express (production).
import { DEFAULT_VOICE, isSupportedVoice, synthesizeSpeech } from './tts-core.js'

function sendJson(res, status, payload) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(payload))
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (chunk) => {
      raw += chunk
      // Lindungi dari body raksasa (>1MB).
      if (raw.length > 1_000_000) {
        reject(Object.assign(new Error('Body terlalu besar.'), { status: 413 }))
        req.destroy()
      }
    })
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {})
      } catch {
        reject(Object.assign(new Error('JSON tidak valid.'), { status: 400 }))
      }
    })
    req.on('error', reject)
  })
}

/** GET /api/tts/health → { available: boolean }. */
export function handleHealth(getApiKey, res) {
  sendJson(res, 200, { available: Boolean(getApiKey()) })
}

/** POST /api/tts → audio/wav (binary). */
export async function handleTts(getApiKey, req, res) {
  const apiKey = getApiKey()
  if (!apiKey) {
    return sendJson(res, 503, {
      error: 'TTS belum dikonfigurasi. GEMINI_API_KEY tidak tersedia di server.',
      code: 'NO_API_KEY',
    })
  }

  try {
    const body = await readJsonBody(req)
    const text = typeof body.text === 'string' ? body.text : ''
    if (!text.trim()) {
      return sendJson(res, 400, { error: 'Field "text" wajib diisi.', code: 'EMPTY_TEXT' })
    }

    const { wav, mimeType } = await synthesizeSpeech({
      apiKey,
      text,
      voice: isSupportedVoice(body.voice) ? body.voice : DEFAULT_VOICE,
    })

    res.statusCode = 200
    res.setHeader('Content-Type', mimeType)
    res.setHeader('Content-Length', wav.length)
    res.setHeader('Cache-Control', 'no-store')
    res.end(wav)
  } catch (err) {
    const status = err?.status || 500
    sendJson(res, status, {
      error: err?.message || 'Gagal membuat audio.',
      code: 'TTS_FAILED',
    })
  }
}

/**
 * Coba tangani request TTS. Mengembalikan true bila sudah ditangani.
 * @param {() => string|undefined} getApiKey
 */
export async function tryHandleTtsRequest(getApiKey, req, res) {
  const url = (req.url || '').split('?')[0]
  if (url === '/api/tts/health' && req.method === 'GET') {
    handleHealth(getApiKey, res)
    return true
  }
  if (url === '/api/tts' && req.method === 'POST') {
    await handleTts(getApiKey, req, res)
    return true
  }
  return false
}

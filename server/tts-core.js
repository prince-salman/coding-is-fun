// Inti layanan Text-to-Speech berbasis Gemini TTS.
// File ini berjalan di sisi server (Node) — API key TIDAK pernah sampai ke client.

const GEMINI_TTS_MODEL = 'gemini-3.1-flash-tts-preview'
const GEMINI_ENDPOINT = (model, key) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`

// Suara prebuilt Gemini; "Sulafat" terdengar hangat & natural.
const DEFAULT_VOICE = 'Sulafat'
const SUPPORTED_VOICES = new Set(['Sulafat', 'Kore', 'Puck', 'Aoede', 'Charon'])

export function isSupportedVoice(voice) {
  return typeof voice === 'string' && SUPPORTED_VOICES.has(voice)
}

// Batas aman panjang teks per request (karakter). Teks panjang dipecah.
const MAX_CHARS_PER_CHUNK = 1800

/** Instruksi gaya bicara untuk narasi Bahasa Indonesia yang natural. */
export function buildVoiceInstruction(text) {
  return [
    'Bacakan teks berikut sebagai narator website berbahasa Indonesia.',
    'Gunakan Bahasa Indonesia yang natural, ramah, dan profesional, tidak kaku.',
    'Intonasi jelas dan nyaman didengar, dengan jeda natural antarbagian.',
    'Jangan mengeja tanda baca.',
    'Jangan membaca tag HTML, nama class, nama file, potongan kode, URL, atau simbol teknis.',
    'Jika ada heading atau judul section, bacakan seolah sedang menjelaskan isi website kepada pengunjung.',
    '',
    'Teks untuk dibacakan:',
    text,
  ].join('\n')
}

/**
 * Pecah teks panjang menjadi beberapa bagian aman pada batas kalimat.
 * @param {string} text
 * @param {number} maxChars
 * @returns {string[]}
 */
export function chunkText(text, maxChars = MAX_CHARS_PER_CHUNK) {
  const clean = text.trim()
  if (clean.length <= maxChars) return clean ? [clean] : []

  const sentences = clean.split(/(?<=[.!?])\s+/)
  const chunks = []
  let current = ''
  for (const sentence of sentences) {
    if (sentence.length > maxChars) {
      // Kalimat tunggal kelewat panjang: potong paksa per maxChars.
      if (current) {
        chunks.push(current.trim())
        current = ''
      }
      for (let i = 0; i < sentence.length; i += maxChars) {
        chunks.push(sentence.slice(i, i + maxChars).trim())
      }
      continue
    }
    if ((current + ' ' + sentence).trim().length > maxChars) {
      chunks.push(current.trim())
      current = sentence
    } else {
      current = current ? `${current} ${sentence}` : sentence
    }
  }
  if (current.trim()) chunks.push(current.trim())
  return chunks
}

/** Bungkus PCM 16-bit mono menjadi container WAV agar bisa diputar <audio>. */
export function pcmToWav(pcmBuffer, sampleRate = 24000, channels = 1, bitsPerSample = 16) {
  const byteRate = (sampleRate * channels * bitsPerSample) / 8
  const blockAlign = (channels * bitsPerSample) / 8
  const header = Buffer.alloc(44)

  header.write('RIFF', 0)
  header.writeUInt32LE(36 + pcmBuffer.length, 4)
  header.write('WAVE', 8)
  header.write('fmt ', 12)
  header.writeUInt32LE(16, 16)
  header.writeUInt16LE(1, 20) // PCM
  header.writeUInt16LE(channels, 22)
  header.writeUInt32LE(sampleRate, 24)
  header.writeUInt32LE(byteRate, 28)
  header.writeUInt16LE(blockAlign, 32)
  header.writeUInt16LE(bitsPerSample, 34)
  header.write('data', 36)
  header.writeUInt32LE(pcmBuffer.length, 40)

  return Buffer.concat([header, pcmBuffer])
}

/** Ambil sampleRate dari mimeType seperti "audio/L16;rate=24000". */
function parseSampleRate(mimeType, fallback = 24000) {
  const match = /rate=(\d+)/.exec(mimeType || '')
  return match ? Number(match[1]) : fallback
}

/**
 * Sintesis satu potong teks menjadi PCM via Gemini TTS.
 * @returns {Promise<{ pcm: Buffer, sampleRate: number }>}
 */
async function synthesizeChunk({ apiKey, text, voice, model, fetchImpl }) {
  const body = {
    contents: [{ parts: [{ text: buildVoiceInstruction(text) }] }],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } },
      },
    },
  }

  const res = await fetchImpl(GEMINI_ENDPOINT(model, apiKey), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    let detail = ''
    try {
      const errJson = await res.json()
      detail = errJson?.error?.message || ''
    } catch {
      /* abaikan */
    }
    const err = new Error(detail || `Gemini TTS error (HTTP ${res.status})`)
    err.status = res.status
    throw err
  }

  const json = await res.json()
  const part = json?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)
  const inline = part?.inlineData
  if (!inline?.data) {
    const err = new Error('Respons Gemini tidak berisi data audio.')
    err.status = 502
    throw err
  }

  return {
    pcm: Buffer.from(inline.data, 'base64'),
    sampleRate: parseSampleRate(inline.mimeType),
  }
}

/**
 * Sintesis teks penuh (otomatis dipecah) → satu Buffer WAV.
 * @param {object} opts
 * @param {string} opts.apiKey
 * @param {string} opts.text
 * @param {string} [opts.voice]
 * @param {typeof fetch} [opts.fetchImpl]
 * @returns {Promise<{ wav: Buffer, mimeType: string }>}
 */
export async function synthesizeSpeech({
  apiKey,
  text,
  voice = DEFAULT_VOICE,
  model = GEMINI_TTS_MODEL,
  fetchImpl = fetch,
}) {
  if (!apiKey) {
    const err = new Error('GEMINI_API_KEY belum diset di server.')
    err.status = 503
    throw err
  }
  const chunks = chunkText(text)
  if (chunks.length === 0) {
    const err = new Error('Teks kosong, tidak ada yang dibacakan.')
    err.status = 400
    throw err
  }

  const parts = []
  let sampleRate = 24000
  for (const chunk of chunks) {
    const { pcm, sampleRate: sr } = await synthesizeChunk({
      apiKey,
      text: chunk,
      voice,
      model,
      fetchImpl,
    })
    parts.push(pcm)
    sampleRate = sr
  }

  const wav = pcmToWav(Buffer.concat(parts), sampleRate)
  return { wav, mimeType: 'audio/wav' }
}

export { GEMINI_TTS_MODEL, DEFAULT_VOICE, MAX_CHARS_PER_CHUNK, SUPPORTED_VOICES }

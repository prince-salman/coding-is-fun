import { EventEmitter } from 'node:events'
import { describe, expect, it, vi } from 'vitest'

const synthesizeSpeech = vi.fn()

vi.mock('./tts-core.js', () => ({
  DEFAULT_VOICE: 'Sulafat',
  isSupportedVoice: (voice) => ['Sulafat', 'Kore'].includes(voice),
  synthesizeSpeech: (...args) => synthesizeSpeech(...args),
}))

const { handleTts } = await import('./tts-handler.js')

function createReq(body) {
  const req = new EventEmitter()
  req.destroy = vi.fn()
  queueMicrotask(() => {
    req.emit('data', JSON.stringify(body))
    req.emit('end')
  })
  return req
}

function createRes() {
  return {
    statusCode: 0,
    headers: {},
    body: undefined,
    setHeader(name, value) {
      this.headers[name] = value
    },
    end(value) {
      this.body = value
    },
  }
}

describe('handleTts', () => {
  it('meneruskan voice yang didukung ke synthesizeSpeech', async () => {
    synthesizeSpeech.mockResolvedValueOnce({
      wav: Buffer.from('wav-data'),
      mimeType: 'audio/wav',
    })
    const res = createRes()

    await handleTts(() => 'secret-key', createReq({ text: 'Halo', voice: 'Kore' }), res)

    expect(synthesizeSpeech).toHaveBeenCalledWith(
      expect.objectContaining({ apiKey: 'secret-key', text: 'Halo', voice: 'Kore' }),
    )
    expect(res.statusCode).toBe(200)
    expect(res.headers['Content-Type']).toBe('audio/wav')
  })

  it('mengganti voice tidak dikenal dengan default server', async () => {
    synthesizeSpeech.mockResolvedValueOnce({
      wav: Buffer.from('wav-data'),
      mimeType: 'audio/wav',
    })
    const res = createRes()

    await handleTts(() => 'secret-key', createReq({ text: 'Halo', voice: 'UnknownVoice' }), res)

    expect(synthesizeSpeech).toHaveBeenCalledWith(
      expect.objectContaining({ voice: 'Sulafat' }),
    )
  })
})

import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchSpeech, hashText } from './ttsClient'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('hashText', () => {
  it('deterministik untuk teks sama', () => {
    expect(hashText('halo dunia')).toBe(hashText('halo dunia'))
  })

  it('berbeda untuk teks berbeda', () => {
    expect(hashText('halo')).not.toBe(hashText('dunia'))
  })

  it('mengembalikan string non-kosong', () => {
    expect(hashText('TechNova').length).toBeGreaterThan(0)
  })
})

describe('fetchSpeech', () => {
  it('mengirim voice pilihan ke endpoint internal', async () => {
    const fetchMock = vi.fn(async () => new Response(new Blob(['wav'])))
    vi.stubGlobal('fetch', fetchMock)

    await fetchSpeech('Halo dunia', undefined, 'Kore')

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/tts',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ text: 'Halo dunia', voice: 'Kore' }),
      }),
    )
  })
})

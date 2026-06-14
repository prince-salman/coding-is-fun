import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MAX_TTS_TEXT_CHARS, useTextToSpeech } from './useTextToSpeech'
import { checkTtsAvailable, fetchSpeech } from '../services/ttsClient'
import { extractPageText } from '../utils/extractPageText'

vi.mock('../services/ttsClient', () => ({
  checkTtsAvailable: vi.fn(async () => true),
  fetchSpeech: vi.fn(async () => new Blob(['wav'], { type: 'audio/wav' })),
  hashText: (text: string) => `hash:${text}`,
}))

vi.mock('../utils/extractPageText', () => ({
  extractPageText: vi.fn(() => 'Teks tugas'),
}))

class FakeAudio {
  ended = false
  src = ''
  currentTime = 0
  duration = 0
  onended: null | (() => void) = null
  onerror: null | (() => void) = null
  onplay: null | (() => void) = null
  onpause: null | (() => void) = null
  ontimeupdate: null | (() => void) = null
  ondurationchange: null | (() => void) = null
  constructor(src: string) {
    this.src = src
  }
  play() {
    this.onplay?.()
    return Promise.resolve()
  }
  pause() {
    this.onpause?.()
  }
}

let lastAudio: FakeAudio | null = null

beforeEach(() => {
  vi.clearAllMocks()
  lastAudio = null
  vi.stubGlobal(
    'Audio',
    vi.fn((src: string) => {
      const audio = new FakeAudio(src)
      lastAudio = audio
      return audio
    }),
  )
  vi.stubGlobal('URL', {
    createObjectURL: vi.fn(() => 'blob:tts'),
    revokeObjectURL: vi.fn(),
  })
})

describe('useTextToSpeech', () => {
  it('menyimpan voice pilihan ke localStorage', async () => {
    const { result } = renderHook(() => useTextToSpeech())
    await waitFor(() => expect(checkTtsAvailable).toHaveBeenCalled())

    act(() => result.current.setVoice('Kore'))

    expect(result.current.selectedVoice).toBe('Kore')
    expect(localStorage.getItem('codingisfun:ttsVoice')).toBe('Kore')
  })

  it('memuat voice tersimpan yang valid dari localStorage', async () => {
    localStorage.setItem('codingisfun:ttsVoice', 'Puck')

    const { result } = renderHook(() => useTextToSpeech())
    await waitFor(() => expect(checkTtsAvailable).toHaveBeenCalled())

    expect(result.current.selectedVoice).toBe('Puck')
  })

  it('memakai scope ketika membacakan bagian tertentu', async () => {
    const { result } = renderHook(() => useTextToSpeech())

    await act(async () => {
      await result.current.play('task')
    })

    expect(extractPageText).toHaveBeenCalledWith('task')
    expect(fetchSpeech).toHaveBeenCalledWith('Teks tugas', expect.any(AbortSignal), 'Sulafat')
  })

  it('melacak durasi dan progress audio', async () => {
    const { result } = renderHook(() => useTextToSpeech())

    await act(async () => {
      await result.current.play('task')
    })
    act(() => {
      if (!lastAudio) throw new Error('Audio belum dibuat')
      lastAudio.duration = 120
      lastAudio.currentTime = 30
      lastAudio.ondurationchange?.()
      lastAudio.ontimeupdate?.()
    })

    expect(result.current.duration).toBe(120)
    expect(result.current.currentTime).toBe(30)
    expect(result.current.progress).toBe(25)
  })

  it('bisa seek audio yang sedang tersedia', async () => {
    const { result } = renderHook(() => useTextToSpeech())

    await act(async () => {
      await result.current.play('task')
    })
    act(() => result.current.seek(45))

    expect(lastAudio?.currentTime).toBe(45)
    expect(result.current.currentTime).toBe(45)
  })

  it('membatasi teks terlalu panjang sebelum request TTS', async () => {
    vi.mocked(extractPageText).mockReturnValueOnce('a'.repeat(MAX_TTS_TEXT_CHARS + 100))
    const { result } = renderHook(() => useTextToSpeech())

    await act(async () => {
      await result.current.play('page')
    })

    expect(vi.mocked(fetchSpeech).mock.calls[0][0]).toHaveLength(MAX_TTS_TEXT_CHARS)
    expect(result.current.notice).toContain('dipersingkat')
  })
})

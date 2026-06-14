import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Stub fetch agar health-check TTS (/api/tts/health) tidak menyentuh jaringan
// saat pengujian. Default: TTS dianggap tidak tersedia.
vi.stubGlobal(
  'fetch',
  vi.fn(async (input: RequestInfo | URL) => {
    const url = typeof input === 'string' ? input : input.toString()
    if (url.includes('/api/tts/health')) {
      return new Response(JSON.stringify({ available: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return new Response('{}', { status: 200 })
  }),
)

// jsdom kadang tidak menyediakan localStorage (tergantung origin). Sediakan polyfill.
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map<string, string>()
  const localStorageMock: Storage = {
    get length() {
      return store.size
    },
    clear: () => store.clear(),
    getItem: (key) => store.get(key) ?? null,
    key: (index) => Array.from(store.keys())[index] ?? null,
    removeItem: (key) => void store.delete(key),
    setItem: (key, value) => void store.set(key, String(value)),
  }
  vi.stubGlobal('localStorage', localStorageMock)
}

afterEach(() => {
  cleanup()
  localStorage.clear()
})

// jsdom tidak mengimplementasikan Web Audio & Web Speech API.
// Stub agar hook audio/speech tidak melempar error saat pengujian.
class FakeAudioContext {
  state = 'running'
  currentTime = 0
  destination = {}
  resume() {}
  createOscillator() {
    return {
      type: '',
      frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {}, value: 0 },
      connect() {},
      start() {},
      stop() {},
    }
  }
  createGain() {
    return {
      gain: {
        setValueAtTime() {},
        linearRampToValueAtTime() {},
        exponentialRampToValueAtTime() {},
      },
      connect() {},
    }
  }
}

vi.stubGlobal('AudioContext', FakeAudioContext)
vi.stubGlobal('webkitAudioContext', FakeAudioContext)

vi.stubGlobal('speechSynthesis', {
  cancel() {},
  speak() {},
  getVoices: () => [],
  onvoiceschanged: null,
})

vi.stubGlobal(
  'SpeechSynthesisUtterance',
  class {
    text = ''
    lang = ''
    pitch = 1
    rate = 1
    voice = null
    constructor(text?: string) {
      this.text = text ?? ''
    }
  },
)

import { describe, it, expect } from 'vitest'
import { chunkText, pcmToWav, buildVoiceInstruction } from './tts-core.js'

describe('chunkText', () => {
  it('mengembalikan array kosong untuk teks kosong', () => {
    expect(chunkText('')).toEqual([])
    expect(chunkText('   ')).toEqual([])
  })

  it('teks pendek tetap satu chunk', () => {
    expect(chunkText('Halo dunia.')).toEqual(['Halo dunia.'])
  })

  it('memecah teks panjang pada batas kalimat', () => {
    const sentence = 'Ini kalimat contoh yang cukup panjang. '
    const long = sentence.repeat(100) // jauh di atas batas
    const chunks = chunkText(long, 200)
    expect(chunks.length).toBeGreaterThan(1)
    for (const c of chunks) {
      expect(c.length).toBeLessThanOrEqual(200)
    }
  })

  it('memotong paksa kalimat tunggal yang kelewat panjang', () => {
    const huge = 'a'.repeat(500)
    const chunks = chunkText(huge, 100)
    expect(chunks.length).toBe(5)
    expect(chunks.every((c) => c.length <= 100)).toBe(true)
  })
})

describe('pcmToWav', () => {
  it('menambahkan header WAV 44 byte di depan PCM', () => {
    const pcm = Buffer.from([1, 2, 3, 4])
    const wav = pcmToWav(pcm, 24000)
    expect(wav.length).toBe(44 + pcm.length)
    expect(wav.toString('ascii', 0, 4)).toBe('RIFF')
    expect(wav.toString('ascii', 8, 12)).toBe('WAVE')
    expect(wav.toString('ascii', 36, 40)).toBe('data')
  })

  it('menulis sample rate ke header', () => {
    const wav = pcmToWav(Buffer.from([0, 0]), 16000)
    expect(wav.readUInt32LE(24)).toBe(16000)
  })
})

describe('buildVoiceInstruction', () => {
  it('menyertakan teks asli & instruksi Bahasa Indonesia', () => {
    const out = buildVoiceInstruction('Selamat datang')
    expect(out).toContain('Selamat datang')
    expect(out).toContain('Bahasa Indonesia')
    expect(out.toLowerCase()).toContain('jangan')
  })
})

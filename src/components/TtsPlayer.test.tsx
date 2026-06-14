import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TtsPlayer } from './TtsPlayer'

const setVoice = vi.fn()
const play = vi.fn()

vi.mock('../hooks/useTextToSpeech', () => ({
  useTextToSpeech: () => ({
    status: 'ready',
    isAvailable: true,
    error: null,
    notice: null,
    currentTime: 30,
    duration: 120,
    progress: 25,
    selectedVoice: 'Sulafat',
    voices: [
      { name: 'Sulafat', label: 'Sulafat - hangat' },
      { name: 'Kore', label: 'Kore - jelas' },
    ],
    setVoice,
    play,
    pause: vi.fn(),
    resume: vi.fn(),
    stop: vi.fn(),
    seek: vi.fn(),
    retry: vi.fn(),
  }),
}))

describe('TtsPlayer', () => {
  it('menampilkan pilihan voice Gemini TTS', () => {
    render(<TtsPlayer />)

    const select = screen.getByLabelText('Pilih suara TTS')
    expect(select).toHaveValue('Sulafat')

    fireEvent.change(select, { target: { value: 'Kore' } })
    expect(setVoice).toHaveBeenCalledWith('Kore')
  })

  it('menyediakan tombol bacakan per bagian', () => {
    render(<TtsPlayer />)

    fireEvent.click(screen.getByRole('button', { name: 'Bacakan tugas' }))
    fireEvent.click(screen.getByRole('button', { name: 'Bacakan materi' }))
    fireEvent.click(screen.getByRole('button', { name: 'Bacakan feedback' }))

    expect(play).toHaveBeenNthCalledWith(1, 'task')
    expect(play).toHaveBeenNthCalledWith(2, 'lesson')
    expect(play).toHaveBeenNthCalledWith(3, 'feedback')
  })

  it('menampilkan progress audio dan durasi', () => {
    render(<TtsPlayer />)

    expect(screen.getByRole('progressbar', { name: 'Progress audio TTS' })).toHaveAttribute(
      'aria-valuenow',
      '25',
    )
    expect(screen.getByText('0:30 / 2:00')).toBeInTheDocument()
  })
})

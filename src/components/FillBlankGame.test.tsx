import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FillBlankGame } from './FillBlankGame'
import type { FillBlankQuestion } from '../data/ilmuDasar'

const QUESTIONS: FillBlankQuestion[] = [
  {
    id: 'q1',
    prompt: 'Pilih tag heading.',
    template: '<___>Judul</___>',
    answer: 'h1',
    choices: ['h1', 'p', 'div'],
    explanation: 'h1 adalah heading utama.',
  },
  {
    id: 'q2',
    prompt: 'Pilih atribut tautan.',
    template: '<a ___="#">x</a>',
    answer: 'href',
    choices: ['href', 'src'],
    explanation: 'href menentukan tujuan.',
  },
]

describe('FillBlankGame', () => {
  it('memberi XP saat memilih jawaban benar', () => {
    const onCorrect = vi.fn()
    render(<FillBlankGame questions={QUESTIONS} onCorrect={onCorrect} />)

    fireEvent.click(screen.getByRole('button', { name: 'h1' }))
    expect(onCorrect).toHaveBeenCalledWith(25)
    expect(screen.getByText(/Benar!/i)).toBeInTheDocument()
  })

  it('menampilkan jawaban benar ketika user salah, tanpa XP', () => {
    const onCorrect = vi.fn()
    render(<FillBlankGame questions={QUESTIONS} onCorrect={onCorrect} />)

    fireEvent.click(screen.getByRole('button', { name: 'p' }))
    expect(onCorrect).not.toHaveBeenCalled()
    expect(screen.getByText(/Belum tepat/i)).toBeInTheDocument()
  })

  it('tidak memberi XP dua kali untuk soal yang sama', () => {
    const onCorrect = vi.fn()
    render(<FillBlankGame questions={QUESTIONS} onCorrect={onCorrect} />)

    fireEvent.click(screen.getByRole('button', { name: 'h1' }))
    // Lanjut ke soal berikutnya, lalu kembali (2 soal → wrap).
    fireEvent.click(screen.getByRole('button', { name: /Soal Berikutnya/i }))
    fireEvent.click(screen.getByRole('button', { name: 'href' }))
    fireEvent.click(screen.getByRole('button', { name: /Soal Pertama|Ulangi/i }))
    // Jawab q1 benar lagi → tidak menambah XP lagi.
    fireEvent.click(screen.getByRole('button', { name: 'h1' }))
    expect(onCorrect).toHaveBeenCalledTimes(2)
  })
})

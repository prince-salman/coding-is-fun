import { useMemo, useState } from 'react'
import { CheckCircle, XCircle, Trophy, ArrowRight } from 'lucide-react'
import type { FillBlankQuestion } from '../data/ilmuDasar'

interface FillBlankGameProps {
  questions: FillBlankQuestion[]
  onCorrect: (xp: number) => void
}

const XP_PER_CORRECT = 25

/** Urutkan choices secara stabil per pertanyaan (tanpa Math.random). */
function orderedChoices(q: FillBlankQuestion): string[] {
  const seed = q.id.charCodeAt(q.id.length - 1)
  return [...q.choices].sort((a, b) => {
    const ha = (a.length * 31 + seed) % 7
    const hb = (b.length * 31 + seed) % 7
    return ha - hb || a.localeCompare(b)
  })
}

export function FillBlankGame({ questions, onCorrect }: FillBlankGameProps) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set())

  const question = questions[index]
  const choices = useMemo(() => orderedChoices(question), [question])
  const isAnswered = selected !== null
  const isCorrect = selected === question.answer
  const isLast = index === questions.length - 1
  const allDone = answeredIds.size === questions.length

  const handleChoose = (choice: string) => {
    if (isAnswered) return
    setSelected(choice)
    if (choice === question.answer && !answeredIds.has(question.id)) {
      setAnsweredIds((prev) => new Set(prev).add(question.id))
      onCorrect(XP_PER_CORRECT)
    }
  }

  const handleNext = () => {
    setSelected(null)
    setIndex((i) => (i + 1) % questions.length)
  }

  const renderTemplate = () => {
    const parts = question.template.split('___')
    return (
      <code className="fbg-code">
        {parts[0]}
        <span className={`fbg-blank ${isAnswered ? (isCorrect ? 'filled' : 'wrong') : ''}`}>
          {isAnswered ? selected : '___'}
        </span>
        {parts[1]}
      </code>
    )
  }

  return (
    <section className="fill-blank-game" aria-label="Mini-game lengkapi kode" lang="id">
      <div className="fbg-header">
        <span className="fbg-title">
          <Trophy size={16} aria-hidden="true" /> Mini-Game: Lengkapi Kode
        </span>
        <span className="fbg-progress">
          Soal {index + 1}/{questions.length} · Benar {answeredIds.size}
        </span>
      </div>

      <p className="fbg-prompt">{question.prompt}</p>

      <div className="fbg-template">{renderTemplate()}</div>

      <div className="fbg-choices" role="group" aria-label="Pilihan jawaban">
        {choices.map((choice) => {
          const showCorrect = isAnswered && choice === question.answer
          const showWrong = isAnswered && choice === selected && !isCorrect
          return (
            <button
              key={choice}
              type="button"
              className={`fbg-chip ${showCorrect ? 'correct' : ''} ${showWrong ? 'incorrect' : ''}`}
              onClick={() => handleChoose(choice)}
              disabled={isAnswered}
            >
              {choice}
            </button>
          )
        })}
      </div>

      {isAnswered && (
        <div
          className={`fbg-feedback ${isCorrect ? 'ok' : 'no'}`}
          role="status"
          aria-live="polite"
        >
          {isCorrect ? (
            <>
              <CheckCircle size={14} aria-hidden="true" /> Benar! +{XP_PER_CORRECT} XP.{' '}
              {question.explanation}
            </>
          ) : (
            <>
              <XCircle size={14} aria-hidden="true" /> Belum tepat. Jawaban yang benar:{' '}
              <strong>{question.answer}</strong>. {question.explanation}
            </>
          )}
          <button className="vscode-btn primary-btn fbg-next" onClick={handleNext}>
            {allDone ? 'Ulangi' : isLast ? 'Soal Pertama' : 'Soal Berikutnya'}{' '}
            <ArrowRight size={14} aria-hidden="true" style={{ verticalAlign: 'middle' }} />
          </button>
        </div>
      )}

      {allDone && (
        <p className="fbg-complete" role="status">
          🎉 Semua soal sudah kamu jawab benar! Total bonus {answeredIds.size * XP_PER_CORRECT} XP.
        </p>
      )}
    </section>
  )
}

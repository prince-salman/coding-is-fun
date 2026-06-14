import { useEffect, useRef } from 'react'
import { Target, Play } from 'lucide-react'
import type { Module } from '../types'

interface TaskModalProps {
  module: Module
  description: string
  isExam: boolean
  onClose: () => void
}

export function TaskModal({ module, description, isExam, onClose }: TaskModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key !== 'Tab') return
      const modal = closeRef.current?.closest('.task-modal')
      const focusable = Array.from(
        modal?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((el) => !el.hasAttribute('disabled'))
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="task-modal-overlay" onClick={onClose}>
      <div
        className={`task-modal ${isExam ? 'is-exam' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        lang="id"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="task-modal-header">
          <span className="task-modal-badge">
            <Target size={14} aria-hidden="true" />
            {isExam ? 'UJIAN' : 'TUGAS'}
          </span>
          <span className="task-modal-sender">
            {module.sender.name} · {module.sender.role}
          </span>
        </div>

        <h2 id="task-modal-title" className="task-modal-title">
          {module.title}
        </h2>

        <div className="task-modal-body">
          {description.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        <button ref={closeRef} className="vscode-btn primary-btn" onClick={onClose}>
          <Play
            size={14}
            aria-hidden="true"
            style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 6 }}
          />
          Mulai Kerjakan
        </button>
      </div>
    </div>
  )
}

import { CheckCircle, ArrowRight, ClipboardList } from 'lucide-react'
import type { Module } from '../types'

interface MentorPanelProps {
  module: Module
  description: string
  successMessage: string
  isSuccess: boolean
  isExam: boolean
  timestamp: string
  onNext: () => void
  onShowTask: () => void
}

export function MentorPanel({
  module,
  description,
  successMessage,
  isSuccess,
  isExam,
  timestamp,
  onNext,
  onShowTask,
}: MentorPanelProps) {
  return (
    <div className="bottom-panel">
      <div className="panel-tabs" role="tablist" aria-label="Panel bawah">
        <span className="panel-tab">PROBLEMS</span>
        <span className="panel-tab active">TERMINAL</span>
        <span className="panel-tab">OUTPUT</span>
        <span className="panel-tab">DEBUG CONSOLE</span>
        <div className="panel-actions">
          <span className="action-icon" aria-hidden="true">^</span>
          <span className="action-icon" aria-hidden="true">x</span>
        </div>
      </div>
      <div className="terminal-content">
        <div className="mentor-message">
          <div className="mentor-header">
            <span className="mentor-avatar" aria-hidden="true">
              {module.sender.avatar}
            </span>
            <span className="mentor-name">
              {module.sender.name} ({module.sender.role})
            </span>
            <span className="time-stamp">- {timestamp}</span>
            <button className="show-task-btn" onClick={onShowTask}>
              <ClipboardList
                size={12}
                aria-hidden="true"
                style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 4 }}
              />
              Lihat Tugas
            </button>
          </div>
          <div className="terminal-text typewriter" lang="id" aria-live="polite">
            {description}
          </div>

          {!isSuccess && (
            <div className="terminal-hint" role="note" lang="id">
              Belum cocok. Cek kembali tag, tanda kurung, dan instruksi tugas. Preview akan
              berubah saat kode valid.
            </div>
          )}

          {isSuccess && (
            <div
              className="terminal-success animate-fade-in"
              role="status"
              aria-live="assertive"
              lang="id"
            >
              <span className="success-icon">
                <CheckCircle
                  size={14}
                  aria-hidden="true"
                  style={{ display: 'inline-block', verticalAlign: 'middle' }}
                />
              </span>{' '}
              {successMessage}
              <button className="vscode-btn primary-btn mt-2" onClick={onNext}>
                {isExam
                  ? 'Jalankan Skrip Evaluasi Selanjutnya'
                  : 'Lanjut ke Baris Berikutnya'}{' '}
                <ArrowRight
                  size={14}
                  aria-hidden="true"
                  style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 4 }}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { useState, type FormEvent } from 'react'
import { Play } from 'lucide-react'

interface OnboardingProps {
  isVoiceEnabled: boolean
  onVoiceChange: (enabled: boolean) => void
  onStart: (name: string, level: string) => void
}

export function Onboarding({
  isVoiceEnabled,
  onVoiceChange,
  onStart,
}: OnboardingProps) {
  const [name, setName] = useState('')
  const [level, setLevel] = useState('beginner')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed === '') return
    onStart(trimmed, level)
  }

  return (
    <main className="onboarding-container vscode-theme" lang="id">
      <div className="onboarding-card">
        <div className="onboarding-logo">
          Tech<span>Nova</span>
        </div>
        <h1>Selamat Datang di VS Code</h1>
        <p>Anda baru saja direkrut sebagai Junior Developer. Siapa nama Anda?</p>
        <form onSubmit={handleSubmit} className="onboarding-form">
          <label htmlFor="player-name" className="sr-only">
            Nama Anda
          </label>
          <input
            id="player-name"
            type="text"
            placeholder="Masukkan nama Anda..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            required
          />
          <div className="voice-toggle-onboard">
            <label>
              <input
                type="checkbox"
                checked={isVoiceEnabled}
                onChange={(e) => onVoiceChange(e.target.checked)}
              />{' '}
              Aktifkan Suara Mentor (Auto-Play)
            </label>
          </div>
          <label className="onboarding-select">
            <span>Level awal</span>
            <select
              aria-label="Level awal"
              value={level}
              onChange={(event) => setLevel(event.target.value)}
            >
              <option value="beginner">beginner</option>
              <option value="intermediate">intermediate</option>
              <option value="advanced">advanced</option>
            </select>
          </label>
          <button type="submit">
            <Play
              size={16}
              aria-hidden="true"
              style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 8 }}
            />{' '}
            Buka Workspace
          </button>
        </form>
      </div>
    </main>
  )
}

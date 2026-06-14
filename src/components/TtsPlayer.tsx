import { Volume2, Play, Pause, Square, Loader2, AlertTriangle, RotateCw } from 'lucide-react'
import { useTextToSpeech, type TtsStatus } from '../hooks/useTextToSpeech'

const STATUS_LABEL: Record<TtsStatus, string> = {
  ready: 'Siap',
  loading: 'Membuat audio...',
  starting: 'Audio siap, memutar...',
  playing: 'Sedang membacakan',
  paused: 'Dijeda',
  stopped: 'Selesai',
  error: 'Terjadi kesalahan',
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const rest = Math.floor(seconds % 60)
  return `${minutes}:${String(rest).padStart(2, '0')}`
}

export function TtsPlayer() {
  const {
    status,
    isAvailable,
    error,
    notice,
    currentTime,
    duration,
    progress,
    selectedVoice,
    voices,
    setVoice,
    play,
    pause,
    resume,
    stop,
    seek,
    retry,
  } = useTextToSpeech()

  const isLoading = status === 'loading'
  const isStarting = status === 'starting'
  const isPlaying = status === 'playing'
  const isPaused = status === 'paused'
  const isBusy = isLoading || isStarting

  // Fallback: server belum punya API key.
  if (isAvailable === false) {
    return (
      <div className="tts-player tts-disabled" role="region" aria-label="Pembaca halaman">
        <AlertTriangle size={16} aria-hidden="true" />
        <span className="tts-status-text">
          Fitur suara nonaktif - <code>GEMINI_API_KEY</code> belum diatur di server.
        </span>
      </div>
    )
  }

  return (
    <div className="tts-player" role="region" aria-label="Pembaca halaman (Text to Speech)">
      <span className="tts-title">
        <Volume2 size={16} aria-hidden="true" /> Dengarkan Web
      </span>

      <span className="tts-status-text" aria-live="polite">
        {status === 'error' && error ? error : STATUS_LABEL[status]}
      </span>
      {notice && <span className="tts-notice">{notice}</span>}

      <label className="tts-voice-picker">
        <span>Suara</span>
        <select
          aria-label="Pilih suara TTS"
          value={selectedVoice}
          onChange={(event) => setVoice(event.target.value)}
          disabled={isBusy || isPlaying || isPaused}
        >
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.label}
            </option>
          ))}
        </select>
      </label>

      <div className="tts-controls">
        {!isPlaying && !isPaused && status !== 'error' && (
          <button
            className="tts-btn primary"
            onClick={() => void play('page')}
            disabled={isBusy || isAvailable === null}
            aria-label="Bacakan halaman ini"
          >
            {isBusy ? (
              <Loader2 size={16} aria-hidden="true" className="tts-spin" />
            ) : (
              <Play size={16} aria-hidden="true" />
            )}
            <span>{isBusy ? 'Memuat' : 'Dengarkan'}</span>
          </button>
        )}

        {!isPlaying && !isPaused && status !== 'error' && (
          <div className="tts-scope-controls" aria-label="Bacakan bagian tertentu">
            <button
              className="tts-btn compact"
              onClick={() => void play('task')}
              disabled={isBusy || isAvailable === null}
              aria-label="Bacakan tugas"
            >
              Tugas
            </button>
            <button
              className="tts-btn compact"
              onClick={() => void play('lesson')}
              disabled={isBusy || isAvailable === null}
              aria-label="Bacakan materi"
            >
              Materi
            </button>
            <button
              className="tts-btn compact"
              onClick={() => void play('feedback')}
              disabled={isBusy || isAvailable === null}
              aria-label="Bacakan feedback"
            >
              Feedback
            </button>
          </div>
        )}

        {isPlaying && (
          <button className="tts-btn" onClick={pause} aria-label="Jeda pembacaan">
            <Pause size={16} aria-hidden="true" />
            <span>Pause</span>
          </button>
        )}

        {isPaused && (
          <button className="tts-btn primary" onClick={resume} aria-label="Lanjutkan pembacaan">
            <Play size={16} aria-hidden="true" />
            <span>Lanjut</span>
          </button>
        )}

        {(isPlaying || isPaused) && (
          <button className="tts-btn" onClick={stop} aria-label="Hentikan pembacaan">
            <Square size={14} aria-hidden="true" />
            <span>Stop</span>
          </button>
        )}

        {status === 'error' && (
          <button className="tts-btn primary" onClick={retry} aria-label="Coba lagi membacakan halaman">
            <RotateCw size={16} aria-hidden="true" />
            <span>Coba Lagi</span>
          </button>
        )}
      </div>

      <div className="tts-progress">
        <div
          className="tts-progress-bar"
          role="progressbar"
          aria-label="Progress audio TTS"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="tts-time-row">
          <span>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <input
            aria-label="Geser posisi audio TTS"
            type="range"
            min={0}
            max={duration || 0}
            step={1}
            value={Math.min(currentTime, duration || currentTime)}
            onChange={(event) => seek(Number(event.target.value))}
            disabled={duration <= 0}
          />
        </div>
      </div>
    </div>
  )
}

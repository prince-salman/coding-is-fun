import { useMemo, useState } from 'react'
import { ChevronDown, Volume2, VolumeX, FolderClosed, BookOpen } from 'lucide-react'
import type { Chapter, Language, Rank } from '../types'

export type AppView = 'curriculum' | 'ilmu-dasar'

interface SidebarProps {
  chapters: Chapter[]
  chapterIndex: number
  moduleIndex: number
  view: AppView
  onNavigate: (chapterIndex: number, moduleIndex: number) => void
  onOpenIlmuDasar: () => void
  playerName: string
  rank: Rank
  xp: number
  totalChapters: number
  isVoiceEnabled: boolean
  onToggleVoice: () => void
  voices: SpeechSynthesisVoice[]
  selectedVoiceURI: string | null
  onSelectVoice: (uri: string) => void
  completedModuleIds: string[]
  skillLevel: string
  recommendedModuleId: string
  hardModuleIds: string[]
}

const iconStyle = { marginRight: 4, display: 'inline-block', verticalAlign: 'middle' }

const FILE_ICON: Record<Language, { label: string; className: string }> = {
  markup: { label: '5', className: 'html-icon' },
  css: { label: '#', className: 'css-icon' },
  javascript: { label: 'JS', className: 'js-icon' },
}

export function Sidebar({
  chapters,
  chapterIndex,
  moduleIndex,
  view,
  onNavigate,
  onOpenIlmuDasar,
  playerName,
  rank,
  xp,
  totalChapters,
  isVoiceEnabled,
  onToggleVoice,
  voices,
  selectedVoiceURI,
  onSelectVoice,
  completedModuleIds,
  skillLevel,
  recommendedModuleId,
  hardModuleIds,
}: SidebarProps) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const normalizedQuery = query.trim().toLowerCase()
  const visibleChapters = useMemo(
    () =>
      chapters
        .map((chapter) => ({
          ...chapter,
          modules: chapter.modules.filter((mod) => {
            const isCompleted = completedModuleIds.includes(mod.id)
            const isHard = hardModuleIds.includes(mod.id)
            const matchesQuery = mod.title.toLowerCase().includes(normalizedQuery)
            const matchesFilter =
              filter === 'all' ||
              (filter === 'completed' && isCompleted) ||
              (filter === 'incomplete' && !isCompleted) ||
              (filter === 'hard' && isHard)
            return matchesQuery && matchesFilter
          }),
        }))
        .filter((chapter) => chapter.modules.length > 0),
    [chapters, completedModuleIds, filter, hardModuleIds, normalizedQuery],
  )

  return (
    <nav className="sidebar" aria-label="Explorer dan progres karier">
      <div className="sidebar-header">EXPLORER</div>
      <div className="sidebar-section">
        <div className="section-title">
          <ChevronDown size={12} style={iconStyle} aria-hidden="true" /> TECHNOVA_PROJECT
        </div>
        <div className="module-tools">
          <label>
            <span>Cari modul</span>
            <input
              aria-label="Cari modul"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari lesson..."
            />
          </label>
          <label>
            <span>Filter modul</span>
            <select
              aria-label="Filter modul"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="all">Semua</option>
              <option value="incomplete">Belum selesai</option>
              <option value="completed">Selesai</option>
              <option value="hard">Sulit</option>
            </select>
          </label>
        </div>
        {visibleChapters.length === 0 && <p className="empty-tree">Tidak ada modul.</p>}
        {visibleChapters.map((chapter) => {
          const realChapterIndex = chapters.findIndex(
            (item) => item.chapterId === chapter.chapterId,
          )
          return (
            <div className="chapter-group" key={chapter.chapterId}>
              <div className="chapter-label">{chapter.chapterTitle}</div>
              <ul className="file-tree" aria-label={chapter.chapterTitle}>
                {chapter.modules.map((mod) => {
                  const realModuleIndex = chapters[realChapterIndex].modules.findIndex(
                    (item) => item.id === mod.id,
                  )
                  const icon = FILE_ICON[mod.language]
                  const isActive =
                    view === 'curriculum' &&
                    realChapterIndex === chapterIndex &&
                    realModuleIndex === moduleIndex
                  const isCompleted = completedModuleIds.includes(mod.id)
                  const isRecommended = mod.id === recommendedModuleId
                  return (
                    <li key={mod.id}>
                      <button
                        type="button"
                        className={`tree-item ${isActive ? 'active' : ''}`}
                        aria-current={isActive ? 'true' : undefined}
                        aria-label={`${mod.title}${mod.type === 'ujian' ? ' Ujian' : ''}${isCompleted ? ' Selesai' : ''}`}
                        onClick={() => onNavigate(realChapterIndex, realModuleIndex)}
                      >
                        <span className={`file-icon ${icon.className}`} aria-hidden="true">
                          {icon.label}
                        </span>
                        <span className="tree-item-label">
                          {mod.title}
                          {mod.type === 'ujian' ? ' (Ujian)' : ''}
                          {isCompleted ? ' - Selesai' : ''}
                          {isRecommended ? ' - Rekomendasi' : ''}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}

        <div className="chapter-group">
          <div className="chapter-label">Materi Tambahan</div>
          <ul className="file-tree" aria-label="Materi tambahan">
            <li>
              <button
                type="button"
                className={`tree-item ${view === 'ilmu-dasar' ? 'active' : ''}`}
                aria-current={view === 'ilmu-dasar' ? 'true' : undefined}
                onClick={onOpenIlmuDasar}
              >
                <FolderClosed
                  size={14}
                  aria-hidden="true"
                  style={{ color: '#dcb67a', flexShrink: 0 }}
                />
                <span className="tree-item-label">
                  <BookOpen
                    size={11}
                    aria-hidden="true"
                    style={{ verticalAlign: 'middle', marginRight: 4 }}
                  />
                  Ilmu Dasar (interaktif)
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="sidebar-section progress-section">
        <div className="section-title">
          <ChevronDown size={12} style={iconStyle} aria-hidden="true" /> KARIER DEVELOPER
        </div>
        <div className="stats-box">
          <p>
            User: <strong>{playerName}</strong>
          </p>
          <p>Level: {skillLevel}</p>
          <p>
            Role: <span className="rank-badge">{rank}</span>
          </p>
          <p>
            XP: <strong>{xp}</strong> / 2000
          </p>
          <p>
            Bab:{' '}
            <strong>
              {chapterIndex + 1}/{totalChapters}
            </strong>
          </p>
        </div>
        <button
          className="voice-toggle-btn"
          onClick={onToggleVoice}
          aria-pressed={isVoiceEnabled}
        >
          {isVoiceEnabled ? (
            <>
              <Volume2 size={12} style={iconStyle} aria-hidden="true" /> Suara: ON
            </>
          ) : (
            <>
              <VolumeX size={12} style={iconStyle} aria-hidden="true" /> Suara: OFF
            </>
          )}
        </button>
        <div className="voice-picker">
          <label htmlFor="voice-select">Pilih suara mentor</label>
          <select
            id="voice-select"
            value={selectedVoiceURI ?? voices[0]?.voiceURI ?? ''}
            onChange={(e) => onSelectVoice(e.target.value)}
            disabled={!isVoiceEnabled || voices.length === 0}
          >
            {voices.length === 0 && <option value="">Suara browser default</option>}
            {voices.map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </div>
      </div>
    </nav>
  )
}

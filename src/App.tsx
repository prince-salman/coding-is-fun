import { useCallback, useEffect, useState, useMemo, type MouseEvent as ReactMouseEvent } from 'react'
import './App.css'
import { CURRICULUM } from './data'
import { FLAPPY_BIRD_HTML } from './data/flappyBirdHtml'
import { useAudio } from './hooks/useAudio'
import { useSpeech } from './hooks/useSpeech'
import { useGameProgress, getRank } from './hooks/useGameProgress'
import { useIdle } from './hooks/useIdle'
import { Onboarding } from './components/Onboarding'
import { VSCodeLayout, type ActivityView } from './components/VSCodeLayout'
import { Sidebar, type AppView } from './components/Sidebar'
import { EditorPane } from './components/EditorPane'
import { MentorPanel } from './components/MentorPanel'
import { PreviewPane } from './components/PreviewPane'
import { TaskModal } from './components/TaskModal'
import { IdleBanner } from './components/IdleBanner'
import { IlmuDasar } from './components/IlmuDasar'
import { CertificateModal } from './components/CertificateModal'
import { formatCode } from './utils/formatCode'

const IDLE_DELAY_MS = 5 * 60 * 1000
type ThemeMode = 'dark' | 'light' | 'high-contrast'
type MobilePanel = 'sidebar' | 'editor' | 'preview'
type DraftMap = Record<string, string>
type ModuleAnalytics = Record<string, { attempts: number; seconds: number }>
type SnapshotMap = Record<string, { code: string; createdAt: string }[]>
type AppSettings = {
  fontSize: number
  reduceMotion: boolean
  defaultVoiceURI: string
  challengeTimer: boolean
}

const DRAFT_KEY = 'codingisfun:drafts'
const ANALYTICS_KEY = 'codingisfun:analytics'
const LEVEL_KEY = 'codingisfun:skillLevel'
const SETTINGS_KEY = 'codingisfun:settings'
const SNAPSHOT_KEY = 'codingisfun:snapshots'
const STREAK_KEY = 'codingisfun:streakDays'
const PRACTICE_LAB_KEY = 'codingisfun:practiceLab'
const DAILY_REWARD_KEY = 'codingisfun:practiceDailyReward'
const DEFAULT_SETTINGS: AppSettings = {
  fontSize: 15,
  reduceMotion: false,
  defaultVoiceURI: '',
  challengeTimer: false,
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJson<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore localStorage failures */
  }
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10)
}

function findModulePosition(moduleId: string) {
  for (let chapterIndex = 0; chapterIndex < CURRICULUM.length; chapterIndex += 1) {
    const moduleIndex = CURRICULUM[chapterIndex].modules.findIndex(
      (module) => module.id === moduleId,
    )
    if (moduleIndex >= 0) return { chapterIndex, moduleIndex }
  }
  return null
}

function readFileText(file: File) {
  if ('text' in file && typeof file.text === 'function') return file.text()
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}

function getRecommendedModuleId(level: string, completedModuleIds: string[]) {
  const modules = CURRICULUM.flatMap((chapter) => chapter.modules)
  const incomplete = modules.filter((module) => !completedModuleIds.includes(module.id))
  if (level === 'advanced') {
    return incomplete.find((module) => module.type === 'ujian')?.id ?? incomplete[0]?.id ?? modules[0].id
  }
  if (level === 'intermediate') {
    return (
      incomplete.find((module) => module.language === 'css')?.id ??
      incomplete.find((module) => module.language === 'javascript')?.id ??
      incomplete[0]?.id ??
      modules[0].id
    )
  }
  return incomplete[0]?.id ?? modules[0].id
}

function getModuleSolution(moduleId: string): string {
  const solutions: Record<string, string> = {
    '1.1': '<h1>Halo Dunia</h1>',
    '1.2': '<p>Ini adalah paragraf contoh untuk website klien.</p>',
    '1.3': '<p>Teks ini <strong>sangat penting</strong> dan <em>bercetak miring</em>.</p>',
    '1-exam': '<h1>Pentingnya Belajar</h1>\n<p>Belajar koding itu <strong>sangat</strong> menyenangkan!</p>',
    '2.1': '<a href="https://wikipedia.org">Ke Wikipedia</a>',
    '2-exam': '<a href="#">Beranda</a>\n<a href="#">Tentang Kami</a>',
    '3.1': '<img src="https://picsum.photos/300/200" alt="Gambar acak">',
    '3-exam': '<a href="https://google.com">\n  <img src="https://picsum.photos/300/200" alt="Logo">\n</a>',
    '4.1': '<ul>\n  <li>Beli susu</li>\n  <li>Beli roti</li>\n</ul>',
    '4.2': '<section>\n  <h2>Profil</h2>\n  <p>Ini adalah bagian profil pengguna.</p>\n</section>',
    '5.1': '<form>\n  <input type="text">\n  <button type="submit">Kirim</button>\n</form>',
    '5.2': '<table>\n  <tr>\n    <td>Baris 1 Kolom 1</td>\n    <td>Baris 1 Kolom 2</td>\n  </tr>\n</table>',
    'html-final-exam': '<h1>Form Pendaftaran</h1>\n<form>\n  <input type="text">\n  <button type="submit">Daftar</button>\n</form>',
    '7.1': 'h1 {\n  color: blue;\n}',
    '7.2': 'body {\n  background-color: lightblue;\n}',
    '7.3': 'h1 {\n  font-size: 32px;\n  font-weight: bold;\n}',
    '7.4': '.toolbar {\n  display: flex;\n  gap: 10px;\n}',
    '8.1': '.box {\n  margin: 20px;\n  padding: 10px;\n}',
    '8.2': '.card {\n  border: 1px solid black;\n  border-radius: 5px;\n}',
    '9.1': '.card {\n  box-shadow: 2px 2px 5px rgba(0,0,0,0.5);\n}',
    '9.2': '.btn {\n  transition: all 0.3s ease;\n}\n.btn:hover {\n  background-color: blue;\n}',
    'css-final-exam': '.navbar {\n  display: flex;\n  background-color: #333;\n  padding: 15px;\n}',
    '10.1': 'document.write("Halo Dunia");',
    '10.2': 'let skor = 100;\ndocument.write(skor);',
    '10.3': 'alert("Selamat Datang!");',
    '10.4': 'console.log("Memeriksa sistem...");',
    '11.1': 'function sapa() {\n  alert("Halo!");\n}\nsapa();',
    '11.2': 'let nilai = 80;\nif (nilai > 70) {\n  alert("Lulus!");\n} else {\n  alert("Gagal!");\n}',
    'js-final-exam': 'let umur = 20;\nif (umur >= 18) {\n  document.write("Dewasa");\n} else {\n  document.write("Anak-anak");\n}'
  }
  return solutions[moduleId] || '<!-- Baca instruksi modul dengan seksama -->'
}

function App() {
  const game = useGameProgress()
  const { playTyping, playSuccess } = useAudio()
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true)
  const { speak, cancel, voices, selectedVoiceURI, setSelectedVoiceURI } =
    useSpeech(isVoiceEnabled)

  const { currentModule, isStarted, playerName } = game
  const [code, setCode] = useState(currentModule.initialCode)
  const [isTaskOpen, setIsTaskOpen] = useState(true)
  const [view, setView] = useState<AppView>('curriculum')
  const [theme, setTheme] = useState<ThemeMode>('dark')
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [showCertificate, setShowCertificate] = useState(false)
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('editor')
  const [skillLevel, setSkillLevel] = useState(() => {
    try {
      return localStorage.getItem(LEVEL_KEY) ?? 'beginner'
    } catch {
      return 'beginner'
    }
  })
  const [hintStep, setHintStep] = useState(0)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [analytics, setAnalytics] = useState<ModuleAnalytics>(() =>
    readJson<ModuleAnalytics>(ANALYTICS_KEY, {}),
  )
  const [settings, setSettings] = useState<AppSettings>(() => ({
    ...DEFAULT_SETTINGS,
    ...readJson<Partial<AppSettings>>(SETTINGS_KEY, {}),
  }))
  const [snapshots, setSnapshots] = useState<SnapshotMap>(() =>
    readJson<SnapshotMap>(SNAPSHOT_KEY, {}),
  )
  const [streakDays, setStreakDays] = useState<string[]>(() =>
    readJson<string[]>(STREAK_KEY, []),
  )
  const [timerSeconds, setTimerSeconds] = useState(5 * 60)
  const [activeActivity, setActiveActivity] = useState<ActivityView>('explorer')
  const [isEditorOpen, setIsEditorOpen] = useState(true)
  const [sidebarWidth, setSidebarWidth] = useState(250)
  const [previewWidth, setPreviewWidth] = useState(35)

  const [prevModuleId, setPrevModuleId] = useState(currentModule.id)
  if (prevModuleId !== currentModule.id) {
    setPrevModuleId(currentModule.id)
    const drafts = readJson<DraftMap>(DRAFT_KEY, {})
    setCode(drafts[currentModule.id] ?? currentModule.initialCode)
    setIsTaskOpen(true)
    setHintStep(0)
    setTimerSeconds(5 * 60)
    setIsEditorOpen(true)
  }

  const { isIdle } = useIdle(
    IDLE_DELAY_MS,
    isStarted && view === 'curriculum' && !isTaskOpen,
  )

  const parseText = useCallback(
    (text: string) => text.replace(/\{\{playerName\}\}/g, playerName || 'Developer'),
    [playerName],
  )
  const displayedText = parseText(currentModule.description)
  const successText = parseText(currentModule.successMessage)
  const isExam = currentModule.type === 'ujian'
  const isSuccess = isStarted && currentModule.validator(code)

  useEffect(() => {
    writeJson(SETTINGS_KEY, settings)
  }, [settings])

  useEffect(() => {
    if (!settings.challengeTimer || !isStarted || isSuccess) return
    const id = window.setInterval(() => {
      setTimerSeconds((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => window.clearInterval(id)
  }, [isStarted, isSuccess, settings.challengeTimer])

  useEffect(() => {
    if (!isStarted) return
    const id = window.setInterval(() => {
      setAnalytics((prev) => {
        const current = prev[currentModule.id] ?? { attempts: 0, seconds: 0 }
        const next = {
          ...prev,
          [currentModule.id]: { ...current, seconds: current.seconds + 1 },
        }
        writeJson(ANALYTICS_KEY, next)
        return next
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [currentModule.id, isStarted])

  useEffect(() => {
    if (isStarted && isVoiceEnabled && !isSuccess) {
      speak(displayedText)
    }
  }, [displayedText, isStarted, isVoiceEnabled, isSuccess, speak])

  useEffect(() => {
    if (!isSuccess) return
    playSuccess()
  }, [isSuccess, playSuccess])

  const handleCodeChange = useCallback(
    (newCode: string) => {
      setCode(newCode)
      const drafts = readJson<DraftMap>(DRAFT_KEY, {})
      writeJson(DRAFT_KEY, { ...drafts, [currentModule.id]: newCode })
      setAnalytics((prev) => {
        const current = prev[currentModule.id] ?? { attempts: 0, seconds: 0 }
        const next = {
          ...prev,
          [currentModule.id]: { ...current, attempts: current.attempts + 1 },
        }
        writeJson(ANALYTICS_KEY, next)
        return next
      })
      playTyping()
    },
    [currentModule.id, playTyping],
  )

  const handleFormatCode = useCallback(() => {
    setCode((prev) => formatCode(prev, currentModule.language))
  }, [currentModule.language])

  const handleNext = useCallback(() => {
    cancel()
    const gained = isExam ? 300 : 100
    const finished = game.advance()
    setToast(`+${gained} XP - ${currentModule.title} selesai`)
    if (finished) {
      const finalXp = game.xp + gained
      setToast(`Kelas selesai - ${finalXp} XP - ${getRank(finalXp)}`)
      setShowCertificate(true)
    }
  }, [cancel, currentModule.title, game, isExam])

  const handleToggleVoice = useCallback(() => {
    setIsVoiceEnabled((prev) => {
      if (prev) cancel()
      return !prev
    })
  }, [cancel])

  const handleNavigate = useCallback(
    (nextChapter: number, nextModule: number) => {
      cancel()
      setView('curriculum')
      setIsEditorOpen(true)
      game.jumpTo(nextChapter, nextModule)
    },
    [cancel, game],
  )

  const handleOpenIlmuDasar = useCallback(() => {
    cancel()
    setView('ilmu-dasar')
  }, [cancel])

  const handleResetProgress = useCallback(() => {
    cancel()
    localStorage.removeItem(DRAFT_KEY)
    localStorage.removeItem(ANALYTICS_KEY)
    localStorage.removeItem(SNAPSHOT_KEY)
    game.reset()
    setAnalytics({})
    setSnapshots({})
    setIsCommandOpen(false)
    setIsSettingsOpen(false)
    setToast('Progress direset')
  }, [cancel, game])

  const handleResetCurrentModule = useCallback(() => {
    const drafts = readJson<DraftMap>(DRAFT_KEY, {})
    const nextDrafts = { ...drafts }
    const nextAnalytics = { ...analytics }
    delete nextDrafts[currentModule.id]
    delete nextAnalytics[currentModule.id]
    writeJson(DRAFT_KEY, nextDrafts)
    writeJson(ANALYTICS_KEY, nextAnalytics)
    setAnalytics(nextAnalytics)
    setCode(currentModule.initialCode)
    setHintStep(0)
    setTimerSeconds(5 * 60)
    setToast('Modul ini direset')
  }, [analytics, currentModule.id, currentModule.initialCode])

  const handleStart = useCallback(
    (name: string, level: string) => {
      setSkillLevel(level)
      try {
        localStorage.setItem(LEVEL_KEY, level)
      } catch {
        /* ignore localStorage failures */
      }
      const today = getTodayKey()
      setStreakDays((prev) => {
        if (prev.includes(today)) return prev
        const next = [...prev, today].slice(-30)
        writeJson(STREAK_KEY, next)
        return next
      })
      game.start(name)
    },
    [game],
  )

  const handleHint = useCallback(() => {
    setHintStep((prev) => Math.min(3, prev + 1))
  }, [])

  const handleSettingsChange = useCallback((nextSettings: AppSettings) => {
    setSettings(nextSettings)
    if (nextSettings.defaultVoiceURI) setSelectedVoiceURI(nextSettings.defaultVoiceURI)
  }, [setSelectedVoiceURI])

  const handleSaveSnapshot = useCallback(() => {
    setSnapshots((prev) => {
      const next = {
        ...prev,
        [currentModule.id]: [
          ...(prev[currentModule.id] ?? []),
          { code, createdAt: new Date().toISOString() },
        ].slice(-5),
      }
      writeJson(SNAPSHOT_KEY, next)
      return next
    })
    setToast('Snapshot disimpan')
  }, [code, currentModule.id])

  const handleRollbackSnapshot = useCallback(() => {
    const latest = snapshots[currentModule.id]?.at(-1)
    if (!latest) {
      setToast('Belum ada snapshot')
      return
    }
    setCode(latest.code)
    const drafts = readJson<DraftMap>(DRAFT_KEY, {})
    writeJson(DRAFT_KEY, { ...drafts, [currentModule.id]: latest.code })
    setToast('Rollback snapshot berhasil')
  }, [currentModule.id, snapshots])

  const handleImportProgress = useCallback(
    async (file: File) => {
      try {
        const payload = JSON.parse(await readFileText(file)) as {
          playerName?: string
          chapterIndex?: number
          moduleIndex?: number
          xp?: number
          completedModuleIds?: string[]
          analytics?: ModuleAnalytics
          drafts?: DraftMap
          settings?: Partial<AppSettings>
        }
        game.importProgress({
          playerName: payload.playerName ?? playerName,
          chapterIndex: payload.chapterIndex ?? game.chapterIndex,
          moduleIndex: payload.moduleIndex ?? game.moduleIndex,
          xp: payload.xp ?? game.xp,
          completedModuleIds: payload.completedModuleIds ?? game.completedModuleIds,
        })
        if (payload.analytics) {
          setAnalytics(payload.analytics)
          writeJson(ANALYTICS_KEY, payload.analytics)
        }
        if (payload.drafts) writeJson(DRAFT_KEY, payload.drafts)
        if (payload.settings) {
          setSettings((prev) => ({ ...prev, ...payload.settings }))
        }
        setToast('Progress diimport')
      } catch {
        setToast('Import progress gagal')
      }
    },
    [game, playerName],
  )

  const startSidebarResize = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    const startX = event.clientX
    const startWidth = sidebarWidth
    const onMove = (moveEvent: MouseEvent) => {
      const nextWidth = Math.min(420, Math.max(210, startWidth + moveEvent.clientX - startX))
      setSidebarWidth(nextWidth)
    }
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [sidebarWidth])

  const startPreviewResize = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    const startX = event.clientX
    const startWidth = previewWidth
    const onMove = (moveEvent: MouseEvent) => {
      const delta = ((startX - moveEvent.clientX) / window.innerWidth) * 100
      const nextWidth = Math.min(55, Math.max(24, startWidth + delta))
      setPreviewWidth(nextWidth)
    }
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [previewWidth])

  const solution = currentModule.exampleSolution || getModuleSolution(currentModule.id)
  const hardest = Object.entries(analytics).sort(
    (a, b) => b[1].attempts + b[1].seconds / 60 - (a[1].attempts + a[1].seconds / 60),
  )[0]
  const hardModuleIds = Object.entries(analytics)
    .filter(([, item]) => item.attempts >= 3)
    .map(([moduleId]) => moduleId)
  const recommendedModuleId = getRecommendedModuleId(skillLevel, game.completedModuleIds)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setIsCommandOpen((prev) => !prev)
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        handleFormatCode()
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'j') {
        event.preventDefault()
        setIsTaskOpen(true)
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'p') {
        event.preventDefault()
        setMobilePanel((prev) => (prev === 'editor' ? 'preview' : 'editor'))
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && isSuccess) {
        event.preventDefault()
        handleNext()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleFormatCode, handleNext, isSuccess])

  if (!isStarted) {
    return (
      <Onboarding
        isVoiceEnabled={isVoiceEnabled}
        onVoiceChange={setIsVoiceEnabled}
        onStart={handleStart}
      />
    )
  }

  return (
    <VSCodeLayout
      isExam={isExam}
      theme={theme}
      reduceMotion={settings.reduceMotion}
      activeActivity={activeActivity}
      onActivityChange={setActiveActivity}
      onThemeChange={setTheme}
      onOpenSettings={() => setIsSettingsOpen(true)}
    >
      <MobilePanelSwitcher activePanel={mobilePanel} onChange={setMobilePanel} />
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onToggleVoice={handleToggleVoice}
        onResetProgress={handleResetProgress}
        onFormatCode={handleFormatCode}
        onGoFirstLesson={() => {
          handleNavigate(0, 0)
          setIsCommandOpen(false)
        }}
      />
      {toast && <AchievementToast message={toast} onClose={() => setToast(null)} />}
      {isSettingsOpen && (
        <SettingsPanel
          analytics={analytics}
          hardestModuleId={hardest?.[0] ?? 'Belum ada'}
          completedCount={game.completedModuleIds.length}
          completedModuleIds={game.completedModuleIds}
          totalModules={CURRICULUM.flatMap((chapter) => chapter.modules).length}
          xp={game.xp}
          rank={game.rank}
          settings={settings}
          voices={voices}
          streakDays={streakDays}
          timerSeconds={timerSeconds}
          currentModuleTitle={currentModule.title}
          snapshotCount={snapshots[currentModule.id]?.length ?? 0}
          onSettingsChange={handleSettingsChange}
          onResetCurrentModule={handleResetCurrentModule}
          onSaveSnapshot={handleSaveSnapshot}
          onRollbackSnapshot={handleRollbackSnapshot}
          onImportProgress={handleImportProgress}
          onClose={() => setIsSettingsOpen(false)}
          onReset={handleResetProgress}
          onExport={() => {
            const payload = {
              playerName,
              xp: game.xp,
              rank: game.rank,
              completedModuleIds: game.completedModuleIds,
              analytics,
              drafts: readJson<DraftMap>(DRAFT_KEY, {}),
              settings,
            }
            const blob = new Blob([JSON.stringify(payload, null, 2)], {
              type: 'application/json',
            })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'codingisfun-progress.json'
            link.click()
            URL.revokeObjectURL(url)
            setToast('Progress diexport')
          }}
        />
      )}
      <div
        className={`sidebar-shell mobile-panel ${mobilePanel === 'sidebar' ? 'mobile-active' : ''}`}
        style={{ width: activeActivity === 'game' ? Math.max(sidebarWidth, 520) : sidebarWidth }}
      >
        {activeActivity === 'explorer' ? (
          <Sidebar
            chapters={CURRICULUM}
            chapterIndex={game.chapterIndex}
            moduleIndex={game.moduleIndex}
            view={view}
            onNavigate={handleNavigate}
            onOpenIlmuDasar={handleOpenIlmuDasar}
            playerName={playerName}
            rank={game.rank}
            xp={game.xp}
            totalChapters={CURRICULUM.length}
            isVoiceEnabled={isVoiceEnabled}
            onToggleVoice={handleToggleVoice}
            voices={voices}
            selectedVoiceURI={selectedVoiceURI}
            onSelectVoice={setSelectedVoiceURI}
            completedModuleIds={game.completedModuleIds}
            skillLevel={skillLevel}
            recommendedModuleId={recommendedModuleId}
            hardModuleIds={hardModuleIds}
          />
        ) : (
          <ActivityTrainingPanel
            activity={activeActivity}
            activeLanguage={currentModule.language}
            onOpenModule={handleNavigate}
            onEarnXp={game.addXp}
            completedModuleIds={game.completedModuleIds}
          />
        )}
      </div>
      <div
        className="resize-handle resize-handle-sidebar"
        role="separator"
        aria-label="Resize sidebar"
        aria-orientation="vertical"
        onMouseDown={startSidebarResize}
      />

      {view === 'ilmu-dasar' ? (
        <IlmuDasar onEarnXp={game.addXp} />
      ) : (
        <>
          <div className={`editor-group mobile-panel ${mobilePanel === 'editor' ? 'mobile-active' : ''}`}>
            {isEditorOpen ? (
              <EditorPane
                code={code}
                language={currentModule.language}
                fontSize={settings.fontSize}
                onChange={handleCodeChange}
                onFormat={handleFormatCode}
                onClose={() => setIsEditorOpen(false)}
              />
            ) : (
              <div className="closed-editor-tab">
                <p>Tab editor ditutup</p>
                <button type="button" onClick={() => setIsEditorOpen(true)}>
                  Buka index.html
                </button>
              </div>
            )}
            {settings.challengeTimer && (
              <div className="challenge-timer" role="status">
                Timer latihan: {Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:
                {(timerSeconds % 60).toString().padStart(2, '0')}
              </div>
            )}
            <MentorPanel
              module={currentModule}
              description={displayedText}
              successMessage={successText}
              isSuccess={isSuccess}
              isExam={isExam}
              timestamp={new Date().toLocaleTimeString()}
              onNext={handleNext}
              onShowTask={() => setIsTaskOpen(true)}
            />
            <LearningAssist
              hintStep={hintStep}
              onHint={handleHint}
              title={currentModule.title}
              solution={solution}
              isSuccess={isSuccess}
              code={code}
            />
          </div>

          <div
            className="resize-handle resize-handle-preview"
            role="separator"
            aria-label="Resize preview"
            aria-orientation="vertical"
            onMouseDown={startPreviewResize}
          />
          <div
            className={`preview-shell mobile-panel ${mobilePanel === 'preview' ? 'mobile-active' : ''}`}
            style={{ width: `${previewWidth}%` }}
          >
            <PreviewPane code={code} language={currentModule.language} />
          </div>

          {isTaskOpen && (
            <TaskModal
              module={currentModule}
              description={displayedText}
              isExam={isExam}
              onClose={() => setIsTaskOpen(false)}
            />
          )}

          {isIdle && <IdleBanner playerName={playerName} />}
          {showCertificate && <CertificateModal playerName={playerName} onClose={() => setShowCertificate(false)} />}
        </>
      )}
    </VSCodeLayout>
  )
}

export default App

function MobilePanelSwitcher({
  activePanel,
  onChange,
}: {
  activePanel: MobilePanel
  onChange: (panel: MobilePanel) => void
}) {
  return (
    <div className="mobile-panel-switcher" aria-label="Panel mobile">
      <button
        type="button"
        aria-pressed={activePanel === 'sidebar'}
        onClick={() => onChange('sidebar')}
      >
        Sidebar
      </button>
      <button
        type="button"
        aria-pressed={activePanel === 'editor'}
        onClick={() => onChange('editor')}
      >
        Editor
      </button>
      <button
        type="button"
        aria-pressed={activePanel === 'preview'}
        onClick={() => onChange('preview')}
      >
        Preview
      </button>
    </div>
  )
}

function ActivityTrainingPanel({
  activity,
  activeLanguage,
  onOpenModule,
  onEarnXp,
  completedModuleIds,
}: {
  activity: Exclude<ActivityView, 'explorer'>
  activeLanguage: string
  onOpenModule: (chapterIndex: number, moduleIndex: number) => void
  onEarnXp: (amount: number) => void
  completedModuleIds: string[]
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [gitStep, setGitStep] = useState<'modified' | 'staged' | 'committed'>('modified')
  const [gitQuizStatus, setGitQuizStatus] = useState('Pilih command yang benar.')
  const [gitLevel, setGitLevel] = useState<'add' | 'commit' | 'branch' | 'merge'>('add')
  const [debugStatus, setDebugStatus] = useState('Debug belum dijalankan.')
  const [extensionStatus, setExtensionStatus] = useState('Belum ada ekstensi latihan aktif.')
  const [completedLabs, setCompletedLabs] = useState<string[]>(() =>
    readJson<string[]>(PRACTICE_LAB_KEY, []),
  )
  const [dailyRewardStatus, setDailyRewardStatus] = useState('')
  const [labCode, setLabCode] = useState<Record<string, string>>(() => ({
    html: '',
    css: '',
    js: '',
  }))
  const todayKey = getTodayKey()
  const allModuleIds = useMemo(() => CURRICULUM.flatMap((ch) => ch.modules.map((m) => m.id)), [])
  const searchResults = CURRICULUM.flatMap((chapter) =>
    chapter.modules.map((module, moduleIndex) => ({
      id: module.id,
      title: module.title,
      chapter: chapter.chapterTitle,
      chapterIndex: CURRICULUM.findIndex((item) => item.chapterId === chapter.chapterId),
      moduleIndex,
      text: `${module.title} ${module.description} ${module.initialCode}`.toLowerCase(),
    })),
  )
    .filter((item) => searchQuery && item.text.includes(searchQuery.toLowerCase()))
    .slice(0, 6)
  const extensionRecommendations = {
    markup: ['HTML CSS Support', 'Prettier'],
    css: ['Stylelint', 'Prettier'],
    javascript: ['JavaScript Debugger', 'Prettier'],
  }[activeLanguage] ?? ['Prettier']
  const gitQuiz = {
    add: {
      question: 'Apa command berikutnya untuk memindahkan perubahan ke staging area?',
      answer: 'git add',
    },
    commit: {
      question: 'Apa command untuk menyimpan staged changes?',
      answer: 'git commit',
    },
    branch: {
      question: 'Apa command untuk melihat atau membuat branch?',
      answer: 'git branch',
    },
    merge: {
      question: 'Apa command untuk menggabungkan branch?',
      answer: 'git merge',
    },
  }[gitLevel]

  if (activity === 'search') {
    return (
      <aside className="activity-panel" aria-label="Latihan Search">
        <h2>Latihan Search</h2>
        <p>Cari tag, properti, atau konsep di semua modul kurikulum.</p>
        <label>
          <span>Cari di workspace</span>
          <input
            aria-label="Cari di workspace"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="contoh: h1, color, function"
          />
        </label>
        {searchQuery && (
          <div className="activity-result">
            <strong>Hasil pencarian</strong>
            <p>
              Highlight: <mark className="search-highlight">{searchQuery}</mark>
            </p>
            {searchResults.length ? (
              <ul className="activity-list">
                {searchResults.map((result) => {
                  const linearIndex = allModuleIds.indexOf(result.id)
                  const isUnlocked =
                    linearIndex === 0 ||
                    completedModuleIds.includes(result.id) ||
                    (linearIndex > 0 && completedModuleIds.includes(allModuleIds[linearIndex - 1]))

                  return (
                    <li key={result.id}>
                      <span>{result.title}</span>
                      <small>{result.chapter}</small>
                      <button
                        type="button"
                        disabled={!isUnlocked}
                        style={!isUnlocked ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                        onClick={() => onOpenModule(result.chapterIndex, result.moduleIndex)}
                      >
                        {isUnlocked ? `Buka ${result.title}` : `Terkunci 🔒`}
                      </button>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p>Tidak ada hasil untuk "{searchQuery}".</p>
            )}
          </div>
        )}
      </aside>
    )
  }

  if (activity === 'source-control') {
    return (
      <aside className="activity-panel" aria-label="Latihan Git">
        <h2>Latihan Git</h2>
        <p>Simulasi alur Git: cek perubahan, stage, lalu commit tanpa menyentuh repo asli.</p>
        <div className="debug-card">
          <div className="quiz-levels">
            {(['add', 'commit', 'branch', 'merge'] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => {
                  setGitLevel(level)
                  setGitQuizStatus('Pilih command yang benar.')
                }}
              >
                Level {level}
              </button>
            ))}
          </div>
          <p>{gitQuiz.question}</p>
          <button type="button" onClick={() => setGitQuizStatus(`Benar: ${gitQuiz.answer}`)}>
            {gitQuiz.answer}
          </button>
          <button
            type="button"
            onClick={() => setGitQuizStatus('Belum tepat: cek urutan workflow Git lagi')}
          >
            git push
          </button>
          <p className="activity-result">{gitQuizStatus}</p>
        </div>
        <ol className="git-steps">
          <li className={gitStep === 'modified' ? 'active' : ''}>1. Modified</li>
          <li className={gitStep === 'staged' ? 'active' : ''}>2. Staged</li>
          <li className={gitStep === 'committed' ? 'active' : ''}>3. Committed</li>
        </ol>
        <button type="button" onClick={() => setGitStep('staged')}>
          Stage perubahan
        </button>
        <button type="button" onClick={() => setGitStep('committed')}>
          Commit latihan
        </button>
        <p className="activity-result">
          {gitStep === 'committed'
            ? 'Commit latihan dibuat'
            : gitStep === 'staged'
              ? 'Perubahan sudah staged'
              : 'Ada perubahan latihan di editor'}
        </p>
      </aside>
    )
  }

  if (activity === 'debug') {
    const bugBank = [
      {
        label: 'Bug HTML',
        code: '<section><h2>Profil</h2><p>Halo',
        answer: 'Kurang tag penutup',
      },
      {
        label: 'Bug CSS',
        code: '.card { display flex; }',
        answer: 'Kurang titik dua',
      },
      {
        label: 'Bug JS',
        code: 'document.querySelector("button").addEventlistener("click", run)',
        answer: 'Nama method salah',
      },
    ]
    const dailyBug = bugBank[new Date().getDate() % bugBank.length]

    return (
      <aside className="activity-panel" aria-label="Latihan Debug">
        <h2>Latihan Debug</h2>
        <p>Latihan membaca error: jalankan debug, cek breakpoint, lalu perbaiki kode.</p>
        <div className="activity-result">
          <strong>Bug harian</strong>
          <p>{dailyBug.label}: {dailyBug.answer}</p>
        </div>
        <button type="button" onClick={() => setDebugStatus('Breakpoint aktif')}>
          Jalankan debug
        </button>
        {bugBank.map((bug) => (
          <div className="debug-card" key={bug.label}>
            <strong>{bug.label}</strong>
            <code>{bug.code}</code>
            <p>Apa bug utama pada kode ini?</p>
            <button type="button" onClick={() => setDebugStatus('Bug ketemu')}>
              {bug.answer}
            </button>
            <button type="button" onClick={() => setDebugStatus('Coba cek lagi')}>
              Bukan itu
            </button>
          </div>
        ))}
        <p className="activity-result">{debugStatus}</p>
      </aside>
    )
  }

  if (activity === 'practice-lab') {
    const labs = [
      {
        id: 'html',
        title: 'Mini Challenge HTML',
        task: 'Buat section kecil berisi heading dan paragraf.',
        label: 'Editor mini HTML',
        moduleId: '4.2',
        validator: (code: string) => /<section[^>]*>.*<h2>.+<\/h2>.*<p>.+<\/p>.*<\/section>/is.test(code),
      },
      {
        id: 'css',
        title: 'Mini Challenge CSS',
        task: 'Buat toolbar dengan display flex dan gap.',
        label: 'Editor mini CSS',
        moduleId: '6.4',
        validator: (code: string) => /\bdisplay\s*:\s*flex/i.test(code) && /\bgap\s*:/i.test(code),
      },
      {
        id: 'js',
        title: 'Mini Challenge JS',
        task: 'Pasang event click pada tombol latihan.',
        label: 'Editor mini JS',
        moduleId: '7.4',
        validator: (code: string) => /addEventListener\s*\(\s*['"`]click/i.test(code),
      },
    ]
    const daily = labs[new Date().getDate() % labs.length]

    return (
      <aside className="activity-panel" aria-label="Practice Lab">
        <h2>Practice Lab</h2>
        <p>Kumpulan mini challenge singkat untuk pemanasan sebelum modul utama.</p>
        <div className="activity-result">
          <strong>Daily Challenge</strong>
          <p>{daily.title}: {daily.task}</p>
        </div>
        <div className="practice-list">
          {labs.map((lab) => {
            const done = completedLabs.includes(lab.id)
            return (
              <section key={lab.id} className="practice-card">
                <h3>{lab.title}</h3>
                <p>{lab.task}</p>
                <textarea
                  aria-label={lab.label}
                  value={labCode[lab.id] ?? ''}
                  onChange={(event) =>
                    setLabCode((prev) => ({ ...prev, [lab.id]: event.target.value }))
                  }
                  placeholder="Tulis jawaban singkat di sini..."
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!lab.validator(labCode[lab.id] ?? '')) return
                    setCompletedLabs((prev) => {
                      const next = prev.includes(lab.id) ? prev : [...prev, lab.id]
                      writeJson(PRACTICE_LAB_KEY, next)
                      return next
                    })
                    const rewardedDay = localStorage.getItem(DAILY_REWARD_KEY)
                    if (lab.id === daily.id && rewardedDay !== todayKey) {
                      onEarnXp(25)
                      localStorage.setItem(DAILY_REWARD_KEY, todayKey)
                      setDailyRewardStatus('+25 XP Daily Challenge')
                    }
                  }}
                >
                  Cek {lab.id.toUpperCase()}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const target = findModulePosition(lab.moduleId)
                    if (target) onOpenModule(target.chapterIndex, target.moduleIndex)
                  }}
                >
                  Jadikan modul {lab.id.toUpperCase()}
                </button>
                {done && <p className="activity-result">{lab.id.toUpperCase()} challenge selesai</p>}
              </section>
            )
          })}
        </div>
        {dailyRewardStatus && <p className="activity-result">{dailyRewardStatus}</p>}
      </aside>
    )
  }

  if (activity === 'game') {
    return (
      <aside className="activity-panel game-lab-panel" aria-label="Game Lab">
        <h2>Flappy Bird HTML</h2>
        <p>Mini game HTML dari kode paste. Klik canvas atau tekan Space untuk terbang.</p>
        <iframe
          className="game-frame"
          title="Flappy Bird HTML"
          srcDoc={FLAPPY_BIRD_HTML}
          sandbox="allow-scripts"
        />
      </aside>
    )
  }

  return (
    <aside className="activity-panel" aria-label="Latihan Extensions">
      <h2>Latihan Extensions</h2>
      <p>Pilih ekstensi yang cocok untuk workflow HTML, CSS, dan JavaScript.</p>
      <p className="activity-result">Rekomendasi modul aktif: {extensionRecommendations.join(', ')}</p>
      <div className="extension-grid">
        {[
          ['HTML CSS Support', 'Bantu autocomplete class dan tag HTML/CSS.'],
          ['Stylelint', 'Latihan menjaga CSS tetap konsisten.'],
          ['JavaScript Debugger', 'Latihan breakpoint dan inspeksi nilai.'],
          ['Prettier', 'Format kode sebelum submit latihan.'],
        ]
          .filter(([name]) => extensionRecommendations.includes(name))
          .map(([name, desc]) => (
          <button
            key={name}
            type="button"
            onClick={() => setExtensionStatus(`${name} aktif`)}
          >
            <strong>{name}</strong>
            <span>{desc}</span>
          </button>
        ))}
      </div>
      <button type="button" onClick={() => setExtensionStatus('Prettier aktif')}>
        Install Prettier
      </button>
      <p className="activity-result">{extensionStatus}</p>
    </aside>
  )
}

function CommandPalette({
  isOpen,
  onClose,
  onToggleVoice,
  onResetProgress,
  onFormatCode,
  onGoFirstLesson,
}: {
  isOpen: boolean
  onClose: () => void
  onToggleVoice: () => void
  onResetProgress: () => void
  onFormatCode: () => void
  onGoFirstLesson: () => void
}) {
  useEffect(() => {
    if (!isOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="command-overlay" onClick={onClose}>
      <div
        className="command-palette"
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="command-title">Command Palette</div>
        <button type="button" onClick={onGoFirstLesson}>
          Buka lesson pertama
        </button>
        <button type="button" onClick={onToggleVoice}>
          Toggle suara mentor
        </button>
        <button type="button" onClick={onFormatCode}>
          Format kode
        </button>
        <button type="button" onClick={onResetProgress}>
          Reset progress
        </button>
      </div>
    </div>
  )
}

function AchievementToast({
  message,
  onClose,
}: {
  message: string
  onClose: () => void
}) {
  useEffect(() => {
    const id = window.setTimeout(onClose, 3500)
    return () => window.clearTimeout(id)
  }, [onClose])

  return (
    <div className="achievement-toast" role="status" aria-label="Achievement">
      {message}
      <button type="button" onClick={onClose} aria-label="Tutup achievement">
        x
      </button>
    </div>
  )
}

function LearningAssist({
  hintStep,
  onHint,
  title,
  solution,
  isSuccess,
  code,
}: {
  hintStep: number
  onHint: () => void
  title: string
  solution: string
  isSuccess: boolean
  code: string
}) {
  return (
    <section className="learning-assist" aria-label="Bantuan belajar">
      <button type="button" className="hint-btn" onClick={onHint}>
        Butuh petunjuk?
      </button>
      {hintStep >= 1 && (
        <p>
          <strong>Hint 1:</strong> Baca ulang instruksi modul "{title}" dan cari tag
          utama yang diminta.
        </p>
      )}
      {hintStep >= 2 && (
        <p>
          <strong>Hint 2:</strong> Pastikan tag pembuka dan penutup lengkap, lalu cek
          preview.
        </p>
      )}
      {hintStep >= 3 && (
        <pre className="solution-box">
          <strong>Solusi contoh</strong>
          {'\n'}
          {solution}
        </pre>
      )}
      {isSuccess && (
        <div className="diff-viewer" aria-label="Perbandingan solusi">
          <h3>Perbandingan solusi</h3>
          <div className="diff-columns">
            <pre>
              <strong>Kode kamu</strong>
              {'\n'}
              {code}
            </pre>
            <pre>
              <strong>Contoh solusi</strong>
              {'\n'}
              {solution}
            </pre>
          </div>
        </div>
      )}
    </section>
  )
}

function SettingsPanel({
  analytics,
  hardestModuleId,
  completedCount,
  completedModuleIds,
  totalModules,
  xp,
  rank,
  settings,
  voices,
  streakDays,
  timerSeconds,
  currentModuleTitle,
  snapshotCount,
  onSettingsChange,
  onResetCurrentModule,
  onSaveSnapshot,
  onRollbackSnapshot,
  onImportProgress,
  onClose,
  onReset,
  onExport,
}: {
  analytics: ModuleAnalytics
  hardestModuleId: string
  completedCount: number
  completedModuleIds: string[]
  totalModules: number
  xp: number
  rank: string
  settings: AppSettings
  voices: SpeechSynthesisVoice[]
  streakDays: string[]
  timerSeconds: number
  currentModuleTitle: string
  snapshotCount: number
  onSettingsChange: (settings: AppSettings) => void
  onResetCurrentModule: () => void
  onSaveSnapshot: () => void
  onRollbackSnapshot: () => void
  onImportProgress: (file: File) => void
  onClose: () => void
  onReset: () => void
  onExport: () => void
}) {
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const modules = CURRICULUM.flatMap((chapter) => chapter.modules)
  const completedModules = modules.filter((module) => completedModuleIds.includes(module.id))
  const totalAttempts = Object.values(analytics).reduce((sum, item) => sum + item.attempts, 0)
  const totalSeconds = Object.values(analytics).reduce((sum, item) => sum + item.seconds, 0)
  const xpPercent = Math.min(100, Math.round((xp / 2000) * 100))

  return (
    <div className="settings-overlay" onClick={onClose}>
      <aside
        className="settings-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="settings-header">
          <div>
            <h2>Settings</h2>
            <p>Workspace controls, progress, dan backup belajar.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Tutup settings">
            x
          </button>
        </div>
        <div className="settings-summary" aria-label="Ringkasan settings">
          <div>
            <span>XP</span>
            <strong>{xp}</strong>
          </div>
          <div>
            <span>Rank</span>
            <strong>{rank}</strong>
          </div>
          <div>
            <span>Selesai</span>
            <strong>
              {completedCount}/{totalModules}
            </strong>
          </div>
        </div>
        <section>
          <h3>Analytics Lokal</h3>
          <p>XP: {xp}</p>
          <p>Rank: {rank}</p>
          <p>
            Selesai: {completedCount}/{totalModules}
          </p>
          <p>Modul tersulit: {hardestModuleId}</p>
          <p>Total percobaan: {totalAttempts}</p>
        </section>
        <section>
          <h3>Dashboard Progress</h3>
          <div className="progress-chart" aria-label="Chart XP, attempts, dan waktu belajar">
            <span>XP</span>
            <div><i style={{ width: `${xpPercent}%` }} /></div>
            <span>Attempts</span>
            <div><i style={{ width: `${Math.min(100, totalAttempts * 10)}%` }} /></div>
            <span>Waktu</span>
            <div><i style={{ width: `${Math.min(100, Math.round(totalSeconds / 6))}%` }} /></div>
          </div>
          <p>Waktu belajar: {Math.floor(totalSeconds / 60)} menit</p>
          <p>Timer latihan: {Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:{(timerSeconds % 60).toString().padStart(2, '0')}</p>
        </section>
        <section>
          <h3>Streak belajar</h3>
          <p>{streakDays.length} hari aktif</p>
          <p>Kalender belajar lokal: {streakDays.slice(-7).join(', ') || 'Belum ada'}</p>
        </section>
        <section>
          <h3>Better Settings</h3>
          <label className="setting-row">
            <span>Ukuran font editor</span>
            <input
              aria-label="Ukuran font editor"
              type="number"
              min="12"
              max="24"
              value={settings.fontSize}
              onChange={(event) =>
                onSettingsChange({ ...settings, fontSize: Number(event.target.value) })
              }
            />
          </label>
          <label className="setting-row inline">
            <input
              aria-label="Reduce motion"
              type="checkbox"
              checked={settings.reduceMotion}
              onChange={(event) =>
                onSettingsChange({ ...settings, reduceMotion: event.target.checked })
              }
            />
            <span>Reduce motion</span>
          </label>
          <label className="setting-row inline">
            <input
              aria-label="Timer challenge"
              type="checkbox"
              checked={settings.challengeTimer}
              onChange={(event) =>
                onSettingsChange({ ...settings, challengeTimer: event.target.checked })
              }
            />
            <span>Code challenge timer</span>
          </label>
          <label className="setting-row">
            <span>Suara default</span>
            <select
              aria-label="Suara default"
              value={settings.defaultVoiceURI}
              onChange={(event) =>
                onSettingsChange({ ...settings, defaultVoiceURI: event.target.value })
              }
            >
              <option value="">Ikuti sistem</option>
              {voices.map((voice) => (
                <option key={voice.voiceURI} value={voice.voiceURI}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={onResetCurrentModule}>
            Reset modul ini
          </button>
        </section>
        <section>
          <h3>Review Mode</h3>
          <div className="settings-action-grid" aria-label="Aksi progress">
            <button type="button" onClick={() => setIsReviewOpen((prev) => !prev)}>
              Review selesai
            </button>
            <button type="button" onClick={onExport}>
              Export progress
            </button>
          </div>
          {isReviewOpen && (
            <div className="review-list" aria-label="Review modul selesai">
              {completedModules.length ? (
                completedModules.map((module) => (
                  <div key={module.id} className="review-item">
                    {module.id} - {module.title}
                  </div>
                ))
              ) : (
                <p>Belum ada modul selesai untuk direview.</p>
              )}
            </div>
          )}
          <label className="import-progress">
            <span>Import progress JSON</span>
            <input
              aria-label="Import progress JSON"
              type="file"
              accept="application/json"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) void onImportProgress(file)
              }}
            />
            <em>Pilih file progress JSON untuk restore data belajar.</em>
          </label>
          <div className="snapshot-tools">
            <div className="snapshot-header">
              <span>Snapshot</span>
              <strong>{currentModuleTitle}</strong>
              <em>{snapshotCount}</em>
            </div>
            <div className="settings-action-grid" aria-label="Aksi snapshot">
              <button type="button" onClick={onSaveSnapshot}>
                Simpan snapshot
              </button>
              <button type="button" onClick={onRollbackSnapshot}>
                Rollback snapshot
              </button>
            </div>
          </div>
          <div className="danger-zone">
            <button type="button" onClick={onReset}>
              Reset progress
            </button>
          </div>
        </section>
      </aside>
    </div>
  )
}

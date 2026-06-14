import { useCallback, useEffect, useState } from 'react'
import type { Chapter, Progress, Rank } from '../types'
import { CURRICULUM } from '../data'

const STORAGE_KEY = 'codingisfun:progress'

function loadProgress(): Progress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const saved = JSON.parse(raw) as Partial<Progress>
    if (
      typeof saved.chapterIndex !== 'number' ||
      typeof saved.moduleIndex !== 'number' ||
      typeof saved.playerName !== 'string' ||
      typeof saved.xp !== 'number'
    ) {
      return null
    }
    // Pastikan indeks tersimpan masih valid terhadap kurikulum saat ini.
    const chapter = CURRICULUM[saved.chapterIndex]
    if (!chapter || !chapter.modules[saved.moduleIndex]) return null
    return saved as Progress
  } catch {
    return null
  }
}

export function getRank(xp: number): Rank {
  if (xp < 300) return 'Trainee Intern'
  if (xp < 600) return 'Junior Developer'
  if (xp < 1000) return 'Mid-Level Dev'
  if (xp < 1500) return 'Senior Developer'
  return 'Tech Lead'
}

export interface GameProgress {
  playerName: string
  chapterIndex: number
  moduleIndex: number
  xp: number
  isStarted: boolean
  currentChapter: Chapter
  currentModule: Chapter['modules'][number]
  rank: Rank
  completedModuleIds: string[]
  start: (name: string) => void
  /** Maju ke modul/bab berikutnya. Mengembalikan true bila kurikulum tamat. */
  advance: () => boolean
  /** Lompat langsung ke modul tertentu (navigasi via sidebar). */
  jumpTo: (chapterIndex: number, moduleIndex: number) => void
  /** Tambah XP langsung (mis. bonus dari mini-game). */
  addXp: (amount: number) => void
  importProgress: (progress: Partial<Progress>) => void
  reset: () => void
}

export function useGameProgress(): GameProgress {
  const saved = loadProgress()

  const [playerName, setPlayerName] = useState(saved?.playerName ?? '')
  const [isStarted, setIsStarted] = useState(Boolean(saved?.playerName))
  const [chapterIndex, setChapterIndex] = useState(saved?.chapterIndex ?? 0)
  const [moduleIndex, setModuleIndex] = useState(saved?.moduleIndex ?? 0)
  const [xp, setXp] = useState(saved?.xp ?? 0)
  const [completedModuleIds, setCompletedModuleIds] = useState(
    saved?.completedModuleIds ?? [],
  )

  useEffect(() => {
    if (!isStarted) return
    const progress: Progress = {
      playerName,
      chapterIndex,
      moduleIndex,
      xp,
      completedModuleIds,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [isStarted, playerName, chapterIndex, moduleIndex, xp, completedModuleIds])

  const currentChapter = CURRICULUM[chapterIndex]
  const currentModule = currentChapter.modules[moduleIndex]

  const start = useCallback((name: string) => {
    setPlayerName(name)
    setIsStarted(true)
  }, [])

  const advance = useCallback((): boolean => {
    const gained = currentModule.type === 'ujian' ? 300 : 100
    setXp((prev) => prev + gained)
    setCompletedModuleIds((prev) =>
      prev.includes(currentModule.id) ? prev : [...prev, currentModule.id],
    )

    if (moduleIndex < currentChapter.modules.length - 1) {
      setModuleIndex(moduleIndex + 1)
      return false
    }
    if (chapterIndex < CURRICULUM.length - 1) {
      setChapterIndex(chapterIndex + 1)
      setModuleIndex(0)
      return false
    }
    return true
  }, [chapterIndex, moduleIndex, currentChapter, currentModule])

  const jumpTo = useCallback((nextChapter: number, nextModule: number) => {
    const chapter = CURRICULUM[nextChapter]
    if (!chapter || !chapter.modules[nextModule]) return
    setChapterIndex(nextChapter)
    setModuleIndex(nextModule)
  }, [])

  const addXp = useCallback((amount: number) => {
    setXp((prev) => prev + amount)
  }, [])

  const importProgress = useCallback((progress: Partial<Progress>) => {
    const nextChapter = progress.chapterIndex ?? 0
    const nextModule = progress.moduleIndex ?? 0
    const chapter = CURRICULUM[nextChapter]
    const safeChapter = chapter ? nextChapter : 0
    const safeModule = chapter?.modules[nextModule] ? nextModule : 0

    setPlayerName(progress.playerName || 'Developer')
    setIsStarted(true)
    setChapterIndex(safeChapter)
    setModuleIndex(safeModule)
    setXp(typeof progress.xp === 'number' ? progress.xp : 0)
    setCompletedModuleIds(progress.completedModuleIds ?? [])
  }, [])

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setPlayerName('')
    setIsStarted(false)
    setChapterIndex(0)
    setModuleIndex(0)
    setXp(0)
    setCompletedModuleIds([])
  }, [])

  return {
    playerName,
    chapterIndex,
    moduleIndex,
    xp,
    isStarted,
    currentChapter,
    currentModule,
    rank: getRank(xp),
    completedModuleIds,
    start,
    advance,
    jumpTo,
    addXp,
    importProgress,
    reset,
  }
}

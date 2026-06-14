export type ModuleType = 'materi' | 'ujian'

/** Bahasa modul; menentukan syntax highlighting dan cara render preview. */
export type Language = 'markup' | 'css' | 'javascript'

export interface Sender {
  name: string
  role: string
  avatar: string
}

export interface Module {
  id: string
  type: ModuleType
  language: Language
  sender: Sender
  title: string
  description: string
  initialCode: string
  /** Mengembalikan true ketika kode learner dianggap benar. */
  validator: (code: string) => boolean
  successMessage: string
}

export interface Chapter {
  chapterId: number
  chapterTitle: string
  modules: Module[]
}

export type Rank =
  | 'Trainee Intern'
  | 'Junior Developer'
  | 'Mid-Level Dev'
  | 'Senior Developer'
  | 'Tech Lead'

export interface Progress {
  playerName: string
  chapterIndex: number
  moduleIndex: number
  xp: number
  completedModuleIds?: string[]
}

import type { ReactNode } from 'react'
import {
  Folder,
  FileCode,
  Search,
  GitBranch,
  Bug,
  Blocks,
  BookOpenCheck,
  Gamepad2,
  Settings,
  Sun,
  Moon,
  GitMerge,
  XCircle,
  AlertTriangle,
  CheckCircle,
  Swords,
} from 'lucide-react'

export type ActivityView =
  | 'explorer'
  | 'search'
  | 'source-control'
  | 'debug'
  | 'extensions'
  | 'practice-lab'
  | 'game'
  | 'multiplayer'

interface VSCodeLayoutProps {
  isExam: boolean
  theme: 'dark' | 'light' | 'high-contrast'
  reduceMotion: boolean
  activeActivity: ActivityView
  onActivityChange: (activity: ActivityView) => void
  onThemeChange: (theme: 'dark' | 'light' | 'high-contrast') => void
  onOpenSettings: () => void
  children: ReactNode
}

const ACTIVITY_ITEMS = [
  { id: 'explorer', icon: FileCode, label: 'Explorer' },
  { id: 'search', icon: Search, label: 'Cari' },
  { id: 'source-control', icon: GitBranch, label: 'Source Control' },
  { id: 'debug', icon: Bug, label: 'Run dan Debug' },
  { id: 'extensions', icon: Blocks, label: 'Ekstensi' },
  { id: 'practice-lab', icon: BookOpenCheck, label: 'Practice Lab' },
  { id: 'game', icon: Gamepad2, label: 'Game Lab' },
  { id: 'multiplayer', icon: Swords, label: 'Duel Koding' },
] satisfies { id: ActivityView; icon: typeof FileCode; label: string }[]

export function VSCodeLayout({
  isExam,
  theme,
  reduceMotion,
  activeActivity,
  onActivityChange,
  onThemeChange,
  onOpenSettings,
  children,
}: VSCodeLayoutProps) {
  return (
    <div
      className={`vscode-app theme-${theme} ${isExam ? 'exam-mode' : ''} ${reduceMotion ? 'reduce-motion' : ''}`}
      role="application"
    >
      <a className="skip-link" href="#code-editor">
        Lewati ke editor
      </a>
      {/* Top Menu Bar */}
      <div className="vscode-menubar">
        <div className="menu-items">
          <span className="logo-icon" aria-hidden="true">
            <Folder size={14} />
          </span>
          <span>File</span>
          <span>Edit</span>
          <span>Selection</span>
          <span>View</span>
          <span>Go</span>
          <span>Run</span>
          <span>Terminal</span>
          <span>Help</span>
        </div>
        <div className="title-bar">
          TechNova Workspace - index.html - Visual Studio Code
        </div>
        <div className="window-controls" aria-hidden="true">
          <span className="minimize"></span>
          <span className="maximize"></span>
          <span className="close"></span>
        </div>
      </div>

      <div className="vscode-body">
        {/* Activity Bar */}
        <div className="activity-bar" role="toolbar" aria-label="Activity Bar">
          {ACTIVITY_ITEMS.map(({ id, icon: Icon, label }) => {
            const active = activeActivity === id
            return (
            <button
              key={label}
              className={`activity-icon ${active ? 'active' : ''}`}
              aria-label={label}
              aria-pressed={active}
              onClick={() => onActivityChange(id)}
            >
              <Icon size={24} aria-hidden="true" />
            </button>
          )})}
          <div className="activity-bottom">
            <button
              className="activity-icon"
              aria-label={theme === 'light' ? 'Aktifkan tema gelap' : 'Aktifkan tema terang'}
              aria-pressed={theme === 'light'}
              onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? (
                <Moon size={24} aria-hidden="true" />
              ) : (
                <Sun size={24} aria-hidden="true" />
              )}
            </button>
            <button className="activity-icon" aria-label="Settings" onClick={onOpenSettings}>
              <Settings size={24} aria-hidden="true" />
            </button>
          </div>
        </div>

        {children}
      </div>

      {/* Bottom Status Bar */}
      <div className="vscode-statusbar">
        <div className="status-left">
          <span className="status-item">
            <GitMerge size={12} style={inlineIcon} aria-hidden="true" /> master*
          </span>
          <span className="status-item">
            <XCircle size={12} style={inlineIcon} aria-hidden="true" /> 0{' '}
            <AlertTriangle
              size={12}
              style={{ ...inlineIcon, marginLeft: 6 }}
              aria-hidden="true"
            />{' '}
            0
          </span>
          <span className="status-item">Port: 3000</span>
          <span className="status-item" style={{ opacity: 0.8, marginLeft: '10px' }}>
            Dibuat oleh <a href="https://portofolio-salman.netlify.app/" target="_blank" rel="noreferrer" style={{color: 'inherit', textDecoration: 'underline'}}>Muhamad Salman</a> dan Muhammad Zaidan Faiz
          </span>
        </div>
        <div className="status-right">
          <span className="status-item">Ln 1, Col 1</span>
          <span className="status-item">Spaces: 2</span>
          <span className="status-item">UTF-8</span>
          <span className="status-item">HTML</span>
          <span className="status-item">
            Prettier:{' '}
            <CheckCircle
              size={12}
              style={{ ...inlineIcon, marginLeft: 2 }}
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </div>
  )
}

const inlineIcon = {
  display: 'inline-block',
  verticalAlign: 'middle',
  marginRight: 4,
} as const

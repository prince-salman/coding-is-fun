import { useMemo, useState } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-core'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-javascript'
import { Globe, BookOpen } from 'lucide-react'
import {
  BASICS_FILES,
  FILL_BLANK_QUESTIONS,
  buildBasicsDocument,
} from '../data/ilmuDasar'
import { FillBlankGame } from './FillBlankGame'

const PRISM_GRAMMAR = {
  markup: { grammar: Prism.languages.markup, name: 'markup' },
  css: { grammar: Prism.languages.css, name: 'css' },
  javascript: { grammar: Prism.languages.javascript, name: 'javascript' },
} as const

const ICON_CLASS = {
  markup: 'html-icon',
  css: 'css-icon',
  javascript: 'js-icon',
} as const

interface IlmuDasarProps {
  onEarnXp: (xp: number) => void
}

export function IlmuDasar({ onEarnXp }: IlmuDasarProps) {
  const [activeFile, setActiveFile] = useState(0)
  const file = BASICS_FILES[activeFile]
  const doc = useMemo(() => buildBasicsDocument(), [])

  const highlighted = useMemo(() => {
    const { grammar, name } = PRISM_GRAMMAR[file.language]
    return Prism.highlight(file.content, grammar, name)
  }, [file])

  return (
    <>
      <div className="editor-group">
        <div className="editor-pane">
          <div className="editor-tabs" role="tablist" aria-label="Berkas ilmu dasar">
            {BASICS_FILES.map((f, i) => (
              <button
                key={f.name}
                role="tab"
                aria-selected={i === activeFile}
                className={`tab ${i === activeFile ? 'active' : ''}`}
                onClick={() => setActiveFile(i)}
              >
                <span className={`file-icon ${ICON_CLASS[f.language]}`} aria-hidden="true">
                  {f.icon}
                </span>{' '}
                {f.name}
              </button>
            ))}
            <div className="tab-breadcrumb">Ilmu_Dasar {'>'} {file.name} (read-only)</div>
          </div>

          <div className="code-container">
            <pre className="vs-code-editor readonly-code" aria-label={`Kode ${file.name}`}>
              <code dangerouslySetInnerHTML={{ __html: highlighted }} />
            </pre>
          </div>
        </div>

        <div className="bottom-panel">
          <div className="panel-tabs">
            <span className="panel-tab active">
              <BookOpen
                size={12}
                aria-hidden="true"
                style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 6 }}
              />
              LATIHAN
            </span>
          </div>
          <div className="terminal-content">
            <FillBlankGame questions={FILL_BLANK_QUESTIONS} onCorrect={onEarnXp} />
          </div>
        </div>
      </div>

      <aside className="preview-pane" aria-label="Pratinjau web ilmu dasar">
        <div className="editor-tabs">
          <div className="tab active">
            <Globe size={14} style={{ marginRight: 6 }} aria-hidden="true" /> Hasil Render Langsung
          </div>
        </div>
        <div className="preview-content">
          <div className="browser-address-bar">
            <div className="url-bar">ilmu-dasar.local</div>
          </div>
          <iframe
            className="live-output"
            title="Render web ilmu dasar"
            sandbox="allow-scripts"
            srcDoc={doc}
          />
        </div>
      </aside>
    </>
  )
}

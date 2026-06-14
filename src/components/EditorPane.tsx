import _Editor from 'react-simple-code-editor'
import Prism from 'prismjs'
import 'prismjs/components/prism-core'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-javascript'
import 'prismjs/themes/prism-tomorrow.css'
import type { Language } from '../types'

const Editor = (_Editor as { default?: typeof _Editor }).default ?? _Editor

const PRISM_GRAMMAR: Record<Language, { grammar: Prism.Grammar; name: string }> = {
  markup: { grammar: Prism.languages.markup, name: 'markup' },
  css: { grammar: Prism.languages.css, name: 'css' },
  javascript: { grammar: Prism.languages.javascript, name: 'javascript' },
}

interface EditorPaneProps {
  code: string
  language: Language
  fontSize: number
  onChange: (code: string) => void
  onFormat: () => void
  onClose: () => void
}

export function EditorPane({
  code,
  language,
  fontSize,
  onChange,
  onFormat,
  onClose,
}: EditorPaneProps) {
  const { grammar, name } = PRISM_GRAMMAR[language]

  return (
    <div className="editor-pane">
      <div className="editor-tabs">
        <div className="tab active">
          <span className="file-icon html-icon" aria-hidden="true">
            5
          </span>{' '}
          index.html
          <button
            type="button"
            className="close-tab"
            aria-label="Tutup tab editor"
            onClick={onClose}
          >
            x
          </button>
        </div>
        <div className="tab-breadcrumb">TechNova_Project {'>'} index.html</div>
        <button className="format-code-btn" type="button" onClick={onFormat}>
          Format kode
        </button>
      </div>

      <div className="code-container">
        <label htmlFor="code-editor" className="sr-only">
          Editor kode
        </label>
        <Editor
          value={code}
          onValueChange={onChange}
          highlight={(c) => Prism.highlight(c, grammar, name)}
          padding={20}
          className="vs-code-editor"
          textareaId="code-editor"
          style={{
            fontFamily: '"Fira Code", Consolas, monospace',
            fontSize,
            minHeight: '100%',
          }}
        />
      </div>
    </div>
  )
}

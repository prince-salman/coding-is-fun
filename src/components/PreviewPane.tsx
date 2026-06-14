import { Globe, ArrowLeft, ArrowRight, RotateCw } from 'lucide-react'
import type { Language } from '../types'
import { buildSrcDoc, previewNeedsScripts } from '../utils/preview'

interface PreviewPaneProps {
  code: string
  language: Language
}

export function PreviewPane({ code, language }: PreviewPaneProps) {
  const srcDoc = buildSrcDoc(language, code)
  // allow-scripts hanya untuk track JS; tetap tanpa allow-same-origin
  // sehingga iframe tidak bisa mengakses localStorage / DOM induk.
  const sandbox = previewNeedsScripts(language) ? 'allow-scripts' : ''

  return (
    <aside className="preview-pane" aria-label="Pratinjau browser">
      <div className="editor-tabs">
        <div className="tab active">
          <Globe size={14} style={{ marginRight: 6 }} aria-hidden="true" /> Browser Preview
        </div>
      </div>
      <div className="preview-content">
        <div className="browser-address-bar">
          <span className="nav-btn" aria-hidden="true">
            <ArrowLeft size={16} />
          </span>
          <span className="nav-btn" aria-hidden="true">
            <ArrowRight size={16} />
          </span>
          <span className="nav-btn" aria-hidden="true">
            <RotateCw size={16} />
          </span>
          <div className="url-bar">localhost:3000</div>
        </div>
        {code.trim() ? (
          <iframe
            className="live-output"
            title="Hasil pratinjau kode"
            sandbox={sandbox}
            srcDoc={srcDoc}
          />
        ) : (
          <div className="preview-empty" role="status">
            Tulis kode di editor untuk melihat preview.
          </div>
        )}
      </div>
    </aside>
  )
}

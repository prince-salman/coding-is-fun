import type { Language } from '../types'

/** Markup contoh yang dipakai untuk mempratinjau pelajaran CSS. */
const CSS_SAMPLE_MARKUP = `
  <h1>TechNova</h1>
  <p>Ini paragraf contoh untuk melihat gaya CSS kamu.</p>
  <div class="card">Ini sebuah kartu (.card)</div>
`

/**
 * Membangun dokumen HTML lengkap (srcDoc) untuk iframe pratinjau,
 * disesuaikan dengan bahasa modul.
 */
export function buildSrcDoc(language: Language, code: string): string {
  switch (language) {
    case 'markup':
      return code

    case 'css':
      return `<!doctype html><html><head><meta charset="utf-8"><style>${code}</style></head><body>${CSS_SAMPLE_MARKUP}</body></html>`

    case 'javascript': {
      // Pisahkan token penutup script agar tidak mengakhiri tag <script> induk.
      const closeScript = '</' + 'script>'
      return `<!doctype html><html><head><meta charset="utf-8"></head><body><script>${code}${closeScript}</body></html>`
    }
  }
}

/**
 * Apakah modul ini butuh eksekusi script di dalam iframe?
 * Hanya track JavaScript yang mengaktifkan allow-scripts.
 */
export function previewNeedsScripts(language: Language): boolean {
  return language === 'javascript'
}

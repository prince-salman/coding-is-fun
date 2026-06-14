// Mengambil teks penting yang tampil di halaman untuk dibacakan TTS.
// Mengabaikan navigasi, footer, script, elemen tersembunyi/dekoratif.

const SKIP_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'NOSCRIPT',
  'NAV',
  'FOOTER',
  'SVG',
  'PATH',
  'IFRAME',
  'CODE',
  'PRE',
  'TEXTAREA',
  'INPUT',
  'SELECT',
  'OPTION',
])

// Selektor area yang tidak perlu dibaca (mengacu pada layout VS Code app).
const SKIP_SELECTORS = [
  '.vscode-menubar',
  '.vscode-statusbar',
  '.activity-bar',
  '.editor-tabs',
  '.panel-tabs',
  '.browser-address-bar',
  '.window-controls',
  '.file-tree',
  '.tts-player',
  '[aria-hidden="true"]',
  '[hidden]',
]

export type TtsTextScope = 'page' | 'task' | 'lesson' | 'feedback'

const SCOPE_SELECTORS: Record<Exclude<TtsTextScope, 'page'>, string> = {
  task: '.task-modal',
  lesson: '.terminal-content, .readonly-code, .fill-blank-game',
  feedback: '.terminal-success',
}

function isHidden(el: Element): boolean {
  const style = window.getComputedStyle(el)
  return (
    style.display === 'none' ||
    style.visibility === 'hidden' ||
    style.opacity === '0'
  )
}

function shouldSkip(el: Element): boolean {
  if (SKIP_TAGS.has(el.tagName)) return true
  if (el.getAttribute('aria-hidden') === 'true') return true
  if (el.hasAttribute('hidden')) return true
  for (const sel of SKIP_SELECTORS) {
    if (el.matches(sel) || el.closest(sel)) return true
  }
  return isHidden(el)
}

/** Rapikan whitespace & buang token teknis yang tidak enak dibacakan. */
function normalize(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/[{}<>]/g, ' ')
    .trim()
}

function resolveScope(input?: HTMLElement | TtsTextScope | null): HTMLElement | null {
  if (!input || input === 'page') {
    return document.querySelector('main') ?? document.body ?? document.documentElement
  }
  if (typeof input !== 'string') return input
  return document.querySelector(SCOPE_SELECTORS[input])
}

/**
 * Kumpulkan teks penting dari sebuah root (default: <main> atau body).
 * Mengembalikan narasi tergabung yang rapi.
 */
export function extractPageText(root?: HTMLElement | TtsTextScope | null): string {
  const scope = resolveScope(root)
  if (!scope) return ''
  const textScope = typeof root === 'string' ? root : 'page'

  // Elemen blok yang biasanya berisi konten penting.
  const selector = 'h1, h2, h3, h4, p, li, button, .rank-badge, .terminal-text, .terminal-success, .fbg-prompt'
  const seen = new Set<string>()
  const parts: string[] = []
  const candidates = [
    ...(scope.matches(selector) ? [scope] : []),
    ...Array.from(scope.querySelectorAll(selector)),
  ]

  candidates.forEach((el) => {
    if (shouldSkip(el)) return
    if (textScope === 'lesson' && el.closest('.terminal-success')) return
    // Lewati bila ada ancestor yang harus di-skip.
    let parent = el.parentElement
    while (parent && parent !== scope) {
      if (SKIP_TAGS.has(parent.tagName)) return
      parent = parent.parentElement
    }

    const text = normalize(el.textContent || '')
    if (text.length < 2) return
    // Lewati teks yang murni simbol/angka pendek (mis. label ikon).
    if (!/\p{L}/u.test(text)) return

    const key = text.toLowerCase()
    if (seen.has(key)) return
    seen.add(key)
    parts.push(text)
  })

  // Gabung dengan tanda titik agar ada jeda natural antarbagian.
  return parts
    .map((p) => (/[.!?]$/.test(p) ? p : `${p}.`))
    .join(' ')
    .trim()
}

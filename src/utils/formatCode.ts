import type { Language } from '../types'

function formatMarkup(code: string): string {
  const tokens = code
    .replace(/>\s*</g, '>\n<')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  let depth = 0
  return tokens
    .map((line) => {
      const isClosing = /^<\//.test(line)
      const isSelfClosing = /\/>$/.test(line) || /^<!/.test(line)
      const isInlinePair = /^<([a-z][\w-]*)\b[^>]*>.*<\/\1>$/i.test(line)
      if (isClosing) depth = Math.max(0, depth - 1)
      const out = `${'  '.repeat(depth)}${line}`
      if (!isClosing && !isSelfClosing && !isInlinePair) depth += 1
      return out
    })
    .join('\n')
}

function formatCss(code: string): string {
  return code
    .replace(/\s*{\s*/g, ' {\n  ')
    .replace(/;\s*/g, ';\n  ')
    .replace(/\s*}\s*/g, '\n}\n')
    .replace(/:\s*/g, ': ')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .replace(/\n\s*\n/g, '\n')
    .trim()
}

function formatJavaScript(code: string): string {
  return code
    .replace(/;\s*/g, ';\n')
    .replace(/{\s*/g, '{\n  ')
    .replace(/\s*}\s*/g, '\n}\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .replace(/\n\s*\n/g, '\n')
    .trim()
}

export function formatCode(code: string, language: Language): string {
  const trimmed = code.trim()
  if (!trimmed) return ''
  if (language === 'markup') return formatMarkup(trimmed)
  if (language === 'css') return formatCss(trimmed)
  return formatJavaScript(trimmed)
}

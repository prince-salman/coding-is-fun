import { describe, expect, it } from 'vitest'
import { formatCode } from './formatCode'

describe('formatCode', () => {
  it('memformat HTML sederhana dengan indentasi', () => {
    expect(formatCode('<main><h1>Halo</h1></main>', 'markup')).toBe(
      '<main>\n  <h1>Halo</h1>\n</main>',
    )
  })

  it('merapikan whitespace CSS sederhana', () => {
    expect(formatCode('h1{color:red;}', 'css')).toBe('h1 {\n  color: red;\n}')
  })

  it('merapikan JavaScript sederhana tanpa mengubah isi string', () => {
    expect(formatCode('const nama="Budi";document.write(nama);', 'javascript')).toContain(
      'document.write(nama);',
    )
  })
})

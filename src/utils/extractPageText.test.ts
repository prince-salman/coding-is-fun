import { describe, it, expect, afterEach } from 'vitest'
import { extractPageText } from './extractPageText'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('extractPageText', () => {
  it('mengambil heading & paragraf penting', () => {
    document.body.innerHTML = `
      <main>
        <h1>Selamat Datang</h1>
        <p>Ini deskripsi fitur utama.</p>
      </main>
    `
    const text = extractPageText()
    expect(text).toContain('Selamat Datang')
    expect(text).toContain('Ini deskripsi fitur utama')
  })

  it('mengabaikan nav, footer, script, dan aria-hidden', () => {
    document.body.innerHTML = `
      <nav><a href="#">Menu Berulang</a></nav>
      <main>
        <h2>Konten Asli</h2>
        <span aria-hidden="true">Ikon Dekoratif</span>
      </main>
      <footer>Hak cipta 2026</footer>
      <script>var x = 1;</script>
    `
    const text = extractPageText()
    expect(text).toContain('Konten Asli')
    expect(text).not.toContain('Menu Berulang')
    expect(text).not.toContain('Hak cipta')
    expect(text).not.toContain('Ikon Dekoratif')
    expect(text).not.toContain('var x')
  })

  it('menghapus duplikat teks', () => {
    document.body.innerHTML = `
      <main>
        <p>Teks sama</p>
        <p>Teks sama</p>
      </main>
    `
    const text = extractPageText()
    const occurrences = text.split('Teks sama').length - 1
    expect(occurrences).toBe(1)
  })

  it('mengembalikan string kosong bila tidak ada konten', () => {
    document.body.innerHTML = '<main></main>'
    expect(extractPageText()).toBe('')
  })

  it('bisa mengambil teks dari scope tugas saja', () => {
    document.body.innerHTML = `
      <main>
        <section class="task-modal">
          <h2>Tugas HTML</h2>
          <p>Buat heading utama.</p>
        </section>
        <section class="terminal-content">
          <p>Materi lain tidak dibaca.</p>
        </section>
      </main>
    `

    const text = extractPageText('task')

    expect(text).toContain('Tugas HTML')
    expect(text).toContain('Buat heading utama')
    expect(text).not.toContain('Materi lain')
  })

  it('bisa mengambil teks feedback mentor saja', () => {
    document.body.innerHTML = `
      <main>
        <section class="terminal-content">
          <p>Instruksi utama.</p>
          <div class="terminal-success">Berhasil, lanjut ke modul berikutnya.</div>
        </section>
      </main>
    `

    const text = extractPageText('feedback')

    expect(text).toContain('Berhasil, lanjut ke modul berikutnya')
    expect(text).not.toContain('Instruksi utama')
  })

  it('scope materi tidak ikut membaca feedback sukses', () => {
    document.body.innerHTML = `
      <main>
        <section class="terminal-content">
          <p>Pelajari struktur HTML dasar.</p>
          <div class="terminal-success">Berhasil, lanjut ke modul berikutnya.</div>
        </section>
      </main>
    `

    const text = extractPageText('lesson')

    expect(text).toContain('Pelajari struktur HTML dasar')
    expect(text).not.toContain('Berhasil, lanjut')
  })
})

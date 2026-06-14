import { beforeEach, describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import App from './App'

vi.mock('./components/TtsPlayer', () => ({
  TtsPlayer: () => null,
}))

beforeEach(() => {
  localStorage.clear()
})

function startGame(name = 'Budi') {
  const input = screen.getByLabelText('Nama Anda')
  fireEvent.change(input, { target: { value: name } })
  fireEvent.click(screen.getByRole('button', { name: /Buka Workspace/i }))
}

describe('alur permainan', () => {
  it('menampilkan onboarding terlebih dahulu', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: /Selamat Datang di VS Code/i }),
    ).toBeInTheDocument()
  })

  it('masuk ke workspace setelah mengisi nama', () => {
    render(<App />)
    startGame('Andi')
    // Nama pemain tampil di sidebar
    expect(screen.getByText('Andi')).toBeInTheDocument()
    expect(screen.getByLabelText('Editor kode')).toBeInTheDocument()
  })

  it('menyimpan assessment awal dari onboarding', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('Nama Anda'), { target: { value: 'Rani' } })
    fireEvent.change(screen.getByLabelText('Level awal'), { target: { value: 'intermediate' } })
    fireEvent.click(screen.getByRole('button', { name: /Buka Workspace/i }))

    expect(screen.getByText(/Level: intermediate/i)).toBeInTheDocument()
  })

  it('menyelesaikan modul pertama memunculkan pesan sukses & tombol lanjut', () => {
    render(<App />)
    startGame()

    const editor = screen.getByLabelText('Editor kode')
    fireEvent.change(editor, { target: { value: '<h1>Halo Dunia</h1>' } })

    const status = screen.getByRole('status')
    expect(status).toBeInTheDocument()
    expect(
      within(status).getByRole('button', { name: /Lanjut ke Baris Berikutnya/i }),
    ).toBeInTheDocument()
  })

  it('menambah XP dan pindah modul setelah klik lanjut', () => {
    render(<App />)
    startGame()

    // XP awal 0
    expect(screen.getByText('0')).toBeInTheDocument()

    const editor = screen.getByLabelText('Editor kode')
    fireEvent.change(editor, { target: { value: '<h1>Judul</h1>' } })

    fireEvent.click(
      screen.getByRole('button', { name: /Lanjut ke Baris Berikutnya/i }),
    )

    // Modul materi memberi +100 XP
    expect(screen.getByText('100')).toBeInTheDocument()
    // Editor ter-reset ke initialCode modul berikutnya (tidak lagi mengandung <h1>Judul</h1>)
    expect((editor as HTMLTextAreaElement).value).not.toContain('<h1>Judul</h1>')
  })

  it('bisa membuka tugas CSS langsung lewat navigasi sidebar', () => {
    render(<App />)
    startGame()

    // Awalnya di modul HTML pertama.
    const editor = screen.getByLabelText('Editor kode') as HTMLTextAreaElement
    expect(editor.value).toContain('<h1>')

    // Klik modul CSS "Apa itu CSS?" di sidebar.
    fireEvent.click(screen.getByRole('button', { name: /Apa itu CSS\?/i }))

    // Editor kini menampilkan starter code CSS, bukan lagi HTML.
    expect(editor.value).toContain('color')
    expect(editor.value).not.toContain('<h1>')
  })

  it('bisa membuka tugas JavaScript lewat navigasi sidebar', () => {
    render(<App />)
    startGame()

    fireEvent.click(screen.getByRole('button', { name: /Menampilkan Pesan/i }))

    const editor = screen.getByLabelText('Editor kode') as HTMLTextAreaElement
    expect(editor.value).toContain('document.write')
  })

  it('menampilkan modal tugas otomatis saat masuk modul', () => {
    render(<App />)
    startGame()
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(
      within(dialog).getByRole('button', { name: /Mulai Kerjakan/i }),
    ).toBeInTheDocument()
  })

  it('menutup modal lalu membukanya lagi via "Lihat Tugas"', () => {
    render(<App />)
    startGame()

    fireEvent.click(screen.getByRole('button', { name: /Mulai Kerjakan/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Lihat Tugas/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('membuka modal tugas baru saat berpindah modul', () => {
    render(<App />)
    startGame()

    // Tutup modal modul pertama.
    fireEvent.click(screen.getByRole('button', { name: /Mulai Kerjakan/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    // Pindah ke modul CSS → modal tugas baru muncul otomatis.
    fireEvent.click(screen.getByRole('button', { name: /Apa itu CSS\?/i }))
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText(/Apa itu CSS\?/i)).toBeInTheDocument()
  })

  it('membuka folder Ilmu Dasar dan menampilkan render + mini-game', () => {
    render(<App />)
    startGame()
    fireEvent.click(screen.getByRole('button', { name: /Mulai Kerjakan/i }))

    fireEvent.click(screen.getByRole('button', { name: /Ilmu Dasar/i }))

    // Tab berkas read-only & mini-game tampil.
    expect(screen.getByRole('tab', { name: /index\.html/i })).toBeInTheDocument()
    expect(screen.getByText(/Mini-Game: Lengkapi Kode/i)).toBeInTheDocument()
    expect(screen.getByTitle('Render web ilmu dasar')).toBeInTheDocument()
  })

  it('mini-game di Ilmu Dasar menambah XP saat jawaban benar', () => {
    render(<App />)
    startGame()
    fireEvent.click(screen.getByRole('button', { name: /Mulai Kerjakan/i }))
    fireEvent.click(screen.getByRole('button', { name: /Ilmu Dasar/i }))

    // XP awal 0 di sidebar.
    expect(screen.getByText('0')).toBeInTheDocument()
    // Jawab soal pertama dengan benar (jawabannya 'h1').
    fireEvent.click(screen.getByRole('button', { name: 'h1' }))
    // XP bertambah 25.
    expect(screen.getByText('25')).toBeInTheDocument()
  })

  it('memuat ulang progres dari localStorage', () => {
    localStorage.setItem(
      'codingisfun:progress',
      JSON.stringify({ playerName: 'Sari', chapterIndex: 0, moduleIndex: 1, xp: 100 }),
    )
    render(<App />)
    // Langsung di workspace, bukan onboarding
    expect(screen.getByText('Sari')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('menandai modul selesai setelah lanjut', () => {
    render(<App />)
    startGame()

    fireEvent.change(screen.getByLabelText('Editor kode'), {
      target: { value: '<h1>Halo Dunia</h1>' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Lanjut ke Baris Berikutnya/i }))

    expect(screen.getByRole('button', { name: /Apa itu HTML\?.*Selesai/i })).toBeInTheDocument()
  })

  it('membuka command palette dengan Ctrl+K dan bisa toggle suara mentor', () => {
    render(<App />)
    startGame()

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
    const dialog = screen.getByRole('dialog', { name: /Command Palette/i })
    expect(dialog).toBeInTheDocument()

    fireEvent.click(within(dialog).getByRole('button', { name: /Toggle suara mentor/i }))
    expect(screen.getByRole('button', { name: /Suara: OFF/i })).toBeInTheDocument()
  })

  it('menyediakan theme toggle', () => {
    render(<App />)
    startGame()

    expect(screen.queryByLabelText('Tema tampilan')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Aktifkan tema terang/i }))
    expect(document.querySelector('.vscode-app')).toHaveClass('theme-light')

    fireEvent.click(screen.getByRole('button', { name: /Aktifkan tema gelap/i }))
    expect(document.querySelector('.vscode-app')).toHaveClass('theme-dark')
  })

  it('menyediakan tombol format kode', () => {
    render(<App />)
    startGame()
    fireEvent.click(screen.getByRole('button', { name: /Mulai Kerjakan/i }))

    const editor = screen.getByLabelText('Editor kode') as HTMLTextAreaElement
    fireEvent.change(editor, { target: { value: '<main><h1>Halo</h1></main>' } })
    fireEvent.click(screen.getByRole('button', { name: /Format kode/i }))

    expect(editor.value).toContain('\n  <h1>Halo</h1>')
  })

  it('menampilkan toast achievement ketika modul selesai', () => {
    render(<App />)
    startGame()

    fireEvent.change(screen.getByLabelText('Editor kode'), {
      target: { value: '<h1>Halo Dunia</h1>' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Lanjut ke Baris Berikutnya/i }))

    expect(screen.getByRole('status', { name: /Achievement/i })).toHaveTextContent('+100 XP')
  })

  it('menyediakan skip link dan tab editor preview untuk layar kecil', () => {
    render(<App />)
    startGame()

    expect(screen.getByRole('link', { name: /Lewati ke editor/i })).toHaveAttribute(
      'href',
      '#code-editor',
    )
    fireEvent.click(screen.getByRole('button', { name: /Tampilkan preview/i, hidden: true }))

    expect(screen.getByRole('button', { name: /Tampilkan preview/i, hidden: true })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('menyediakan hint bertahap dan solusi', () => {
    render(<App />)
    startGame()
    fireEvent.click(screen.getByRole('button', { name: /Mulai Kerjakan/i }))

    fireEvent.click(screen.getByRole('button', { name: /Butuh petunjuk/i }))
    expect(screen.getByText(/Hint 1/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Butuh petunjuk/i }))
    fireEvent.click(screen.getByRole('button', { name: /Butuh petunjuk/i }))
    expect(screen.getByText(/Solusi contoh/i)).toBeInTheDocument()
  })

  it('autosave draft per modul dan memulihkannya saat kembali', () => {
    render(<App />)
    startGame()
    fireEvent.click(screen.getByRole('button', { name: /Mulai Kerjakan/i }))

    fireEvent.change(screen.getByLabelText('Editor kode'), {
      target: { value: '<h1>Draft Lokal</h1>' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Menulis Paragraf/i }))
    fireEvent.click(screen.getByRole('button', { name: /Apa itu HTML\?/i }))

    expect(screen.getByLabelText('Editor kode')).toHaveValue('<h1>Draft Lokal</h1>')
  })

  it('menampilkan analytics, review mode, dan export progress di settings', () => {
    render(<App />)
    startGame()
    fireEvent.change(screen.getByLabelText('Editor kode'), {
      target: { value: '<h1>Halo Dunia</h1>' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Lanjut ke Baris Berikutnya/i }))

    fireEvent.click(screen.getByRole('button', { name: /Settings/i }))

    expect(screen.getByText(/Analytics Lokal/i)).toBeInTheDocument()
    expect(screen.getByText(/Modul tersulit/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Review selesai/i }))
    const reviewList = screen.getByLabelText(/Review modul selesai/i)
    expect(reviewList).toBeInTheDocument()
    expect(within(reviewList).getByText(/Apa itu HTML\?/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Export progress/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/Aksi progress/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Aksi snapshot/i)).toBeInTheDocument()
  })

  it('bisa close tab editor dan buka lagi dari explorer', () => {
    render(<App />)
    startGame()

    fireEvent.click(screen.getByRole('button', { name: /Tutup tab editor/i }))
    expect(screen.queryByLabelText('Editor kode')).not.toBeInTheDocument()
    expect(screen.getByText(/Tab editor ditutup/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Apa itu HTML\?/i }))
    expect(screen.getByLabelText('Editor kode')).toBeInTheDocument()
  })

  it('menyediakan handle resize ala VS Code', () => {
    render(<App />)
    startGame()

    expect(screen.getByRole('separator', { name: /Resize sidebar/i })).toBeInTheDocument()
    expect(screen.getByRole('separator', { name: /Resize preview/i })).toBeInTheDocument()
  })

  it('menampilkan diff viewer setelah kode berhasil', () => {
    render(<App />)
    startGame()

    fireEvent.change(screen.getByLabelText('Editor kode'), {
      target: { value: '<h1>Halo Dunia</h1>' },
    })

    expect(screen.getByText(/Perbandingan solusi/i)).toBeInTheDocument()
    expect(screen.getByText(/Kode kamu/i)).toBeInTheDocument()
  })

  it('menjalankan shortcut keyboard utama', () => {
    render(<App />)
    startGame()
    fireEvent.click(screen.getByRole('button', { name: /Mulai Kerjakan/i }))

    fireEvent.change(screen.getByLabelText('Editor kode'), {
      target: { value: '<main><h1>Halo</h1></main>' },
    })
    fireEvent.keyDown(window, { key: 's', ctrlKey: true })
    expect(screen.getByLabelText('Editor kode')).toHaveValue('<main>\n  <h1>Halo</h1>\n</main>')

    fireEvent.keyDown(window, { key: 'j', ctrlKey: true })
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('menampilkan rekomendasi learning path berdasarkan level onboarding', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('Nama Anda'), { target: { value: 'Nina' } })
    fireEvent.change(screen.getByLabelText('Level awal'), {
      target: { value: 'advanced' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Buka Workspace/i }))

    expect(screen.getByText(/Rekomendasi/i)).toBeInTheDocument()
    expect(screen.getByText(/Level: advanced/i)).toBeInTheDocument()
  })

  it('bisa mencari dan memfilter modul di sidebar', () => {
    render(<App />)
    startGame()

    fireEvent.change(screen.getByLabelText(/Cari modul/i), {
      target: { value: 'paragraf' },
    })
    expect(screen.getByRole('button', { name: /Menulis Paragraf/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Apa itu HTML\?/i })).not.toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/Filter modul/i), {
      target: { value: 'completed' },
    })
    expect(screen.getByText(/Tidak ada modul/i)).toBeInTheDocument()
  })

  it('menyediakan better settings, dashboard, streak, timer, dan reset modul', () => {
    render(<App />)
    startGame()
    fireEvent.change(screen.getByLabelText('Editor kode'), {
      target: { value: '<h1>Draft Settings</h1>' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Settings/i }))

    expect(screen.getByText(/Dashboard Progress/i)).toBeInTheDocument()
    expect(screen.getByText(/Streak belajar/i)).toBeInTheDocument()
    expect(screen.getByText(/Kalender belajar lokal/i)).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/Ukuran font editor/i), {
      target: { value: '18' },
    })
    expect(screen.getByLabelText(/Ukuran font editor/i)).toHaveValue(18)

    fireEvent.click(screen.getByLabelText(/Reduce motion/i))
    expect(document.querySelector('.vscode-app')).toHaveClass('reduce-motion')

    fireEvent.click(screen.getByLabelText(/Timer challenge/i))
    expect(screen.getAllByText(/Timer latihan/i).length).toBeGreaterThan(0)

    fireEvent.click(screen.getByRole('button', { name: /Reset modul ini/i }))
    expect((screen.getByLabelText('Editor kode') as HTMLTextAreaElement).value).toContain(
      'Ketik tag <h1> di bawah ini',
    )
  })

  it('bisa menyimpan snapshot dan rollback draft modul', () => {
    render(<App />)
    startGame()

    fireEvent.change(screen.getByLabelText('Editor kode'), {
      target: { value: '<h1>Versi Snapshot</h1>' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Settings/i }))
    fireEvent.click(screen.getByRole('button', { name: /Simpan snapshot/i }))

    fireEvent.click(screen.getByLabelText(/Tutup settings/i))
    fireEvent.change(screen.getByLabelText('Editor kode'), {
      target: { value: '<h1>Versi Rusak</h1>' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Settings/i }))
    fireEvent.click(screen.getByRole('button', { name: /Rollback snapshot/i }))

    expect(screen.getByLabelText('Editor kode')).toHaveValue('<h1>Versi Snapshot</h1>')
  })

  it('bisa import progress JSON', async () => {
    render(<App />)
    startGame()
    fireEvent.click(screen.getByRole('button', { name: /Settings/i }))

    const file = new File(
      [
        JSON.stringify({
          playerName: 'Importir',
          xp: 500,
          completedModuleIds: ['1.1'],
          analytics: { '1.1': { attempts: 4, seconds: 90 } },
        }),
      ],
      'progress.json',
      { type: 'application/json' },
    )

    fireEvent.change(screen.getByLabelText(/Import progress JSON/i), {
      target: { files: [file] },
    })

    expect(await screen.findByText(/Progress diimport/i)).toBeInTheDocument()
    expect(screen.getByText(/XP: 500/i)).toBeInTheDocument()
  })

  it('tidak menampilkan popup dengarkan web dan hanya memakai kontrol suara sidebar', () => {
    render(<App />)
    startGame()

    expect(screen.queryByText(/Dengarkan web/i)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Suara: ON/i })).toBeInTheDocument()
    expect(screen.getByText(/Pilih suara mentor/i)).toBeInTheDocument()
  })

  it('activity bar search git debug dan ekstensi membuka panel latihan', () => {
    render(<App />)
    startGame()

    fireEvent.click(screen.getByRole('button', { name: /Cari/i }))
    expect(screen.getByText(/Latihan Search/i)).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText(/Cari di workspace/i), {
      target: { value: 'h1' },
    })
    const searchPanel = screen.getByLabelText(/Latihan Search/i)
    expect(within(searchPanel).getByText(/Hasil pencarian/i)).toBeInTheDocument()
    expect(within(searchPanel).getByText(/h1/i)).toHaveClass('search-highlight')
    expect(within(searchPanel).getAllByText(/Apa itu HTML\?/i).length).toBeGreaterThan(0)
    expect(within(searchPanel).getAllByText(/Ujian Modul 1/i).length).toBeGreaterThan(0)
    fireEvent.click(within(searchPanel).getByRole('button', { name: /Buka Ujian Modul 1/i }))
    expect(screen.getByRole('heading', { name: /Ujian Modul 1/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Source Control/i }))
    expect(screen.getByText(/Latihan Git/i)).toBeInTheDocument()
    expect(screen.getByText(/1\. Modified/i)).toBeInTheDocument()
    expect(screen.getByText(/Apa command berikutnya/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /git add/i }))
    expect(screen.getByText(/Benar: git add/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Level commit/i }))
    expect(screen.getByText(/Apa command untuk menyimpan staged changes/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /git commit/i }))
    expect(screen.getByText(/Benar: git commit/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Level branch/i }))
    expect(screen.getByText(/git branch/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Level merge/i }))
    expect(screen.getByText(/git merge/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Stage perubahan/i }))
    expect(screen.getByText(/2\. Staged/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Commit latihan/i }))
    expect(screen.getByText(/Commit latihan dibuat/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Run dan Debug/i }))
    expect(screen.getByText(/Latihan Debug/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Bug HTML/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Bug CSS/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Bug JS/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/Bug harian/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Jalankan debug/i }))
    expect(screen.getByText(/Breakpoint aktif/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Kurang tag penutup/i }))
    expect(screen.getByText(/Bug ketemu/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Ekstensi/i }))
    expect(screen.getByText(/Latihan Extensions/i)).toBeInTheDocument()
    expect(screen.getByText(/Rekomendasi modul aktif/i)).toBeInTheDocument()
    expect(screen.getAllByText(/HTML CSS Support/i).length).toBeGreaterThan(0)
    fireEvent.click(screen.getByRole('button', { name: /Install Prettier/i }))
    expect(screen.getByText(/Prettier aktif/i)).toBeInTheDocument()
  })

  it('menyediakan Practice Lab dengan mini challenge singkat', () => {
    render(<App />)
    startGame()

    fireEvent.click(screen.getByRole('button', { name: /Practice Lab/i }))
    expect(screen.getByText(/Practice Lab/i)).toBeInTheDocument()
    expect(screen.getByText(/Daily Challenge/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Mini Challenge HTML/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Mini Challenge CSS/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Mini Challenge JS/i).length).toBeGreaterThan(0)

    fireEvent.change(screen.getByLabelText(/Editor mini HTML/i), {
      target: { value: '<section><h2>Halo</h2><p>Latihan</p></section>' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Cek HTML/i }))
    expect(screen.getByText(/HTML challenge selesai/i)).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText(/Editor mini CSS/i), {
      target: { value: '.toolbar { display: flex; gap: 8px; }' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Cek CSS/i }))
    fireEvent.change(screen.getByLabelText(/Editor mini JS/i), {
      target: { value: 'button.addEventListener("click", run)' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Cek JS/i }))
    expect(screen.getByText(/\+25 XP Daily Challenge/i)).toBeInTheDocument()
    expect(localStorage.getItem('codingisfun:practiceLab')).toContain('html')

    fireEvent.click(screen.getByRole('button', { name: /Explorer/i }))
    fireEvent.click(screen.getByRole('button', { name: /Practice Lab/i }))
    expect(screen.getByText(/HTML challenge selesai/i)).toBeInTheDocument()
  })

  it('Practice Lab bisa promote challenge jadi modul utama', () => {
    render(<App />)
    startGame()

    fireEvent.click(screen.getByRole('button', { name: /Practice Lab/i }))
    fireEvent.click(screen.getByRole('button', { name: /Jadikan modul HTML/i }))

    expect(screen.getByRole('heading', { name: /Latihan HTML: Struktur Section/i })).toBeInTheDocument()
  })

  it('menyediakan modul latihan tambahan di HTML CSS dan JavaScript', () => {
    render(<App />)
    startGame()

    expect(screen.getByRole('button', { name: /Latihan HTML: Struktur Section/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Latihan CSS: Flexbox Toolbar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Latihan JS: Event Button/i })).toBeInTheDocument()
  })

  it('menampilkan Game Lab Flappy Bird dari tab navigation', () => {
    render(<App />)
    startGame()

    fireEvent.click(screen.getByRole('button', { name: /Game Lab/i }))

    expect(screen.getByText(/Flappy Bird HTML/i)).toBeInTheDocument()
    expect(screen.getByTitle(/Flappy Bird HTML/i)).toBeInTheDocument()
  })
})

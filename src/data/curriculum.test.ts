import { describe, it, expect } from 'vitest'
import { CURRICULUM, TOTAL_MODULES } from './index'
import type { Module } from '../types'

/** Cari modul berdasarkan id di seluruh kurikulum. */
function findModule(id: string): Module {
  for (const chapter of CURRICULUM) {
    const mod = chapter.modules.find((m) => m.id === id)
    if (mod) return mod
  }
  throw new Error(`Modul ${id} tidak ditemukan`)
}

describe('struktur kurikulum', () => {
  it('memiliki track HTML, CSS, dan JavaScript', () => {
    const languages = new Set(
      CURRICULUM.flatMap((c) => c.modules.map((m) => m.language)),
    )
    expect(languages).toEqual(new Set(['markup', 'css', 'javascript']))
  })

  it('setiap modul punya field wajib & validator berupa fungsi', () => {
    for (const chapter of CURRICULUM) {
      for (const mod of chapter.modules) {
        expect(mod.id).toBeTruthy()
        expect(mod.title).toBeTruthy()
        expect(typeof mod.validator).toBe('function')
        expect(['materi', 'ujian']).toContain(mod.type)
      }
    }
  })

  it('id modul unik', () => {
    const ids = CURRICULUM.flatMap((c) => c.modules.map((m) => m.id))
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('TOTAL_MODULES sesuai jumlah sebenarnya', () => {
    const count = CURRICULUM.reduce((s, c) => s + c.modules.length, 0)
    expect(TOTAL_MODULES).toBe(count)
  })
})

describe('validator HTML', () => {
  it('1.1 menerima <h1> dan menolak yang kosong', () => {
    const v = findModule('1.1').validator
    expect(v('<h1>Halo</h1>')).toBe(true)
    expect(v('<h1></h1>')).toBe(false)
    expect(v('teks biasa')).toBe(false)
  })

  it('1.3 butuh <strong> DAN <em>', () => {
    const v = findModule('1.3').validator
    expect(v('<strong>a</strong><em>b</em>')).toBe(true)
    expect(v('<strong>a</strong>')).toBe(false)
  })

  it('1-exam butuh h1 dan p berisi strong', () => {
    const v = findModule('1-exam').validator
    expect(v('<h1>Judul</h1><p>isi <strong>penting</strong></p>')).toBe(true)
    expect(v('<h1>Judul</h1><p>tanpa penekanan</p>')).toBe(false)
  })

  it('2-exam butuh 2 tautan dengan salah satunya "Beranda"', () => {
    const v = findModule('2-exam').validator
    expect(
      v('<a href="#">Beranda</a><a href="#">Kontak</a>'),
    ).toBe(true)
    expect(v('<a href="#">Kontak</a>')).toBe(false)
    expect(v('<a href="#">Satu</a><a href="#">Dua</a>')).toBe(false)
  })

  it('final-exam butuh h1, img, p, a, dan ul>li', () => {
    const v = findModule('final-exam').validator
    const ok =
      '<h1>T</h1><img src="x.jpg"><p>desk</p><a href="#">link</a><ul><li>satu</li></ul>'
    expect(v(ok)).toBe(true)
    expect(v('<h1>T</h1><p>desk</p>')).toBe(false)
  })
})

describe('validator CSS', () => {
  it('6.1 butuh properti color', () => {
    const v = findModule('6.1').validator
    expect(v('h1 { color: blue; }')).toBe(true)
    expect(v('h1 { }')).toBe(false)
  })

  it('6.3 butuh font-size DAN font-weight', () => {
    const v = findModule('6.3').validator
    expect(v('h1 { font-size: 20px; font-weight: bold; }')).toBe(true)
    expect(v('h1 { font-size: 20px; }')).toBe(false)
  })

  it('6-exam butuh color, background, dan padding', () => {
    const v = findModule('6-exam').validator
    expect(
      v('.card { color: #fff; background-color: #333; padding: 10px; }'),
    ).toBe(true)
    expect(v('.card { color: #fff; padding: 10px; }')).toBe(false)
  })
})

describe('validator JavaScript', () => {
  it('7.1 butuh document.write dengan argumen string', () => {
    const v = findModule('7.1').validator
    expect(v('document.write("Halo")')).toBe(true)
    expect(v('document.write()')).toBe(false)
  })

  it('7.2 butuh deklarasi variabel DAN document.write', () => {
    const v = findModule('7.2').validator
    expect(v('const nama = "x"; document.write(nama);')).toBe(true)
    expect(v('const nama = "x";')).toBe(false)
  })

  it('7.3 butuh function yang dipanggil', () => {
    const v = findModule('7.3').validator
    expect(v('function sapa(){}; sapa();')).toBe(true)
    expect(v('function sapa(){}')).toBe(false)
  })

  it('grand-final butuh perulangan for dan document.write', () => {
    const v = findModule('grand-final').validator
    expect(
      v('for (let i = 0; i < 5; i++) { document.write(i); }'),
    ).toBe(true)
    expect(v('document.write("tanpa loop")')).toBe(false)
  })
})

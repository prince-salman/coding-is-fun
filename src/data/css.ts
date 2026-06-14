import type { Chapter } from '../types'

const MENTOR = { name: 'Mbak Sari', role: 'Frontend Engineer', avatar: 'MS' }
const EXAM = { name: 'Sistem Evaluasi', role: 'Ujian Otomatis', avatar: 'SYS' }

export const CSS_TRACK: Chapter[] = [
  {
    chapterId: 6,
    chapterTitle: 'Hari Kelima: Mewarnai Dunia dengan CSS',
    modules: [
      {
        id: '6.1',
        type: 'materi',
        language: 'css',
        sender: MENTOR,
        title: 'Apa itu CSS?',
        description:
          'Halo {{playerName}}! Saya Mbak Sari. Kalau HTML adalah kerangka, maka CSS (Cascading Style Sheets) adalah baju dan riasannya. CSS membuat website jadi indah.\n\nCara kerjanya: kita memilih elemen (selector), lalu memberi aturan di dalam kurung kurawal. Contoh untuk mewarnai semua teks <h1> menjadi biru:\n\nh1 {\n  color: blue;\n}\n\nTugasmu: tulis aturan CSS yang mengubah properti "color" pada selector apa pun. Editor ini sudah berisi <h1>, coba warnai!',
        initialCode:
          'h1 {\n  /* tambahkan properti color di bawah ini */\n}\n',
        validator: (code) => /[a-z0-9.#*\s,>:-]+\{[^}]*\bcolor\s*:\s*[^;}]+/i.test(code),
        successMessage:
          'Mantap, {{playerName}}! Properti "color" mengatur warna teks. Kamu baru saja memberi gaya pertamamu.',
      },
      {
        id: '6.2',
        type: 'materi',
        language: 'css',
        sender: MENTOR,
        title: 'Warna Latar (Background)',
        description:
          'Selain warna teks, kita bisa mengatur warna latar belakang elemen dengan properti "background-color".\n\nContoh:\nbody {\n  background-color: #f0f0f0;\n}\n\nTugasmu: berikan "background-color" pada selector mana pun. Coba beri warna latar yang kamu suka!',
        initialCode: 'body {\n  /* atur background-color di sini */\n}\n',
        validator: (code) => /\bbackground(-color)?\s*:\s*[^;}]+/i.test(code),
        successMessage:
          'Keren! Kombinasi warna teks dan latar yang tepat membuat website nyaman dibaca.',
      },
      {
        id: '6.3',
        type: 'materi',
        language: 'css',
        sender: MENTOR,
        title: 'Ukuran & Ketebalan Font',
        description:
          'Tipografi itu penting. Dua properti yang sering dipakai:\n- "font-size" untuk ukuran teks (mis. 24px).\n- "font-weight" untuk ketebalan (mis. bold).\n\nContoh:\nh1 {\n  font-size: 32px;\n  font-weight: bold;\n}\n\nTugasmu: atur "font-size" DAN "font-weight" dalam kodemu.',
        initialCode: 'h1 {\n  /* atur font-size dan font-weight */\n}\n',
        validator: (code) =>
          /\bfont-size\s*:\s*[^;}]+/i.test(code) &&
          /\bfont-weight\s*:\s*[^;}]+/i.test(code),
        successMessage:
          'Sempurna! Hirarki visual lewat ukuran & ketebalan font bikin halaman lebih mudah dipindai mata.',
      },
      {
        id: '6.4',
        type: 'materi',
        language: 'css',
        sender: MENTOR,
        title: 'Latihan CSS: Flexbox Toolbar',
        description:
          'Latihan praktik: banyak layout modern memakai Flexbox. Untuk membuat toolbar horizontal, kita butuh display: flex, gap, dan align-items.\n\nTugasmu: tulis aturan CSS untuk selector .toolbar yang memakai display: flex dan gap.',
        initialCode: '.toolbar {\n  /* buat toolbar flex di sini */\n}\n',
        validator: (code) =>
          /\.toolbar\s*\{[^}]*\bdisplay\s*:\s*flex\s*;?[^}]*\bgap\s*:\s*[^;}]+/i.test(code),
        successMessage:
          'Bagus. Flexbox adalah alat utama untuk menyusun toolbar, navbar, dan layout kecil yang rapi.',
      },
      {
        id: '6-exam',
        type: 'ujian',
        language: 'css',
        sender: EXAM,
        title: 'Ujian Modul CSS: Kartu Bergaya',
        description:
          '{{playerName}}, gaya sebuah komponen kartu. Aturan CSS yang kamu tulis WAJIB mengandung minimal:\n\n1. Sebuah properti "color".\n2. Sebuah properti "background-color".\n3. Sebuah properti "padding".\n\nGabungkan ketiganya untuk menghasilkan tampilan yang rapi!',
        initialCode: '.card {\n  /* kerjakan ujian di sini */\n}\n',
        validator: (code) =>
          /\bcolor\s*:\s*[^;}]+/i.test(code) &&
          /\bbackground(-color)?\s*:\s*[^;}]+/i.test(code) &&
          /\bpadding\s*:\s*[^;}]+/i.test(code),
        successMessage:
          'Lulus! Kamu sudah bisa menggabungkan beberapa properti CSS jadi satu komponen utuh. Saatnya membuat web jadi hidup dengan JavaScript!',
      },
    ],
  },
]

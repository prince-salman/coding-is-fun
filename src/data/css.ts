import type { Chapter } from '../types'

const MENTOR = { name: 'Mbak Sari', role: 'Frontend Engineer', avatar: 'MS' }
const EXAM = { name: 'Sistem Evaluasi', role: 'Ujian Otomatis', avatar: 'SYS' }

export const CSS_TRACK: Chapter[] = [
  {
    chapterId: 7,
    chapterTitle: 'Hari Ketujuh: Mewarnai Dunia dengan CSS',
    modules: [
      {
        id: '7.1',
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
        id: '7.2',
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
        id: '7.3',
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
        id: '7.4',
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
      }
    ],
  },
  {
    chapterId: 8,
    chapterTitle: 'Hari Kedelapan: Box Model & Spasi',
    modules: [
      {
        id: '8.1',
        type: 'materi',
        language: 'css',
        sender: MENTOR,
        title: 'Margin & Padding',
        description: 'Setiap elemen di HTML pada dasarnya adalah sebuah kotak (Box Model). \n\nMargin adalah jarak di luar kotak (memisahkan elemen ini dengan elemen lain di sekitarnya). Padding adalah jarak di dalam kotak (antara batas kotak dengan isi teks/kontennya).\n\nTugasmu: Berikan "margin" sebesar 20px dan "padding" 10px pada class .box.',
        initialCode: '.box {\n  /* atur margin dan padding di sini */\n}\n',
        validator: (code) => /\bmargin\s*:\s*[^;}]+/i.test(code) && /\bpadding\s*:\s*[^;}]+/i.test(code),
        successMessage: 'Keren! Box Model adalah konsep paling krusial untuk mengatur tata letak dan kelegaan halaman.',
      },
      {
        id: '8.2',
        type: 'materi',
        language: 'css',
        sender: MENTOR,
        title: 'Borders & Radius',
        description: 'Untuk melihat batas kotak secara visual, kita bisa memakai "border". Lalu kita bisa membulatkan sudutnya dengan "border-radius".\n\nContoh:\nborder: 1px solid black;\nborder-radius: 5px;\n\nTugasmu: Buatkan properti "border" dan "border-radius" pada class .card!',
        initialCode: '.card {\n  /* tambahkan border dan border-radius */\n}\n',
        validator: (code) => /\bborder\s*:\s*[^;}]+/i.test(code) && /\bborder-radius\s*:\s*[^;}]+/i.test(code),
        successMessage: 'Sip! Elemen berbentuk kartu atau tombol kini terlihat jauh lebih modern.',
      }
    ]
  },
  {
    chapterId: 9,
    chapterTitle: 'Hari Kesembilan: Layout Lanjutan & Desain',
    modules: [
      {
        id: '9.1',
        type: 'materi',
        language: 'css',
        sender: MENTOR,
        title: 'Positioning Lanjutan',
        description: 'Positioning membiarkanmu mengatur elemen terlepas dari alur normal.\n\n"position: absolute" akan menempatkan elemen persis di koordinat yang kamu mau (misal top: 0, left: 0), dan akan mengikuti elemen induknya jika induk tersebut memiliki "position: relative".\n\nTugasmu: Berikan "position: absolute" dan properti "top" pada selector .badge.',
        initialCode: '.badge {\n  /* jadikan posisinya absolute dan tentukan top */\n}\n',
        validator: (code) => /\bposition\s*:\s*absolute/i.test(code) && /\btop\s*:\s*[^;}]+/i.test(code),
        successMessage: 'Mantap. Ilmu ini biasa dipakai untuk membuat titik notifikasi merah di atas ikon lonceng!',
      },
      {
        id: '9.2',
        type: 'materi',
        language: 'css',
        sender: MENTOR,
        title: 'Efek Pseudo-class (:hover)',
        description: 'Interaktivitas kecil sangat penting. Kita bisa mengubah gaya elemen saat kursor berada di atasnya dengan pseudo-class :hover.\n\nContoh:\nbutton:hover {\n  background-color: red;\n}\n\nTugasmu: Buatkan aturan CSS untuk button:hover dan ubah warna latar (background-color).',
        initialCode: 'button:hover {\n  /* ubah warna latar saat di-hover */\n}\n',
        validator: (code) => /button:hover\s*\{[^}]*\bbackground(-color)?\s*:\s*[^;}]+/i.test(code),
        successMessage: 'Hebat! Website kini terasa merespons sentuhan pengguna.',
      },
      {
        id: 'css-exam',
        type: 'ujian',
        language: 'css',
        sender: EXAM,
        title: 'Ujian Modul CSS: Desain Tombol',
        description: 'Ujian CSS! Rancang sebuah tombol yang lengkap! Tulis CSS yang mengandung 5 properti ini sekaligus:\n\n1. color\n2. background-color\n3. padding\n4. border-radius\n5. margin',
        initialCode: '.btn {\n  /* selesaikan desain tombol */\n}\n',
        validator: (code) => {
          return /\bcolor\s*:\s*[^;}]+/i.test(code) &&
                 /\bbackground(-color)?\s*:\s*[^;}]+/i.test(code) &&
                 /\bpadding\s*:\s*[^;}]+/i.test(code) &&
                 /\bborder-radius\s*:\s*[^;}]+/i.test(code) &&
                 /\bmargin\s*:\s*[^;}]+/i.test(code)
        },
        successMessage: 'Lulus! Kamu sudah resmi menguasai fundamental layouting dan styling CSS.',
      }
    ]
  }
]

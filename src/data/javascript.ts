import type { Chapter } from '../types'

const MENTOR = { name: 'Bang Rizki', role: 'Software Engineer', avatar: 'BR' }
const EXAM = { name: 'Sistem Evaluasi', role: 'Ujian Otomatis', avatar: 'SYS' }
const CTO = { name: 'CTO TechNova', role: 'Penguji Utama', avatar: 'CTO' }

export const JS_TRACK: Chapter[] = [
  {
    chapterId: 7,
    chapterTitle: 'Hari Keenam: Logika dengan JavaScript',
    modules: [
      {
        id: '7.1',
        type: 'materi',
        language: 'javascript',
        sender: MENTOR,
        title: 'Menampilkan Pesan',
        description:
          'Halo {{playerName}}, saya Bang Rizki! JavaScript membuat website jadi pintar dan interaktif. Mari mulai dari yang paling dasar.\n\nUntuk menampilkan teks ke halaman, kita bisa pakai document.write(). Apa pun yang kamu tulis di preview kanan akan langsung tampil.\n\nContoh:\ndocument.write("Halo Dunia");\n\nTugasmu: gunakan document.write() untuk menampilkan sebuah pesan. Lihat hasilnya langsung di preview!',
        initialCode: '// Tulis kode di bawah ini\ndocument.write("Halo {{playerName}}");\n',
        validator: (code) => /document\.write\s*\(\s*['"`].+['"`]\s*\)/i.test(code),
        successMessage:
          'Mantap, {{playerName}}! Kodemu benar-benar berjalan di preview. Ini eksekusi JavaScript pertamamu.',
      },
      {
        id: '7.2',
        type: 'materi',
        language: 'javascript',
        sender: MENTOR,
        title: 'Menyimpan Data di Variabel',
        description:
          'Variabel adalah wadah untuk menyimpan data. Di JavaScript modern kita pakai kata kunci "let" (untuk nilai yang bisa berubah) atau "const" (untuk nilai tetap).\n\nContoh:\nconst nama = "TechNova";\ndocument.write(nama);\n\nTugasmu: buat sebuah variabel menggunakan "let" atau "const", lalu tampilkan isinya dengan document.write().',
        initialCode: '// Buat variabel lalu tampilkan\n',
        validator: (code) =>
          /\b(let|const)\s+[a-zA-Z_$][\w$]*\s*=/i.test(code) &&
          /document\.write\s*\(/i.test(code),
        successMessage:
          'Bagus! Variabel adalah fondasi dari semua program. Tanpa variabel, kita tidak bisa mengingat apa pun.',
      },
      {
        id: '7.3',
        type: 'materi',
        language: 'javascript',
        sender: MENTOR,
        title: 'Membuat Fungsi',
        description:
          'Fungsi adalah blok kode yang bisa dipakai berulang kali. Kita mendefinisikannya dengan kata kunci "function".\n\nContoh:\nfunction sapa() {\n  document.write("Halo!");\n}\nsapa();\n\nTugasmu: buat sebuah "function" lalu PANGGIL fungsi tersebut agar ia berjalan.',
        initialCode: '// Definisikan function lalu panggil\n',
        validator: (code) => {
          const def = code.match(/function\s+([a-zA-Z_$][\w$]*)\s*\(/)
          if (!def) return false
          const name = def[1]
          // Pastikan fungsi dipanggil (selain pada baris definisinya)
          const callRegex = new RegExp(`\\b${name}\\s*\\(`, 'g')
          const calls = code.match(callRegex)
          return Boolean(calls && calls.length >= 2)
        },
        successMessage:
          'Keren! Fungsi membuat kode kita rapi dan tidak berulang (prinsip DRY: Don\'t Repeat Yourself).',
      },
      {
        id: '7.4',
        type: 'materi',
        language: 'javascript',
        sender: MENTOR,
        title: 'Latihan JS: Event Button',
        description:
          'Latihan praktik: interaksi web sering dimulai dari event. Kali ini kamu perlu mengambil tombol dengan querySelector lalu memasang addEventListener("click", ...).\n\nTugasmu: tulis kode yang memakai querySelector dan addEventListener untuk event click.',
        initialCode:
          '// Contoh target: const tombol = document.querySelector("button")\n',
        validator: (code) =>
          /querySelector\s*\(\s*['"`][^'"`]+['"`]\s*\)/i.test(code) &&
          /addEventListener\s*\(\s*['"`]click['"`]\s*,/i.test(code),
        successMessage:
          'Sip! Event listener adalah fondasi tombol, form, modal, dan interaksi UI modern.',
      },
      {
        id: '7-exam',
        type: 'ujian',
        language: 'javascript',
        sender: EXAM,
        title: 'Ujian Modul JS: Kalkulator Mini',
        description:
          '{{playerName}}, gabungkan semua yang kamu pelajari. Kodemu WAJIB mengandung:\n\n1. Sebuah variabel ("let" atau "const").\n2. Sebuah "function" yang dipanggil.\n3. Pemanggilan document.write() untuk menampilkan hasil.\n\nContoh ide: buat fungsi yang menjumlahkan dua angka lalu tampilkan hasilnya!',
        initialCode: '// Kerjakan ujian di sini\n',
        validator: (code) => {
          const hasVar = /\b(let|const)\s+[a-zA-Z_$][\w$]*\s*=/i.test(code)
          const def = code.match(/function\s+([a-zA-Z_$][\w$]*)\s*\(/)
          const hasWrite = /document\.write\s*\(/i.test(code)
          if (!hasVar || !def || !hasWrite) return false
          const calls = code.match(new RegExp(`\\b${def[1]}\\s*\\(`, 'g'))
          return Boolean(calls && calls.length >= 2)
        },
        successMessage:
          'Lulus dengan gemilang! Variabel, fungsi, dan output—kamu sudah menguasai trio inti pemrograman.',
      },
    ],
  },
  {
    chapterId: 8,
    chapterTitle: 'Sertifikasi Akhir: Full-Stack Mindset',
    modules: [
      {
        id: 'grand-final',
        type: 'ujian',
        language: 'javascript',
        sender: CTO,
        title: 'Sertifikasi Web Developer',
        description:
          'Ujian pamungkas, {{playerName}}! Tunjukkan kamu bisa berpikir seperti programmer sungguhan.\n\nBuat program yang menggunakan PERULANGAN (loop) untuk menampilkan sesuatu beberapa kali. Syaratnya:\n\n1. Gunakan perulangan "for".\n2. Di dalam loop, panggil document.write() untuk menampilkan output.\n\nMisalnya: tampilkan angka 1 sampai 5, atau ucapkan salam beberapa kali. Tunjukkan kemampuanmu!',
        initialCode: '// Tulis program perulangan terbaikmu di sini\n',
        validator: (code) => {
          const hasFor = /\bfor\s*\([^)]*;[^)]*;[^)]*\)/i.test(code)
          const hasWrite = /document\.write\s*\(/i.test(code)
          return hasFor && hasWrite
        },
        successMessage:
          'LUAR BIASA, {{playerName}}! Kamu telah menyelesaikan HTML, CSS, dan JavaScript. Resmi kamu menyandang predikat Web Developer. Selamat berkarier di TechNova!',
      },
    ],
  },
]

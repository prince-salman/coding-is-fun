import type { Chapter } from '../types'

const MENTOR = { name: 'Bang Rizki', role: 'Software Engineer', avatar: 'BR' }
const CTO = { name: 'CTO TechNova', role: 'Penguji Utama', avatar: 'CTO' }

export const JS_TRACK: Chapter[] = [
  {
    chapterId: 10,
    chapterTitle: 'Hari Kesepuluh: Dasar JavaScript',
    modules: [
      {
        id: '10.1',
        type: 'materi',
        language: 'javascript',
        sender: MENTOR,
        title: 'Menampilkan Pesan',
        description:
          'Halo {{playerName}}, saya Bang Rizki! JavaScript membuat website jadi pintar dan interaktif.\n\nUntuk menampilkan teks ke halaman, kita bisa pakai document.write().\n\nContoh:\ndocument.write("Halo Dunia");\n\nTugasmu: gunakan document.write() untuk menampilkan pesan!',
        initialCode: '// Tulis kode di bawah ini\ndocument.write("Halo {{playerName}}");\n',
        validator: (code) => /document\.write\s*\(\s*['"`].+['"`]\s*\)/i.test(code),
        successMessage: 'Mantap! Ini eksekusi JavaScript pertamamu.',
      },
      {
        id: '10.2',
        type: 'materi',
        language: 'javascript',
        sender: MENTOR,
        title: 'Variabel (let & const)',
        description: 'Variabel adalah wadah data. Gunakan "let" untuk nilai yang bisa berubah, dan "const" untuk nilai tetap.\n\nContoh:\nconst nama = "TechNova";\ndocument.write(nama);\n\nTugasmu: buat variabel dengan "let" atau "const", lalu tampilkan dengan document.write!',
        initialCode: '// Buat variabel lalu tampilkan\n',
        validator: (code) => /\b(let|const)\s+[a-zA-Z_$][\w$]*\s*=/i.test(code) && /document\.write\s*\(/i.test(code),
        successMessage: 'Bagus! Variabel adalah fondasi memori di programmu.',
      },
      {
        id: '10.3',
        type: 'materi',
        language: 'javascript',
        sender: MENTOR,
        title: 'Membuat Function',
        description: 'Fungsi (function) adalah blok kode yang bisa dipanggil berulang kali.\n\nContoh:\nfunction sapa() {\n  document.write("Halo!");\n}\nsapa();\n\nTugasmu: buat sebuah function dan PANGGIL function tersebut.',
        initialCode: '// Definisikan function lalu panggil\n',
        validator: (code) => {
          const def = code.match(/function\s+([a-zA-Z_$][\w$]*)\s*\(/)
          if (!def) return false
          const calls = code.match(new RegExp(`\\b${def[1]}\\s*\\(`, 'g'))
          return Boolean(calls && calls.length >= 2)
        },
        successMessage: 'Sip! Function mencegah penulisan kode yang berulang-ulang.',
      }
    ]
  },
  {
    chapterId: 11,
    chapterTitle: 'Hari Kesebelas: Logika & Struktur Data',
    modules: [
      {
        id: '11.1',
        type: 'materi',
        language: 'javascript',
        sender: MENTOR,
        title: 'Percabangan (If/Else)',
        description: 'Dengan if/else, program bisa mengambil keputusan mandiri.\n\nContoh:\nlet lapar = true;\nif (lapar) {\n  document.write("Makan");\n} else {\n  document.write("Main");\n}\n\nTugasmu: Buat statement "if" untuk mengecek sebuah kondisi, dan jalankan document.write di dalamnya.',
        initialCode: 'let nilai = 80;\n// Tambahkan pengecekan if di sini\n',
        validator: (code) => /\bif\s*\(.+\)\s*\{/i.test(code) && /document\.write\s*\(/i.test(code),
        successMessage: 'Luar biasa! Komputermu sekarang bisa mengambil keputusan sendiri.',
      },
      {
        id: '11.2',
        type: 'materi',
        language: 'javascript',
        sender: MENTOR,
        title: 'Array (Kumpulan Data)',
        description: 'Array digunakan untuk menyimpan banyak data sekaligus. Ditandai dengan kurung siku [].\n\nContoh:\nconst buah = ["Apel", "Jeruk", "Pisang"];\ndocument.write(buah[0]); // Output: Apel\n\nTugasmu: Buat sebuah array dan gunakan document.write untuk mencetak isi dari index tertentu.',
        initialCode: '// Buat array di sini\n',
        validator: (code) => /\[.*\]/.test(code) && /document\.write\s*\(.*\[\d+\].*\)/i.test(code),
        successMessage: 'Kerja bagus! Array dipakai untuk data list, seperti daftar produk.',
      }
    ]
  },
  {
    chapterId: 12,
    chapterTitle: 'Hari Keduabelas: DOM & Interaktivitas',
    modules: [
      {
        id: '12.1',
        type: 'materi',
        language: 'javascript',
        sender: MENTOR,
        title: 'Event Listener & Selector',
        description: 'JS bisa merespons interaksi user di web.\n\nContoh:\nconst btn = document.querySelector("button");\nbtn.addEventListener("click", function() {\n  alert("Hai");\n});\n\nTugasmu: Gunakan document.querySelector() dan tambahkan addEventListener() untuk event "click"!',
        initialCode: '// Pasang event click\n',
        validator: (code) => /document\.querySelector\s*\(/i.test(code) && /\.addEventListener\s*\(\s*['"`]click['"`]/i.test(code),
        successMessage: 'Sip! Event listener membuat halaman web menjadi hidup dan responsif.',
      },
      {
        id: '12.2',
        type: 'materi',
        language: 'javascript',
        sender: MENTOR,
        title: 'Manipulasi Elemen Baru',
        description: 'Kita bisa menyisipkan elemen HTML langsung dari JS dengan document.createElement() dan appendChild().\n\nContoh:\nconst p = document.createElement("p");\np.textContent = "Baru";\ndocument.body.appendChild(p);\n\nTugasmu: Buat elemen baru dengan createElement dan masukkan ke web dengan appendChild.',
        initialCode: '// Buat elemen baru dan append\n',
        validator: (code) => /document\.createElement\s*\(/i.test(code) && /\.appendChild\s*\(/i.test(code),
        successMessage: 'Mantap. Teknik ini dipakai di semua framework modern seperti React!',
      }
    ]
  },
  {
    chapterId: 13,
    chapterTitle: 'Sertifikasi Akhir: Full-Stack Web',
    modules: [
      {
        id: 'grand-final-todo',
        type: 'ujian',
        language: 'javascript',
        sender: CTO,
        title: 'Sertifikasi Web: Mini To-Do App',
        description: 'Ujian pamungkas, {{playerName}}! Bangun logika To-Do App.\n\nKamu harus membuat sebuah fungsi bernama `tambahTugas`. Di dalam fungsi tersebut kamu wajib:\n1. Menggunakan document.querySelector.\n2. Membuat elemen <li> dengan document.createElement.\n3. Memasukkannya menggunakan appendChild.\n\nTuliskan kodenya untuk menyelesaikan sertifikasimu!',
        initialCode: '// Tulis kode To-Do App milikmu\nfunction tambahTugas() {\n  \n}\n',
        validator: (code) => {
          return /\bfunction\s+tambahTugas\s*\(/.test(code) &&
                 /document\.querySelector\s*\(/.test(code) &&
                 /document\.createElement\s*\(/.test(code) &&
                 /\.appendChild\s*\(/.test(code)
        },
        successMessage: 'LUAR BIASA, {{playerName}}! Kamu telah berhasil mensimulasikan sistem To-Do App lengkap. Kamu kini resmi siap menjadi Frontend Developer! Selamat datang di tim!',
      }
    ]
  }
]

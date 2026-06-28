import type { Chapter } from '../types'

const MENTOR = { name: 'Pak Budi', role: 'Mentor Senior', avatar: 'PB' }
const EXAM = { name: 'Sistem Evaluasi', role: 'Ujian Otomatis', avatar: 'SYS' }
const CEO = { name: 'CEO TechNova', role: 'Penguji Utama', avatar: 'CEO' }

export const HTML_TRACK: Chapter[] = [
  {
    chapterId: 1,
    chapterTitle: 'Hari Pertama: Pengenalan HTML & Tag Dasar',
    modules: [
      {
        id: '1.1',
        type: 'materi',
        language: 'markup',
        sender: MENTOR,
        title: 'Apa itu HTML?',
        description:
          "Halo {{playerName}}! Selamat bergabung. Hari ini saya akan mengajari kamu pondasi dari semua website di dunia: HTML. HTML atau HyperText Markup Language adalah kerangka dari sebuah halaman web. Bayangkan HTML seperti tulang punggung manusia. Tanpa tulang, kita tidak bisa berdiri tegak. \n\nDi HTML, kita menggunakan sesuatu yang disebut 'Tag' untuk memberi tahu browser apa yang harus ditampilkan. Tag biasanya berpasangan: ada tag pembuka dan tag penutup. \n\nTugas pertamamu: Buat sebuah Judul Utama menggunakan tag <h1>. Contoh: <h1>Ini Judul</h1>. Tuliskan kode tersebut di editor atas nama klien pertama kita!",
        initialCode: '<!-- Ketik tag <h1> di bawah ini -->\n',
        validator: (code) => /<h1>.+<\/h1>/i.test(code),
        successMessage:
          'Kerja bagus, {{playerName}}! Tag <h1> adalah tag heading terbesar, sangat penting untuk judul utama halaman web dan juga untuk SEO.',
      },
      {
        id: '1.2',
        type: 'materi',
        language: 'markup',
        sender: MENTOR,
        title: 'Menulis Paragraf',
        description:
          'Bagus sekali. Sekarang, sebuah judul tidak akan lengkap tanpa isi teksnya. Di dalam HTML, kita membungkus teks biasa menggunakan tag Paragraf, yaitu <p>.\n\nSetiap teks panjang, artikel, atau deskripsi produk di website, semuanya dibungkus dalam tag <p>. Ini memberitahu browser untuk memberikan jarak (spasi) yang rapi antar blok teks.\n\nSekarang, tambahkan sebuah paragraf menggunakan tag <p> yang berisi penjelasan singkat tentang klien kita. Isi teksnya bebas!',
        initialCode: '<!-- Ketik tag <p> di bawah ini -->\n',
        validator: (code) => /<p>.+<\/p>/i.test(code),
        successMessage:
          'Sip! Sekarang halamannya mulai terlihat berisi. Konsep membuka dan menutup tag seperti <p>... </p> adalah hal yang akan selalu kamu gunakan.',
      },
      {
        id: '1.3',
        type: 'materi',
        language: 'markup',
        sender: MENTOR,
        title: 'Format Teks: Bold & Italic',
        description:
          'Nah {{playerName}}, terkadang di dalam paragraf kita ingin memberikan penekanan pada kata tertentu. Sama seperti di Microsoft Word.\n\nDi HTML, kita menggunakan tag <strong> untuk menebalkan teks, yang juga memberi tahu mesin pencari Google bahwa kata tersebut penting. Sedangkan untuk teks miring, kita menggunakan tag <em> (Emphasis).\n\nTugasmu: Buatkan satu tag <strong> dan satu tag <em>. Kamu bisa membuatnya berdiri sendiri atau diletakkan di dalam tag <p>.',
        initialCode: '<!-- Ketik tag <strong> dan <em> di bawah ini -->\n',
        validator: (code) =>
          /<strong>.+<\/strong>/i.test(code) && /<em>.+<\/em>/i.test(code),
        successMessage:
          "Sempurna! Teksnya kini jauh lebih dinamis. Tag <strong> dan <em> disebut tag 'inline', artinya mereka tidak membuat baris baru.",
      },
      {
        id: '1-exam',
        type: 'ujian',
        language: 'markup',
        sender: EXAM,
        title: 'Ujian Modul 1: Artikel Lengkap',
        description:
          'Ujian dimulai, {{playerName}}. Buktikan bahwa kamu telah memahami teori dari Pak Budi.\n\nKamu diminta oleh klien untuk menulis artikel pendek. Syaratnya harus memiliki ketiga elemen yang baru saja diajarkan dalam satu kesatuan:\n\n1. Harus ada sebuah judul <h1>.\n2. Harus ada sebuah paragraf <p>.\n3. Di DALAM paragraf tersebut, wajib ada satu kata yang ditebalkan dengan tag <strong>.\n\nKerjakan sekarang sebelum waktu habis!',
        initialCode: '<!-- Kerjakan ujian di sini -->\n',
        validator: (code) => {
          const cleanCode = code.replace(/\n/g, '')
          const hasH1 = /<h1>.+<\/h1>/i.test(cleanCode)
          const hasPWithStrong = /<p>.*<strong>.+<\/strong>.*<\/p>/i.test(cleanCode)
          return hasH1 && hasPWithStrong
        },
        successMessage:
          'Hebat! Kamu telah menguasai struktur teks dasar HTML. Siap untuk materi yang lebih menantang?',
      },
    ],
  },
  {
    chapterId: 2,
    chapterTitle: 'Hari Kedua: Hyperlink (Jembatan Internet)',
    modules: [
      {
        id: '2.1',
        type: 'materi',
        language: 'markup',
        sender: MENTOR,
        title: 'Teori Tag Anchor <a>',
        description:
          "Internet disebut 'Web' (Jaring) karena setiap halamannya saling terhubung. Alat yang menghubungkannya adalah Hyperlink. Di HTML, kita menggunakan tag Anchor, disingkat <a>.\n\nTag <a> unik karena dia membutuhkan 'Atribut'. Atribut memberikan informasi tambahan pada tag. Untuk tag <a>, atribut terpenting adalah 'href' (Hypertext Reference) yang berisi alamat tujuan.\n\nContoh penulisannya: <a href=\"https://google.com\">Klik di sini</a>.\n\nCoba buatkan sebuah hyperlink menuju https://wikipedia.org sekarang!",
        initialCode: '<!-- Buat tautan <a> di bawah ini -->\n',
        validator: (code) =>
          /<a\s+[^>]*href\s*=\s*['"][^'"]*['"][^>]*>.+<\/a>/i.test(code),
        successMessage:
          'Tautan berhasil dibuat! Atribut href adalah fondasi dari seluruh navigasi internet.',
      },
      {
        id: '2-exam',
        type: 'ujian',
        language: 'markup',
        sender: EXAM,
        title: 'Ujian Modul 2: Navigasi Menu',
        description:
          "{{playerName}}, buatkan simulasi menu navigasi sederhana. \n\nSistem membutuhkan 2 buah tautan <a>. \nSalah satu tautan tersebut teksnya harus bertuliskan 'Beranda'. \n\nTuliskan keduanya di editor!",
        initialCode: '<!-- Buat 2 tautan di sini -->\n',
        validator: (code) => {
          const matches = code.match(
            /<a\s+[^>]*href\s*=\s*['"][^'"]*['"][^>]*>.*?<\/a>/gi,
          )
          if (!matches || matches.length < 2) return false
          return /<a[^>]*>.*?Beranda.*?<\/a>/i.test(code)
        },
        successMessage: 'Lulus! Menu navigasi berhasil dideteksi oleh sistem pengujian.',
      },
    ],
  },
  {
    chapterId: 3,
    chapterTitle: 'Hari Ketiga: Menampilkan Gambar',
    modules: [
      {
        id: '3.1',
        type: 'materi',
        language: 'markup',
        sender: MENTOR,
        title: 'Teori Tag Image <img>',
        description:
          "Hari ini kita belajar memasukkan media visual. Tag untuk gambar adalah <img>.\n\nBerbeda dengan tag lainnya, <img> adalah 'self-closing tag', artinya dia TIDAK punya tag penutup. Kita tidak menulis </img>.\n\nUntuk menampilkan gambar, tag ini butuh atribut 'src' (Source) yang mengarah ke URL gambar, dan atribut 'alt' (Alternative text) jika gambar gagal dimuat. Contoh: <img src=\"url-gambar.jpg\" alt=\"Deskripsi\">.\n\nSekarang, coba buatkan satu gambar. Gunakan link gambar apa saja yang kamu mau, masukkan ke atribut src!",
        initialCode:
          '<!-- Buat gambar dengan tag <img>, isi atribut src.\n     Contoh URL: https://picsum.photos/300/200 -->\n',
        validator: (code) =>
          /<img\s+[^>]*src\s*=\s*['"][^'"]*['"][^>]*>/i.test(code),
        successMessage:
          'Benar sekali! Ingat, atribut alt sangat penting untuk aksesibilitas (membantu tunanetra yang menggunakan screen reader).',
      },
      {
        id: '3-exam',
        type: 'ujian',
        language: 'markup',
        sender: EXAM,
        title: 'Ujian Modul 3: Gambar yang Bisa Diklik',
        description:
          "Ujian praktikal: Menggabungkan modul 2 dan modul 3!\n\nDi dunia nyata, logo website atau banner iklan biasanya bisa diklik. \nCaranya adalah dengan memasukkan tag <img> ke dalam tag <a> (sebagai 'anak' atau child element).\n\nTugas: Buatkan sebuah gambar yang jika diklik akan mengarah ke tempat lain. Bungkus <img> dengan <a>!",
        initialCode: '<!-- Kerjakan ujian di sini -->\n',
        validator: (code) => {
          const cleanCode = code.replace(/\n/g, '')
          return /<a[^>]*>.*?<img[^>]*>.*?<\/a>/i.test(cleanCode)
        },
        successMessage:
          "Sempurna! Kamu baru saja memahami konsep 'Nesting' (menyarangkan tag di dalam tag lain).",
      },
    ],
  },
  {
    chapterId: 4,
    chapterTitle: 'Hari Keempat: Menyusun Daftar (Lists)',
    modules: [
      {
        id: '4.1',
        type: 'materi',
        language: 'markup',
        sender: MENTOR,
        title: 'Teori Unordered List <ul>',
        description:
          'Ada kalanya kita perlu menampilkan informasi secara berpoin (bullet points). Untuk itu, HTML menyediakan tag <ul> (Unordered List).\n\nNamun, tag <ul> tidak bisa berdiri sendiri. Di dalamnya, kita harus mendefinisikan item satu per satu menggunakan tag <li> (List Item). Ini disebut hubungan Parent-Child.\n\nContoh:\n<ul>\n  <li>Item 1</li>\n</ul>\n\nTugasmu: Buatkan sebuah <ul> yang di dalamnya terdapat minimal dua <li>.',
        initialCode: '<!-- Buat daftar fitur di bawah ini -->\n',
        validator: (code) => {
          const cleanCode = code.replace(/\n/g, '')
          const ulMatch = cleanCode.match(/<ul>(.*?)<\/ul>/i)
          if (!ulMatch) return false
          const liMatches = ulMatch[1].match(/<li>.+?<\/li>/gi)
          return Boolean(liMatches && liMatches.length >= 2)
        },
        successMessage:
          'Kerja bagus. Struktur daftar sangat sering digunakan dalam pembuatan navigasi web profesional (Navbar).',
      },
      {
        id: '4.2',
        type: 'materi',
        language: 'markup',
        sender: MENTOR,
        title: 'Latihan HTML: Struktur Section',
        description:
          'Latihan praktik: sekarang kita mulai menyusun halaman seperti frontend engineer. Gunakan tag <section> untuk membungkus satu area konten.\n\nDi dalam <section>, wajib ada <h2> sebagai judul bagian dan <p> sebagai penjelasan singkat.\n\nTugasmu: buat satu struktur <section> yang berisi <h2> dan <p>.',
        initialCode: '<!-- Buat section latihan di sini -->\n',
        validator: (code) => {
          const cleanCode = code.replace(/\n/g, '')
          return /<section[^>]*>.*<h2>.+<\/h2>.*<p>.+<\/p>.*<\/section>/i.test(cleanCode)
        },
        successMessage:
          'Mantap! Tag section membuat halaman lebih semantik dan mudah dipahami browser maupun developer lain.',
      },
    ],
  },
  {
    chapterId: 5,
    chapterTitle: 'Hari Kelima: Mengumpulkan & Menampilkan Data',
    modules: [
      {
        id: '5.1',
        type: 'materi',
        language: 'markup',
        sender: MENTOR,
        title: 'Membuat Formulir (Forms)',
        description:
          'Website interaktif pasti butuh formulir (Login, Daftar, dll). Kita menggunakan tag <form> untuk membungkus elemen input.\n\nTag <input> (self-closing) memiliki banyak tipe: "text", "password", "email", dll. Kita juga butuh <button type="submit"> untuk mengirim data.\n\nTugasmu: Buatkan satu <input> bertipe "text" dan satu <button> bertipe "submit" di dalam form!',
        initialCode: '<!-- Buat form input di sini -->\n<form>\n  \n</form>\n',
        validator: (code) => {
          const cleanCode = code.replace(/\n/g, '')
          return /<input\s+[^>]*type\s*=\s*['"]text['"][^>]*>/i.test(cleanCode) && /<button[^>]*type\s*=\s*['"]submit['"][^>]*>.+<\/button>/i.test(cleanCode)
        },
        successMessage: 'Hebat! Kamu baru saja menguasai cara mengambil data dari user.',
        exampleSolution: '<form>\n  <input type="text">\n  <button type="submit">Kirim</button>\n</form>',
      },
      {
        id: '5.2',
        type: 'materi',
        language: 'markup',
        sender: MENTOR,
        title: 'Menyusun Data dengan Tabel',
        description:
          'Terkadang kita perlu menampilkan data seperti Excel. Kita menggunakan tag <table>, baris <tr> (Table Row), dan kolom data <td> (Table Data).\n\nUntuk teks judul/header tabel, kita pakai <th>.\n\nTugasmu: Buatkan sebuah tabel yang memiliki SATU baris <tr>, dan di dalamnya ada DUA kolom <td>.',
        initialCode: '<!-- Buat tabel di sini -->\n',
        validator: (code) => {
          const cleanCode = code.replace(/\n/g, '')
          const trMatch = cleanCode.match(/<tr>(.*?)<\/tr>/i)
          if (!trMatch) return false
          const tdMatches = trMatch[1].match(/<td>.+?<\/td>/gi)
          return Boolean(tdMatches && tdMatches.length >= 2)
        },
        successMessage: 'Keren! Tabel sangat penting untuk dashboard dan laporan data.',
        exampleSolution: '<table>\n  <tr>\n    <td>Baris 1, Kolom 1</td>\n    <td>Baris 1, Kolom 2</td>\n  </tr>\n</table>',
      },
    ],
  },
  {
    chapterId: 6,
    chapterTitle: 'Ujian Akhir: Struktur Fundamental',
    modules: [
      {
        id: 'html-final-exam',
        type: 'ujian',
        language: 'markup',
        sender: CEO,
        title: 'Sertifikasi HTML Developer',
        description:
          'Ini adalah ujian akhirmu, {{playerName}}. Buktikan pemahamanmu terhadap seluruh teori yang diajarkan.\n\nBangunlah sebuah struktur Formulir Registrasi! Syaratnya:\n1. Harus ada Heading <h1>.\n2. Harus ada <form>.\n3. Di dalam form, harus ada tag input type="text" dan <button> submit.\n\nKerjakan layaknya profesional!',
        initialCode: '<!-- Tulis kode mahakaryamu di sini -->\n',
        validator: (code) => {
          const cleanCode = code.replace(/\n/g, '')
          const hasH1 = /<h1>.+<\/h1>/i.test(cleanCode)
          const hasForm = /<form.*?>.*?<\/form>/i.test(cleanCode)
          const hasInput = /<input\s+[^>]*type\s*=\s*['"]text['"][^>]*>/i.test(cleanCode)
          const hasButton = /<button[^>]*type\s*=\s*['"]submit['"][^>]*>.+<\/button>/i.test(cleanCode)
          return hasH1 && hasForm && hasInput && hasButton
        },
        successMessage:
          'LUAR BIASA! Kode kamu sangat bersih dan terstruktur. Selamat, {{playerName}}, fondasi HTML-mu sangat kokoh!',
        exampleSolution: '<h1>Pendaftaran TechNova</h1>\n<form>\n  <input type="text">\n  <button type="submit">Daftar Sekarang</button>\n</form>',
      },
    ],
  },
]

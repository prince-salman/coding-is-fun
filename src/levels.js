export const LEVELS = [
  {
    id: 1,
    title: 'Modul 1: Judul Utama (Heading)',
    description: 'Selamat datang di pelatihan dasar. HTML menggunakan "tag" untuk menstrukturkan halaman web.\nSetiap halaman web membutuhkan judul utama. Buatlah sebuah judul menggunakan tag <h1>.',
    initialCode: '<!-- Tulis tag <h1> Anda di bawah ini -->\n',
    validator: (code) => {
      const regex = /<h1>.+<\/h1>/i;
      return regex.test(code.replace(/\s+/g, ' '));
    },
    successMessage: 'Judul berhasil dibuat.'
  },
  {
    id: 2,
    title: 'Modul 2: Paragraf',
    description: 'Setelah judul, Anda biasanya membutuhkan teks penjelas. Paragraf dibuat menggunakan tag <p>.\nBuatlah sebuah paragraf yang mendeskripsikan tujuan Anda belajar coding.',
    initialCode: '<!-- Tulis tag <p> Anda di bawah ini -->\n',
    validator: (code) => {
      const regex = /<p>.+<\/p>/i;
      return regex.test(code.replace(/\s+/g, ' '));
    },
    successMessage: 'Paragraf berhasil dibuat.'
  },
  {
    id: 3,
    title: 'Modul 3: Penekanan Teks',
    description: 'Anda dapat memberikan penekanan pada teks menggunakan tag <strong> untuk teks tebal.\nBuatlah sebuah teks tebal menggunakan tag <strong>.',
    initialCode: '<!-- Tulis tag <strong> Anda di bawah ini -->\n',
    validator: (code) => {
      const regex = /<strong>.+<\/strong>/i;
      return regex.test(code.replace(/\s+/g, ' '));
    },
    successMessage: 'Penekanan teks berhasil diaplikasikan.'
  },
  {
    id: 4,
    title: 'Modul 4: Tautan (Hyperlink)',
    description: 'Tautan memungkinkan pengguna berpindah antar halaman. Gunakan tag <a> dan atribut "href" untuk menentukan tujuan tautan.\nContoh: <a href="https://google.com">Google</a>.\nBuatlah sebuah tautan bebas.',
    initialCode: '<!-- Tulis tag <a> Anda di bawah ini -->\n',
    validator: (code) => {
      const regex = /<a\s+[^>]*href\s*=\s*['"][^'"]*['"][^>]*>.+<\/a>/i;
      return regex.test(code);
    },
    successMessage: 'Tautan berhasil ditambahkan.'
  },
  {
    id: 5,
    title: 'Modul 5: Menyisipkan Gambar',
    description: 'Gambar direpresentasikan dengan tag tunggal <img> (tanpa tag penutup). Anda wajib menggunakan atribut "src" untuk menentukan lokasi gambar.\nBuatlah tag <img> dengan atribut "src".',
    initialCode: '<!-- Tulis tag <img> Anda di bawah ini -->\n',
    validator: (code) => {
      const regex = /<img\s+[^>]*src\s*=\s*['"][^'"]*['"][^>]*>/i;
      return regex.test(code);
    },
    successMessage: 'Gambar berhasil dimuat.'
  },
  {
    id: 6,
    title: 'Modul 6: Daftar Tidak Berurutan (List)',
    description: 'Daftar berpoin dibuat dengan tag <ul> (Unordered List) sebagai pembungkus, dan tag <li> (List Item) untuk setiap poinnya.\nBuatlah struktur <ul> yang memiliki minimal satu <li> di dalamnya.',
    initialCode: '<!-- Tulis struktur <ul> dan <li> Anda di bawah ini -->\n',
    validator: (code) => {
      const cleanCode = code.replace(/\s+/g, ' ');
      const regex = /<ul>.*<li>.+<\/li>.*<\/ul>/i;
      return regex.test(cleanCode);
    },
    successMessage: 'Struktur daftar berhasil dibuat.'
  },
  {
    id: 7,
    title: 'Modul 7: Tombol Interaktif',
    description: 'Elemen tombol sangat penting untuk antarmuka pengguna. Gunakan tag <button> untuk membuat tombol.\nBuatlah satu tombol dengan teks bebas di dalamnya.',
    initialCode: '<!-- Tulis tag <button> Anda di bawah ini -->\n',
    validator: (code) => {
      const regex = /<button>.+<\/button>/i;
      return regex.test(code.replace(/\s+/g, ' '));
    },
    successMessage: 'Tombol berhasil dibuat.'
  },
  {
    id: 8,
    title: 'Modul 8: Kolom Input Pengguna',
    description: 'Untuk menerima masukan dari pengguna, gunakan tag <input>. Tag ini tidak memiliki tag penutup. Gunakan atribut type="text" untuk input teks standar.\nBuatlah satu tag input bertipe teks.',
    initialCode: '<!-- Tulis tag <input> Anda di bawah ini -->\n',
    validator: (code) => {
      const regex = /<input\s+[^>]*type\s*=\s*['"]text['"][^>]*>/i;
      return regex.test(code);
    },
    successMessage: 'Kolom input siap digunakan.'
  },
  {
    id: 9,
    title: 'Modul 9: Struktur Tabel Dasar',
    description: 'Tabel digunakan untuk menampilkan data terstruktur. Gunakan tag <table> sebagai pembungkus. Di dalamnya, gunakan <tr> untuk membuat baris, dan <td> untuk membuat data kolom.\nBuatlah <table> berisi satu <tr> dan satu <td> di dalamnya.',
    initialCode: '<!-- Tulis struktur <table>, <tr>, dan <td> Anda di bawah ini -->\n',
    validator: (code) => {
      const cleanCode = code.replace(/\s+/g, ' ');
      const regex = /<table>.*<tr>.*<td>.+<\/td>.*<\/tr>.*<\/table>/i;
      return regex.test(cleanCode);
    },
    successMessage: 'Data tabel berhasil distrukturisasi.'
  },
  {
    id: 10,
    title: 'Modul 10: Elemen Semantik',
    description: 'HTML5 memperkenalkan elemen semantik untuk menstrukturkan halaman lebih bermakna. Contohnya: <article> untuk artikel independen.\nBuatlah satu tag <article> dan isi dengan elemen teks di dalamnya.',
    initialCode: '<!-- Tulis tag <article> Anda di bawah ini -->\n',
    validator: (code) => {
      const regex = /<article>.+<\/article>/i;
      return regex.test(code.replace(/\s+/g, ' '));
    },
    successMessage: 'Pelatihan dasar HTML selesai!'
  }
];

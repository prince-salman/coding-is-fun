export interface BasicsFile {
  name: string
  language: 'markup' | 'css' | 'javascript'
  /** Ikon huruf di file tree. */
  icon: string
  content: string
}

export interface FillBlankQuestion {
  id: string
  /** Pertanyaan/perintah singkat. */
  prompt: string
  /** Potongan kode dengan placeholder `___` pada bagian yang dikosongkan. */
  template: string
  /** Jawaban benar untuk mengisi `___`. */
  answer: string
  /** Pilihan chip (termasuk jawaban benar), akan diacak saat ditampilkan. */
  choices: string[]
  /** Penjelasan singkat setelah dijawab. */
  explanation: string
}

const INDEX_HTML = `<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <title>Ilmu Dasar Web</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <header>
      <h1>Halo, Dunia Web!</h1>
      <p>Halaman ini dibangun dari HTML, CSS, dan JavaScript.</p>
    </header>

    <main>
      <h2>Tiga Pilar Web</h2>
      <ul id="pillars">
        <li>HTML — kerangka</li>
        <li>CSS — tampilan</li>
        <li>JavaScript — perilaku</li>
      </ul>
      <button id="cta">Klik aku!</button>
      <p id="output"></p>
    </main>

    <script src="script.js"></script>
  </body>
</html>`

const STYLE_CSS = `body {
  font-family: 'Segoe UI', sans-serif;
  margin: 0;
  padding: 24px;
  color: #0f172a;
  background: #f8fafc;
}
header h1 { color: #2563eb; margin-bottom: 4px; }
#pillars li { margin: 4px 0; }
#cta {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}
#cta:hover { background: #1d4ed8; }
#output { font-weight: bold; color: #16a34a; min-height: 20px; }`

const SCRIPT_JS = `const button = document.getElementById('cta');
const output = document.getElementById('output');
let clicks = 0;

button.addEventListener('click', () => {
  clicks = clicks + 1;
  output.textContent = 'Tombol diklik ' + clicks + ' kali!';
});`

export const BASICS_FILES: BasicsFile[] = [
  { name: 'index.html', language: 'markup', icon: '5', content: INDEX_HTML },
  { name: 'style.css', language: 'css', icon: '#', content: STYLE_CSS },
  { name: 'script.js', language: 'javascript', icon: 'JS', content: SCRIPT_JS },
]

/** Gabungkan 3 file menjadi satu dokumen HTML yang bisa langsung dirender. */
export function buildBasicsDocument(): string {
  // Token penutup script dipisah agar tidak mengakhiri tag <script> induk.
  const closeScript = '</' + 'script>'
  return `<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <style>${STYLE_CSS}</style>
  </head>
  <body>
    <header>
      <h1>Halo, Dunia Web!</h1>
      <p>Halaman ini dibangun dari HTML, CSS, dan JavaScript.</p>
    </header>
    <main>
      <h2>Tiga Pilar Web</h2>
      <ul id="pillars">
        <li>HTML — kerangka</li>
        <li>CSS — tampilan</li>
        <li>JavaScript — perilaku</li>
      </ul>
      <button id="cta">Klik aku!</button>
      <p id="output"></p>
    </main>
    <script>${SCRIPT_JS}${closeScript}
  </body>
</html>`
}

export const FILL_BLANK_QUESTIONS: FillBlankQuestion[] = [
  {
    id: 'q1',
    prompt: 'Lengkapi tag judul utama agar teks "Selamat Datang" menjadi heading terbesar.',
    template: '<___>Selamat Datang</___>',
    answer: 'h1',
    choices: ['h1', 'p', 'div', 'title'],
    explanation: 'Tag <h1> adalah heading level tertinggi untuk judul utama halaman.',
  },
  {
    id: 'q2',
    prompt: 'Lengkapi atribut tautan agar mengarah ke sebuah alamat.',
    template: '<a ___="https://example.com">Kunjungi</a>',
    answer: 'href',
    choices: ['href', 'src', 'link', 'url'],
    explanation: 'Atribut href (Hypertext Reference) menentukan tujuan dari sebuah tautan <a>.',
  },
  {
    id: 'q3',
    prompt: 'Lengkapi properti CSS untuk mengatur warna teks menjadi biru.',
    template: 'h1 { ___: blue; }',
    answer: 'color',
    choices: ['color', 'background', 'font', 'text'],
    explanation: 'Properti color mengatur warna teks sebuah elemen.',
  },
  {
    id: 'q4',
    prompt: 'Lengkapi properti CSS untuk memberi warna latar belakang.',
    template: 'body { ___: #f8fafc; }',
    answer: 'background-color',
    choices: ['background-color', 'color', 'fill', 'bg'],
    explanation: 'background-color mengatur warna latar belakang elemen.',
  },
  {
    id: 'q5',
    prompt: 'Lengkapi kata kunci untuk membuat variabel tetap (tidak berubah) di JavaScript.',
    template: '___ nama = "TechNova";',
    answer: 'const',
    choices: ['const', 'let', 'var', 'def'],
    explanation: 'const membuat variabel yang nilainya tidak bisa diubah (konstan).',
  },
  {
    id: 'q6',
    prompt: 'Lengkapi pemanggilan untuk menampilkan teks ke halaman.',
    template: 'document.___("Halo Dunia");',
    answer: 'write',
    choices: ['write', 'print', 'log', 'show'],
    explanation: 'document.write() menulis teks langsung ke dokumen halaman.',
  },
]

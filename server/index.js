// Server produksi: menyajikan build (dist/) + endpoint aman /api/tts.
// Jalankan dengan: npm run build && npm run start
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tryHandleTtsRequest } from './tts-handler.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const DIST = join(__dirname, '..', 'dist')
const PORT = process.env.PORT || 4173

const getApiKey = () => process.env.GEMINI_API_KEY

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
}

async function serveStatic(req, res) {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0])
  // Cegah path traversal.
  const safePath = normalize(urlPath).replace(/^(\.\.[/\\])+/, '')
  let filePath = join(DIST, safePath)

  if (!existsSync(filePath) || safePath === '/' || safePath === '') {
    filePath = join(DIST, 'index.html') // SPA fallback
  }

  try {
    const data = await readFile(filePath)
    res.statusCode = 200
    res.setHeader('Content-Type', MIME[extname(filePath)] || 'application/octet-stream')
    res.end(data)
  } catch {
    res.statusCode = 404
    res.end('Not found')
  }
}

const server = createServer(async (req, res) => {
  const handled = await tryHandleTtsRequest(getApiKey, req, res)
  if (handled) return
  await serveStatic(req, res)
})

server.listen(PORT, () => {
  const ready = getApiKey() ? 'aktif' : 'NONAKTIF (GEMINI_API_KEY belum diset)'
  console.log(`TechNova server berjalan di http://localhost:${PORT} — TTS ${ready}`)
})

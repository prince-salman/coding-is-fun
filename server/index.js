import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tryHandleTtsRequest } from './tts-handler.js'
import { Server } from 'socket.io'

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
  const safePath = normalize(urlPath).replace(/^(\.\.[/\\])+/, '')
  let filePath = join(DIST, safePath)

  if (!existsSync(filePath) || safePath === '/' || safePath === '') {
    filePath = join(DIST, 'index.html')
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

const io = new Server(server, { cors: { origin: '*' } })
let waitingPlayer = null
const activeRooms = new Map()

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id)

  socket.on('join_matchmaking', (data) => {
    if (waitingPlayer && waitingPlayer.id !== socket.id) {
      const roomId = `room_${Date.now()}`
      socket.join(roomId)
      waitingPlayer.join(roomId)
      
      const player1 = waitingPlayer
      const player2 = socket
      
      io.to(roomId).emit('match_found', { 
        roomId, 
        players: [
          { id: player1.id, name: player1.playerName || 'Player 1' },
          { id: player2.id, name: data.playerName || 'Player 2' }
        ]
      })
      
      activeRooms.set(roomId, { p1: player1.id, p2: player2.id })
      waitingPlayer = null
    } else {
      socket.playerName = data.playerName
      waitingPlayer = socket
      socket.emit('waiting_for_opponent')
    }
  })

  socket.on('code_update', (data) => {
    socket.to(data.roomId).emit('opponent_progress', data)
  })

  socket.on('match_win', (data) => {
    socket.to(data.roomId).emit('match_lost', { winnerId: socket.id })
  })

  socket.on('disconnect', () => {
    if (waitingPlayer && waitingPlayer.id === socket.id) {
      waitingPlayer = null
    }
    for (const [roomId, room] of activeRooms.entries()) {
      if (room.p1 === socket.id || room.p2 === socket.id) {
        socket.to(roomId).emit('opponent_disconnected')
        activeRooms.delete(roomId)
      }
    }
  })
})

server.listen(PORT, () => {
  const ready = getApiKey() ? 'aktif' : 'NONAKTIF (GEMINI_API_KEY belum diset)'
  console.log(`TechNova server berjalan di http://localhost:${PORT} — TTS ${ready} — Multiplayer Aktif`)
})

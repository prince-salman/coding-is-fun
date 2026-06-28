import { useState, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import { Swords, Loader2, User, Trophy, Frown } from 'lucide-react'
import '../App.css'

interface ActivityMultiplayerPanelProps {
  playerName: string
  onEarnXp: (amount: number) => void
}

export function ActivityMultiplayerPanel({ playerName, onEarnXp }: ActivityMultiplayerPanelProps) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [status, setStatus] = useState<'idle' | 'searching' | 'matched' | 'playing' | 'won' | 'lost'>('idle')
  const [opponent, setOpponent] = useState<string | null>(null)
  const [roomId, setRoomId] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [opponentProgress, setOpponentProgress] = useState(0)

  useEffect(() => {
    return () => {
      if (socket) socket.disconnect()
    }
  }, [socket])

  const findMatch = () => {
    const serverUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
      ? 'http://localhost:4173' 
      : '/'
    
    const newSocket = io(serverUrl)
    setSocket(newSocket)
    setStatus('searching')
    setOpponentProgress(0)

    newSocket.on('connect_error', () => {
      setStatus('error')
      newSocket.disconnect()
    })

    newSocket.on('connect', () => {
      newSocket.emit('join_matchmaking', { playerName })
    })

    newSocket.on('waiting_for_opponent', () => {
      setStatus('searching')
    })

    newSocket.on('match_found', (data: { roomId: string; players: { id: string; name: string }[] }) => {
      setRoomId(data.roomId)
      const opp = data.players.find((p) => p.id !== newSocket.id)
      setOpponent(opp ? opp.name : 'Anonim')
      setStatus('matched')
      
      setTimeout(() => {
        setStatus('playing')
        setCode('// Tantangan: Buat fungsi tambah(a, b) yang mengembalikan hasil a + b\n\nfunction tambah(a, b) {\n  \n}')
      }, 3000)
    })

    newSocket.on('opponent_progress', (data) => {
      setOpponentProgress(data.codeLength)
    })

    newSocket.on('match_lost', () => {
      setStatus('lost')
      newSocket.disconnect()
    })

    newSocket.on('opponent_disconnected', () => {
      if (status === 'playing') {
        setStatus('won')
        onEarnXp(100)
        newSocket.disconnect()
      }
    })
  }

  const cancelSearch = () => {
    if (socket) socket.disconnect()
    setStatus('idle')
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value
    setCode(newCode)
    if (socket && roomId) {
      socket.emit('code_update', { roomId, codeLength: newCode.length })
    }

    if (newCode.includes('return a + b') || newCode.includes('return a+b') || newCode.includes('return a +b') || newCode.includes('return a+ b')) {
      if (socket && roomId) {
        socket.emit('match_win', { roomId })
        socket.disconnect()
      }
      setStatus('won')
      onEarnXp(200)
    }
  }

  return (
    <div className="activity-panel">
      <div className="activity-header">
        <h2 className="activity-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Swords size={16} /> DUEL KODING (ONLINE)
        </h2>
      </div>
      <div className="activity-content" style={{ padding: '20px', textAlign: 'center' }}>
        
        {status === 'idle' && (
          <div>
            <div style={{ background: '#252526', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#FFD700' }}>Tantang Programmer Lain!</h3>
              <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '20px' }}>
                Adu kecepatan mengetik dan menyelesaikan algoritma sederhana melawan pemain nyata secara real-time. Pemenang mendapat +200 XP.
              </p>
              <button className="vscode-btn primary-btn" onClick={findMatch} style={{ width: '100%', padding: '10px' }}>
                Cari Lawan Sekarang
              </button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div style={{ padding: '40px 0', animation: 'fadeIn 0.5s' }}>
            <h3 style={{ color: '#e51400', fontSize: '1.5rem' }}>Koneksi Gagal</h3>
            <p style={{ color: '#aaa', margin: '20px 0' }}>
              Tidak dapat terhubung ke server Multiplayer. Jika Anda mengakses dari Netlify, fitur ini tidak didukung karena Netlify tidak menjalankan server backend Node.js.
            </p>
            <p style={{ color: '#aaa', margin: '20px 0' }}>
              Jalankan proyek ini secara lokal (npm run start) untuk mencoba fitur ini.
            </p>
            <button className="vscode-btn primary-btn" onClick={() => setStatus('idle')}>Kembali</button>
          </div>
        )}

        {status === 'searching' && (
          <div style={{ padding: '40px 0' }}>
            <Loader2 size={48} className="spin" style={{ margin: '0 auto', color: '#007acc' }} />
            <h3 style={{ marginTop: '20px' }}>Mencari Lawan...</h3>
            <p style={{ color: '#aaa' }}>Menunggu pemain lain bergabung ke arena.</p>
            <button className="vscode-btn" onClick={cancelSearch} style={{ marginTop: '20px' }}>Batal</button>
          </div>
        )}

        {status === 'matched' && (
          <div style={{ padding: '40px 0', animation: 'fadeIn 0.5s' }}>
            <h3 style={{ color: '#FFD700', fontSize: '1.5rem' }}>Lawan Ditemukan!</h3>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', margin: '30px 0' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ background: '#007acc', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                  <User size={30} />
                </div>
                <strong style={{ display: 'block', marginTop: '10px' }}>{playerName}</strong>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FF0055' }}>VS</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ background: '#e51400', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                  <User size={30} />
                </div>
                <strong style={{ display: 'block', marginTop: '10px' }}>{opponent}</strong>
              </div>
            </div>
            <p style={{ color: '#aaa' }}>Bersiaplah... Duel dimulai dalam 3 detik!</p>
          </div>
        )}

        {status === 'playing' && (
          <div style={{ textAlign: 'left', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', background: '#1e1e1e', padding: '10px', borderRadius: '4px' }}>
              <div>
                <span style={{ color: '#007acc' }}>Kamu:</span> {code.length} karakter
              </div>
              <div>
                <span style={{ color: '#e51400' }}>{opponent}:</span> {opponentProgress} karakter
              </div>
            </div>
            <p style={{ color: '#FFD700', marginBottom: '10px', fontWeight: 'bold' }}>Tugas: Selesaikan fungsi di bawah agar bisa menambah 2 angka!</p>
            <textarea
              className="code-editor-textarea"
              style={{ flex: 1, width: '100%', background: '#1e1e1e', color: '#d4d4d4', padding: '15px', fontFamily: 'monospace', fontSize: '14px', border: '1px solid #333', resize: 'none' }}
              value={code}
              onChange={handleCodeChange}
              spellCheck={false}
              autoFocus
            />
          </div>
        )}

        {status === 'won' && (
          <div style={{ padding: '40px 0', animation: 'fadeIn 0.5s' }}>
            <Trophy size={64} style={{ color: '#FFD700', margin: '0 auto' }} />
            <h2 style={{ color: '#FFD700', margin: '20px 0' }}>KAMU MENANG!</h2>
            <p>Hebat! Kecepatanmu mengalahkan <strong>{opponent}</strong>.</p>
            <p style={{ color: '#4CAF50', fontWeight: 'bold', margin: '10px 0' }}>+200 XP Diterima</p>
            <button className="vscode-btn primary-btn" onClick={() => setStatus('idle')} style={{ marginTop: '20px' }}>Main Lagi</button>
          </div>
        )}

        {status === 'lost' && (
          <div style={{ padding: '40px 0', animation: 'fadeIn 0.5s' }}>
            <Frown size={64} style={{ color: '#e51400', margin: '0 auto' }} />
            <h2 style={{ color: '#e51400', margin: '20px 0' }}>KAMU KALAH</h2>
            <p><strong>{opponent}</strong> menyelesaikan kode lebih cepat darimu.</p>
            <button className="vscode-btn primary-btn" onClick={() => setStatus('idle')} style={{ marginTop: '20px' }}>Coba Lagi</button>
          </div>
        )}

      </div>
    </div>
  )
}

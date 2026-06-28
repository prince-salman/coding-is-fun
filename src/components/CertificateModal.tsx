import { Award, Download, X } from 'lucide-react'
import '../App.css'

export function CertificateModal({
  playerName,
  onClose,
}: {
  playerName: string
  onClose: () => void
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-content certificate-modal" style={{ maxWidth: '800px', width: '90%' }}>
        <button className="modal-close hide-on-print" onClick={onClose} aria-label="Tutup">
          <X size={20} />
        </button>
        <div id="certificate-content" className="certificate-body" style={{ textAlign: 'center', padding: '40px', border: '10px solid #2d2d2d', background: '#1e1e1e', color: '#fff', borderRadius: '10px' }}>
          <Award size={64} style={{ color: '#FFD700', marginBottom: '20px' }} />
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#FFD700', textTransform: 'uppercase', fontFamily: 'serif' }}>Sertifikat Kelulusan</h1>
          <p style={{ fontSize: '1.2rem', color: '#aaa' }}>Diberikan dengan penuh rasa bangga kepada:</p>
          <h2 style={{ fontSize: '3rem', margin: '20px 0', borderBottom: '2px solid #555', paddingBottom: '10px', fontFamily: 'monospace' }}>{playerName}</h2>
          <p style={{ fontSize: '1.2rem', color: '#ccc', lineHeight: '1.6' }}>
            Telah berhasil menyelesaikan seluruh rangkaian kurikulum <br />
            <strong>Full-Stack Web Development</strong> (HTML, CSS, JavaScript) <br />
            di platform edukasi TechNova.
          </p>
          <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'cursive', fontSize: '1.5rem', color: '#FFD700', marginBottom: '10px' }}>Pak Budi & Tim</div>
              <div style={{ borderBottom: '1px solid #aaa', width: '200px', margin: '0 auto 5px' }}></div>
              <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Instruktur Utama</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '10px', fontFamily: 'monospace', paddingTop: '1.5rem' }}>{new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <div style={{ borderBottom: '1px solid #aaa', width: '200px', margin: '0 auto 5px' }}></div>
              <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Tanggal Kelulusan</p>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '20px' }} className="hide-on-print">
          <button className="vscode-btn primary-btn" onClick={() => window.print()} style={{ fontSize: '1.1rem', padding: '10px 20px', cursor: 'pointer' }}>
            <Download size={18} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} />
            Unduh PDF (Print)
          </button>
        </div>
      </div>
    </div>
  )
}

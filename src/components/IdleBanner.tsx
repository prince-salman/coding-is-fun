import { Coffee } from 'lucide-react'

const MESSAGES = [
  'Masih di sana? Ayo lanjutkan tantanganmu, kariermu menanti! ',
  'Jangan menyerah — setiap baris kode membawamu lebih dekat ke gelar berikutnya. ',
  'Butuh rehat sejenak? Tidak apa-apa. Tapi ingat, TechNova butuh kamu! ',
  'Tips: baca lagi instruksi tugasnya pelan-pelan, kamu pasti bisa. ',
]

interface IdleBannerProps {
  playerName: string
}

export function IdleBanner({ playerName }: IdleBannerProps) {
  const name = playerName || 'Developer'
  const text = MESSAGES.map((m) => `${name}, ${m}`).join('   •   ')

  return (
    <div className="idle-banner" role="status" aria-live="polite" lang="id">
      <Coffee size={14} aria-hidden="true" className="idle-banner-icon" />
      <div className="idle-banner-track">
        <span className="idle-banner-text">{text}</span>
        <span className="idle-banner-text" aria-hidden="true">
          {text}
        </span>
      </div>
    </div>
  )
}

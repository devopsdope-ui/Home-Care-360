import { useEffect, useState, useMemo } from 'react'
import { ms } from './fxConfig'

const BRAND_COLORS = ['#315cf5', '#32b768', '#f5a623', '#e5484d']

export interface ConfettiProps {
  onDone?: () => void
}

export function Confetti({ onDone }: ConfettiProps = {}) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      onDone?.()
    }, ms(2200))
    return () => clearTimeout(timer)
  }, [onDone])

  const pieces = useMemo(() => {
    return Array.from({ length: 28 }, (_, i) => {
      const color = BRAND_COLORS[i % BRAND_COLORS.length]
      const left = Math.round(Math.random() * 90 + 5)
      const tx = Math.round((Math.random() - 0.5) * 260)
      const ty = Math.round(Math.random() * 320 + 380)
      const rot = Math.round(Math.random() * 720 - 360)
      const delay = (Math.random() * 0.35).toFixed(2)
      const duration = (Math.random() * 0.5 + 1.5).toFixed(2)
      const sizeW = Math.round(Math.random() * 6 + 6)
      const sizeH = Math.round(sizeW * (Math.random() > 0.4 ? 1.6 : 1))

      const style: React.CSSProperties & Record<string, string | number> = {
        position: 'absolute',
        left: `${left}%`,
        top: '-16px',
        width: `${sizeW}px`,
        height: `${sizeH}px`,
        backgroundColor: color,
        borderRadius: i % 4 === 0 ? '50%' : '2px',
        opacity: 1,
        '--fx-tx': `${tx}px`,
        '--fx-ty': `${ty}px`,
        '--fx-rot': `${rot}deg`,
        '--fx-color': color,
        animation: `fx-confetti ${duration}s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s forwards`,
      }

      return { id: i, style }
    })
  }, [])

  if (!visible) return null

  return (
    <div className="fx-confetti-container" aria-hidden="true">
      {pieces.map(piece => (
        <span
          key={piece.id}
          className="fx-confetti-piece"
          style={piece.style}
        />
      ))}
    </div>
  )
}

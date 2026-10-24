import { useEffect, useState, useRef, useMemo } from 'react'
import { ms, prefersReducedMotion } from './fxConfig'

export interface ProcessingOverlayProps {
  open: boolean
  title: string
  steps: string[]
  durationMs: number
  variant: 'bar' | 'radar'
  dotCount?: number
  onDone: () => void
}

export function ProcessingOverlay({
  open,
  title,
  steps,
  durationMs,
  variant,
  dotCount = 3,
  onDone,
}: ProcessingOverlayProps) {
  const [progress, setProgress] = useState(0)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const [visibleDots, setVisibleDots] = useState(0)

  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone
  const hasCalledOnDoneRef = useRef(false)

  const radarDots = useMemo(() => {
    const count = dotCount > 0 ? dotCount : 3
    return Array.from({ length: count }, (_, i) => {
      const angle = (i * (360 / count) + 30) * (Math.PI / 180)
      const radius = 24 + ((i * 11) % 18)
      const x = 50 + Math.cos(angle) * radius
      const y = 50 + Math.sin(angle) * radius
      return { x: `${x.toFixed(1)}%`, y: `${y.toFixed(1)}%` }
    })
  }, [dotCount])

  useEffect(() => {
    if (!open) {
      setProgress(0)
      setCurrentStepIndex(0)
      setIsDone(false)
      setVisibleDots(0)
      hasCalledOnDoneRef.current = false
      return
    }

    hasCalledOnDoneRef.current = false
    const reduced = prefersReducedMotion()
    const totalDuration = reduced ? ms(600) : ms(durationMs)
    const startTime = performance.now()
    const stepCount = Math.max(1, steps.length)
    const totalDots = dotCount > 0 ? dotCount : 3

    let popTimer: ReturnType<typeof setTimeout> | undefined

    const intervalId = setInterval(() => {
      const now = performance.now()
      const elapsed = now - startTime
      const fraction = Math.min(1, elapsed / totalDuration)

      setProgress(Math.round(fraction * 100))

      const stepIdx = Math.min(stepCount - 1, Math.floor(fraction * stepCount))
      setCurrentStepIndex(stepIdx)

      const dots = Math.min(totalDots, Math.floor(fraction * (totalDots + 1)))
      setVisibleDots(dots)

      if (fraction >= 1) {
        clearInterval(intervalId)
        setIsDone(true)

        popTimer = setTimeout(() => {
          if (!hasCalledOnDoneRef.current) {
            hasCalledOnDoneRef.current = true
            onDoneRef.current()
          }
        }, reduced ? 0 : ms(350))
      }
    }, 20)

    return () => {
      clearInterval(intervalId)
      if (popTimer) clearTimeout(popTimer)
    }
  }, [open, durationMs, steps.length, dotCount])

  if (!open) return null

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal" style={{ textAlign: 'center', maxWidth: '420px' }}>
        <h2>{title}</h2>

        {variant === 'radar' && (
          <div className="fx-radar-container" aria-hidden="true">
            <div className="fx-radar-ring fx-radar-ring-1" />
            <div className="fx-radar-ring fx-radar-ring-2" />
            <div className="fx-radar-ring fx-radar-ring-3" />
            <div className="fx-radar-sweep" />
            <div className="fx-radar-center" />
            {radarDots.map((dot, i) => (
              <div
                key={i}
                className={`fx-radar-dot ${i < visibleDots ? 'fx-visible' : ''}`}
                style={{ left: dot.x, top: dot.y }}
              />
            ))}
          </div>
        )}

        <div className="fx-bar-track">
          <div
            className="fx-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        {steps.length > 0 && (
          <div className="fx-steps-list">
            {steps.map((step, idx) => {
              const isFinished = isDone || idx < currentStepIndex
              const isActive = !isDone && idx === currentStepIndex
              return (
                <div
                  key={idx}
                  className={`fx-step-item ${isFinished ? 'fx-step-done' : ''} ${
                    isActive ? 'fx-step-active' : ''
                  }`}
                >
                  <span className="fx-step-icon">
                    {isFinished ? (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <span className="fx-step-bullet" />
                    )}
                  </span>
                  <span className="fx-step-label">{step}</span>
                </div>
              )
            })}
          </div>
        )}

        {isDone && (
          <div className="fx-complete-banner fx-pop">
            <div className="fx-check-circle">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

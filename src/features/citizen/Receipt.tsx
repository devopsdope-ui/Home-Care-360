import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { Icon } from '../../components/common/Icon'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { Confetti } from '../../components/common/Confetti'
import { ms, prefersReducedMotion } from '../../components/common/fxConfig'
import type { CitizenView } from '../../types'

const celebratedJobIds = new Set<string>()

function useCountUp(target: number, duration = 900): number {
  const [val, setVal] = useState(prefersReducedMotion() ? target : 0)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setVal(target)
      return
    }

    setVal(0)
    const startTime = performance.now()
    const targetVal = target
    let rafId: number

    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(1, elapsed / ms(duration))
      const ease = 1 - Math.pow(1 - progress, 3)
      const current = targetVal * ease
      setVal(current)

      if (progress < 1) {
        rafId = requestAnimationFrame(step)
      } else {
        setVal(targetVal)
      }
    }

    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [target, duration])

  return val
}

export function Receipt({ go }: { go: (v: CitizenView) => void }) {
  const { activeJob, transactions, setActiveRequestId, requests, notifications } = useApp()
  const [downloadMsg, setDownloadMsg] = useState(false)

  const jobId = activeJob?.id || 'HC-301'
  const serviceName = activeJob?.serviceName || 'Plumbing'
  const techName = activeJob?.assignedTechName || 'Ravi Verma'
  const basePrice = activeJob?.agreedPrice || 500
  const fee = activeJob?.feeAmount || 25
  const gst = activeJob?.gstAmount || 94.5
  const total = activeJob?.totalPaid || 619.5
  const paymentRef = activeJob?.paymentRef || 'HC360-241026-301'

  const animatedTotal = useCountUp(total, 900)

  // Determine if this job was just released vs opened from history
  const isJustReleased =
    Boolean(activeJob) &&
    activeJob?.escrowStatus === 'released' &&
    notifications[0]?.title === `Escrow Released for ${jobId}` &&
    !celebratedJobIds.has(jobId)

  const [showConfetti, setShowConfetti] = useState(() => {
    if (isJustReleased && !prefersReducedMotion()) {
      celebratedJobIds.add(jobId)
      return true
    }
    return false
  })

  // Staggered fade for receipt rows (150 ms apart)
  const [visibleRows, setVisibleRows] = useState(prefersReducedMotion() ? 4 : 1)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setVisibleRows(4)
      return
    }
    setVisibleRows(1)
    const t1 = setTimeout(() => setVisibleRows(2), ms(150))
    const t2 = setTimeout(() => setVisibleRows(3), ms(300))
    const t3 = setTimeout(() => setVisibleRows(4), ms(450))
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [jobId])

  const handleDownload = () => {
    setDownloadMsg(true)
    setTimeout(() => {
      window.print?.()
      setDownloadMsg(false)
    }, 400)
  }

  return (
    <div className="page center-page" style={{ maxWidth: '900px' }}>
      {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}
      <div className="digital-receipt" style={{ width: '100%' }}>
        <div className="receipt-brand">
          <div className="brand">
            <span className="brand-mark">
              <Icon name="home" size={16} />
            </span>
            <span>
              HOMECARE <b>360</b>
            </span>
          </div>
          <Badge tone="green">PAID · ESCROW RELEASED</Badge>
        </div>

        <div className="receipt-title">
          <p>MUNICIPAL TAX INVOICE</p>
          <h1>{jobId}</h1>
          <span>24 Oct 2026 · {activeJob?.afterPhotoTime || '15:34'}</span>
        </div>

        <div className="receipt-service">
          <div className="service-icon">
            <Icon name="route" />
          </div>
          <div>
            <span>SERVICE VERIFIED</span>
            <b>{serviceName} Repair</b>
            <small>
              Technician: {techName} · PASSPORT-HC360-00004
            </small>
          </div>
        </div>

        <div className="receipt-lines">
          <div
            className="fx-slide-in"
            style={{
              opacity: visibleRows >= 1 ? 1 : 0,
              transition: prefersReducedMotion() ? 'none' : 'opacity 250ms ease',
            }}
          >
            <span>Base verified service</span>
            <b>₹{basePrice.toFixed(2)}</b>
          </div>
          <div
            className="fx-slide-in"
            style={{
              opacity: visibleRows >= 2 ? 1 : 0,
              transition: prefersReducedMotion() ? 'none' : 'opacity 250ms ease',
            }}
          >
            <span>
              Municipal infrastructure fee <small>5%</small>
            </span>
            <b>₹{fee.toFixed(2)}</b>
          </div>
          <div
            className="fx-slide-in"
            style={{
              opacity: visibleRows >= 3 ? 1 : 0,
              transition: prefersReducedMotion() ? 'none' : 'opacity 250ms ease',
            }}
          >
            <span>
              GST <small>18%</small>
            </span>
            <b>₹{gst.toFixed(2)}</b>
          </div>
          <div
            className="receipt-total fx-slide-in"
            style={{
              opacity: visibleRows >= 4 ? 1 : 0,
              transition: prefersReducedMotion() ? 'none' : 'opacity 250ms ease',
            }}
          >
            <span>Total paid via escrow</span>
            <b>₹{animatedTotal.toFixed(2)}</b>
          </div>
        </div>

        <div className="receipt-proof">
          <Icon name="shield" />
          <span>
            <b>Transaction cryptographically verified</b> Payment reference · {paymentRef}
          </span>
        </div>
      </div>

      <div className="center-actions">
        <Button kind="secondary" icon="download" onClick={handleDownload}>
          {downloadMsg ? 'Preparing PDF...' : 'Download receipt / Print'}
        </Button>
        <Button icon="arrow" onClick={() => go('review')}>
          Continue to review
        </Button>
      </div>

      {/* Citizen Past Payment History Table */}
      <section className="table-card" style={{ width: '100%', marginTop: '36px', textAlign: 'left' }}>
        <div className="section-title">
          <h2>Your payment and transaction history</h2>
          <span className="muted">All payments protected under municipal escrow</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Receipt / Job</th>
              <th>Service</th>
              <th>Technician</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id}>
                <td>
                  <b>{t.jobId}</b>
                  <span style={{ display: 'block', fontSize: '9px', color: 'var(--muted)' }}>{t.date}</span>
                </td>
                <td>{t.service}</td>
                <td>{t.technician}</td>
                <td>
                  <Badge tone={t.status === 'Paid' ? 'green' : 'amber'}>{t.status}</Badge>
                </td>
                <td>
                  <b>₹{t.amount}</b>
                </td>
                <td>
                  <button
                    className="text-link"
                    onClick={() => {
                      const matchedReq = requests.find(r => r.id === t.jobId)
                      if (matchedReq) setActiveRequestId(matchedReq.id)
                    }}
                  >
                    View Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

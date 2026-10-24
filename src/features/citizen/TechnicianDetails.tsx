import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Icon } from '../../components/common/Icon'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { Rating } from '../../components/common/Rating'
import { ProcessingOverlay } from '../../components/common/ProcessingOverlay'
import { ms } from '../../components/common/fxConfig'
import type { CitizenView, VerificationDocument } from '../../types'

export function TechnicianDetails({ go }: { go: (v: CitizenView) => void }) {
  const { activeJob, acceptOffer, offers, negotiatingOffer, technicians } = useApp()

  const offer = negotiatingOffer || offers.find(o => o.requestId === activeJob?.id) || offers[0]
  const techName = offer?.name || activeJob?.assignedTechName || 'Ravi Verma'
  const initials = offer?.initials || activeJob?.assignedTechInitials || 'RV'
  const rating = offer?.rating || '4.9'
  const jobs = offer?.jobs ?? 247
  const distance = offer?.distance || '2.4 km'
  const eta = offer?.eta || '8 min'
  const price = offer?.price || activeJob?.agreedPrice || 650

  const matchingTech =
    (offer?.name ? technicians.find(t => t.name === offer.name) : undefined) ||
    (offer?.phone ? technicians.find(t => t.phone === offer.phone) : undefined)

  const trustScore = matchingTech?.trustScore ?? 94

  const defaultDocs: VerificationDocument[] = [
    { name: 'Govt ID Verified', date: '', status: 'verified' },
    { name: 'Police Background Cleared', date: '', status: 'verified' },
    { name: 'Level 3 Trade Certified', date: '', status: 'verified' },
    { name: 'Safety & Hygiene Compliant', date: '', status: 'verified' },
  ]
  const documents =
    matchingTech?.documents && matchingTech.documents.length > 0
      ? matchingTech.documents
      : defaultDocs

  const [isLocking, setIsLocking] = useState<boolean>(false)

  const handleAccept = () => {
    setIsLocking(true)
  }

  const handleLockDone = () => {
    const targetRequestId = offer?.requestId || activeJob?.id
    if (targetRequestId && offer) {
      acceptOffer(targetRequestId, { ...offer, price })
    }
    setIsLocking(false)
    go('locked')
  }

  return (
    <div className="page narrow-page">
      <button className="back" onClick={() => go('offers')}>
        ← Back to all offers
      </button>

      <div className="profile-hero">
        <div className="profile-avatar">
          {initials}
          <span>
            <Icon name="check" size={16} />
          </span>
        </div>
        <div>
          <p className="eyebrow">VERIFIED PROFESSIONAL</p>
          <h1>{techName}</h1>
          <div className="profile-meta">
            <Rating value={rating} />
            <span>{jobs} completed jobs</span>
            <span>{distance.includes('away') ? distance : `${distance} away`}</span>
            <span>{eta.startsWith('ETA') ? eta : `ETA ${eta}`}</span>
          </div>
        </div>
        <div className="trust-score">
          <span>TRUST SCORE</span>
          <strong>
            {trustScore}<small>/ 100</small>
          </strong>
          <div>
            <i style={{ width: `${trustScore}%` }} />
          </div>
        </div>
      </div>

      <div className="details-grid">
        <section className="detail-card">
          <p className="eyebrow">VERIFICATION</p>
          <h2>Credential checks</h2>
          {documents.map(doc => {
            const isVerified = doc.status === 'verified'
            return (
              <div className="verification-row" key={doc.name}>
                <span>
                  <Icon name="check" size={14} />
                </span>
                {doc.name}
                <Badge tone={isVerified ? 'green' : 'amber'}>
                  {isVerified ? 'VERIFIED' : 'PENDING'}
                </Badge>
              </div>
            )
          })}
        </section>

        <section className="quote-card">
          <p className="eyebrow">QUOTE FOR {activeJob?.id || 'HC-301'}</p>
          <h3>{activeJob?.serviceName || 'Plumbing'} repair</h3>
          <strong>₹{price}</strong>
          <p>Includes inspection, basic materials, and labour. Parts quoted separately if required.</p>
          <div className="quote-buttons">
            <Button kind="secondary" onClick={() => go('negotiate')} disabled={isLocking}>
              Counter offer
            </Button>
            <Button onClick={handleAccept} disabled={isLocking}>Accept offer</Button>
          </div>
        </section>
      </div>

      <ProcessingOverlay
        open={isLocking}
        title="Locking your price"
        steps={[
          'Confirming price with technician',
          `Holding ₹${price} in escrow`,
          'Generating agreement',
        ]}
        durationMs={ms(1800)}
        variant="bar"
        onDone={handleLockDone}
      />
    </div>
  )
}

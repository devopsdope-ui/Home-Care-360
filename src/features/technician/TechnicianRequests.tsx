import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Icon } from '../../components/common/Icon'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { dataStore } from '../../services/dataStore'
import type { Offer } from '../../types'

export function TechnicianRequests({ setView }: { setView: (v: string) => void }) {
  const { requests, activeJob, setActiveRequestId, acceptOffer } = useApp()

  const currentReq = activeJob || requests[0]
  const [quotePrice, setQuotePrice] = useState<string>(currentReq?.agreedPrice ? currentReq.agreedPrice.toString() : '650')
  const [quoted, setQuoted] = useState(false)
  const [rejected, setRejected] = useState(false)
  const [showWaiting, setShowWaiting] = useState(false)

  const tech = dataStore.getTechnicians().find(t => t.id === 'TECH-01') || dataStore.getTechnicians()[0]
  const req = dataStore.getRequest(currentReq?.id) || currentReq
  const isLockedForTech = req?.status === 'price_locked' && req?.assignedTechId === 'TECH-01'

  const status = req?.status || currentReq?.status || 'pending'
  const isMasked = status === 'pending' || status === 'quoted'
  const addressParts = (currentReq?.address || '').split(',')
  const area = addressParts[1]?.trim() || currentReq?.address || ''
  const displayAddress = isMasked ? area : currentReq?.address
  const displayPhone = isMasked ? '+91 XXXXX XXXXX' : currentReq?.citizenPhone

  const handleSendQuote = () => {
    if (currentReq && tech) {
      const parsedPrice = parseInt(quotePrice, 10) || currentReq.agreedPrice || 500
      const band = dataStore.getPriceBand(currentReq.serviceCode || currentReq.serviceName)
      const verdict = dataStore.getPriceVerdict(parsedPrice, band)
      const offer: Offer = {
        id: `OFFER-${currentReq.id}-${tech.id}`,
        requestId: currentReq.id,
        name: tech.name,
        initials: tech.initials,
        rating: String(tech.rating),
        jobs: tech.jobsCompleted,
        distance: '2.4 km',
        eta: '8 min',
        price: parsedPrice,
        deal: verdict.label,
        pct: verdict.pct,
        tone: verdict.tone,
        phone: tech.phone,
      }
      dataStore.saveTechnicianOffer(offer)
      setQuoted(true)
    }
  }

  const handleClaimJob = () => {
    if (isLockedForTech) {
      setView('job')
    } else {
      setShowWaiting(true)
    }
  }

  const handleInstantAccept = () => {
    if (currentReq && tech) {
      const budget = currentReq.agreedPrice || 500
      const band = dataStore.getPriceBand(currentReq.serviceCode || currentReq.serviceName)
      const verdict = dataStore.getPriceVerdict(budget, band)
      acceptOffer(currentReq.id, {
        id: `OFFER-${currentReq.id}-${tech.id}`,
        requestId: currentReq.id,
        name: tech.name,
        initials: tech.initials,
        rating: String(tech.rating),
        jobs: tech.jobsCompleted,
        distance: '2.4 km',
        eta: '8 min',
        price: budget,
        deal: verdict.label,
        pct: verdict.pct,
        tone: verdict.tone,
        phone: tech.phone,
      })
      setView('job')
    }
  }

  return (
    <div className="page narrow-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <button className="back" onClick={() => setView('overview')} style={{ margin: 0 }}>
          ← Back to incoming requests
        </button>

        {requests.length > 1 && (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: 700 }}>SELECT:</span>
            {requests.slice(0, 4).map(r => (
              <button
                key={r.id}
                className={r.id === currentReq?.id ? 'button primary' : 'button secondary'}
                style={{ height: '28px', padding: '0 8px', fontSize: '10px' }}
                onClick={() => {
                  setActiveRequestId(r.id)
                  setQuoted(false)
                  setRejected(false)
                  setQuotePrice(r.agreedPrice.toString())
                }}
              >
                {r.id}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="eyebrow blue">
        REQUEST · {currentReq?.id || 'HC-301'} · {currentReq?.serviceName.toUpperCase()}
      </p>

      <div className="split-heading">
        <div>
          <h1>{currentReq?.description || 'Burst kitchen pipe'}</h1>
          <p className="subhead">
            Posted by {currentReq?.citizenName || 'Rahul Sharma'} · {currentReq?.createdAt || 'just now'}
          </p>
        </div>
        <Badge tone={currentReq?.priority === 'urgent' ? 'red' : 'green'}>
          {currentReq?.priority === 'urgent' ? 'HIGH PRIORITY SOS' : 'OPEN FOR QUOTES'}
        </Badge>
      </div>

      {rejected ? (
        <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '16px', padding: '36px', textAlign: 'center' }}>
          <div className="modal-icon" style={{ background: '#fff0d9', color: 'var(--amber)', margin: '0 auto 12px' }}>
            <Icon name="close" size={20} />
          </div>
          <h2>Request Declined</h2>
          <p style={{ color: 'var(--muted)', fontSize: '12px', marginBottom: '18px' }}>
            You have declined request {currentReq?.id}. It has been returned to the municipal dispatch pool.
          </p>
          <Button onClick={() => setView('overview')}>Return to incoming radar</Button>
        </div>
      ) : (
        <div className="details-grid">
          <section className="detail-card">
            <h3>Customer problem description</h3>
            <p className="quote-text">“{currentReq?.description}”</p>

            <div className="request-detail-list">
              <div>
                <Icon name="user" />
                <span>
                  Customer
                  <b>{currentReq?.citizenName}</b>
                </span>
              </div>
              <div>
                <Icon name="pin" />
                <span>
                  Distance & Area
                  <b>{isMasked ? area : (currentReq?.address ? `${currentReq.address.slice(0, 24)}...` : '')}</b>
                </span>
              </div>
              <div>
                <Icon name="clock" />
                <span>
                  Target arrival
                  <b>{currentReq?.scheduledTime}</b>
                </span>
              </div>
              <div>
                <Icon name="wallet" />
                <span>
                  Base price range
                  <b>₹{currentReq?.agreedPrice - 50}–₹{currentReq?.agreedPrice + 150}</b>
                </span>
              </div>
            </div>

            <div style={{ marginTop: '20px', borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
              <span style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>
                CITIZEN CONTACT & ADDRESS
              </span>
              <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)', margin: 0 }}>
                {displayAddress}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
                Phone: {displayPhone}{isMasked ? ' (Encrypted via platform until dispatch)' : ''}
              </p>
            </div>
          </section>

          <aside className="quote-card">
            <p className="eyebrow">YOUR SPECIALIST QUOTE</p>
            <label>
              Labour and inspection fee (₹)
              <div className="price-input">
                <span>₹</span>
                <input
                  type="number"
                  value={quotePrice}
                  onChange={e => setQuotePrice(e.target.value)}
                  placeholder="650"
                />
              </div>
            </label>
            <small>Parts can be documented in photographic custody and added with citizen approval.</small>

            {quoted ? (
              <div style={{ display: 'grid', gap: '10px' }}>
                <Badge tone="green">QUOTE BROADCASTED SUCCESSFULLY</Badge>
                <p style={{ fontSize: '10px', color: 'var(--muted)', lineHeight: '1.4' }}>
                  Citizen has received your quote of ₹{quotePrice}. You may directly accept and claim this assignment.
                </p>
                <Button onClick={handleClaimJob}>Accept and claim job</Button>
                {(!isLockedForTech || showWaiting) && (
                  <small style={{ fontSize: '11px', color: 'var(--muted)' }}>
                    Waiting for the customer to accept your quote.
                  </small>
                )}
                <Button kind="secondary" onClick={() => setView('job')}>
                  Open active job tracker
                </Button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '8px' }}>
                <Button onClick={handleSendQuote}>Submit quote (₹{quotePrice})</Button>
                <Button kind="secondary" onClick={handleInstantAccept}>
                  Instant Accept for ₹{currentReq?.agreedPrice || 500}
                </Button>
                <Button kind="ghost" onClick={() => setRejected(true)}>
                  Decline request
                </Button>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  )
}

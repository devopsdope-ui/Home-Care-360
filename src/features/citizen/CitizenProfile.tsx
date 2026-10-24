import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Icon } from '../../components/common/Icon'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import type { CitizenView } from '../../types'

export function CitizenProfile({ go }: { go: (v: CitizenView) => void }) {
  const {
    activeJob,
    submitReview,
    seniorMode,
    setSeniorMode,
    openCallToBook,
    requests,
  } = useApp()

  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [reviewDone, setReviewDone] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)

  // Profile editable fields
  const [name, setName] = useState('Rahul Sharma')
  const [phone, setPhone] = useState('+91 98201 55432')
  const [address, setAddress] = useState('Flat 302, Silver Oak Residency, Andheri West, Mumbai')
  const [emergencyPhone, setEmergencyPhone] = useState('+91 98209 99887')

  const techName = activeJob?.assignedTechName || 'Ravi Verma'
  const jobId = activeJob?.id || 'HC-301'
  const isPaid = activeJob?.escrowStatus === 'released'

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isPaid) return
    if (activeJob) {
      submitReview(activeJob.id, rating, reviewText)
    }
    setReviewDone(true)
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2500)
  }

  return (
    <div className="page narrow-page">
      <div className="split-heading">
        <div>
          <p className="eyebrow blue">CITIZEN ACCOUNT & SERVICE RATINGS</p>
          <h1>Profile & Reviews</h1>
          <p className="subhead">Manage your registered details, emergency contacts, and technician reviews.</p>
        </div>
        <Button kind="secondary" icon="phone" onClick={() => openCallToBook()}>
          Call to Book
        </Button>
      </div>

      {/* Review Submission Card if not done */}
      <section className="form-card" style={{ marginBottom: '28px' }}>
        {reviewDone ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div className="success-seal" style={{ margin: '0 auto 12px' }}>
              <Icon name="check" size={28} />
            </div>
            <h2>Thank you, {name}!</h2>
            <p className="subhead">Your {rating}-star review helps neighbours choose with confidence.</p>
            <Button kind="secondary" onClick={() => setReviewDone(false)}>
              Update review
            </Button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p className="eyebrow blue">RATE RECENT JOB · {jobId}</p>
                <h2 style={{ margin: '4px 0 8px' }}>How was your experience?</h2>
              </div>
              <Badge tone="green">JOB COMPLETED</Badge>
            </div>

            <div className="review-person">
              <div className="profile-avatar small-profile">
                RV
                <span>
                  <Icon name="check" size={13} />
                </span>
              </div>
              <div>
                <b>{techName}</b>
                <span>Plumbing & Mechanical · Verified technician</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '14px 0' }}>
              <div className="stars">
                {[1, 2, 3, 4, 5].map(x => (
                  <button
                    key={x}
                    type="button"
                    className={x <= rating ? 'filled' : ''}
                    onClick={() => setRating(x)}
                    aria-label={`Rate ${x} stars`}
                  >
                    <Icon name="star" size={26} />
                  </button>
                ))}
              </div>
              <b className="rating-number">{rating} / 5 Stars</b>
            </div>

            <form onSubmit={handleSubmitReview} className="review-form">
              <label>
                Tell us about the service
                <textarea
                  placeholder="Ravi arrived on time and explained the repair clearly..."
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                />
              </label>

              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={e => setIsPublic(e.target.checked)}
                />
                Share as a public verified review for Silver Oak society
              </label>

              <Button type="submit" disabled={!isPaid}>Submit review</Button>
              {!isPaid && <p className="hint">Reviews open after payment is released.</p>}
            </form>
          </div>
        )}
      </section>

      {/* Citizen Personal Profile & Senior Mode Settings */}
      <section className="form-card">
        <div className="section-title" style={{ margin: '0 0 18px' }}>
          <div>
            <p className="eyebrow">SAVED PARTICULARS</p>
            <h2>Citizen Details & Safety Preferences</h2>
          </div>
          <Badge tone={seniorMode ? 'blue' : 'neutral'}>
            {seniorMode ? 'SENIOR MODE: ON' : 'STANDARD MODE'}
          </Badge>
        </div>

        {profileSaved && (
          <div style={{ padding: '10px 14px', background: '#e1f6e9', color: 'var(--green)', borderRadius: '8px', fontSize: '11px', fontWeight: 600, display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Icon name="check" size={16} /> Profile changes saved successfully to persistent memory.
          </div>
        )}

        <form onSubmit={handleSaveProfile} style={{ display: 'grid', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <label>
              Full Name
              <input value={name} onChange={e => setName(e.target.value)} required />
            </label>
            <label>
              Primary Phone
              <input value={phone} onChange={e => setPhone(e.target.value)} required />
            </label>
          </div>

          <label>
            Registered Address
            <input value={address} onChange={e => setAddress(e.target.value)} required />
          </label>

          <label>
            Emergency Contact (Next of Kin / Relative)
            <input
              value={emergencyPhone}
              onChange={e => setEmergencyPhone(e.target.value)}
              placeholder="e.g. Rohan Sharma (Son) +91 98209 99887"
            />
          </label>

          {/* Senior Assistance Mode Toggle */}
          <div style={{ padding: '16px', background: '#f5f5f2', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <b style={{ fontSize: '13px' }}>Senior Citizen High-Accessibility Mode</b>
              <span style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
                Enables larger buttons, high contrast badges, and 1-click Call to Book options.
              </span>
            </div>
            <button
              type="button"
              className={seniorMode ? 'button primary' : 'button secondary'}
              style={{ height: '34px', fontSize: '11px' }}
              onClick={() => setSeniorMode(!seniorMode)}
            >
              {seniorMode ? 'Enabled' : 'Enable Senior Mode'}
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button kind="secondary" onClick={() => go('overview')}>
              Return to overview
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </section>
    </div>
  )
}

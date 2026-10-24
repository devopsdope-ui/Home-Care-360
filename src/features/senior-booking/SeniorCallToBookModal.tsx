import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { Icon } from '../../components/common/Icon'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'

export function SeniorCallToBookModal() {
  const {
    isCallToBookOpen,
    closeCallToBook,
    callToBookCategory,
    services,
    createServiceRequest,
    setView,
    setActiveRequestId,
  } = useApp()

  const [selectedServiceCode, setSelectedServiceCode] = useState<string>('SRV-01')
  const [phone, setPhone] = useState<string>('+91 98201 55432')
  const [address, setAddress] = useState<string>('Flat 302, Silver Oak Residency, Andheri West, Mumbai')
  const [description, setDescription] = useState<string>('Requested voice-assisted booking for home service.')
  const [urgency, setUrgency] = useState<'standard' | 'urgent'>('standard')
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (callToBookCategory) {
      setSelectedServiceCode(callToBookCategory.code)
      setDescription(`Assisted booking request for ${callToBookCategory.name}.`)
    } else {
      setSelectedServiceCode('SRV-01')
      setDescription('Urgent leak and tap repair assistance.')
    }
    setConfirmedBookingId(null)
    setError(null)
  }, [callToBookCategory, isCallToBookOpen])

  if (!isCallToBookOpen) return null

  const currentCategory = services.find(s => s.code === selectedServiceCode) || services[0]

  const handleConfirm = () => {
    // Validation
    if (!phone.trim()) {
      setError('Please provide a valid contact phone number so our operator can call you.')
      return
    }
    if (!address.trim()) {
      setError('Please provide the service address.')
      return
    }

    setError(null)
    setIsSubmitting(true)

    setTimeout(() => {
      const newReq = createServiceRequest({
        serviceCode: currentCategory.code,
        serviceName: currentCategory.name,
        description: description || `Voice telephone booking for ${currentCategory.name}`,
        address,
        citizenName: 'Rahul Sharma',
        citizenPhone: phone,
        priority: urgency,
        bookingSource: 'senior_call_to_book',
        scheduledTime: urgency === 'urgent' ? 'Immediate priority' : 'Within 30 minutes',
        agreedPrice: currentCategory.startingPrice,
      })

      setIsSubmitting(false)
      setConfirmedBookingId(newReq.id)
    }, 450)
  }

  const handleFinishAndTrack = () => {
    if (confirmedBookingId) {
      setActiveRequestId(confirmedBookingId)
      closeCallToBook()
      setView('job')
    }
  }

  return (
    <div
      className="modal-backdrop"
      onClick={closeCallToBook}
      role="dialog"
      aria-modal="true"
      aria-labelledby="call-to-book-title"
    >
      <div
        className="modal"
        style={{ maxWidth: '580px', padding: '30px' }}
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close" onClick={closeCallToBook} aria-label="Cancel and close">
          <Icon name="close" size={20} />
        </button>

        {confirmedBookingId ? (
          /* Confirmation Success Panel */
          <div style={{ textAlign: 'center' }}>
            <div
              className="success-seal"
              style={{ width: '68px', height: '68px', margin: '0 auto 16px' }}
            >
              <Icon name="check" size={36} />
            </div>
            <Badge tone="green">BOOKING CONFIRMED · OPERATOR ASSIGNED</Badge>
            <h2 id="call-to-book-title" style={{ fontSize: '26px', margin: '12px 0 6px' }}>
              Booking Request Placed!
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '13px', lineHeight: '1.5', marginBottom: '22px' }}>
              Reference ID: <strong style={{ color: 'var(--ink)' }}>{confirmedBookingId}</strong>. An assisted
              care coordinator is dispatching a verified specialist to your residence.
            </p>

            <div
              style={{
                background: '#f8f9fc',
                border: '1px solid var(--line)',
                borderRadius: '14px',
                padding: '18px',
                textAlign: 'left',
                display: 'grid',
                gap: '10px',
                marginBottom: '22px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '.1em' }}>SERVICE</span>
                <b style={{ fontSize: '13px' }}>{currentCategory.name}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '.1em' }}>CALL-BACK PHONE</span>
                <b style={{ fontSize: '12px' }}>{phone}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '.1em' }}>ADDRESS</span>
                <span style={{ fontSize: '11px', textAlign: 'right', maxWidth: '65%' }}>{address}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '.1em' }}>ESTIMATED PRICING</span>
                <Badge tone="dark">ESCROW PROTECTED · ₹{currentCategory.startingPrice}</Badge>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <Button kind="secondary" onClick={closeCallToBook}>
                Back to Dashboard
              </Button>
              <Button icon="arrow" onClick={handleFinishAndTrack}>
                Track Service Status
              </Button>
            </div>
          </div>
        ) : (
          /* Booking Confirmation & Edit Details Form */
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '14px',
                  background: 'var(--blue)',
                  color: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <Icon name="phone" size={24} />
              </div>
              <div>
                <p className="eyebrow blue" style={{ margin: 0 }}>
                  SENIOR CITIZEN ASSISTED BOOKING
                </p>
                <h2 id="call-to-book-title" style={{ fontSize: '24px', margin: 0 }}>
                  Call to Book
                </h2>
              </div>
            </div>

            <p style={{ color: 'var(--muted)', fontSize: '12px', lineHeight: '1.5', marginBottom: '18px' }}>
              Prefer assistance without typing? Confirm your address and contact number below. Our dedicated
              HomeCare 360 care coordinator will arrange your verified specialist.
            </p>

            <div
              style={{
                background: '#f2f4fc',
                border: '1px solid #c8d0f0',
                borderRadius: '12px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '18px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="shield" size={16} />
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--blue)' }}>
                  Toll-Free Helpline: <strong>1800-555-0199</strong> (8 AM – 8 PM)
                </span>
              </div>
              <Badge tone="blue">SIMULATED ASSISTANCE</Badge>
            </div>

            {error && (
              <div
                style={{
                  padding: '10px 14px',
                  background: '#ffe1e1',
                  color: 'var(--red)',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Icon name="alert" size={16} />
                {error}
              </div>
            )}

            <div style={{ display: 'grid', gap: '16px' }}>
              {/* Select or Confirm Service */}
              <div>
                <label className="field-label" htmlFor="service-select">
                  Service Needed
                </label>
                <select
                  id="service-select"
                  value={selectedServiceCode}
                  onChange={e => setSelectedServiceCode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d3d2ce',
                    background: '#fff',
                    fontWeight: 600,
                    fontSize: '13px',
                    outline: 'none',
                  }}
                >
                  {services.map(s => (
                    <option key={s.code} value={s.code}>
                      {s.name} ({s.code}) — Estimated from ₹{s.startingPrice}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contact Phone */}
              <div>
                <label className="field-label" htmlFor="senior-phone">
                  Contact Phone (For Operator Call-Back)
                </label>
                <div className="input-with-icon">
                  <Icon name="phone" />
                  <input
                    id="senior-phone"
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              {/* Service Address */}
              <div>
                <label className="field-label" htmlFor="senior-address">
                  Home Address
                </label>
                <div className="input-with-icon">
                  <Icon name="pin" />
                  <input
                    id="senior-address"
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Enter full home address"
                  />
                </div>
              </div>

              {/* Priority Choice */}
              <div>
                <label className="field-label">Assistance Urgency</label>
                <div className="choice-row">
                  <button
                    type="button"
                    className={urgency === 'standard' ? 'choice selected' : 'choice'}
                    onClick={() => setUrgency('standard')}
                  >
                    <Icon name="clock" />
                    <span>
                      <b>Standard Booking</b>
                      <small>Coordinator calls back in 5 mins</small>
                    </span>
                  </button>
                  <button
                    type="button"
                    className={urgency === 'urgent' ? 'choice danger-choice selected' : 'choice danger-choice'}
                    onClick={() => setUrgency('urgent')}
                  >
                    <Icon name="alert" />
                    <span>
                      <b>Urgent Emergency</b>
                      <small>Immediate dispatch priority</small>
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'flex-end',
                marginTop: '24px',
                borderTop: '1px solid var(--line)',
                paddingTop: '18px',
              }}
            >
              <Button kind="secondary" onClick={closeCallToBook} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button icon="phone" onClick={handleConfirm} disabled={isSubmitting}>
                {isSubmitting ? 'Confirming...' : 'Confirm Call to Book'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

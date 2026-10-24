import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Icon } from '../../components/common/Icon'
import { Button } from '../../components/common/Button'
import { dataStore } from '../../services/dataStore'
import { ProcessingOverlay } from '../../components/common/ProcessingOverlay'
import { ms } from '../../components/common/fxConfig'
import type { CitizenView, ServiceCategory } from '../../types'

export function RequestScreen({ go }: { go: (v: CitizenView) => void }) {
  const { services, createServiceRequest, openCallToBook } = useApp()

  const [selectedServiceCode, setSelectedServiceCode] = useState<string>('SRV-01')
  const [description, setDescription] = useState('Burst pipe under kitchen sink. Water leaking continuously.')
  const [address, setAddress] = useState('Flat 302, Silver Oak Residency, Andheri West, Mumbai')
  const [urgent, setUrgent] = useState(false)
  const [scheduledTime, setScheduledTime] = useState('Immediate dispatch')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [overlayConfig, setOverlayConfig] = useState<{
    open: boolean
    steps: string[]
    dotCount: number
  }>({
    open: false,
    steps: [
      'Locating your area',
      'Scanning verified technicians within 3 km',
      'Collecting quotes',
    ],
    dotCount: 3,
  })

  const selectedCategory: ServiceCategory =
    services.find(s => s.code === selectedServiceCode) || services[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!description.trim()) {
      setError('Please provide a description of the problem.')
      return
    }
    if (!address.trim()) {
      setError('Please enter a valid service address.')
      return
    }

    setError(null)
    setIsSubmitting(true)

    const newReq = createServiceRequest({
      serviceCode: selectedCategory.code,
      serviceName: selectedCategory.name,
      description: description.trim(),
      address: address.trim(),
      priority: urgent ? 'urgent' : 'standard',
      scheduledTime,
      citizenName: 'Rahul Sharma',
      citizenPhone: '+91 98201 55432',
      bookingSource: 'citizen_web',
      agreedPrice: selectedCategory.startingPrice,
    })

    const offerCount = dataStore.getOffers(newReq.id).length
    const baseSteps = [
      'Locating your area',
      'Scanning verified technicians within 3 km',
      'Collecting quotes',
    ]
    const steps =
      offerCount === 0
        ? [...baseSteps, 'No verified technician yet. We keep searching.']
        : baseSteps

    setOverlayConfig({
      open: true,
      steps,
      dotCount: Math.min(offerCount, 5),
    })
  }

  const handleOverlayDone = () => {
    setOverlayConfig(prev => ({ ...prev, open: false }))
    setIsSubmitting(false)
    go('offers')
  }

  return (
    <div className="page narrow-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button className="back" onClick={() => go('overview')} style={{ margin: 0 }}>
          ← Back to services
        </button>
        <button className="text-link" onClick={() => openCallToBook(selectedCategory)}>
          <Icon name="phone" size={14} /> Prefer phone booking? Call to Book
        </button>
      </div>

      <div className="request-layout">
        <section>
          <p className="eyebrow blue">
            {selectedCategory.name.toUpperCase()} · {selectedCategory.code}
          </p>
          <h1>Request {selectedCategory.name.toLowerCase()} service</h1>
          <p className="subhead">Tell verified technicians what needs attention.</p>

          {/* Service Category selector tabs */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              padding: '8px 0',
              marginTop: '16px',
            }}
          >
            {services.map(s => (
              <button
                key={s.code}
                type="button"
                className={selectedServiceCode === s.code ? 'button primary' : 'button secondary'}
                style={{
                  height: '34px',
                  padding: '0 12px',
                  fontSize: '11px',
                  borderRadius: '99px',
                }}
                onClick={() => {
                  setSelectedServiceCode(s.code)
                  if (s.code === 'SRV-01') setDescription('Burst pipe under kitchen sink. Water leaking continuously.')
                  else if (s.code === 'SRV-02') setDescription('Power socket spark and tripped circuit breaker.')
                  else if (s.code === 'SRV-06') setDescription('Split AC not blowing cool air. Needs gas check.')
                  else setDescription(`Inspection and service required for ${s.name.toLowerCase()}.`)
                }}
              >
                {s.name}
              </button>
            ))}
          </div>

          <form className="form-card" onSubmit={handleSubmit}>
            {error && (
              <div
                style={{
                  padding: '10px 14px',
                  background: '#ffe1e1',
                  color: 'var(--red)',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Icon name="alert" size={16} />
                {error}
              </div>
            )}

            <label>
              Describe the problem
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g. Burst pipe under sink, leaking water, power trip, etc."
                required
              />
            </label>

            <label>
              Service address
              <div className="input-with-icon">
                <Icon name="pin" />
                <input
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Enter your flat/street address in Mumbai"
                  required
                />
              </div>
            </label>

            <label>
              Preferred schedule
              <div className="input-with-icon">
                <Icon name="clock" />
                <input
                  value={scheduledTime}
                  onChange={e => setScheduledTime(e.target.value)}
                  placeholder="e.g. Immediate dispatch, Today 4:00 PM, Tomorrow 10:00 AM"
                />
              </div>
            </label>

            <div>
              <label className="field-label">Dispatch priority</label>
              <div className="choice-row">
                <button
                  type="button"
                  className={!urgent ? 'choice selected' : 'choice'}
                  onClick={() => setUrgent(false)}
                >
                  <Icon name="clock" />
                  <span>
                    <b>Standard dispatch</b>
                    <small>Typical arrival in 15–25 min</small>
                  </span>
                </button>
                <button
                  type="button"
                  className={urgent ? 'choice danger-choice selected' : 'choice danger-choice'}
                  onClick={() => setUrgent(true)}
                >
                  <Icon name="alert" />
                  <span>
                    <b>High priority SOS</b>
                    <small>For urgent safety risks only</small>
                  </span>
                </button>
              </div>
            </div>

            <Button type="submit" icon="arrow" disabled={isSubmitting}>
              {isSubmitting ? 'Broadcasting to specialists...' : 'Broadcast request'}
            </Button>
          </form>
        </section>

        <aside className="assurance">
          <Icon name="shield" size={28} />
          <h3>Protected from request to repair</h3>
          <p>Your address is only shared with the technician you select.</p>
          {[
            'Verified professional network',
            'Price agreed before dispatch',
            'Escrow-backed payment',
            'Photographic repair evidence',
          ].map(x => (
            <div className="assurance-row" key={x}>
              <Icon name="check" size={15} />
              {x}
            </div>
          ))}
        </aside>
      </div>

      <ProcessingOverlay
        open={overlayConfig.open}
        title="Broadcasting your request"
        steps={overlayConfig.steps}
        durationMs={ms(2600)}
        variant="radar"
        dotCount={overlayConfig.dotCount}
        onDone={handleOverlayDone}
      />
    </div>
  )
}

import { useState, useRef, type ChangeEvent } from 'react'
import { useApp } from '../../context/AppContext'
import { Icon } from '../../components/common/Icon'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { MiniMap } from '../../components/common/MiniMap'
import { dataStore } from '../../services/dataStore'
import { compressImage } from '../../services/imageUtils'

function JobTimeline({ step = 1 }: { step?: number }) {
  const items = [
    'Dispatched & on the way',
    'Arrived at location',
    'Repair in progress',
    'Repaired & verified',
  ]
  return (
    <div className="timeline">
      {items.map((x, i) => {
        const itemStep = i + 1
        const isCurrent = itemStep === step
        const isDone = itemStep < step
        return (
          <div
            className={isCurrent ? 'timeline-item current' : isDone ? 'timeline-item done' : 'timeline-item'}
            key={x}
          >
            <div className="timeline-number">
              {isDone ? <Icon name="check" size={14} /> : `0${itemStep}`}
            </div>
            <div>
              <span>{x}</span>
              {isCurrent && <small>Current status · updated</small>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function TechnicianJob() {
  const { activeJob, advanceJobStep, requests, setActiveRequestId, refreshAllState } = useApp()
  const [photoFeedback, setPhotoFeedback] = useState<string | null>(null)
  const [phoneDialog, setPhoneDialog] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pendingPhotoType = useRef<'before' | 'after'>('before')

  const currentJob = activeJob || requests[0]
  const step = currentJob?.timelineStep || 1
  const hasBothPhotos = Boolean(currentJob?.beforePhotoUrl && currentJob?.afterPhotoUrl)

  const handleStepTransition = (nextStep: number) => {
    if (nextStep === 4 && !hasBothPhotos) {
      return
    }
    if (currentJob) {
      advanceJobStep(currentJob.id, nextStep)
    }
  }

  const handlePhotoUpload = (photoType: 'before' | 'after') => {
    pendingPhotoType.current = photoType
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !currentJob) return

    try {
      const compressed = await compressImage(file)
      const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      dataStore.saveEvidencePhoto(currentJob.id, pendingPhotoType.current, {
        url: compressed,
        name: file.name,
        time,
      })
      refreshAllState()
      setPhotoFeedback(`${pendingPhotoType.current.toUpperCase()} photo uploaded & cryptographically stamped at ${time}`)
      setTimeout(() => setPhotoFeedback(null), 3000)
    } catch (err) {
      console.error('Failed to compress image:', err)
    } finally {
      e.target.value = ''
    }
  }

  const statusLabels = ['ON THE WAY', 'ARRIVED', 'IN PROGRESS', 'COMPLETED']

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        {requests.length > 1 && (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: 700 }}>SELECT ASSIGNED JOB:</span>
            {requests.map(r => (
              <button
                key={r.id}
                className={r.id === currentJob?.id ? 'button primary' : 'button secondary'}
                style={{ height: '28px', padding: '0 8px', fontSize: '10px' }}
                onClick={() => setActiveRequestId(r.id)}
              >
                {r.id} ({r.serviceName})
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="case-header">
        <div>
          <div className="case-id">
            <span>{currentJob?.id || 'HC-301'}</span>
            <Badge tone={step === 4 ? 'green' : step === 3 ? 'blue' : 'amber'}>
              {statusLabels[step - 1] || 'IN PROGRESS'}
            </Badge>
            <Badge tone="dark">ESCROW LOCKED: ₹{currentJob?.agreedPrice || 500}</Badge>
          </div>
          <h1>{currentJob?.description || 'Burst kitchen pipe repair'}</h1>
          <p>
            Customer: {currentJob?.citizenName || 'Rahul Sharma'} · {currentJob?.address}
          </p>
        </div>

        <Button kind="secondary" icon="phone" onClick={() => setPhoneDialog(true)}>
          Call customer
        </Button>
      </div>

      {photoFeedback && (
        <div
          style={{
            padding: '12px 18px',
            background: '#e1f6e9',
            color: 'var(--green)',
            borderRadius: '10px',
            fontWeight: 600,
            fontSize: '12px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Icon name="camera" size={16} />
          {photoFeedback}
        </div>
      )}

      <div className="command-grid">
        <section className="map-panel">
          <div className="panel-label">
            <span>
              <i /> NAVIGATION ROUTE
            </span>
            <b>{currentJob?.address}</b>
          </div>
          <MiniMap large techName="YOU" />
          <div className="map-footer">
            <span>
              <Icon name="shield" size={13} /> Secure municipal route tracking active
            </span>
            <span>Speed: 24 km/h · ETA 8 min</span>
          </div>
        </section>

        <aside className="command-side">
          <h3>Job progress & verification</h3>
          <JobTimeline step={step} />

          <div className="job-action-stack" style={{ marginTop: '20px' }}>
            {step === 1 && (
              <Button onClick={() => handleStepTransition(2)}>
                Mark arrived at location
              </Button>
            )}

            {step === 2 && (
              <>
                <Button
                  kind="secondary"
                  icon="camera"
                  onClick={() => handlePhotoUpload('before')}
                >
                  Upload baseline before photo
                </Button>
                <Button onClick={() => handleStepTransition(3)}>
                  Start repair work
                </Button>
              </>
            )}

            {step === 3 && (
              <>
                <Button
                  kind="secondary"
                  icon="camera"
                  onClick={() => handlePhotoUpload('after')}
                >
                  Upload repair completion photo
                </Button>
                <Button onClick={() => handleStepTransition(4)} disabled={!hasBothPhotos}>
                  Mark job complete & log proof
                </Button>
              </>
            )}

            {step === 4 && (
              <div style={{ textAlign: 'center', padding: '16px', background: '#e1f6e9', borderRadius: '12px' }}>
                <Badge tone="green" style={{ marginBottom: '8px' }}>
                  WORK COMPLETED
                </Badge>
                <b style={{ display: 'block', fontSize: '13px', color: 'var(--green)' }}>
                  Waiting for citizen inspection & escrow release
                </b>
                <span style={{ fontSize: '10px', color: 'var(--muted)', display: 'block', marginTop: '4px' }}>
                  ₹{currentJob?.agreedPrice} will be released directly to your wallet upon customer signoff.
                </span>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Customer Call Dialog */}
      {phoneDialog && (
        <div className="modal-backdrop" onClick={() => setPhoneDialog(false)}>
          <div className="modal" style={{ maxWidth: '440px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setPhoneDialog(false)}>
              <Icon name="close" />
            </button>
            <div className="modal-icon" style={{ background: '#eef1fd', color: 'var(--blue)', margin: '0 auto 14px' }}>
              <Icon name="phone" size={24} />
            </div>
            <h2>Call {currentJob?.citizenName || 'Customer'}</h2>
            <p style={{ color: 'var(--muted)', fontSize: '12px' }}>
              Linked to service job {currentJob?.id || 'HC-301'}.
            </p>
            <div style={{ padding: '16px', background: '#f5f5f2', borderRadius: '12px', margin: '16px 0' }}>
              <span style={{ fontSize: '11px', color: 'var(--muted)', display: 'block' }}>PHONE NUMBER</span>
              <strong style={{ fontSize: '20px', letterSpacing: '.05em' }}>
                {currentJob?.citizenPhone || '+91 98201 55432'}
              </strong>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <Button kind="secondary" onClick={() => setPhoneDialog(false)}>
                Dismiss
              </Button>
              <a
                href={`tel:${currentJob?.citizenPhone?.replace(/\s+/g, '') || '+919820155432'}`}
                className="button primary"
                style={{ textDecoration: 'none' }}
              >
                <Icon name="phone" size={15} style={{ marginRight: '6px' }} />
                Open Phone App
              </a>
            </div>
          </div>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
    </div>
  )
}

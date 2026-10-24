import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Icon } from '../../components/common/Icon'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { Rating } from '../../components/common/Rating'
import { ProcessingOverlay } from '../../components/common/ProcessingOverlay'
import { ms } from '../../components/common/fxConfig'

export function AdminVerification() {
  const { technicians, updateTechnicianVerification } = useApp()
  const [selectedTechId, setSelectedTechId] = useState<string>('TECH-04') // Suresh Patil who is pending or TECH-01
  const [actionFeedback, setActionFeedback] = useState<string | null>(null)

  const currentTech = technicians.find(t => t.id === selectedTechId) || technicians[0]
  const [pendingAction, setPendingAction] = useState<'approve' | 'reject' | null>(null)

  const handleActionDone = () => {
    if (pendingAction === 'approve') {
      updateTechnicianVerification(currentTech.id, 'verified')
      setActionFeedback(`Approved ${currentTech.name}. Digital Passport credentials issued.`)
      setTimeout(() => setActionFeedback(null), 3000)
    } else if (pendingAction === 'reject') {
      updateTechnicianVerification(currentTech.id, 'rejected')
      setActionFeedback(`Rejected application for ${currentTech.name}. Notice dispatched.`)
      setTimeout(() => setActionFeedback(null), 3000)
    }
    setPendingAction(null)
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p className="eyebrow">PROFESSIONAL NETWORK · ACCREDITATION</p>
          <h1>Technician credential verification</h1>
        </div>

        {/* Technician Selector Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {technicians.map(t => (
            <button
              key={t.id}
              className={t.id === currentTech.id ? 'button primary' : 'button secondary'}
              style={{ height: '32px', fontSize: '11px', padding: '0 10px' }}
              onClick={() => setSelectedTechId(t.id)}
            >
              {t.name} ({t.verificationStatus.toUpperCase()})
            </button>
          ))}
        </div>
      </div>

      {actionFeedback && (
        <div
          style={{
            margin: '18px 0',
            padding: '12px 18px',
            background: '#e1f6e9',
            color: 'var(--green)',
            borderRadius: '10px',
            fontWeight: 600,
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Icon name="check" size={16} />
          {actionFeedback}
        </div>
      )}

      <div className="verification-layout">
        <section className="verification-profile">
          <div className="profile-avatar">{currentTech.initials}</div>
          <h2>{currentTech.name}</h2>
          <span>{currentTech.passportId}</span>
          <Rating value={currentTech.rating.toString()} />
          <div style={{ marginTop: '10px' }}>
            <Badge
              tone={
                currentTech.verificationStatus === 'verified'
                  ? 'green'
                  : currentTech.verificationStatus === 'rejected'
                    ? 'red'
                    : 'amber'
              }
            >
              STATUS: {currentTech.verificationStatus.toUpperCase()}
            </Badge>
          </div>

          <div className="trust-score full">
            <span>CALCULATED TRUST SCORE</span>
            <strong>
              {currentTech.trustScore}
              <small>/ 100</small>
            </strong>
            <div>
              <i style={{ width: `${currentTech.trustScore}%` }} />
            </div>
          </div>
        </section>

        <section className="documents">
          <div className="section-title">
            <div>
              <p className="eyebrow">DOCUMENT AUDIT TRAIL</p>
              <h2>Submitted verification documents</h2>
            </div>
            <Badge
              tone={
                currentTech.documents.every(d => d.status === 'verified')
                  ? 'green'
                  : 'amber'
              }
            >
              {currentTech.documents.filter(d => d.status === 'verified').length} OF{' '}
              {currentTech.documents.length} VERIFIED
            </Badge>
          </div>

          {currentTech.documents.map((d, i) => (
            <div className="document-row" key={d.name}>
              <div className="doc-icon">
                <Icon name="document" />
              </div>
              <div>
                <b>{d.name}</b>
                <span>Audited timestamp: {d.date}</span>
              </div>
              <Badge tone={d.status === 'verified' ? 'green' : d.status === 'rejected' ? 'red' : 'amber'}>
                {d.status === 'verified' ? (
                  <>
                    <Icon name="check" size={12} style={{ marginRight: '4px' }} /> VERIFIED
                  </>
                ) : (
                  d.status.toUpperCase()
                )}
              </Badge>
              <button className="icon-button" title="View cryptographic attestation">
                <Icon name="chevron" />
              </button>
            </div>
          ))}

          <div className="verification-actions">
            <Button
              kind="ghost"
              disabled={Boolean(pendingAction)}
              onClick={() => {
                setActionFeedback(`Information request sent to ${currentTech.name}.`)
                setTimeout(() => setActionFeedback(null), 3000)
              }}
            >
              Request information
            </Button>
            <Button
              kind="danger"
              disabled={Boolean(pendingAction)}
              onClick={() => setPendingAction('reject')}
            >
              Reject application
            </Button>
            <Button
              icon="check"
              disabled={Boolean(pendingAction)}
              onClick={() => setPendingAction('approve')}
            >
              Approve technician
            </Button>
          </div>
        </section>
      </div>

      <ProcessingOverlay
        open={Boolean(pendingAction)}
        title={pendingAction === 'approve' ? 'Approving technician' : 'Rejecting application'}
        steps={['Updating credentials', 'Done']}
        durationMs={ms(900)}
        variant="bar"
        onDone={handleActionDone}
      />
    </div>
  )
}

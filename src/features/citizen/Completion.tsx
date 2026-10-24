import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Icon } from '../../components/common/Icon'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { ProcessingOverlay } from '../../components/common/ProcessingOverlay'
import { ms } from '../../components/common/fxConfig'
import type { CitizenView } from '../../types'

export function Completion({ go }: { go: (v: CitizenView) => void }) {
  const { activeJob, confirmAndReleaseEscrow } = useApp()
  const [issueModal, setIssueModal] = useState(false)
  const [issueReported, setIssueReported] = useState(false)

  const techName = activeJob?.assignedTechName || 'Ravi Verma'
  const jobId = activeJob?.id || 'HC-301'
  const amount = activeJob?.agreedPrice || 500
  const [isReleasing, setIsReleasing] = useState(false)

  const handleConfirmAndRelease = () => {
    setIsReleasing(true)
  }

  const handleReleaseDone = () => {
    if (activeJob) {
      confirmAndReleaseEscrow(activeJob.id)
    }
    setIsReleasing(false)
    go('receipt')
  }

  return (
    <div className="page center-page">
      <div className="success-seal">
        <Icon name="check" size={30} />
      </div>

      <p className="eyebrow blue">REPAIR COMPLETED & LOGGED</p>
      <h1>Does everything look good?</h1>
      <p className="subhead">
        Your payment of ₹{amount} remains protected in municipal escrow until you confirm.
      </p>

      <div className="completion-card">
        <div className="completion-visual">
          <div
            className="mini-photo before-photo"
            style={{
              overflow: 'hidden',
              position: 'relative',
              background: activeJob?.beforePhotoUrl ? '#000' : undefined,
            }}
          >
            {activeJob?.beforePhotoUrl ? (
              <img
                src={activeJob.beforePhotoUrl}
                alt="Before repair proof"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : null}
            <span
              style={{
                position: 'relative',
                zIndex: 2,
                background: 'rgba(0,0,0,0.6)',
                padding: '2px 5px',
                borderRadius: '4px',
                fontSize: '8px',
              }}
            >
              BEFORE
            </span>
          </div>
          <Icon name="arrow" />
          <div className="repair-node">
            <Icon name="tools" />
          </div>
          <Icon name="arrow" />
          <div
            className="mini-photo after-photo"
            style={{
              overflow: 'hidden',
              position: 'relative',
              background: activeJob?.afterPhotoUrl ? '#000' : undefined,
            }}
          >
            {activeJob?.afterPhotoUrl ? (
              <img
                src={activeJob.afterPhotoUrl}
                alt="After repair proof"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : null}
            <span
              style={{
                position: 'relative',
                zIndex: 2,
                background: 'rgba(0,0,0,0.6)',
                padding: '2px 5px',
                borderRadius: '4px',
                fontSize: '8px',
              }}
            >
              AFTER
            </span>
          </div>
        </div>

        <div className="completion-info">
          <div>
            <span>TECHNICIAN</span>
            <b>{techName}</b>
          </div>
          <div>
            <span>FINAL AMOUNT</span>
            <b>₹{amount}</b>
          </div>
          <div>
            <span>JOB REFERENCE</span>
            <b>{jobId}</b>
          </div>
        </div>
      </div>

      <div className="center-actions">
        <Button kind="secondary" onClick={() => setIssueModal(true)} disabled={isReleasing}>
          Report an issue
        </Button>
        <Button icon="shield" onClick={handleConfirmAndRelease} disabled={isReleasing}>
          Confirm repair & release escrow
        </Button>
      </div>

      <p className="hint">
        This action releases ₹{amount} to {techName} and issues your official tax invoice.
      </p>

      <ProcessingOverlay
        open={isReleasing}
        title="Releasing payment"
        steps={[
          'Verifying repair evidence',
          `Releasing ₹${amount} to ${techName}`,
          'Generating tax invoice',
        ]}
        durationMs={ms(2200)}
        variant="bar"
        onDone={handleReleaseDone}
      />

      {/* Report Issue Modal */}
      {issueModal && (
        <div className="modal-backdrop" onClick={() => setIssueModal(false)}>
          <div className="modal" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIssueModal(false)}>
              <Icon name="close" />
            </button>
            <div className="modal-icon warning">
              <Icon name="alert" />
            </div>
            <h2>Dispute or Warranty Claim</h2>
            <p>
              If the repair is incomplete or leaking, your escrow payment is frozen immediately while our
              supervisor investigates.
            </p>
            {issueReported ? (
              <div style={{ padding: '14px', background: '#e1f6e9', color: 'var(--green)', borderRadius: '9px', fontWeight: 600, fontSize: '12px' }}>
                <Icon name="check" size={14} style={{ marginRight: '6px' }} />
                Dispute logged. Escrow hold maintained. A supervisor will contact you within 15 minutes.
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                <textarea
                  placeholder="Describe what needs correction or re-inspection..."
                  style={{ minHeight: '90px' }}
                />
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <Button kind="secondary" onClick={() => setIssueModal(false)}>
                    Cancel
                  </Button>
                  <Button
                    kind="danger"
                    onClick={() => {
                      setIssueReported(true)
                      setTimeout(() => setIssueModal(false), 2000)
                    }}
                  >
                    Submit Dispute
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

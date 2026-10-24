import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Icon } from '../../components/common/Icon'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'

export function AdminSettings() {
  const { resetDemoData } = useApp()
  const [resetModal, setResetModal] = useState(false)
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null)

  const handleReset = () => {
    resetDemoData()
    setResetModal(false)
    setSavedFeedback('All demo records successfully restored to factory seed state.')
    setTimeout(() => setSavedFeedback(null), 3000)
  }

  return (
    <div className="page narrow-page">
      <div className="split-heading">
        <div>
          <p className="eyebrow">SYSTEM GOVERNANCE</p>
          <h1>Platform Operations Settings</h1>
          <p className="subhead">Manage municipal escrow parameters, telephony gateway configurations, and demo storage.</p>
        </div>
        <Badge tone="blue">PROTOTYPE MODE ACTIVE</Badge>
      </div>

      {savedFeedback && (
        <div
          style={{
            padding: '12px 18px',
            background: '#e1f6e9',
            color: 'var(--green)',
            borderRadius: '10px',
            fontWeight: 600,
            fontSize: '12px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Icon name="check" size={16} />
          {savedFeedback}
        </div>
      )}

      {/* Demo State Control Card */}
      <section className="form-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '18px', margin: '0 0 4px' }}>Demo Data & Local Storage Control</h2>
            <p style={{ color: 'var(--muted)', fontSize: '12px', margin: 0 }}>
              The prototype saves all service requests, jobs, offers, and verifications in your browser's persistent localStorage.
            </p>
          </div>
          <Button kind="danger" icon="refresh" onClick={() => setResetModal(true)}>
            Reset Demo Data
          </Button>
        </div>
      </section>

      {/* Municipal Platform Configuration */}
      <section className="form-card" style={{ display: 'grid', gap: '20px' }}>
        <h2 style={{ fontSize: '18px', margin: 0 }}>Platform Configuration</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label className="field-label">Senior Citizen Helpline Number</label>
            <input defaultValue="1800-555-0199" />
          </div>
          <div>
            <label className="field-label">Assisted Hours of Operation</label>
            <input defaultValue="Monday – Sunday: 8:00 AM – 8:00 PM IST" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div>
            <label className="field-label">Platform Infrastructure Fee</label>
            <input defaultValue="5%" disabled style={{ background: '#f5f5f2' }} />
          </div>
          <div>
            <label className="field-label">Statutory GST Rate</label>
            <input defaultValue="18%" disabled style={{ background: '#f5f5f2' }} />
          </div>
          <div>
            <label className="field-label">SOS Beacon Timeout</label>
            <input defaultValue="12 Minutes" disabled style={{ background: '#f5f5f2' }} />
          </div>
        </div>

        <div>
          <label className="field-label">Operating Municipal Jurisdiction</label>
          <input defaultValue="Greater Mumbai Municipal Corporation · Ward K-West (Andheri, Juhu, Versova)" />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
          <Button
            onClick={() => {
              setSavedFeedback('Platform settings saved successfully.')
              setTimeout(() => setSavedFeedback(null), 2500)
            }}
          >
            Save Configuration
          </Button>
        </div>
      </section>

      {/* Reset Confirmation Modal */}
      {resetModal && (
        <div className="modal-backdrop" onClick={() => setResetModal(false)}>
          <div className="modal" style={{ maxWidth: '440px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setResetModal(false)}>
              <Icon name="close" />
            </button>
            <div className="modal-icon warning" style={{ margin: '0 auto 14px' }}>
              <Icon name="alert" size={24} />
            </div>
            <h2>Reset All Prototype Records?</h2>
            <p style={{ color: 'var(--muted)', fontSize: '12px', lineHeight: '1.5', marginBottom: '20px' }}>
              This will clear browser localStorage and re-seed the application with initial realistic demo records
              (HC-301 through HC-304, technicians, and citizens).
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <Button kind="secondary" onClick={() => setResetModal(false)}>
                Cancel
              </Button>
              <Button kind="danger" onClick={handleReset}>
                Yes, Reset All Data
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

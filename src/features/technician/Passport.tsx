import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Icon } from '../../components/common/Icon'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'

export function Passport() {
  const { technicians } = useApp()
  const [modal, setModal] = useState(false)

  const ravi = technicians.find(t => t.id === 'TECH-01') || technicians[0]

  return (
    <div className="page">
      <div className="passport">
        <div className="passport-top">
          <div className="brand">
            <span className="brand-mark">
              <Icon name="home" />
            </span>
            <span>
              HOMECARE <b>360</b>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Badge tone="green">MUNICIPALLY ATTESTED</Badge>
            <span>DIGITAL SKILL PASSPORT</span>
          </div>
        </div>

        <div className="passport-body">
          <div>
            <div className="passport-person">
              <div className="profile-avatar">
                {ravi.initials}
                <span>
                  <Icon name="check" size={14} />
                </span>
              </div>
              <div>
                <p>VERIFIED PROFESSIONAL</p>
                <h1>{ravi.name}</h1>
                <span>{ravi.passportId}</span>
              </div>
            </div>

            <div className="passport-trust">
              <span>TRUST SCORE</span>
              <strong>
                {ravi.trustScore}
                <small>/ 100</small>
              </strong>
              <div>
                <i style={{ width: `${ravi.trustScore}%` }} />
              </div>
            </div>

            <div className="passport-badges">
              {ravi.documents.map(d => (
                <div key={d.name}>
                  <Icon name="check" />
                  <span>
                    {d.name} <Badge tone={d.status === 'verified' ? 'green' : 'amber'}>{d.status.toUpperCase()}</Badge>
                  </span>
                </div>
              ))}
            </div>

            <div className="passport-stats">
              <div>
                <span>SERVICES</span>
                <b>{ravi.services.join(' · ')}</b>
              </div>
              <div>
                <span>JOBS COMPLETED</span>
                <b>{ravi.jobsCompleted}</b>
              </div>
              <div>
                <span>CITIZEN RATING</span>
                <b>{ravi.rating} / 5.0</b>
              </div>
            </div>
          </div>

          <div className="qr-side">
            <div className="qr">
              {Array.from({ length: 64 }).map((_, i) => (
                <i key={i} className={(i * 7 + (i % 3)) % 5 < 2 ? 'on' : ''} />
              ))}
            </div>
            <span>Scan to cryptographically verify credentials</span>
            <Button kind="secondary" onClick={() => setModal(true)}>
              Show credential
            </Button>
          </div>
        </div>
      </div>

      {/* Credential Verification Modal */}
      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(false)}>
          <div className="modal" style={{ maxWidth: '480px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(false)}>
              <Icon name="close" />
            </button>
            <div className="modal-icon" style={{ background: '#e1f6e9', color: 'var(--green)', margin: '0 auto 12px' }}>
              <Icon name="shield" size={24} />
            </div>
            <h2>Municipal Attestation Seal</h2>
            <p style={{ color: 'var(--muted)', fontSize: '12px' }}>
              Cryptographic verification certificate issued by Greater Mumbai Municipal Services Platform.
            </p>
            <div style={{ background: '#f6f6f3', padding: '16px', borderRadius: '12px', textAlign: 'left', fontSize: '11px', display: 'grid', gap: '8px', margin: '16px 0' }}>
              <div><b>Passport ID:</b> {ravi.passportId}</div>
              <div><b>Issuing Authority:</b> Ward Safety & Public Works Registry</div>
              <div><b>Police Background:</b> Cleared (Valid thru Oct 2027)</div>
              <div><b>Skill Level:</b> Class 3 Certified Master Tradesperson</div>
              <div><b>Digital Signature:</b> SHA256-8F29C04D81B...</div>
            </div>
            <Button onClick={() => setModal(false)}>Dismiss</Button>
          </div>
        </div>
      )}
    </div>
  )
}

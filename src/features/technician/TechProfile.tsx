import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Icon } from '../../components/common/Icon'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'

export function TechProfile() {
  const { technicians } = useApp()
  const ravi = technicians.find(t => t.id === 'TECH-01') || technicians[0]

  const [name, setName] = useState(ravi.name)
  const [phone, setPhone] = useState(ravi.phone)
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="page narrow-page">
      <div className="split-heading">
        <div>
          <p className="eyebrow">PROFESSIONAL PROFILE</p>
          <h1>Technician Profile & Services</h1>
          <p className="subhead">Manage your registered service specialisations, contact numbers, and bank details.</p>
        </div>
        <Badge tone="green">
          <span className="pulse" /> VERIFIED PROVIDER
        </Badge>
      </div>

      <div className="form-card">
        {saved && (
          <div style={{ padding: '10px 14px', background: '#e1f6e9', color: 'var(--green)', borderRadius: '8px', fontSize: '11px', fontWeight: 600, display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Icon name="check" size={16} /> Changes saved successfully.
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'grid', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <label>
              Full Legal Name
              <input value={name} onChange={e => setName(e.target.value)} required />
            </label>
            <label>
              Registered Phone Number
              <input value={phone} onChange={e => setPhone(e.target.value)} required />
            </label>
          </div>

          <label>
            Skill Passport Reference
            <input value={ravi.passportId} disabled style={{ background: '#f5f5f2', color: 'var(--muted)' }} />
          </label>

          <div>
            <label className="field-label">Active Service Specialisations</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Plumbing', 'Electrical Repairs', 'Drainage', 'Pipe Fitting', 'Sanitary Installations'].map(s => (
                <span
                  key={s}
                  style={{
                    background: '#eef1fd',
                    color: 'var(--blue)',
                    padding: '6px 12px',
                    borderRadius: '99px',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Button type="submit">Save Profile</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

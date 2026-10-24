import { useState, useId } from 'react'
import { useApp } from '../../context/AppContext'
import { Icon } from './Icon'
import { Badge } from './Badge'

export function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const searchInputId = useId()
  const { services, requests, technicians, setView, setActiveRequestId, openCallToBook } = useApp()

  if (!isOpen) return null

  const q = query.toLowerCase().trim()

  const filteredServices = services.filter(
    s => s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
  )

  const filteredRequests = requests.filter(
    r =>
      r.id.toLowerCase().includes(q) ||
      r.serviceName.toLowerCase().includes(q) ||
      r.citizenName.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
  )

  const filteredTechnicians = technicians.filter(
    t =>
      t.name.toLowerCase().includes(q) ||
      t.passportId.toLowerCase().includes(q) ||
      t.services.some(s => s.toLowerCase().includes(q))
  )

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby={searchInputId}>
      <div
        className="modal"
        style={{ maxWidth: '640px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close search">
          <Icon name="close" />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div className="stat-icon" style={{ width: '38px', height: '38px' }}>
            <Icon name="search" size={20} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px' }}>Search HomeCare 360</h2>
            <p style={{ margin: 0, fontSize: '11px', color: 'var(--muted)' }}>
              Find services, active job IDs, technicians, or records
            </p>
          </div>
        </div>

        <div className="input-with-icon" style={{ marginBottom: '18px' }}>
          <Icon name="search" />
          <input
            id={searchInputId}
            type="text"
            autoFocus
            placeholder="Type to search e.g. 'Plumbing', 'HC-301', 'Ravi Verma'..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        <div style={{ overflowY: 'auto', flex: 1, paddingRight: '4px', display: 'grid', gap: '16px' }}>
          {/* Services Matches */}
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.1em', color: 'var(--muted)', marginBottom: '8px' }}>
              SERVICES ({filteredServices.length})
            </div>
            <div style={{ display: 'grid', gap: '8px' }}>
              {filteredServices.slice(0, 4).map(s => (
                <div
                  key={s.code}
                  style={{
                    padding: '10px 12px',
                    border: '1px solid var(--line)',
                    borderRadius: '9px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: '#fff',
                  }}
                  onClick={() => {
                    onClose()
                    setView('request')
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="service-icon" style={{ width: '32px', height: '32px' }}>
                      <Icon name={s.icon} size={16} />
                    </div>
                    <div>
                      <b style={{ fontSize: '12px' }}>{s.name}</b>
                      <span style={{ display: 'block', fontSize: '10px', color: 'var(--muted)' }}>{s.desc}</span>
                    </div>
                  </div>
                  <Badge tone="blue">From ₹{s.startingPrice}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Job/Request Matches */}
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.1em', color: 'var(--muted)', marginBottom: '8px' }}>
              JOBS & REQUESTS ({filteredRequests.length})
            </div>
            <div style={{ display: 'grid', gap: '8px' }}>
              {filteredRequests.slice(0, 3).map(r => (
                <div
                  key={r.id}
                  style={{
                    padding: '10px 12px',
                    border: '1px solid var(--line)',
                    borderRadius: '9px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: '#fff',
                  }}
                  onClick={() => {
                    setActiveRequestId(r.id)
                    onClose()
                    setView('job')
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <b style={{ fontSize: '12px' }}>{r.id}</b>
                      <span style={{ fontSize: '11px', color: 'var(--ink)' }}>· {r.serviceName}</span>
                    </div>
                    <span style={{ fontSize: '10px', color: 'var(--muted)' }}>{r.address}</span>
                  </div>
                  <Badge tone={r.status === 'in_progress' ? 'green' : r.status === 'completed' ? 'neutral' : 'amber'}>
                    {r.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Technicians */}
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.1em', color: 'var(--muted)', marginBottom: '8px' }}>
              VERIFIED TECHNICIANS ({filteredTechnicians.length})
            </div>
            <div style={{ display: 'grid', gap: '8px' }}>
              {filteredTechnicians.slice(0, 3).map(t => (
                <div
                  key={t.id}
                  style={{
                    padding: '10px 12px',
                    border: '1px solid var(--line)',
                    borderRadius: '9px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: '#fff',
                  }}
                  onClick={() => {
                    onClose()
                    setView('technician')
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '10px' }}>
                      {t.initials}
                    </div>
                    <div>
                      <b style={{ fontSize: '12px' }}>{t.name}</b>
                      <span style={{ display: 'block', fontSize: '10px', color: 'var(--muted)' }}>
                        {t.services.join(', ')} · Trust Score {t.trustScore}/100
                      </span>
                    </div>
                  </div>
                  <Badge tone="green">VERIFIED</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--line)', paddingTop: '12px', marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '10px', color: 'var(--muted)' }}>Tip: Press Esc or click outside to dismiss</span>
          <button
            className="text-link"
            onClick={() => {
              onClose()
              openCallToBook()
            }}
          >
            <Icon name="phone" size={14} /> Need voice booking? Call to Book
          </button>
        </div>
      </div>
    </div>
  )
}

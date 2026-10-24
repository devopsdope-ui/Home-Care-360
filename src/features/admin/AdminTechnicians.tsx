import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Icon } from '../../components/common/Icon'
import { Badge } from '../../components/common/Badge'
import { Rating } from '../../components/common/Rating'

export function AdminTechnicians({ setView }: { setView: (v: string) => void }) {
  const { technicians } = useApp()
  const [search, setSearch] = useState('')

  const filtered = technicians.filter(t => {
    const q = search.toLowerCase().trim()
    return (
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.passportId.toLowerCase().includes(q) ||
      t.services.some(s => s.toLowerCase().includes(q))
    )
  })

  return (
    <div className="page">
      <div className="split-heading">
        <div>
          <p className="eyebrow">PROFESSIONAL ROSTER</p>
          <h1>Verified Field Technicians</h1>
          <p className="subhead">Supervise credential status, trust scores, and municipal trades certification.</p>
        </div>
        <button className="button primary" onClick={() => setView('verification')}>
          <Icon name="shield" size={15} /> Open Verification Desk
        </button>
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
        <div className="input-with-icon" style={{ flex: '1 1 280px' }}>
          <Icon name="search" />
          <input
            placeholder="Search technician by name, skill passport, or trade..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <section className="table-card">
        <table>
          <thead>
            <tr>
              <th>Passport ID</th>
              <th>Technician Name</th>
              <th>Phone</th>
              <th>Trades & Specialisations</th>
              <th>Trust Score</th>
              <th>Rating</th>
              <th>Verification</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id}>
                <td>
                  <b>{t.passportId}</b>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="avatar" style={{ width: '28px', height: '28px', fontSize: '9px' }}>
                      {t.initials}
                    </div>
                    <b>{t.name}</b>
                  </div>
                </td>
                <td>{t.phone}</td>
                <td>{t.services.join(', ')}</td>
                <td>
                  <b>{t.trustScore} / 100</b>
                </td>
                <td>
                  <Rating value={t.rating.toString()} />
                </td>
                <td>
                  <Badge
                    tone={
                      t.verificationStatus === 'verified'
                        ? 'green'
                        : t.verificationStatus === 'rejected'
                          ? 'red'
                          : 'amber'
                    }
                  >
                    {t.verificationStatus.toUpperCase()}
                  </Badge>
                </td>
                <td>
                  <Badge tone={t.status === 'online' ? 'green' : 'neutral'}>
                    {t.status.toUpperCase()}
                  </Badge>
                </td>
                <td>
                  <button
                    className="text-link"
                    onClick={() => setView('verification')}
                  >
                    Audit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

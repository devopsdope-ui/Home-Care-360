import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Icon } from '../../components/common/Icon'
import { Badge } from '../../components/common/Badge'

export function AdminCitizens() {
  const { citizens } = useApp()
  const [search, setSearch] = useState('')
  const [seniorFilter, setSeniorFilter] = useState<boolean | null>(null)

  const filtered = citizens.filter(c => {
    const matchesSenior = seniorFilter === null || c.isSeniorCitizen === seniorFilter
    const q = search.toLowerCase().trim()
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q)
    return matchesSenior && matchesSearch
  })

  return (
    <div className="page">
      <div className="split-heading">
        <div>
          <p className="eyebrow">WARD CENSUS & ROSTER</p>
          <h1>Citizens Registry</h1>
          <p className="subhead">Manage resident profiles, accessibility modes, and civic emergency linkages.</p>
        </div>
        <Badge tone="blue">{citizens.length} RECORDED CITIZENS</Badge>
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div className="input-with-icon" style={{ flex: '1 1 260px' }}>
          <Icon name="search" />
          <input
            placeholder="Search citizen by name, phone, or address..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className={seniorFilter === null ? 'button primary' : 'button secondary'}
            style={{ height: '36px', padding: '0 12px', fontSize: '11px' }}
            onClick={() => setSeniorFilter(null)}
          >
            All Residents
          </button>
          <button
            className={seniorFilter === true ? 'button primary' : 'button secondary'}
            style={{ height: '36px', padding: '0 12px', fontSize: '11px' }}
            onClick={() => setSeniorFilter(true)}
          >
            Senior Citizens Only
          </button>
        </div>
      </div>

      <section className="table-card">
        <table>
          <thead>
            <tr>
              <th>Citizen ID</th>
              <th>Resident Name</th>
              <th>Contact Phone</th>
              <th>Registered Address</th>
              <th>Category</th>
              <th>Emergency Contact</th>
              <th>Active Jobs</th>
              <th>Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td>
                  <b>{c.id}</b>
                </td>
                <td>
                  <b>{c.name}</b>
                </td>
                <td>{c.phone}</td>
                <td>{c.address}</td>
                <td>
                  {c.isSeniorCitizen ? (
                    <Badge tone="blue">SENIOR CITIZEN</Badge>
                  ) : (
                    <Badge tone="neutral">STANDARD</Badge>
                  )}
                </td>
                <td>
                  <span style={{ fontSize: '10px', color: 'var(--ink)' }}>{c.emergencyContact.name}</span>
                  <span style={{ display: 'block', fontSize: '8px', color: 'var(--muted)' }}>
                    {c.emergencyContact.phone}
                  </span>
                </td>
                <td>
                  <Badge tone={c.activeJobsCount > 0 ? 'green' : 'neutral'}>
                    {c.activeJobsCount} Active
                  </Badge>
                </td>
                <td>
                  <b>₹{c.totalSpent.toLocaleString('en-IN')}</b>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

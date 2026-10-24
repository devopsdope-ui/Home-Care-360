import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Icon } from '../../components/common/Icon'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import type { JobStatus } from '../../types'

export function AdminJobs({ setView }: { setView: (v: string) => void }) {
  const { requests, activeRequestId, setActiveRequestId, advanceJobStep } = useApp()
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [search, setSearch] = useState<string>('')
  const [selectedJobId, setSelectedJobId] = useState<string>(activeRequestId || 'HC-301')

  const filtered = requests.filter(r => {
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus
    const q = search.toLowerCase().trim()
    const matchesSearch =
      !q ||
      r.id.toLowerCase().includes(q) ||
      r.citizenName.toLowerCase().includes(q) ||
      r.serviceName.toLowerCase().includes(q) ||
      (r.assignedTechName && r.assignedTechName.toLowerCase().includes(q)) ||
      r.address.toLowerCase().includes(q)
    return matchesStatus && matchesSearch
  })

  const selectedJob = requests.find(r => r.id === selectedJobId) || filtered[0] || requests[0]

  return (
    <div className="page">
      <div className="split-heading">
        <div>
          <p className="eyebrow">MUNICIPAL SERVICE REGISTRY</p>
          <h1>Service Jobs Directory</h1>
          <p className="subhead">Inspect, supervise, and verify progress across all citizen service jobs.</p>
        </div>
        <Badge tone="blue">{requests.length} TOTAL REGISTERED JOBS</Badge>
      </div>

      {/* Search and Filters Bar */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: '20px',
        }}
      >
        <div className="input-with-icon" style={{ flex: '1 1 280px' }}>
          <Icon name="search" />
          <input
            placeholder="Search by Job ID, Citizen, Technician, Address..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
          {['all', 'pending', 'on_the_way', 'in_progress', 'completed'].map(st => (
            <button
              key={st}
              className={filterStatus === st ? 'button primary' : 'button secondary'}
              style={{ height: '36px', padding: '0 12px', fontSize: '11px', textTransform: 'capitalize' }}
              onClick={() => setFilterStatus(st)}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedJob ? 'minmax(0, 1.35fr) minmax(320px, 0.65fr)' : '1fr', gap: '18px' }}>
        {/* Table of Jobs */}
        <section className="table-card">
          <table>
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Service</th>
                <th>Citizen</th>
                <th>Technician</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '28px', color: 'var(--muted)' }}>
                    No service jobs match your filter.
                  </td>
                </tr>
              ) : (
                filtered.map(r => (
                  <tr
                    key={r.id}
                    style={{ background: r.id === selectedJob?.id ? '#f3f6ff' : undefined, cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedJobId(r.id)
                      setActiveRequestId(r.id)
                    }}
                  >
                    <td>
                      <b>{r.id}</b>
                      {r.bookingSource === 'senior_call_to_book' && (
                        <span style={{ display: 'block', fontSize: '8px', color: 'var(--blue)', fontWeight: 700 }}>
                          CALL-TO-BOOK
                        </span>
                      )}
                    </td>
                    <td>{r.serviceName}</td>
                    <td>{r.citizenName}</td>
                    <td>{r.assignedTechName || 'Awaiting quote'}</td>
                    <td>
                      <Badge tone={r.priority === 'urgent' ? 'red' : 'neutral'}>
                        {r.priority.toUpperCase()}
                      </Badge>
                    </td>
                    <td>
                      <Badge
                        tone={
                          r.status === 'completed'
                            ? 'green'
                            : r.status === 'in_progress'
                              ? 'blue'
                              : 'amber'
                        }
                      >
                        {r.status.replace(/_/g, ' ').toUpperCase()}
                      </Badge>
                    </td>
                    <td>
                      <b>₹{r.agreedPrice}</b>
                    </td>
                    <td>
                      <Button
                        kind="ghost"
                        onClick={() => {
                          setSelectedJobId(r.id)
                          setActiveRequestId(r.id)
                        }}
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        {/* Selected Job Inspection Drawer */}
        {selectedJob && (
          <aside
            style={{
              background: '#fff',
              border: '1px solid var(--line)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p className="eyebrow blue">JOB SUPERVISION RECORD</p>
                <h2 style={{ margin: 0, fontSize: '18px' }}>{selectedJob.id}</h2>
              </div>
              <Badge tone={selectedJob.status === 'completed' ? 'green' : 'amber'}>
                {selectedJob.status.replace(/_/g, ' ').toUpperCase()}
              </Badge>
            </div>

            <div style={{ background: '#f6f6f3', padding: '14px', borderRadius: '10px', fontSize: '12px', display: 'grid', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '9px', color: 'var(--muted)', display: 'block' }}>DESCRIPTION</span>
                <b>{selectedJob.description}</b>
              </div>
              <div>
                <span style={{ fontSize: '9px', color: 'var(--muted)', display: 'block' }}>LOCATION</span>
                <span>{selectedJob.address}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '9px', color: 'var(--muted)' }}>CITIZEN</span>
                  <div style={{ fontWeight: 600 }}>{selectedJob.citizenName}</div>
                  <div style={{ fontSize: '10px', color: 'var(--muted)' }}>{selectedJob.citizenPhone}</div>
                </div>
                <div>
                  <span style={{ fontSize: '9px', color: 'var(--muted)' }}>TECHNICIAN</span>
                  <div style={{ fontWeight: 600 }}>{selectedJob.assignedTechName || 'None assigned'}</div>
                  <div style={{ fontSize: '10px', color: 'var(--muted)' }}>{selectedJob.assignedTechPhone || 'N/A'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e0ded8', paddingTop: '8px' }}>
                <span>AGREED ESCROW:</span>
                <b>₹{selectedJob.agreedPrice} ({selectedJob.escrowStatus.replace(/_/g, ' ')})</b>
              </div>
            </div>

            {/* Admin Supervision Actions */}
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: '14px', display: 'grid', gap: '8px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--muted)' }}>SUPERVISOR OVERRIDE:</span>
              {selectedJob.status !== 'completed' && (
                <Button
                  kind="secondary"
                  onClick={() => advanceJobStep(selectedJob.id, 4)}
                >
                  Admin Force Complete Job
                </Button>
              )}
              <Button
                kind="ghost"
                onClick={() => setView('sos')}
              >
                Inspect Associated SOS Monitor
              </Button>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}

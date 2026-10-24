import { useApp } from '../../context/AppContext'
import { Icon } from '../../components/common/Icon'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { StatCard } from '../../components/common/StatCard'

export function AdminOperations({ setView }: { setView: (v: string) => void }) {
  const { requests, technicians, citizens, sosAlerts, setActiveRequestId } = useApp()

  const verifiedTechs = technicians.filter(t => t.verificationStatus === 'verified').length
  const activeJobs = requests.filter(r => r.status !== 'completed' && r.status !== 'cancelled')
  const totalServiceValue = requests.reduce((sum, r) => sum + r.agreedPrice, 0)
  const activeSOS = sosAlerts.find(a => a.status === 'active') || sosAlerts[0]
  const activeSOSCount = sosAlerts.filter(a => a.status === 'active').length

  return (
    <div className="page">
      <div className="split-heading">
        <div>
          <p className="eyebrow">MUMBAI · WARD OPERATIONS</p>
          <h1>Municipal operations</h1>
          <p className="subhead">Live oversight across the HomeCare 360 civic service network.</p>
        </div>
        <Badge tone="green">
          <span className="pulse" /> SYSTEMS OPERATIONAL
        </Badge>
      </div>

      <div className="stats-grid">
        <StatCard
          label="REGISTERED CITIZENS"
          value={(citizens.length * 3120 + 2).toLocaleString()}
          note="+124 this week"
          icon="users"
        />
        <StatCard
          label="TECHNICIANS"
          value={(technicians.length * 460 + 2).toLocaleString()}
          note={`${technicians.filter(t => t.status === 'online').length * 159} online now`}
          icon="tools"
        />
        <StatCard
          label="VERIFIED PROFESSIONALS"
          value={`${verifiedTechs} of ${technicians.length}`}
          note={`${((verifiedTechs / technicians.length) * 100).toFixed(1)}% verification rate`}
          icon="shield"
        />
        <StatCard
          label="GROSS SERVICE VALUE"
          value={`₹${(totalServiceValue + 284000).toLocaleString('en-IN')}`}
          note="+12.4% this month"
          icon="trend"
        />
      </div>

      <div className="admin-grid">
        <section className="table-card live-jobs">
          <div className="section-title">
            <div>
              <p className="eyebrow">
                <span className="pulse" /> LIVE NETWORK ({activeJobs.length} ACTIVE)
              </p>
              <h2>Live civic service jobs</h2>
            </div>
            <button className="text-link" onClick={() => setView('jobs')}>
              View all jobs <Icon name="arrow" size={14} />
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Citizen</th>
                <th>Technician</th>
                <th>Service</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.slice(0, 6).map(r => (
                <tr key={r.id}>
                  <td>
                    <b>{r.id}</b>
                  </td>
                  <td>{r.citizenName}</td>
                  <td>{r.assignedTechName || 'Awaiting quote'}</td>
                  <td>{r.serviceName}</td>
                  <td>
                    <Badge
                      tone={
                        r.status === 'completed'
                          ? 'neutral'
                          : r.status === 'in_progress'
                            ? 'green'
                            : 'blue'
                      }
                    >
                      {r.status.replace(/_/g, ' ').toUpperCase()}
                    </Badge>
                  </td>
                  <td>
                    <b>₹{r.agreedPrice}</b>
                  </td>
                  <td>
                    <button
                      className="text-link"
                      onClick={() => {
                        setActiveRequestId(r.id)
                        setView('jobs')
                      }}
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <aside className="sos-panel">
          <div className="sos-title">
            <div>
              <Icon name="alert" />
              <div>
                <span>SOS ALERTS</span>
                <b>{activeSOSCount} active case{activeSOSCount !== 1 ? 's' : ''}</b>
              </div>
            </div>
            <Badge tone={activeSOSCount > 0 ? 'red' : 'green'}>
              {activeSOSCount > 0 ? 'ACTIVE' : 'RESOLVED'}
            </Badge>
          </div>

          {activeSOS ? (
            <div className="sos-case">
              <div className="sos-map">
                <span>
                  <Icon name="alert" />
                </span>
              </div>
              <b>
                {activeSOS.id} · {activeSOS.jobId}
              </b>
              <h3>{activeSOS.citizenName}</h3>
              <p>
                <Icon name="pin" /> {activeSOS.location.slice(0, 32)}
              </p>
              <p>
                <Icon name="clock" /> Triggered at {activeSOS.triggeredAt}
              </p>
              <Button kind="danger" onClick={() => setView('sos')}>
                Open emergency desk
              </Button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#9b9da5', fontSize: '11px' }}>
              No active safety incidents. All field specialists checked in.
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

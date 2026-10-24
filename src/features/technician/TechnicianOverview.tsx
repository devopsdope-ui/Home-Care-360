import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { Icon } from '../../components/common/Icon'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { StatCard } from '../../components/common/StatCard'
import { dataStore } from '../../services/dataStore'

export function TechnicianOverview({ setView }: { setView: (v: string) => void }) {
  const { requests, setActiveRequestId, technicians, refreshAllState } = useApp()
  const tech01 = technicians?.find(t => t.id === 'TECH-01')
  const [online, setOnline] = useState(() => {
    const t = dataStore.getTechnicians().find(x => x.id === 'TECH-01')
    return t ? t.status === 'online' : true
  })

  useEffect(() => {
    if (tech01) {
      setOnline(tech01.status === 'online')
    }
  }, [tech01?.status])

  const handleToggleStatus = () => {
    const nextStatus = online ? 'offline' : 'online'
    setOnline(!online)
    dataStore.setTechnicianStatus('TECH-01', nextStatus)
    refreshAllState()
  }

  const pendingRequests = requests.filter(r => r.status === 'pending' || r.status === 'quoted')

  return (
    <div className="page">
      <div className="split-heading">
        <div>
          <p className="eyebrow">MONDAY, 24 OCTOBER</p>
          <h1>Good morning, Ravi.</h1>
          <p className="subhead">You have {requests.filter(r => r.status === 'in_progress' || r.status === 'on_the_way').length} active jobs in progress today.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            className="button secondary"
            style={{ fontSize: '11px', height: '34px' }}
            onClick={handleToggleStatus}
          >
            Status: {online ? 'Online' : 'Offline'}
          </button>
          <Badge tone={online ? 'green' : 'neutral'}>
            <span className="pulse" /> {online ? 'ONLINE & AVAILABLE' : 'OFFLINE'}
          </Badge>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="TODAY'S EARNINGS" value="₹4,250" note="+18% vs last Monday" icon="wallet" />
        <StatCard
          label="ACTIVE JOBS"
          value={requests.filter(r => r.status !== 'completed' && r.status !== 'cancelled').length.toString()}
          note="1 en route"
          icon="briefcase"
        />
        <StatCard label="COMPLETED JOBS" value="247" note="98% completion rate" icon="check" />
        <StatCard label="TRUST SCORE" value="99 / 100" note="Top 2% in Mumbai" icon="shield" />
      </div>

      <div className="section-title">
        <div>
          <p className="eyebrow">NEARBY SPECIALIST RADAR</p>
          <h2>Incoming service requests ({pendingRequests.length})</h2>
        </div>
        <span className="muted">Real-time municipal dispatch stream</span>
      </div>

      <div className="request-cards">
        {pendingRequests.length === 0 ? (
          <div
            style={{
              gridColumn: '1 / -1',
              background: '#fff',
              border: '1px solid var(--line)',
              borderRadius: '15px',
              padding: '30px',
              textAlign: 'center',
              color: 'var(--muted)',
            }}
          >
            No new incoming requests at this moment. You are caught up!
          </div>
        ) : (
          pendingRequests.map((r, i) => (
            <article
              className={i === 0 ? 'incoming featured' : 'incoming'}
              key={r.id}
            >
              <div>
                <Badge tone={r.priority === 'urgent' ? 'red' : 'blue'}>
                  {r.serviceName.toUpperCase()}
                </Badge>
                {r.bookingSource === 'senior_call_to_book' ? (
                  <span className="new-tag" style={{ color: 'var(--blue)' }}>
                    SENIOR ASSISTED
                  </span>
                ) : (
                  <span className="new-tag">NEW REQUEST</span>
                )}
              </div>

              <h2>{r.description.slice(0, 40)}</h2>
              <p>
                {r.citizenName} · {r.address}
              </p>

              <div className="incoming-facts">
                <span>
                  <Icon name="pin" /> 2.4 km
                </span>
                <span>
                  <Icon name="clock" /> {r.scheduledTime}
                </span>
                <span>
                  <Icon name="wallet" /> ₹{r.agreedPrice - 50}–₹{r.agreedPrice + 150}
                </span>
              </div>

              <div>
                <Button
                  kind="secondary"
                  onClick={() => {
                    setActiveRequestId(r.id)
                    setView('request')
                  }}
                >
                  Inspect details
                </Button>
                <Button
                  onClick={() => {
                    setActiveRequestId(r.id)
                    setView('request')
                  }}
                >
                  Submit quote
                </Button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  )
}

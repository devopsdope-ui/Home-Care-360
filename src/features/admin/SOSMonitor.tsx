import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Icon } from '../../components/common/Icon'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { MiniMap } from '../../components/common/MiniMap'

export function SOSMonitor() {
  const { sosAlerts, resolveSOSAlert } = useApp()
  const [selectedAlertId, setSelectedAlertId] = useState<string>('SOS-1042')
  const [contacted, setContacted] = useState(false)

  const activeAlert = sosAlerts.find(a => a.id === selectedAlertId) || sosAlerts[0]
  const isResolved = activeAlert ? activeAlert.status === 'resolved' : true

  const handleResolve = () => {
    if (activeAlert) {
      resolveSOSAlert(activeAlert.id)
    }
  }

  return (
    <div className="page">
      <div className="split-heading">
        <div>
          <p className="eyebrow red-text">LIVE SAFETY OPERATIONS</p>
          <h1>Emergency response desk</h1>
          <p className="subhead">Coordinate verified GPS location, police/ward dispatch, and response actions.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {sosAlerts.map(a => (
            <button
              key={a.id}
              className={a.id === activeAlert?.id ? 'button primary' : 'button secondary'}
              style={{ height: '32px', fontSize: '11px', padding: '0 10px' }}
              onClick={() => setSelectedAlertId(a.id)}
            >
              {a.id} ({a.status.toUpperCase()})
            </button>
          ))}
          <Badge tone={isResolved ? 'green' : 'red'}>
            {isResolved ? 'CASE RESOLVED' : '1 ACTIVE ALERT'}
          </Badge>
        </div>
      </div>

      <div className="sos-monitor">
        <div className="emergency-map">
          <MiniMap large techName="SOS" />
          <div className="sos-map-marker">
            <Icon name="alert" />
            <span>{activeAlert?.id || 'SOS-1042'}</span>
          </div>
        </div>

        <aside className="alert-feed">
          <p className="eyebrow">ALERT FEED</p>
          <article className="alert-card">
            <div>
              <Badge tone={isResolved ? 'green' : 'red'}>
                {isResolved ? 'RESOLVED' : 'ACTIVE EMERGENCY'}
              </Badge>
              <span>{activeAlert?.triggeredAt || '14:32:08'}</span>
            </div>

            <h2>{activeAlert?.id || 'SOS-1042'}</h2>
            <b>Linked service job · {activeAlert?.jobId || 'HC-301'}</b>

            <hr />

            <p>
              <span>Citizen</span>
              <b>{activeAlert?.citizenName || 'Rahul Sharma'}</b>
            </p>
            <p>
              <span>Location Coordinates</span>
              <b>{activeAlert?.location || 'Live coordinates verified'}</b>
            </p>
            <p>
              <span>Field Technician</span>
              <b>{activeAlert?.technicianName || 'Ravi Verma'}</b>
            </p>
            <p>
              <span>Supervisor Notes</span>
              <b>{activeAlert?.notes || 'Location beacon updated.'}</b>
            </p>

            {contacted && (
              <div
                style={{
                  padding: '10px',
                  background: '#eef1fd',
                  color: 'var(--blue)',
                  borderRadius: '8px',
                  fontSize: '11px',
                  marginTop: '12px',
                  fontWeight: 600,
                }}
              >
                <Icon name="phone" size={14} style={{ marginRight: '6px' }} />
                Direct priority line established to local ward emergency patrol.
              </div>
            )}

            <div className="alert-actions">
              <Button
                kind="secondary"
                icon="phone"
                onClick={() => setContacted(true)}
              >
                Dispatch Patrol
              </Button>
              <Button
                kind={isResolved ? 'secondary' : 'danger'}
                onClick={handleResolve}
                disabled={isResolved}
              >
                {isResolved ? 'Case Closed' : 'Resolve case'}
              </Button>
            </div>
          </article>
        </aside>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Icon } from '../../components/common/Icon'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { Rating } from '../../components/common/Rating'
import { Confetti } from '../../components/common/Confetti'
import { ProcessingOverlay } from '../../components/common/ProcessingOverlay'
import { ms } from '../../components/common/fxConfig'
import type { CitizenView } from '../../types'

export function Locked({ go }: { go: (v: CitizenView) => void }) {
  const { activeJob, dispatchJob } = useApp()
  const [isDispatching, setIsDispatching] = useState(false)

  const firstName = (activeJob?.assignedTechName || 'Ravi').split(' ')[0]

  const handleDispatch = () => {
    setIsDispatching(true)
  }

  const handleDispatchDone = () => {
    if (activeJob) {
      dispatchJob(activeJob.id)
    }
    setIsDispatching(false)
    go('job')
  }

  return (
    <div className="page center-page">
      <Confetti />
      <div className="success-seal fx-pop">
        <Icon name="check" size={30} />
      </div>

      <Badge tone="green">PRICE LOCKED · BINDING AGREEMENT</Badge>
      <h1 style={{ marginTop: '12px' }}>Service confirmed.</h1>
      <p className="subhead">
        {activeJob?.assignedTechName || 'Ravi'} is ready to be dispatched for your{' '}
        {activeJob?.serviceName.toLowerCase() || 'plumbing'} repair.
      </p>

      <div className="locked-card">
        <div className="receipt-head">
          <span>HOMECARE 360</span>
          <b>{activeJob?.id || 'HC-301'}</b>
        </div>

        <div className="locked-service">
          <div className="service-icon">
            <Icon name="route" />
          </div>
          <div>
            <span>{activeJob?.serviceName.toUpperCase() || 'PLUMBING REPAIR'}</span>
            <b>{activeJob?.description || 'Kitchen pipe repair'}</b>
          </div>
          <strong>₹{activeJob?.agreedPrice || 500}</strong>
        </div>

        <div className="locked-person">
          <div className="avatar">{activeJob?.assignedTechInitials || 'RV'}</div>
          <div>
            <span>Assigned Technician</span>
            <b>
              {activeJob?.assignedTechName || 'Ravi Verma'} ·{' '}
              <Rating value={activeJob?.assignedTechRating || '4.9'} />
            </b>
          </div>
        </div>

        <div className="escrow-banner">
          <Icon name="shield" size={20} />
          <div>
            <b>Escrow protected</b>
            <span>
              Your payment of ₹{activeJob?.agreedPrice || 500} is held safely in escrow until you verify
              the completed repair.
            </span>
          </div>
        </div>
      </div>

      <div className="center-actions">
        <Button kind="secondary" icon="users" onClick={() => go('group')} disabled={isDispatching}>
          Invite neighbours
        </Button>
        <Button icon="arrow" onClick={handleDispatch} disabled={isDispatching}>
          Dispatch technician
        </Button>
      </div>

      <p className="hint">Invite neighbours first to unlock a lower pooled group price.</p>

      <ProcessingOverlay
        open={isDispatching}
        title="Dispatching technician"
        steps={[
          `Notifying ${firstName}`,
          'Sharing your live route',
          'Technician on the way',
        ]}
        durationMs={ms(1500)}
        variant="bar"
        onDone={handleDispatchDone}
      />
    </div>
  )
}

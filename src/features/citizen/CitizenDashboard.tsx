import { useApp } from '../../context/AppContext'
import { Icon } from '../../components/common/Icon'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { Rating } from '../../components/common/Rating'
import type { CitizenView, IconName, ServiceCategory } from '../../types'

export function CitizenDashboard({ go }: { go: (v: CitizenView) => void }) {
  const {
    services,
    requests,
    activeJob,
    setActiveRequestId,
    seniorMode,
    setSeniorMode,
    openCallToBook,
  } = useApp()

  const liveJob = activeJob || requests[0]

  const handleServiceClick = (category: ServiceCategory) => {
    if (seniorMode) {
      openCallToBook(category)
    } else {
      go('request')
    }
  }

  return (
    <div className={`page ${seniorMode ? 'senior-mode-active' : ''}`}>
      {/* Welcome Row */}
      <section className="welcome-row">
        <div>
          <p className="eyebrow">MONDAY, 24 OCTOBER</p>
          <h1>Good morning, Rahul.</h1>
          <p className="subhead">What can we help you with today?</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            kind="secondary"
            icon="phone"
            onClick={() => openCallToBook()}
            title="Assisted voice booking"
          >
            Call to Book
          </Button>
          <Button icon="arrow" onClick={() => go('request')}>
            Request a service
          </Button>
        </div>
      </section>

      {/* Senior Citizen Dedicated Assistance Card when Senior Mode is active or prominent */}
      {seniorMode && (
        <section
          style={{
            background: '#ffffff',
            border: '2px solid #315cf5',
            borderRadius: '18px',
            padding: '24px 28px',
            marginBottom: '28px',
            boxShadow: 'var(--shadow)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '5px',
              background: 'var(--blue)',
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div style={{ maxWidth: '680px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Badge tone="blue">SENIOR CITIZEN ASSISTANCE MODE</Badge>
                <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>
                  Free Telephone Booking Hotline
                </span>
              </div>
              <h2 style={{ fontSize: '24px', margin: '6px 0 8px' }}>
                Prefer speaking directly to an operator?
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
                Our municipal care coordinators are ready to book, schedule, and verify technicians for you
                without typing or complex forms.
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginTop: '14px',
                  fontSize: '12px',
                  color: 'var(--ink)',
                }}
              >
                <span>
                  <Icon name="phone" size={15} style={{ verticalAlign: 'middle', marginRight: '6px', color: 'var(--blue)' }} />
                  Toll-Free: <strong>1800-555-0199</strong>
                </span>
                <span>
                  <Icon name="clock" size={15} style={{ verticalAlign: 'middle', marginRight: '6px', color: 'var(--muted)' }} />
                  Hours: <strong>8:00 AM – 8:00 PM IST</strong>
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Button
                icon="phone"
                onClick={() => openCallToBook()}
                className="button primary"
                style={{ fontSize: '14px', height: '48px', padding: '0 24px' }}
              >
                Call to Book Service Now
              </Button>
              <button
                className="text-link"
                style={{ textAlign: 'center', justifyContent: 'center' }}
                onClick={() => setSeniorMode(false)}
              >
                Switch to Standard Citizen View
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Services Section Header */}
      <div className="section-title">
        <div>
          <p className="eyebrow">VERIFIED LOCAL SERVICES</p>
          <h2>Find a service</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {!seniorMode && (
            <button className="text-link" onClick={() => setSeniorMode(true)}>
              <Icon name="user" size={14} /> Senior Citizen Mode
            </button>
          )}
          <button className="text-link" onClick={() => go('request')}>
            View all services <Icon name="arrow" size={15} />
          </button>
        </div>
      </div>

      {/* Service Cards Grid (All 8 Services Interactive!) */}
      <div className="service-grid">
        {services.map(s => (
          <button
            className="service-card"
            key={s.code}
            onClick={() => handleServiceClick(s)}
            title={`Select ${s.name} (${s.code})`}
          >
            <div className="service-icon">
              <Icon name={s.icon as IconName} />
            </div>
            <span className="service-code">{s.code}</span>
            <h3>{s.name}</h3>
            <p>{s.desc}</p>
            <span className="service-action">
              Request <Icon name="arrow" size={14} />
            </span>
          </button>
        ))}
      </div>

      {/* Active Job Card */}
      {liveJob && (
        <section className="active-job-card">
          <div className="active-job-label">
            <span className="pulse" />
            <b>ACTIVE JOB</b>
            <span>{liveJob.id}</span>
            {liveJob.bookingSource === 'senior_call_to_book' && (
              <Badge tone="blue" style={{ marginLeft: '10px' }}>
                CALL-TO-BOOK
              </Badge>
            )}
          </div>

          <div className="job-summary">
            <div>
              <p className="eyebrow">
                {liveJob.serviceName.toUpperCase()} · {liveJob.serviceCode}
              </p>
              <h2>{liveJob.description.slice(0, 48)}</h2>
              <div className="technician-inline">
                <div className="avatar">{liveJob.assignedTechInitials || 'RV'}</div>
                <div>
                  <b>
                    {liveJob.assignedTechName || 'Ravi Verma'}{' '}
                    <span className="verified-check">
                      <Icon name="check" size={11} />
                    </span>
                  </b>
                  <span>
                    Verified technician · <Rating value={liveJob.assignedTechRating || '4.9'} />
                  </span>
                </div>
              </div>
            </div>

            <div className="job-metric">
              <span>STATUS</span>
              <Badge
                tone={
                  liveJob.status === 'completed'
                    ? 'green'
                    : liveJob.status === 'in_progress'
                      ? 'blue'
                      : 'amber'
                }
              >
                {liveJob.status.replace(/_/g, ' ').toUpperCase()}
              </Badge>
            </div>

            <div className="job-metric">
              <span>ETA / TIME</span>
              <strong>
                {liveJob.timelineStep === 1
                  ? '08 '
                  : liveJob.timelineStep === 2
                    ? '00 '
                    : liveJob.timelineStep === 3
                      ? 'NOW '
                      : 'DONE '}
                <small>{liveJob.timelineStep === 1 ? 'min' : ''}</small>
              </strong>
            </div>

            <div className="job-metric">
              <span>PRICE</span>
              <strong>₹{liveJob.agreedPrice}</strong>
              <Badge tone="dark">
                {liveJob.escrowStatus === 'released' ? 'PAID · ESCROW RELEASED' : 'ESCROW LOCKED'}
              </Badge>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Button
                kind="secondary"
                icon="arrow"
                onClick={() => {
                  setActiveRequestId(liveJob.id)
                  go('job')
                }}
              >
                Track job
              </Button>
              {liveJob.status === 'completed' && liveJob.escrowStatus === 'escrow_locked' && (
                <Button
                  kind="primary"
                  icon="shield"
                  onClick={() => {
                    setActiveRequestId(liveJob.id)
                    go('complete')
                  }}
                >
                  Confirm repair
                </Button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Citizen's Requests List Strip */}
      <section style={{ marginTop: '36px' }}>
        <div className="section-title">
          <div>
            <p className="eyebrow">YOUR RECENT BOOKINGS</p>
            <h2>My service requests ({requests.length})</h2>
          </div>
          <button className="text-link" onClick={() => go('offers')}>
            View all requests <Icon name="arrow" size={15} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {requests.slice(0, 3).map(r => (
            <article
              key={r.id}
              style={{
                background: '#fff',
                border: '1px solid var(--line)',
                borderRadius: '14px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <b style={{ fontSize: '13px' }}>{r.id}</b>
                  <Badge tone={r.status === 'completed' ? 'green' : r.status === 'in_progress' ? 'blue' : 'amber'}>
                    {r.status.replace(/_/g, ' ').toUpperCase()}
                  </Badge>
                </div>
                <h3 style={{ margin: '10px 0 4px', fontSize: '14px' }}>{r.serviceName}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '11px', margin: 0 }}>{r.description}</p>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '16px',
                  borderTop: '1px solid var(--soft)',
                  paddingTop: '12px',
                }}
              >
                <b style={{ fontSize: '15px' }}>₹{r.agreedPrice}</b>
                <Button
                  kind="ghost"
                  onClick={() => {
                    setActiveRequestId(r.id)
                    if (r.status === 'pending' || r.status === 'quoted') {
                      go('offers')
                    } else if (r.status === 'completed') {
                      go('receipt')
                    } else {
                      go('job')
                    }
                  }}
                >
                  Open Details →
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

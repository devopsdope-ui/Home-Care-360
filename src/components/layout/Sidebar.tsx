import { useApp } from '../../context/AppContext'
import { Icon } from '../common/Icon'
import type { Role, IconName } from '../../types'

const nav = {
  citizen: [
    ['overview', 'Overview', 'grid'],
    ['request', 'Find a Service', 'search'],
    ['offers', 'My Requests', 'document'],
    ['job', 'Active Jobs', 'briefcase'],
    ['group', 'Group Discounts', 'users'],
    ['receipt', 'Payments', 'wallet'],
    ['review', 'Profile', 'user'],
  ],
  technician: [
    ['overview', 'Overview', 'grid'],
    ['request', 'Requests', 'document'],
    ['job', 'Active Jobs', 'briefcase'],
    ['earnings', 'Earnings', 'wallet'],
    ['passport', 'Skill Passport', 'shield'],
    ['verification', 'Verification', 'check'],
    ['profile', 'Profile', 'user'],
  ],
  admin: [
    ['operations', 'Operations', 'grid'],
    ['jobs', 'Jobs', 'briefcase'],
    ['citizens', 'Citizens', 'users'],
    ['technicians', 'Technicians', 'tools'],
    ['verification', 'Verification', 'shield'],
    ['sos', 'SOS Alerts', 'alert'],
    ['transactions', 'Transactions', 'wallet'],
    ['settings', 'Settings', 'settings'],
  ],
} as const

export function Sidebar() {
  const { role, view, setView, requests, sosAlerts } = useApp()

  const activeJobsCount = requests.filter(r => r.status !== 'completed' && r.status !== 'cancelled').length
  const activeSosCount = sosAlerts.filter(a => a.status === 'active').length

  const userInitials = role === 'technician' ? 'RV' : role === 'admin' ? 'AM' : 'RS'
  const userName = role === 'technician' ? 'Ravi Verma' : role === 'admin' ? 'Anjali Mehta' : 'Rahul Sharma'
  const userSubtitle = role === 'admin' ? 'Ward administrator' : 'Mumbai, MH'

  return (
    <aside className="sidebar">
      <div className="brand" onClick={() => setView(role === 'admin' ? 'operations' : 'overview')} style={{ cursor: 'pointer' }}>
        <span className="brand-mark">
          <Icon name="home" size={18} />
        </span>
        <span>
          HOMECARE <b>360</b>
        </span>
      </div>

      <div className="role-label">{role === 'admin' ? 'Municipal operations' : `${role} workspace`}</div>

      <nav>
        {nav[role].map(([id, label, icon]) => {
          const isActive = view === id
          return (
            <button
              key={id}
              className={isActive ? 'nav-item active' : 'nav-item'}
              onClick={() => setView(id)}
              style={{ width: '100%' }}
            >
              <Icon name={icon as IconName} />
              <span>{label}</span>
              {id === 'sos' && activeSosCount > 0 && (
                <span
                  style={{
                    marginLeft: 'auto',
                    background: 'var(--red)',
                    color: '#fff',
                    borderRadius: '99px',
                    fontSize: '9px',
                    fontWeight: 700,
                    padding: '1px 6px',
                  }}
                >
                  {activeSosCount}
                </span>
              )}
              {id === 'job' && activeJobsCount > 0 && (
                <span
                  style={{
                    marginLeft: 'auto',
                    background: 'var(--blue)',
                    color: '#fff',
                    borderRadius: '99px',
                    fontSize: '9px',
                    fontWeight: 700,
                    padding: '1px 6px',
                  }}
                >
                  {activeJobsCount}
                </span>
              )}
              {isActive && <span className="nav-indicator" />}
            </button>
          )
        })}
      </nav>

      <div
        className="support-card"
        onClick={() => {
          if (role === 'admin') setView('sos')
          else setView('review')
        }}
        style={{ cursor: 'pointer' }}
        title="24/7 Civic Support & Safety Desk"
      >
        <Icon name="shield" />
        <div>
          <b>24/7 Civic support</b>
          <span>Case help & safety</span>
        </div>
        <Icon name="chevron" size={16} />
      </div>

      <div className="sidebar-user">
        <div className="avatar">{userInitials}</div>
        <div>
          <b>{userName}</b>
          <span>{userSubtitle}</span>
        </div>
      </div>
    </aside>
  )
}

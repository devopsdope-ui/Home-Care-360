import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Icon } from '../common/Icon'
import { NotificationDropdown } from '../common/NotificationDropdown'
import type { Role } from '../../types'

export function Topbar() {
  const {
    role,
    setRole,
    view,
    setView,
    notifications,
    setSearchModalOpen,
    seniorMode,
    setSeniorMode,
    openCallToBook,
  } = useApp()

  const [notificationOpen, setNotificationOpen] = useState(false)
  const hasUnread = notifications.some(n => !n.read)

  const roles: Role[] = ['citizen', 'technician', 'admin']
  const userInitials = role === 'technician' ? 'RV' : role === 'admin' ? 'AM' : 'RS'

  const formatBreadcrumb = (v: string) => {
    return v.replace(/[-_]/g, ' ').replace(/^\w/, c => c.toUpperCase())
  }

  return (
    <header className="topbar">
      <div className="mobile-brand" onClick={() => setView('overview')} style={{ cursor: 'pointer' }}>
        HC 360
      </div>

      <div className="breadcrumb">
        <span>{role === 'admin' ? 'Municipal operations' : 'Home'}</span>
        <Icon name="chevron" size={14} />
        <b>{formatBreadcrumb(view)}</b>
      </div>

      <div className="top-actions" style={{ position: 'relative' }}>
        {/* Senior Citizen Mode Quick Toggle for Citizen Workspace */}
        {role === 'citizen' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              className="button ghost"
              style={{
                fontSize: '11px',
                height: '32px',
                padding: '0 10px',
                background: seniorMode ? '#eef1fd' : 'transparent',
                color: seniorMode ? 'var(--blue)' : 'var(--muted)',
                border: seniorMode ? '1px solid #c8d0f0' : '1px solid transparent',
              }}
              onClick={() => setSeniorMode(!seniorMode)}
              title="Toggle Senior Citizen Assistance View"
            >
              <Icon name="user" size={14} />
              <span>{seniorMode ? 'Senior Mode: ON' : 'Senior Mode'}</span>
            </button>

            <button
              className="button secondary"
              style={{
                fontSize: '11px',
                height: '32px',
                padding: '0 10px',
                color: 'var(--blue)',
                borderColor: '#c8d0f0',
              }}
              onClick={() => openCallToBook()}
              title="Quick Call to Book service"
            >
              <Icon name="phone" size={14} />
              <span>Call to Book</span>
            </button>
          </div>
        )}

        {/* Prototype Role Switcher */}
        <div className="role-switch">
          {roles.map(r => (
            <button
              key={r}
              className={role === r ? 'selected' : ''}
              onClick={() => setRole(r)}
              title={`Switch prototype view to ${r}`}
            >
              {r === 'technician' ? 'Tech' : r}
            </button>
          ))}
        </div>

        {/* Search button */}
        <button
          className="icon-button"
          onClick={() => setSearchModalOpen(true)}
          title="Search services, jobs, technicians"
          aria-label="Open search dialog"
        >
          <Icon name="search" />
        </button>

        {/* Bell Notifications */}
        <button
          className={hasUnread ? 'icon-button has-dot' : 'icon-button'}
          onClick={() => setNotificationOpen(!notificationOpen)}
          title="Notifications"
          aria-label="Toggle notifications"
        >
          <Icon name="bell" />
        </button>

        <NotificationDropdown
          isOpen={notificationOpen}
          onClose={() => setNotificationOpen(false)}
        />

        {/* Avatar */}
        <div
          className="avatar small"
          title={`Active user profile: ${role === 'technician' ? 'Ravi Verma' : role === 'admin' ? 'Anjali Mehta' : 'Rahul Sharma'}`}
          onClick={() => {
            if (role === 'citizen') setView('review')
            else if (role === 'technician') setView('profile')
            else setView('settings')
          }}
          style={{ cursor: 'pointer' }}
        >
          {userInitials}
        </div>
      </div>
    </header>
  )
}

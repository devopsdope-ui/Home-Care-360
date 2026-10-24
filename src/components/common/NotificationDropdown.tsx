import { useApp } from '../../context/AppContext'
import { Icon } from './Icon'

export function NotificationDropdown({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { notifications, markNotificationsAsRead, setView, setActiveRequestId } = useApp()

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'absolute',
        top: '56px',
        right: '50px',
        width: '340px',
        background: '#fff',
        border: '1px solid var(--line)',
        borderRadius: '14px',
        boxShadow: 'var(--shadow)',
        zIndex: 40,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--line)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#fafaf8',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <b style={{ fontSize: '12px' }}>Civic Notifications</b>
          <span style={{ fontSize: '9px', background: 'var(--blue-light)', color: 'var(--blue)', padding: '2px 6px', borderRadius: '99px', fontWeight: 700 }}>
            {notifications.filter(n => !n.read).length} new
          </span>
        </div>
        <button
          className="text-link"
          style={{ fontSize: '10px' }}
          onClick={markNotificationsAsRead}
        >
          Mark all read
        </button>
      </div>

      <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)', fontSize: '11px' }}>
            No recent notifications
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--soft)',
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start',
                background: n.read ? '#fff' : '#f7f9ff',
                cursor: 'pointer',
              }}
              onClick={() => {
                if (n.title.includes('HC-')) {
                  const match = n.title.match(/HC-\d+/)
                  if (match) setActiveRequestId(match[0])
                  setView('job')
                }
                onClose()
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  background: n.type === 'alert' ? '#ffe1e1' : n.type === 'success' ? '#e1f6e9' : 'var(--blue-light)',
                  color: n.type === 'alert' ? 'var(--red)' : n.type === 'success' ? 'var(--green)' : 'var(--blue)',
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                <Icon name={n.type === 'alert' ? 'alert' : n.type === 'success' ? 'check' : 'bell'} size={14} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <b style={{ fontSize: '11px', display: 'block', color: 'var(--ink)' }}>{n.title}</b>
                <span style={{ fontSize: '10px', color: 'var(--muted)', lineHeight: '1.4', display: 'block', marginTop: '2px' }}>
                  {n.desc}
                </span>
                <span style={{ fontSize: '8px', color: '#9a9da5', display: 'block', marginTop: '4px' }}>{n.time}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ padding: '10px', textAlign: 'center', borderTop: '1px solid var(--line)', background: '#fafaf8' }}>
        <button className="text-link" style={{ margin: '0 auto', fontSize: '10px' }} onClick={onClose}>
          Close notifications
        </button>
      </div>
    </div>
  )
}

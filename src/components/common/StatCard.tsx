import { Icon } from './Icon'
import type { IconName } from '../../types'

export function StatCard({
  label,
  value,
  note,
  icon,
}: {
  label: string
  value: string | number
  note?: string
  icon: IconName
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        <Icon name={icon} />
      </div>
      <span>{label}</span>
      <strong>{value}</strong>
      {note && <small>{note}</small>}
    </div>
  )
}

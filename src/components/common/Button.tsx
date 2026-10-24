import type { ReactNode } from 'react'
import { Icon } from './Icon'
import type { IconName } from '../../types'

export function Button({
  children,
  kind = 'primary',
  icon,
  onClick,
  disabled,
  type = 'button',
  className = '',
  title,
  ariaLabel,
  style,
}: {
  children: ReactNode
  kind?: 'primary' | 'secondary' | 'ghost' | 'danger'
  icon?: IconName
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
  title?: string
  ariaLabel?: string
  style?: React.CSSProperties
}) {
  return (
    <button
      type={type}
      className={`button ${kind} ${className}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
      style={style}
    >
      {children}
      {icon && <Icon name={icon} size={16} />}
    </button>
  )
}


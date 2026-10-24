import type { ReactNode } from 'react'

export function Badge({
  children,
  tone = 'blue',
  className = '',
  style,
}: {
  children: ReactNode
  tone?: 'blue' | 'green' | 'amber' | 'red' | 'dark' | 'neutral'
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <span className={`badge ${tone} ${className}`} style={style}>
      {tone === 'green' && <span className="dot" />}
      {children}
    </span>
  )
}


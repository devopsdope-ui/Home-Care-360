import { Icon } from './Icon'

export function Rating({ value = '4.9' }: { value?: string | number }) {
  return (
    <span className="rating">
      <Icon name="star" size={14} />
      <b>{value}</b>
    </span>
  )
}

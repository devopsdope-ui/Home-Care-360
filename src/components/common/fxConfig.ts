export const FX_SPEED = 1

export function ms(n: number): number {
  return Math.round(n * FX_SPEED)
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

import { useState, useEffect, useRef, type FormEvent } from 'react'
import { useApp } from '../../context/AppContext'
import { Icon } from '../../components/common/Icon'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { Confetti } from '../../components/common/Confetti'
import { prefersReducedMotion } from '../../components/common/fxConfig'
import { dataStore } from '../../services/dataStore'
import type { CitizenView } from '../../types'

function useCountTo(value: number, duration = 700): number {
  const [count, setCount] = useState(value)
  const prevRef = useRef(value)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setCount(value)
      prevRef.current = value
      return
    }

    const start = prevRef.current
    const end = value
    const change = end - start
    if (change === 0) return

    const startTime = performance.now()
    let rafId: number

    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(1, elapsed / duration)
      const ease = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(start + change * ease)
      setCount(current)

      if (progress < 1) {
        rafId = requestAnimationFrame(step)
      } else {
        setCount(end)
        prevRef.current = end
      }
    }

    rafId = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(rafId)
      prevRef.current = value
    }
  }, [value, duration])

  return count
}

export function GroupBuying({ go }: { go: (v: CitizenView) => void }) {
  const { activeJob, refreshAllState } = useApp()
  const jobId = activeJob?.id || 'HC-301'

  // Load state from dataStore
  const [groupState, setGroupState] = useState(() =>
    dataStore.getGroupBuyingState(jobId, activeJob?.agreedPrice)
  )
  const [copied, setCopied] = useState(false)
  const [inputCode, setInputCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const [codeSuccess, setCodeSuccess] = useState('')

  useEffect(() => {
    setGroupState(dataStore.getGroupBuyingState(jobId, activeJob?.agreedPrice))
  }, [jobId, activeJob?.agreedPrice])

  const { shareCode, neighbours } = groupState
  const basePrice = groupState.basePrice ?? activeJob?.agreedPrice ?? 650
  const tierMultipliers = [1, 0.62, 0.46, 0.38]
  const tierPrices = tierMultipliers.map(m => Math.round((basePrice * m) / 10) * 10)

  const joinedCount = neighbours.filter(n => n.joined).length
  const currentTierPrice = tierPrices[Math.min(Math.max(joinedCount, 1), 4) - 1]
  const animatedPerHomePrice = useCountTo(currentTierPrice, 700)
  const currentPricePerHome = `₹${animatedPerHomePrice}`

  const targetWorkerYield = joinedCount * currentTierPrice
  const animatedWorkerYield = useCountTo(targetWorkerYield, 700)

  const [showConfetti, setShowConfetti] = useState(false)
  const celebratedRef = useRef(false)

  useEffect(() => {
    if (joinedCount >= 4 && !celebratedRef.current) {
      celebratedRef.current = true
      if (!prefersReducedMotion()) {
        setShowConfetti(true)
      }
    }
  }, [joinedCount])

  const [showFloatChip, setShowFloatChip] = useState(false)
  const [chipKey, setChipKey] = useState(0)
  const [flashActive, setFlashActive] = useState(false)
  const [oldPrice, setOldPrice] = useState<number | null>(null)
  const prevCountForAnim = useRef(joinedCount)

  useEffect(() => {
    if (joinedCount > prevCountForAnim.current) {
      const prevIdx = Math.min(Math.max(prevCountForAnim.current, 1), 4) - 1
      const prevPrice = tierPrices[prevIdx]
      setOldPrice(prevPrice)
      setFlashActive(true)
      if (!prefersReducedMotion()) {
        setShowFloatChip(true)
        setChipKey(k => k + 1)
      }

      const flashTimer = setTimeout(() => {
        setFlashActive(false)
      }, 400)

      const chipTimer = setTimeout(() => {
        setShowFloatChip(false)
        setOldPrice(null)
      }, 1000)

      prevCountForAnim.current = joinedCount

      return () => {
        clearTimeout(flashTimer)
        clearTimeout(chipTimer)
      }
    }
    prevCountForAnim.current = joinedCount
  }, [joinedCount, tierPrices])

  const prevJoinedCount = useRef(joinedCount)

  useEffect(() => {
    if (prevJoinedCount.current !== joinedCount) {
      prevJoinedCount.current = joinedCount
      dataStore.updateRequest(jobId, { agreedPrice: currentTierPrice })
      refreshAllState()
    }
  }, [joinedCount, currentTierPrice, jobId, refreshAllState])

  const handleInvite = (flat: string) => {
    const updated = neighbours.map(n => (n.flat === flat ? { ...n, joined: true } : n))
    const newCount = updated.filter(n => n.joined).length
    const nextTierPrice = tierPrices[Math.min(Math.max(newCount, 1), 4) - 1]
    const newState = { shareCode, neighbours: updated, basePrice }
    setGroupState(newState)
    dataStore.saveGroupBuyingState(jobId, newState)
    if (newCount !== joinedCount) {
      prevJoinedCount.current = newCount
      dataStore.updateRequest(jobId, { agreedPrice: nextTierPrice })
      refreshAllState()
    }
  }

  const handleCopy = () => {
    // Copy the actual share code to clipboard
    navigator.clipboard?.writeText(shareCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  const handleApplyCode = (e: FormEvent) => {
    e.preventDefault()
    setCodeError('')
    setCodeSuccess('')

    const cleanCode = inputCode.trim().toUpperCase()

    if (cleanCode !== shareCode.toUpperCase()) {
      setCodeError('Invalid code. Share codes are at least 5 characters (e.g. HC360-7F92).')
      return
    }

    // Check if code was already applied or all joined
    const unjoined = neighbours.filter(n => !n.joined)
    if (unjoined.length === 0) {
      setCodeSuccess('Maximum 4 homes have already joined! You have the highest discount.')
      setInputCode('')
      return
    }

    // Join the next unjoined neighbour flat
    const targetFlat = unjoined[0].flat
    const updated = neighbours.map(n => (n.flat === targetFlat ? { ...n, joined: true } : n))
    const newCount = updated.filter(n => n.joined).length
    const nextTierPrice = tierPrices[Math.min(Math.max(newCount, 1), 4) - 1]
    const newState = { shareCode, neighbours: updated, basePrice }
    setGroupState(newState)
    dataStore.saveGroupBuyingState(jobId, newState)
    if (newCount !== joinedCount) {
      prevJoinedCount.current = newCount
      dataStore.updateRequest(jobId, { agreedPrice: nextTierPrice })
      refreshAllState()
    }

    setCodeSuccess(`Success! Code ${cleanCode} applied for ${targetFlat}. Next discount tier unlocked!`)
    setInputCode('')
  }

  return (
    <div className="page">
      {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}
      {/* Header */}
      <div className="split-heading">
        <div>
          <p className="eyebrow blue">GROUP SERVICE · {activeJob?.id || 'HC-301'}</p>
          <h1>Make it a neighbourhood job</h1>
          <p className="subhead">
            Everyone pays less while {activeJob?.assignedTechName || 'Ravi'} completes multiple homes in one visit.
          </p>
        </div>
        <Button icon="arrow" onClick={() => go('job')}>
          Continue to live job
        </Button>
      </div>

      {/* 1. TOP-MOST SECTION: Neighbour Share Code & Join Group (Immediately below heading) */}
      <section
        className="share-code-top-card"
        style={{
          background: '#ffffff',
          border: '1px solid var(--line)',
          borderRadius: '16px',
          padding: '22px 26px',
          marginBottom: '26px',
          boxShadow: 'var(--shadow)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          {/* Left: User's Share Code */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'var(--blue-light)',
                color: 'var(--blue)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Icon name="users" size={22} />
            </div>
            <div>
              <span
                style={{
                  fontSize: '9px',
                  letterSpacing: '0.12em',
                  color: 'var(--muted)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                YOUR NEIGHBOUR SHARE CODE
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                <b
                  style={{
                    fontSize: '22px',
                    letterSpacing: '0.12em',
                    fontFamily: 'Manrope, sans-serif',
                    color: 'var(--ink)',
                  }}
                >
                  {shareCode}
                </b>
                <Button
                  kind={copied ? 'primary' : 'secondary'}
                  onClick={handleCopy}
                  style={{ height: '34px', padding: '0 14px', fontSize: '11px' }}
                >
                  <Icon name={copied ? 'check' : 'document'} size={13} />
                  {copied ? 'Code Copied!' : 'Copy Code'}
                </Button>
              </div>
            </div>
          </div>

          {/* Right: Enter Neighbour's Code & Join Group */}
          <form
            onSubmit={handleApplyCode}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <span
              style={{
                fontSize: '9px',
                letterSpacing: '0.1em',
                color: 'var(--muted)',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              ENTER A NEIGHBOUR'S SHARE CODE
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="e.g. HC360-7F92"
                value={inputCode}
                onChange={e => {
                  setInputCode(e.target.value.toUpperCase())
                  setCodeError('')
                  setCodeSuccess('')
                }}
                style={{
                  height: '38px',
                  padding: '0 12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  minWidth: '180px',
                }}
              />
              <Button type="submit" kind="primary" style={{ height: '38px', padding: '0 16px' }}>
                Join Group
              </Button>
            </div>
          </form>
        </div>

        {/* Validation or Success Messages */}
        {codeError && (
          <div
            style={{
              marginTop: '12px',
              fontSize: '11px',
              color: 'var(--red)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 600,
            }}
          >
            <Icon name="alert" size={13} />
            <span>{codeError}</span>
          </div>
        )}
        {codeSuccess && (
          <div
            style={{
              marginTop: '12px',
              fontSize: '11px',
              color: 'var(--green)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 600,
            }}
          >
            <Icon name="check" size={13} />
            <span>{codeSuccess}</span>
          </div>
        )}
      </section>

      {/* 2. Group Layout: Discount Progress, Neighbour List, and Worker Economics */}
      <div className="group-layout">
        <section className="group-pricing">
          <div className="saving-badge">
            {joinedCount >= 4 ? '61% SAVED' : joinedCount === 3 ? '54% SAVED' : '38% SAVED'}
          </div>

          <div className="fx-price-hero">
            {showFloatChip && !prefersReducedMotion() && (
              <div key={chipKey} className="fx-floating-chip">
                +1 home joined
              </div>
            )}
            <div className="fx-hero-col">
              <span className="fx-hero-sublabel">Customer price</span>
              <div className="fx-price-slot-wrapper">
                {flashActive && !prefersReducedMotion() && <div className="fx-green-flash" />}
                <div className="fx-price-slot">
                  {oldPrice !== null && !prefersReducedMotion() && (
                    <s className="fx-price-old">₹{oldPrice}</s>
                  )}
                  <span
                    key={currentTierPrice}
                    className={
                      oldPrice !== null && !prefersReducedMotion()
                        ? 'fx-price-new fx-slide-in'
                        : 'fx-price-new'
                    }
                  >
                    ₹{animatedPerHomePrice}
                  </span>
                </div>
                <span className="fx-arrow-indicator">▼</span>
              </div>
            </div>

            <div className="fx-hero-col">
              <span className="fx-hero-sublabel">Technician earns per hour</span>
              <div className="fx-price-slot-wrapper">
                <span className="fx-hero-stat">₹{animatedWorkerYield}</span>
                <span className="fx-arrow-indicator">▲</span>
              </div>
            </div>
          </div>

          <div className="homes-progress">
            {[
              ['1 HOME', `₹${tierPrices[0]}`],
              ['2 HOMES', `₹${tierPrices[1]}`],
              ['3 HOMES', `₹${tierPrices[2]}`],
              ['4 HOMES', `₹${tierPrices[3]}`],
            ].map((x, i) => {
              const isDone = i + 1 < joinedCount
              const isActive = i + 1 === joinedCount
              const activeClass = prefersReducedMotion() ? 'home-price active' : 'home-price active fx-pop'
              return (
                <div
                  className={isActive ? activeClass : isDone ? 'home-price done' : 'home-price'}
                  key={`${x[0]}-${isActive}`}
                >
                  <span>{i < joinedCount ? <Icon name="check" size={14} /> : i + 1}</span>
                  <small>{x[0]}</small>
                  <b>{x[1]}</b>
                </div>
              )
            })}
          </div>

          <div className="join-progress">
            <div>
              <b>{joinedCount} / 4 homes joined</b>
              <span>
                {joinedCount < 4 ? (
                  `${4 - joinedCount} more homes unlock ${joinedCount === 2 ? `₹${tierPrices[2]}` : `₹${tierPrices[3]}`} per home`
                ) : (
                  <span className={prefersReducedMotion() ? '' : 'fx-pop'} style={{ display: 'inline-block' }}>
                    Maximum group discount unlocked!
                  </span>
                )}
              </span>
            </div>
            <div>
              <i
                style={{
                  width: `${(joinedCount / 4) * 100}%`,
                  transition: prefersReducedMotion() ? 'none' : 'width 600ms cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            </div>
          </div>

          <div className="neighbour-list">
            {neighbours.map(n => (
              <div className="neighbour" key={n.flat}>
                <div className="flat-icon">
                  <Icon name="home" size={17} />
                </div>
                <div>
                  <b>{n.flat}</b>
                  <span>{n.name}</span>
                </div>
                {n.joined ? (
                  <Badge tone="green">JOINED · {currentPricePerHome}</Badge>
                ) : (
                  <Button kind="ghost" onClick={() => handleInvite(n.flat)}>
                    Invite to join
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>

        <aside className="worker-economics">
          <div className="economics-visual">
            <span className="house h1">
              <Icon name="home" />
            </span>
            <span className="house h2">
              <Icon name="home" />
            </span>
            <span className="house h3">
              <Icon name="home" />
            </span>
            <span className="worker">
              <Icon name="tools" />
            </span>
          </div>

          <p className="eyebrow">BETTER WORKER ECONOMICS</p>
          <h2>
            More homes.
            <br />
            One trip.
          </h2>
          <p>
            Group jobs increase technician efficiency by eliminating travel downtime between jobs in the same society.
          </p>

          <div className="yield">
            <span>ESTIMATED WORKER YIELD</span>
            <div>
              <s>₹{tierPrices[0]}</s>
              <Icon name="arrow" />
              <b>₹{animatedWorkerYield}</b>
            </div>
          </div>

          <Button onClick={handleCopy} style={{ width: '100%' }}>
            {copied ? 'Code Copied!' : 'Share code with neighbours'}
          </Button>
        </aside>
      </div>
    </div>
  )
}

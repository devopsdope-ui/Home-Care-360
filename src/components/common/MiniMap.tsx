import { useState, useEffect, useRef } from 'react'
import { Icon } from './Icon'
import { dataStore } from '../../services/dataStore'

export interface Waypoint {
  x: number
  y: number
  name: string
  instruction: string
}

// Deterministic municipal street coordinates in Andheri West, Mumbai (percentages)
export const ROUTE_WAYPOINTS: Waypoint[] = [
  { x: 80, y: 16, name: 'Service Dispatch Hub · Link Road', instruction: 'Technician dispatched from central depot' },
  { x: 68, y: 26, name: 'Link Road & Shastri Nagar Jct', instruction: 'Turned onto Lokhandwala Avenue' },
  { x: 56, y: 34, name: 'Lokhandwala Main Avenue', instruction: 'Traversing Lokhandwala main commercial artery' },
  { x: 48, y: 46, name: 'Crossroads Sector 4', instruction: 'Crossed Sector 4 traffic junction' },
  { x: 38, y: 54, name: 'Silver Oak North Gate', instruction: 'Passing through society security gate' },
  { x: 32, y: 62, name: 'Silver Oak Internal Lane B', instruction: 'Approaching Wing A / Tower 3 parking' },
  { x: 26, y: 72, name: 'Citizen Destination · Flat 302', instruction: 'Arrived at your location' },
]

// Pre-calculate physical segment lengths for constant linear velocity interpolation
const SEGMENT_LENGTHS = ROUTE_WAYPOINTS.slice(0, -1).map((p, i) => {
  const next = ROUTE_WAYPOINTS[i + 1]
  return Math.hypot(next.x - p.x, next.y - p.y)
})
const TOTAL_LENGTH = SEGMENT_LENGTHS.reduce((a, b) => a + b, 0)
const CUMULATIVE_DISTANCES = [0]
for (let i = 0; i < SEGMENT_LENGTHS.length; i++) {
  CUMULATIVE_DISTANCES.push(CUMULATIVE_DISTANCES[i] + SEGMENT_LENGTHS[i])
}

export interface TrackingTelemetry {
  distance: string
  eta: string
  progress: number // integer 0 - 100
  statusText: string
  currentStreet: string
}

export interface MiniMapProps {
  large?: boolean
  techName?: string
  eta?: string
  distance?: string
  status?: string
  isLiveTracking?: boolean
  jobId?: string
  onArrived?: () => void
  onProgressUpdate?: (info: TrackingTelemetry) => void
}

export function MiniMap({
  large = false,
  techName = 'RAVI VERMA',
  eta: initialEta = '08:00',
  distance: initialDistance = '2.4 km',
  status = 'on_the_way',
  isLiveTracking = false,
  jobId = 'HC-301',
  onArrived,
  onProgressUpdate,
}: MiniMapProps) {
  const [zoom, setZoom] = useState(1)
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1)
  const [isPlaying, setIsPlaying] = useState<boolean>(true)

  // Initialize progress from persistent dataStore or status
  const [progress, setProgress] = useState<number>(() => {
    if (status === 'arrived' || status === 'in_progress' || status === 'completed') return 1
    if (status === 'cancelled') return 0
    const stored = dataStore.getTrackingProgress(jobId)
    if (stored > 0) return Math.min(1, stored)
    return 0
  })

  const animFrameRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(performance.now())

  const isDispatchedOrOnTheWay =
    status === 'on_the_way' || status === 'dispatched' || status === 'price_locked'

  const shouldAnimate =
    isLiveTracking &&
    isDispatchedOrOnTheWay &&
    isPlaying &&
    progress < 1

  // Continuous animation loop using requestAnimationFrame
  useEffect(() => {
    if (!shouldAnimate) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
        animFrameRef.current = null
      }
      return
    }

    lastTimeRef.current = performance.now()

    const animateStep = (now: number) => {
      const deltaSec = (now - lastTimeRef.current) / 1000
      lastTimeRef.current = now

      // Full journey takes ~24 seconds at 1x speed (smooth, visible, realistic)
      const baseDuration = 24
      const stepIncrement = (deltaSec / baseDuration) * speedMultiplier

      setProgress(prev => {
        const next = Math.min(1, prev + stepIncrement)
        dataStore.saveTrackingProgress(jobId, next)

        if (next >= 1) {
          if (onArrived) {
            onArrived()
          }
        }
        return next
      })

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animateStep)
      }
    }

    animFrameRef.current = requestAnimationFrame(animateStep)

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
        animFrameRef.current = null
      }
    }
  }, [shouldAnimate, progress, speedMultiplier, jobId, onArrived])

  // Distance-based interpolation across the polyline
  const calculatePositionAndHeading = (p: number) => {
    if (p <= 0) {
      const p0 = ROUTE_WAYPOINTS[0]
      const p1 = ROUTE_WAYPOINTS[1]
      const angle = Math.atan2(p1.y - p0.y, p1.x - p0.x) * (180 / Math.PI)
      return {
        x: p0.x,
        y: p0.y,
        angle,
        segmentIndex: 0,
        streetName: p0.name,
      }
    }

    if (p >= 1) {
      const last = ROUTE_WAYPOINTS[ROUTE_WAYPOINTS.length - 1]
      const prev = ROUTE_WAYPOINTS[ROUTE_WAYPOINTS.length - 2]
      const angle = Math.atan2(last.y - prev.y, last.x - prev.x) * (180 / Math.PI)
      return {
        x: last.x,
        y: last.y,
        angle,
        segmentIndex: ROUTE_WAYPOINTS.length - 2,
        streetName: last.name,
      }
    }

    const targetDistance = p * TOTAL_LENGTH
    let segIdx = 0
    for (let i = 0; i < CUMULATIVE_DISTANCES.length - 1; i++) {
      if (targetDistance >= CUMULATIVE_DISTANCES[i] && targetDistance <= CUMULATIVE_DISTANCES[i + 1]) {
        segIdx = i
        break
      }
    }

    const segStartDist = CUMULATIVE_DISTANCES[segIdx]
    const segLength = SEGMENT_LENGTHS[segIdx]
    const segFraction = segLength > 0 ? (targetDistance - segStartDist) / segLength : 0

    const pA = ROUTE_WAYPOINTS[segIdx]
    const pB = ROUTE_WAYPOINTS[segIdx + 1]

    const x = pA.x + segFraction * (pB.x - pA.x)
    const y = pA.y + segFraction * (pB.y - pA.y)
    const angle = Math.atan2(pB.y - pA.y, pB.x - pA.x) * (180 / Math.PI)

    return {
      x,
      y,
      angle,
      segmentIndex: segIdx,
      streetName: pA.name,
    }
  }

  const { x: curX, y: curY, angle: headingAngle, segmentIndex, streetName } =
    calculatePositionAndHeading(progress)

  // Distance, ETA, and Progress calculation
  const remainingKm = Math.max(0, 2.4 * (1 - progress))
  const distanceStr = progress >= 1 ? '0.0 km' : `${remainingKm.toFixed(1)} km`

  const remainingMin = Math.max(0, Math.ceil(8 * (1 - progress)))
  const etaStr =
    progress >= 1
      ? 'Arrived'
      : remainingMin === 0
        ? '< 1 min'
        : `0${remainingMin}:00`

  const progressPercent = Math.min(100, Math.round(progress * 100))
  const statusLabel =
    progress >= 1 || status === 'arrived'
      ? 'Arrived at your location'
      : status === 'completed'
        ? 'Job completed'
        : status === 'cancelled'
          ? 'Job cancelled'
          : 'On the way'

  // Push telemetry update to parent
  useEffect(() => {
    if (onProgressUpdate && isLiveTracking) {
      onProgressUpdate({
        distance: distanceStr,
        eta: etaStr,
        progress: progressPercent,
        statusText: statusLabel,
        currentStreet: streetName,
      })
    }
  }, [distanceStr, etaStr, progressPercent, statusLabel, streetName, isLiveTracking, onProgressUpdate])

  // Build SVG Paths:
  // 1. Underlay full road path
  const fullRoadD = ROUTE_WAYPOINTS.map((w, i) => `${i === 0 ? 'M' : 'L'} ${w.x} ${w.y}`).join(' ')

  // 2. Traveled path: Start -> passed waypoints -> current position
  const passedWaypoints = ROUTE_WAYPOINTS.slice(0, segmentIndex + 1)
  const traveledD = [
    ...passedWaypoints.map((w, i) => `${i === 0 ? 'M' : 'L'} ${w.x} ${w.y}`),
    `L ${curX} ${curY}`,
  ].join(' ')

  // 3. Remaining path: Current position -> remaining waypoints -> destination
  const remainingWaypoints = ROUTE_WAYPOINTS.slice(segmentIndex + 1)
  const remainingD = [
    `M ${curX} ${curY}`,
    ...remainingWaypoints.map(w => `L ${w.x} ${w.y}`),
  ].join(' ')

  const handleRestartJourney = () => {
    dataStore.saveTrackingProgress(jobId, 0)
    setProgress(0)
    setIsPlaying(true)
  }

  const startPoint = ROUTE_WAYPOINTS[0]
  const destinationPoint = ROUTE_WAYPOINTS[ROUTE_WAYPOINTS.length - 1]

  return (
    <div
      className={large ? 'map large' : 'map'}
      style={{
        position: 'relative',
        background: '#e8e8e1',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Background Street Grid Texture */}
      <div
        className="map-grid"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
          transition: 'transform 0.2s ease',
        }}
      />

      {/* Municipal Road Network Base */}
      <div className="road r1" />
      <div className="road r2" />
      <div className="road r3" />

      {/* SVG Route Overlay: Fully continuous two-part route visualization */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      >
        {/* Road Base Track (Wide subtle road casing) */}
        <path
          d={fullRoadD}
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.75"
        />

        {/* Completed / Traveled Portion (Solid Muted Blue) */}
        {progress > 0.005 && (
          <path
            d={traveledD}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />
        )}

        {/* Remaining Portion toward Customer (Vibrant Royal Blue with Pulse) */}
        {progress < 0.995 && (
          <path
            d={remainingD}
            fill="none"
            stroke="#315cf5"
            strokeWidth="3.6"
            strokeDasharray="4 2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>

      {/* 1. Worker Starting Location Marker */}
      <div
        style={{
          position: 'absolute',
          left: `${startPoint.x}%`,
          top: `${startPoint.y}%`,
          transform: 'translate(-50%, -50%)',
          zIndex: 3,
          display: 'grid',
          placeItems: 'center',
        }}
        title="Worker Starting Location · Dispatch Hub"
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: '#1e293b',
            color: '#38bdf8',
            border: '2px solid #ffffff',
            boxShadow: '0 3px 10px rgba(0,0,0,0.25)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Icon name="briefcase" size={13} />
        </div>
        <span
          style={{
            position: 'absolute',
            top: '-20px',
            background: '#1e293b',
            color: '#f8fafc',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '7px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          }}
        >
          START · DISPATCH HUB
        </span>
      </div>

      {/* 2. Customer Destination Marker (Fixed at Destination) */}
      <div
        className="map-home"
        style={{
          left: `${destinationPoint.x}%`,
          top: `${destinationPoint.y}%`,
          transform: 'translate(-50%, -50%)',
          zIndex: 4,
          background: 'var(--deep)',
          border: '2px solid #ffffff',
          boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
        }}
        title="Customer Destination · Flat 302, Silver Oak Residency"
      >
        <Icon name="home" size={18} />
        {/* Subtle beacon pulse around customer destination */}
        <div
          style={{
            position: 'absolute',
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'rgba(23, 24, 28, 0.15)',
            pointerEvents: 'none',
          }}
        />
        <span
          style={{
            position: 'absolute',
            bottom: '-22px',
            background: '#ffffff',
            color: 'var(--ink)',
            padding: '3px 7px',
            borderRadius: '5px',
            fontSize: '8px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            border: '1px solid var(--line)',
          }}
        >
          CUSTOMER DESTINATION (FLAT 302)
        </span>
      </div>

      {/* 3. Moving Worker Marker (Glides strictly forward along the route) */}
      <div
        className="tech-pin"
        style={{
          left: `${curX}%`,
          top: `${curY}%`,
          transform: 'translate(-50%, -50%)',
          zIndex: 5,
          background: progress >= 1 ? 'var(--green)' : 'var(--blue)',
          border: '2px solid #ffffff',
          boxShadow: '0 4px 16px rgba(49,92,245,0.4)',
          transition: shouldAnimate ? 'none' : 'left 0.25s ease, top 0.25s ease',
        }}
        title={`Worker: ${techName} (${statusLabel})`}
      >
        {/* Pulse beacon wave while moving toward customer */}
        {shouldAnimate && (
          <div
            style={{
              position: 'absolute',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(49, 92, 245, 0.3)',
              animation: 'ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Floating Worker Name Tag */}
        <span
          style={{
            position: 'absolute',
            top: '-26px',
            background: '#ffffff',
            color: 'var(--ink)',
            padding: '3px 7px',
            borderRadius: '5px',
            fontSize: '8px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
            border: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: progress >= 1 ? 'var(--green)' : 'var(--blue)',
            }}
          />
          {techName.split(' ')[0].toUpperCase()}
          {progress >= 1 && ' (ARRIVED)'}
        </span>

        {/* Directional heading orientation pointer */}
        {progress < 1 && (
          <div
            style={{
              position: 'absolute',
              width: '10px',
              height: '10px',
              transform: `rotate(${headingAngle}deg) translateX(22px)`,
              pointerEvents: 'none',
              color: 'var(--blue)',
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: '5px solid transparent',
                borderBottom: '5px solid transparent',
                borderLeft: '7px solid var(--blue)',
              }}
            />
          </div>
        )}

        <Icon name="tools" size={18} />
      </div>

      {/* Floating Real-Time Tracking HUD Card */}
      <div
        className="map-eta"
        style={{
          left: '50%',
          top: '22px',
          transform: 'translateX(-50%)',
          zIndex: 6,
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--line)',
          borderRadius: '14px',
          padding: '12px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          minWidth: '290px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: progress >= 1 ? 'var(--green)' : 'var(--blue)',
                  boxShadow: progress >= 1 ? '0 0 0 3px rgba(50,183,104,0.2)' : '0 0 0 3px rgba(49,92,245,0.2)',
                }}
              />
              <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--muted)', textTransform: 'uppercase' }}>
                STATUS
              </span>
            </div>
            <strong style={{ fontSize: '13px', color: progress >= 1 ? 'var(--green)' : 'var(--ink)', display: 'block', marginTop: '2px' }}>
              {statusLabel}
            </strong>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '8px', fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              DISTANCE REMAINING
            </span>
            <div style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'Manrope, sans-serif', color: 'var(--blue)' }}>
              {isLiveTracking ? distanceStr : initialDistance}
            </div>
          </div>
        </div>

        {/* Live Route Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--muted)', marginBottom: '4px' }}>
            <span>Route progress: <b>{progressPercent}%</b></span>
            <span>ETA: <b>{isLiveTracking ? etaStr : initialEta}</b></span>
          </div>
          <div style={{ width: '100%', height: '5px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: progress >= 1 ? 'var(--green)' : 'linear-gradient(90deg, #315cf5, #60a5fa)',
                transition: shouldAnimate ? 'none' : 'width 0.2s linear',
              }}
            />
          </div>
        </div>

        {/* Simulation Controls Strip */}
        {isLiveTracking && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '6px',
              borderTop: '1px solid var(--soft)',
              fontSize: '10px',
            }}
          >
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                type="button"
                onClick={() => setIsPlaying(p => !p)}
                className="button secondary"
                style={{ height: '24px', padding: '0 8px', fontSize: '10px', borderRadius: '5px' }}
                title={isPlaying ? 'Pause worker movement' : 'Resume worker movement'}
              >
                {isPlaying ? 'Pause' : 'Resume'}
              </button>
              <button
                type="button"
                onClick={handleRestartJourney}
                className="button ghost"
                style={{ height: '24px', padding: '0 6px', fontSize: '10px' }}
                title="Restart simulated journey from start point"
              >
                Restart
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '8px', color: 'var(--muted)' }}>SPEED:</span>
              {[1, 2].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpeedMultiplier(s)}
                  className={speedMultiplier === s ? 'button primary' : 'button secondary'}
                  style={{
                    height: '22px',
                    padding: '0 6px',
                    fontSize: '9px',
                    borderRadius: '4px',
                  }}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Demo Telemetry Attribution Badge */}
      <div
        style={{
          position: 'absolute',
          left: '14px',
          bottom: '14px',
          background: 'rgba(23, 24, 28, 0.88)',
          color: '#ffffff',
          padding: '5px 10px',
          borderRadius: '6px',
          fontSize: '8px',
          letterSpacing: '0.08em',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          zIndex: 6,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: progress >= 1 ? 'var(--green)' : 'var(--blue)',
          }}
        />
        SIMULATED ROUTE TELEMETRY · PROTOTYPE DEMO
      </div>

      {/* Zoom Controls */}
      <div className="map-controls" style={{ zIndex: 6 }}>
        <button
          type="button"
          onClick={() => setZoom(z => Math.min(1.4, z + 0.1))}
          title="Zoom in map"
          aria-label="Zoom in map"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => setZoom(z => Math.max(0.8, z - 0.1))}
          title="Zoom out map"
          aria-label="Zoom out map"
        >
          −
        </button>
      </div>
    </div>
  )
}

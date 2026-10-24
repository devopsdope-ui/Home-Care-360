import { useState, useEffect, useRef, type KeyboardEvent } from 'react'
import { useApp } from '../../context/AppContext'
import { Icon } from '../../components/common/Icon'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { Rating } from '../../components/common/Rating'
import { dataStore } from '../../services/dataStore'
import { ProcessingOverlay } from '../../components/common/ProcessingOverlay'
import { ms } from '../../components/common/fxConfig'
import type { CitizenView, ChatMessage, Offer } from '../../types'

const STEP = 10

export function Negotiation({ go }: { go: (v: CitizenView) => void }) {
  const {
    activeJob,
    requests,
    activeRequestId,
    acceptOffer,
    offers,
    negotiatingOffer,
  } = useApp()

  const currentRequest = requests.find(r => r.id === activeRequestId) || activeJob || requests[0]
  const priceBand = dataStore.getPriceBand(currentRequest?.serviceCode || currentRequest?.serviceName)
  const MIN_PRICE = priceBand.low
  const MAX_PRICE = priceBand.high

  // Identify the target worker / offer being negotiated
  const currentOffers = offers.filter(o => o.requestId === currentRequest?.id)
  const targetOffer: Offer = negotiatingOffer || currentOffers[0] || offers[0] || {
    id: 'OFFER-HC-301-1',
    requestId: currentRequest?.id || 'HC-301',
    name: 'Ravi Verma',
    initials: 'RV',
    rating: '4.9',
    jobs: 247,
    distance: '1.8 km',
    eta: '6 min',
    price: 650,
    deal: 'GREAT DEAL',
    pct: 54,
    tone: 'green',
    phone: '+91 98111 22334',
  }

  const workerId = targetOffer.id || targetOffer.name.replace(/\s+/g, '_')
  const reqId = currentRequest?.id || 'HC-301'

  // Counter offer state
  const savedCounter = dataStore.getCounterOffer(reqId, workerId)
  const initialPrice = savedCounter?.amount || Math.min(MAX_PRICE, Math.max(MIN_PRICE, Math.round((targetOffer.price * 0.85) / 10) * 10))

  const [counterPrice, setCounterPrice] = useState<number>(initialPrice)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(savedCounter?.submitted ?? false)
  const [counterCount, setCounterCount] = useState<number>(() => savedCounter?.count ?? (savedCounter?.submitted ? 1 : 0))
  const [counterStatus, setCounterStatus] = useState<'accepted' | 'countered' | 'declined' | undefined>(() => savedCounter?.status)
  const [workerPrice, setWorkerPrice] = useState<number | undefined>(() => savedCounter?.workerPrice)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [isLocking, setIsLocking] = useState<boolean>(false)
  const replyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Chat messages state (strictly separated by request and worker)
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    dataStore.getChatMessages(reqId, workerId)
  )
  const [inputVal, setInputVal] = useState('')
  const [isReplying, setIsReplying] = useState(false)

  const sliderTrackRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Sync saved messages if reqId or workerId changes
  useEffect(() => {
    const loaded = dataStore.getChatMessages(reqId, workerId)
    setMessages(loaded)
    const saved = dataStore.getCounterOffer(reqId, workerId)
    if (saved) {
      setCounterPrice(saved.amount)
      setIsSubmitted(saved.submitted)
      setCounterCount(saved.count ?? (saved.submitted ? 1 : 0))
      setCounterStatus(saved.status)
      setWorkerPrice(saved.workerPrice)
    } else {
      setCounterPrice(Math.min(MAX_PRICE, Math.max(MIN_PRICE, Math.round((targetOffer.price * 0.85) / 10) * 10)))
      setIsSubmitted(false)
      setCounterCount(0)
      setCounterStatus(undefined)
      setWorkerPrice(undefined)
    }
  }, [reqId, workerId, MIN_PRICE, MAX_PRICE])

  // Scroll chat to bottom when messages update
  useEffect(() => {
    if (isSubmitted) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isSubmitted])

  // Smooth Pointer Drag Handling (Mouse + Touch)
  const updatePriceFromClientX = (clientX: number) => {
    if (!sliderTrackRef.current) return
    const rect = sliderTrackRef.current.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const rawPrice = MIN_PRICE + ratio * (MAX_PRICE - MIN_PRICE)
    const stepped = Math.round(rawPrice / STEP) * STEP
    const clamped = Math.max(MIN_PRICE, Math.min(MAX_PRICE, stepped))
    setCounterPrice(clamped)
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    setIsDragging(true)
    updatePriceFromClientX(e.clientX)

    const onPointerMove = (moveEvent: PointerEvent) => {
      updatePriceFromClientX(moveEvent.clientX)
    }

    const onPointerUp = () => {
      setIsDragging(false)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }

  // Keyboard accessibility for slider
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    let next = counterPrice
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      next = Math.min(MAX_PRICE, counterPrice + STEP)
      e.preventDefault()
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      next = Math.max(MIN_PRICE, counterPrice - STEP)
      e.preventDefault()
    } else if (e.key === 'Home') {
      next = MIN_PRICE
      e.preventDefault()
    } else if (e.key === 'End') {
      next = MAX_PRICE
      e.preventDefault()
    }
    setCounterPrice(next)
  }

  // Submit Counter Offer -> Opens Chat Interface
  const handleSubmitCounterOffer = () => {
    const timeStr = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    const currentSaved = dataStore.getCounterOffer(reqId, workerId)
    const nextCount = (currentSaved?.count ?? counterCount ?? 0) + 1
    dataStore.saveCounterOffer(reqId, workerId, {
      amount: counterPrice,
      submitted: true,
      time: timeStr,
      count: nextCount,
    })
    setCounterCount(nextCount)
    setIsSubmitted(true)
    setIsReplying(true)

    if (replyTimerRef.current) {
      clearTimeout(replyTimerRef.current)
    }

    const submittedCounter = counterPrice
    const offerPrice = targetOffer.price

    replyTimerRef.current = setTimeout(() => {
      setIsReplying(false)
      let status: 'accepted' | 'countered' | 'declined'
      let calculatedWorkerPrice: number | undefined
      let messageText: string

      if (submittedCounter >= offerPrice * 0.85) {
        status = 'accepted'
        messageText = `I accept your counter offer of ₹${submittedCounter}.`
      } else if (submittedCounter >= offerPrice * 0.7) {
        status = 'countered'
        calculatedWorkerPrice = Math.round(((submittedCounter + offerPrice) / 2) / 10) * 10
        messageText = `I can't do ₹${submittedCounter}, but I can do ₹${calculatedWorkerPrice}.`
      } else {
        status = 'declined'
        messageText = `Sorry, ₹${submittedCounter} is too low. The original quote of ₹${offerPrice} stands.`
      }

      const current = dataStore.getCounterOffer(reqId, workerId)
      dataStore.saveCounterOffer(reqId, workerId, {
        amount: submittedCounter,
        submitted: true,
        time: current?.time || timeStr,
        count: current?.count ?? nextCount,
        status,
        workerPrice: calculatedWorkerPrice,
      })
      setCounterStatus(status)
      setWorkerPrice(calculatedWorkerPrice)

      const decisionMsg: ChatMessage = {
        id: `msg-decision-${Date.now()}`,
        sender: 'tech',
        text: messageText,
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        accepted: status === 'accepted',
      }
      const withDecision = dataStore.saveChatMessage(reqId, workerId, decisionMsg)
      setMessages(withDecision)
    }, 2000)
  }

  // Send citizen message
  const handleSendMessage = () => {
    const text = inputVal.trim()
    if (!text) return

    const now = new Date()
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'citizen',
      text,
      time: timeStr,
    }

    const updated = dataStore.saveChatMessage(reqId, workerId, userMsg)
    setMessages(updated)
    setInputVal('')

    // Clear and prompt demo worker acknowledgment after short pause
    setIsReplying(true)
    setTimeout(() => {
      setIsReplying(false)
      const ackMsg: ChatMessage = {
        id: `msg-ack-${Date.now()}`,
        sender: 'tech',
        text: "Thanks, I'll check and reply.",
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        accepted: false,
      }
      const withAck = dataStore.saveChatMessage(reqId, workerId, ackMsg)
      setMessages(withAck)
    }, 900)
  }

  const getLockPrice = () => {
    const saved = dataStore.getCounterOffer(reqId, workerId)
    const st = counterStatus || saved?.status
    const wp = workerPrice ?? saved?.workerPrice
    if (st === 'accepted') return counterPrice
    if (st === 'countered' && wp !== undefined) return wp
    return targetOffer.price
  }

  // Accept and Lock Price
  const handleLockPrice = () => {
    setIsLocking(true)
  }

  const handleLockDone = () => {
    if (currentRequest) {
      acceptOffer(currentRequest.id, {
        ...targetOffer,
        price: getLockPrice(),
      })
    }
    setIsLocking(false)
    go('locked')
  }

  const sliderPercent = ((counterPrice - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100

  return (
    <div className="page narrow-page">
      <button className="back" onClick={() => go('offers')} style={{ cursor: 'pointer' }}>
        ← Back to technician offers
      </button>

      <div className="negotiation-layout">
        <section>
          <p className="eyebrow">
            PRICE NEGOTIATION · {currentRequest?.id || 'HC-301'} · {currentRequest?.serviceName.toUpperCase()}
          </p>
          <h1>
            {isSubmitted
              ? `Chat with ${targetOffer.name}`
              : `Make a counter offer to ${targetOffer.name}`}
          </h1>
          <p className="subhead" style={{ marginTop: '4px', marginBottom: '18px' }}>
            {currentRequest?.description || 'Service request'} · {currentRequest?.address.split(',')[1]?.trim() || 'Andheri West'}
          </p>

          <div className="chat-card" style={{ boxShadow: 'var(--shadow)', borderRadius: '16px' }}>
            {/* Header: Technician Profile Info */}
            <div className="chat-profile" style={{ background: '#fff', borderBottom: '1px solid var(--line)' }}>
              <div className="avatar">{targetOffer.initials}</div>
              <div>
                <b>
                  {targetOffer.name}{' '}
                  <span className="verified-check" title="Verified Specialist">
                    <Icon name="check" size={11} />
                  </span>
                </b>
                <span>
                  <Rating value={targetOffer.rating} /> · {targetOffer.jobs} jobs completed · {targetOffer.distance} away
                </span>
              </div>
              {isSubmitted ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Badge tone="green">
                    OFFER SUBMITTED · ₹{counterPrice} ({counterCount || 1}/2)
                  </Badge>
                  <button
                    className="text-link"
                    style={{ fontSize: '11px', textDecoration: 'underline' }}
                    disabled={counterCount >= 2}
                    onClick={() => {
                      if (counterCount < 2) {
                        setIsSubmitted(false)
                      }
                    }}
                  >
                    Adjust
                  </button>
                </div>
              ) : (
                <Badge tone="blue">ORIGINAL QUOTE: ₹{targetOffer.price}</Badge>
              )}
            </div>

            {/* STAGE A: Draggable Counter Offer Pointer */}
            {!isSubmitted && (
              <div style={{ padding: '24px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>
                    Set your fair counter-offer amount
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                    Original quote: <s style={{ color: 'var(--muted)' }}>₹{targetOffer.price}</s>
                  </span>
                </div>

                {/* Interactive Slider Track */}
                <div
                  className="market-band"
                  style={{
                    margin: '16px 0 20px',
                    padding: '20px 18px',
                    borderRadius: '12px',
                    userSelect: 'none',
                    touchAction: 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '12px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>
                      Market range: ₹{MIN_PRICE} — ₹{MAX_PRICE}
                    </span>
                    <strong style={{ fontSize: '15px', color: 'var(--blue)', fontWeight: 700 }}>
                      Selected: ₹{counterPrice}
                    </strong>
                  </div>

                  {/* The Band & Draggable Pointer */}
                  <div
                    ref={sliderTrackRef}
                    className="band"
                    onPointerDown={handlePointerDown}
                    style={{
                      height: '8px',
                      borderRadius: '4px',
                      cursor: isDragging ? 'grabbing' : 'grab',
                      position: 'relative',
                      background: 'linear-gradient(90deg, #dce5ff 0%, #d8eedf 50%, #ffe3bb 100%)',
                      margin: '12px 0 28px',
                    }}
                  >
                    {/* Active highlight fill */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: `${sliderPercent}%`,
                        background: 'var(--blue)',
                        borderRadius: '4px',
                        opacity: 0.25,
                      }}
                    />

                    {/* Draggable Thumb */}
                    <i
                      role="slider"
                      tabIndex={0}
                      aria-valuenow={counterPrice}
                      aria-valuemin={MIN_PRICE}
                      aria-valuemax={MAX_PRICE}
                      aria-label="Counter offer price slider"
                      onKeyDown={handleKeyDown}
                      style={{
                        position: 'absolute',
                        left: `${sliderPercent}%`,
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#ffffff',
                        border: '3px solid var(--blue)',
                        boxShadow: '0 2px 8px rgba(49,92,245,0.4)',
                        cursor: isDragging ? 'grabbing' : 'grab',
                        transition: isDragging ? 'none' : 'left 0.08s ease',
                        outline: 'none',
                        zIndex: 2,
                      }}
                    />

                    {/* Value Bubble above Thumb */}
                    <em
                      style={{
                        position: 'absolute',
                        left: `${sliderPercent}%`,
                        top: '-30px',
                        transform: 'translateX(-50%)',
                        background: 'var(--deep)',
                        color: '#fff',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        fontStyle: 'normal',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                        transition: isDragging ? 'none' : 'left 0.08s ease',
                        zIndex: 3,
                      }}
                    >
                      ₹{counterPrice}
                    </em>

                    {/* Min & Max labels */}
                    <span
                      style={{
                        position: 'absolute',
                        left: 0,
                        bottom: '-22px',
                        fontSize: '10px',
                        color: 'var(--muted)',
                        fontWeight: 600,
                      }}
                    >
                      ₹{MIN_PRICE} (Min)
                    </span>
                    <span
                      style={{
                        position: 'absolute',
                        right: 0,
                        bottom: '-22px',
                        fontSize: '10px',
                        color: 'var(--muted)',
                        fontWeight: 600,
                      }}
                    >
                      ₹{MAX_PRICE} (Max)
                    </span>
                  </div>
                </div>

                {/* Preset Chips */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', margin: '20px 0 24px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>QUICK PRESETS:</span>
                  {[400, 450, 500, 550, 600].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setCounterPrice(val)}
                      className={counterPrice === val ? 'button primary' : 'button secondary'}
                      style={{
                        height: '30px',
                        padding: '0 12px',
                        fontSize: '11px',
                        borderRadius: '16px',
                      }}
                    >
                      ₹{val}
                    </button>
                  ))}
                </div>

                {/* Submit Counter Offer Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--soft)' }}>
                  <Button kind="secondary" onClick={() => go('offers')}>
                    Cancel
                  </Button>
                  <Button
                    icon="arrow"
                    onClick={handleSubmitCounterOffer}
                    style={{ minWidth: '180px' }}
                  >
                    Submit Counter Offer (₹{counterPrice})
                  </Button>
                </div>
              </div>
            )}

            {/* STAGE B: Working Clean Chat with Worker (Opens ONLY after submission) */}
            {isSubmitted && (
              <>
                {/* System Notice for Submitted Counter Offer */}
                <div
                  style={{
                    background: '#eef3fd',
                    padding: '10px 18px',
                    borderBottom: '1px solid #d5e0fc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '11px',
                    color: '#274cc8',
                  }}
                >
                  <span>
                    <Icon name="check" size={13} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                    Counter-offer of <strong>₹{counterPrice}</strong> submitted to {targetOffer.name}.
                  </span>
                  <span style={{ fontSize: '10px', opacity: 0.8 }}>
                    Case Ref: {currentRequest?.id}
                  </span>
                </div>

                {/* Messages Container — Empty initial state with no placeholders */}
                <div
                  className="messages"
                  style={{
                    overflowY: 'auto',
                    minHeight: '260px',
                    maxHeight: '340px',
                    background: '#fafaf8',
                    padding: '20px 18px',
                  }}
                >
                  {messages.length === 0 ? (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '200px',
                        textAlign: 'center',
                        color: 'var(--muted)',
                        padding: '20px',
                      }}
                    >
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          background: 'var(--soft)',
                          display: 'grid',
                          placeItems: 'center',
                          color: 'var(--muted)',
                          marginBottom: '10px',
                        }}
                      >
                        <Icon name="tools" size={18} />
                      </div>
                      <b style={{ color: 'var(--ink)', fontSize: '13px', marginBottom: '4px' }}>
                        Start a conversation with your service professional
                      </b>
                      <span style={{ fontSize: '11px', maxWidth: '360px', lineHeight: '1.5' }}>
                        Send a message to clarify job requirements, parts needed, or schedule specifics with {targetOffer.name}.
                      </span>
                    </div>
                  ) : (
                    messages.map(m => (
                      <div
                        key={m.id}
                        className={
                          m.sender === 'citizen'
                            ? 'message citizen'
                            : m.accepted
                              ? 'message tech accepted'
                              : 'message tech'
                        }
                      >
                        {m.accepted && <Icon name="check" size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />}
                        <span>{m.text}</span>
                        <small>{m.time}</small>
                      </div>
                    ))
                  )}
                  {isReplying && (
                    <div className="message tech" style={{ opacity: 0.7, fontStyle: 'italic', fontSize: '10px' }}>
                      {targetOffer.name} is typing...
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Composer Form */}
                <form
                  className="composer"
                  onSubmit={e => {
                    e.preventDefault()
                    handleSendMessage()
                  }}
                >
                  <input
                    placeholder={`Type a message to ${targetOffer.name}...`}
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    autoFocus
                  />
                  <Button type="submit" disabled={!inputVal.trim()}>
                    Send
                  </Button>
                </form>
              </>
            )}
          </div>
        </section>

        {/* Right Side: Final Offer & Lock Price Card */}
        <aside className="final-offer" style={{ borderRadius: '16px' }}>
          <Icon name="shield" size={26} />
          <p>PROPOSED COUNTER OFFER</p>
          <strong>₹{isSubmitted ? getLockPrice() : counterPrice}</strong>
          <span>
            Original quote <s>₹{targetOffer.price}</s>
          </span>
          <hr />
          <div>
            <Icon name="check" size={16} />
            <span>Civic price lock guarantee</span>
          </div>
          <div>
            <Icon name="check" size={16} />
            <span>Escrow release only after completion</span>
          </div>
          <div>
            <Icon name="check" size={16} />
            <span>Direct municipal protection</span>
          </div>

          <Button
            icon="arrow"
            onClick={handleLockPrice}
            disabled={isLocking}
            style={{ width: '100%', marginTop: '18px' }}
          >
            Accept & lock price
          </Button>

          {isSubmitted && (
            <button
              className="text-link"
              style={{
                marginTop: '12px',
                color: '#b6b8bf',
                fontSize: '10px',
                justifyContent: 'center',
                textDecoration: 'underline',
              }}
              disabled={isLocking || counterCount >= 2}
              onClick={() => {
                if (counterCount < 2 && !isLocking) {
                  setIsSubmitted(false)
                }
              }}
            >
              Modify counter offer amount
            </button>
          )}
        </aside>
      </div>

      <ProcessingOverlay
        open={isLocking}
        title="Locking your price"
        steps={[
          'Confirming price with technician',
          `Holding ₹${getLockPrice()} in escrow`,
          'Generating agreement',
        ]}
        durationMs={ms(1800)}
        variant="bar"
        onDone={handleLockDone}
      />
    </div>
  )
}

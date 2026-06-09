import { useState, useRef, useEffect } from 'react'
import { INITIAL_MESSAGES, getSimulatedResponse } from '../fixtures/chat'
import { useBreakpoint } from '../hooks/useBreakpoint'
import type { ChatMessage, ChatCard } from '../fixtures/chat'

const QUICK_ACTIONS = [
  'Resumen del día',
  'Estado de Norte',
  'Cola HITL',
  'Marista sin reporte',
  'Traspasos pendientes',
]

let msgCounter = 100

export function AgentChat() {
  const { isMobile } = useBreakpoint()
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || typing) return

    const userMsg: ChatMessage = {
      id: `msg-${++msgCounter}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)

    const responses = getSimulatedResponse(trimmed)
    let delay = 900

    responses.forEach((res, i) => {
      setTimeout(() => {
        const agentMsg: ChatMessage = {
          id: `msg-${++msgCounter}`,
          role: 'agent',
          content: res.content,
          timestamp: new Date().toISOString(),
          card: res.card,
        }
        setMessages(prev => [...prev, agentMsg])
        if (i === responses.length - 1) setTyping(false)
      }, delay)
      delay += 600
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: isMobile ? 'calc(100vh - 56px - 64px)' : 'calc(100vh - 64px)',
      maxHeight: '800px',
    }}>
      {/* Header */}
      <div style={{
        padding: isMobile ? 'var(--space-4) var(--space-4) var(--space-3)' : 'var(--space-6) var(--space-6) var(--space-4)',
        borderBottom: '1px solid var(--line)',
        flexShrink: 0,
      }}>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)',
          letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase',
          color: 'var(--bran)', marginBottom: 'var(--space-1)',
        }}>Agente</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <AgentAvatar size={isMobile ? 32 : 36} />
          <div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-black)',
              fontSize: isMobile ? 'var(--text-lg)' : 'var(--text-xl)', color: 'var(--ink)',
              lineHeight: 1,
            }}>Clarisa AI</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22C55E' }} />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--bran)' }}>En línea · monitoreando 5 sucursales</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: isMobile ? 'var(--space-4)' : 'var(--space-6)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
      }}>
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} isMobile={isMobile} />
        ))}

        {typing && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Quick actions */}
      <div style={{
        padding: `var(--space-3) ${isMobile ? 'var(--space-4)' : 'var(--space-6)'} 0`,
        display: 'flex',
        gap: 'var(--space-2)',
        overflowX: 'auto',
        flexShrink: 0,
        paddingBottom: 0,
      }}>
        {QUICK_ACTIONS.map(action => (
          <button
            key={action}
            onClick={() => sendMessage(action)}
            disabled={typing}
            style={{
              padding: '5px 14px',
              borderRadius: 'var(--r-pill)',
              border: '1.5px solid var(--line)',
              background: 'var(--flour)',
              color: 'var(--ink-soft)',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--weight-medium)',
              cursor: typing ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
              opacity: typing ? 0.5 : 1,
              transition: 'all var(--transition)',
              flexShrink: 0,
            }}
          >
            {action}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: isMobile ? 'var(--space-3) var(--space-4) var(--space-4)' : 'var(--space-4) var(--space-6) var(--space-6)',
          display: 'flex',
          gap: 'var(--space-3)',
          flexShrink: 0,
          alignItems: 'flex-end',
        }}
      >
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          background: 'var(--flour)',
          border: '1.5px solid var(--line)',
          borderRadius: 'var(--r-pill)',
          padding: '0 var(--space-4)',
          boxShadow: 'var(--shadow-sm)',
          transition: 'border-color 0.2s',
        }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Pregunta algo sobre las sucursales…"
            disabled={typing}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              padding: '12px 0',
              fontSize: 'var(--text-sm)',
              fontFamily: 'var(--font-body)',
              color: 'var(--ink)',
            }}
          />
        </div>
        <button
          type="submit"
          disabled={!input.trim() || typing}
          style={{
            width: '44px', height: '44px',
            borderRadius: 'var(--r-pill)',
            border: 'none',
            background: input.trim() && !typing ? 'var(--babka-blue)' : 'var(--line)',
            color: '#fff',
            cursor: input.trim() && !typing ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px',
            flexShrink: 0,
            transition: 'background var(--transition)',
          }}
        >
          ↑
        </button>
      </form>
    </div>
  )
}

function MessageBubble({ message, isMobile }: { message: ChatMessage; isMobile: boolean }) {
  const isAgent = message.role === 'agent'

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isAgent ? 'flex-start' : 'flex-end',
      gap: 'var(--space-1)',
    }}>
      {isAgent && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginLeft: '4px' }}>
          <AgentAvatar size={20} />
          <span style={{ fontSize: '11px', color: 'var(--bran)', fontFamily: 'var(--font-body)', fontWeight: 'var(--weight-medium)' }}>
            Clarisa AI
          </span>
        </div>
      )}

      <div style={{
        maxWidth: isMobile ? '88%' : '72%',
        background: isAgent ? 'var(--flour)' : 'var(--babka-blue)',
        color: isAgent ? 'var(--ink)' : '#fff',
        borderRadius: isAgent ? 'var(--r-md) var(--r-lg) var(--r-lg) var(--r-sm)' : 'var(--r-lg) var(--r-md) var(--r-sm) var(--r-lg)',
        padding: 'var(--space-3) var(--space-4)',
        boxShadow: 'var(--shadow-sm)',
        fontSize: 'var(--text-sm)',
        lineHeight: 1.55,
        whiteSpace: 'pre-line',
        fontFamily: 'var(--font-body)',
      }}>
        {message.content}
      </div>

      {message.card && <InlineCard card={message.card} isMobile={isMobile} />}

      <span style={{
        fontSize: '10px',
        color: 'var(--bran)',
        marginLeft: isAgent ? 'var(--space-2)' : 0,
        marginRight: isAgent ? 0 : 'var(--space-2)',
      }}>
        {formatTime(message.timestamp)}
      </span>
    </div>
  )
}

function InlineCard({ card, isMobile }: { card: ChatCard; isMobile: boolean }) {
  const maxW = isMobile ? '88%' : '72%'

  if (card.type === 'branch-summary') {
    const lightColor = card.light === 'verde' ? '#22C55E' : card.light === 'amarillo' ? 'var(--wheat)' : 'var(--babka-orange)'
    return (
      <div style={{
        maxWidth: maxW, width: '100%',
        background: 'var(--flour)', borderRadius: 'var(--r-lg)',
        boxShadow: 'var(--shadow-md)', overflow: 'hidden',
      }}>
        <div style={{ background: lightColor, padding: 'var(--space-3) var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-black)', fontSize: 'var(--text-lg)', color: 'var(--ink)' }}>
            {card.branchName}
          </span>
          <span style={{
            background: 'rgba(26,23,20,0.15)', color: 'var(--ink)',
            fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.06em',
            textTransform: 'uppercase', padding: '3px 10px', borderRadius: 'var(--r-pill)',
            fontFamily: 'var(--font-body)',
          }}>{card.status}</span>
        </div>
        <div style={{ padding: 'var(--space-4)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
          <Stat label="Total" value={String(card.totalUnits ?? 0)} mono />
          <Stat label="Vendido" value={String(card.soldUnits ?? 0)} mono />
          <Stat label="Diferencia" value={card.diferencia === 0 ? 'Δ = 0 ✓' : `Δ = +${card.diferencia}`} accent={card.diferencia !== 0} mono />
        </div>
      </div>
    )
  }

  if (card.type === 'hitl-alert') {
    return (
      <div style={{
        maxWidth: maxW, width: '100%',
        background: 'rgba(220,122,51,0.08)',
        borderRadius: 'var(--r-lg)',
        border: '1.5px solid rgba(220,122,51,0.25)',
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: 'var(--r-md)', flexShrink: 0,
            background: 'var(--babka-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-sm)',
          }}>{card.pending}</div>
          <div>
            <div style={{ fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-sm)', color: 'var(--ink)' }}>
              Items pendientes de aprobación
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--bran)', marginTop: '2px' }}>
              Bandeja HITL · requiere tu revisión
            </div>
          </div>
        </div>
        <div style={{
          borderTop: '1px solid rgba(220,122,51,0.2)',
          padding: 'var(--space-2) var(--space-3)',
          display: 'flex', gap: 'var(--space-2)',
        }}>
          <ActionChip label="Ver bandeja →" primary />
          <ActionChip label="Resumir ítems" />
        </div>
      </div>
    )
  }

  return null
}

function ActionChip({ label, primary }: { label: string; primary?: boolean }) {
  return (
    <button style={{
      padding: '5px 12px', borderRadius: 'var(--r-pill)', border: 'none', cursor: 'pointer',
      background: primary ? 'var(--babka-orange)' : 'rgba(220,122,51,0.12)',
      color: primary ? '#fff' : 'var(--babka-orange-deep)',
      fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 'var(--weight-bold)',
    }}>{label}</button>
  )
}

function Stat({ label, value, mono, accent }: { label: string; value: string; mono?: boolean; accent?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--bran)', marginBottom: '2px' }}>
        {label}
      </div>
      <div style={{
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)',
        fontWeight: 'var(--weight-bold)',
        fontSize: 'var(--text-sm)',
        color: accent ? 'var(--wheat-deep)' : 'var(--ink)',
      }}>
        {value}
      </div>
    </div>
  )
}

function AgentAvatar({ size }: { size: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 'var(--r-md)',
      background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <span style={{ fontSize: size * 0.44, color: 'var(--wheat)', lineHeight: 1 }}>✦</span>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginLeft: '4px' }}>
      <AgentAvatar size={20} />
      <div style={{
        background: 'var(--flour)', borderRadius: 'var(--r-md) var(--r-lg) var(--r-lg) var(--r-sm)',
        padding: '10px 16px', boxShadow: 'var(--shadow-sm)',
        display: 'flex', gap: '4px', alignItems: 'center',
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: 'var(--bran)',
            animation: `babka-spin 1.2s ease-in-out ${i * 0.2}s infinite`,
            animationName: 'typing-dot',
          }} />
        ))}
      </div>
      <style>{`
        @keyframes typing-dot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30%            { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
}

import { useState } from 'react'
import { HITL_REQUESTS, BRANCHES } from '../fixtures/branches'
import type { HITLRequest, HITLType } from '../types'

export function HITL() {
  const [requests, setRequests] = useState(HITL_REQUESTS)
  const [expandedId, setExpandedId] = useState<string | null>(HITL_REQUESTS[0]?.id ?? null)

  const handleApprove = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id))
    if (expandedId === id) setExpandedId(null)
  }

  const handleDismiss = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id))
    if (expandedId === id) setExpandedId(null)
  }

  const alta = requests.filter(r => r.priority === 'alta')
  const media = requests.filter(r => r.priority === 'media')
  const baja = requests.filter(r => r.priority === 'baja')

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)',
          letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--bran)', marginBottom: 'var(--space-2)',
        }}>
          Bandeja de aprobaciones
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <h1>HITL Queue</h1>
          {requests.length > 0 && (
            <span style={{
              background: 'var(--babka-orange)', color: '#fff',
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)',
              borderRadius: 'var(--r-pill)', padding: '2px 12px',
            }}>
              {requests.length}
            </span>
          )}
        </div>
        <p style={{ marginTop: 'var(--space-2)', color: 'var(--bran)', fontSize: 'var(--text-sm)' }}>
          Decisiones que BABKA no puede tomar solo.
        </p>
      </div>

      {requests.length === 0 ? (
        <EmptyState />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          {alta.length > 0 && (
            <Section title="Alta prioridad" color="var(--babka-orange)">
              {alta.map(r => <HITLCard key={r.id} request={r} expanded={expandedId === r.id} onToggle={() => setExpandedId(expandedId === r.id ? null : r.id)} onApprove={handleApprove} onDismiss={handleDismiss} />)}
            </Section>
          )}
          {media.length > 0 && (
            <Section title="Media prioridad" color="var(--wheat)">
              {media.map(r => <HITLCard key={r.id} request={r} expanded={expandedId === r.id} onToggle={() => setExpandedId(expandedId === r.id ? null : r.id)} onApprove={handleApprove} onDismiss={handleDismiss} />)}
            </Section>
          )}
          {baja.length > 0 && (
            <Section title="Baja prioridad" color="var(--bran)">
              {baja.map(r => <HITLCard key={r.id} request={r} expanded={expandedId === r.id} onToggle={() => setExpandedId(expandedId === r.id ? null : r.id)} onApprove={handleApprove} onDismiss={handleDismiss} />)}
            </Section>
          )}
        </div>
      )}
    </div>
  )
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)',
      }}>
        <div style={{ width: '4px', height: '20px', background: color, borderRadius: 'var(--r-pill)' }} />
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)',
          letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: 'var(--bran)',
        }}>
          {title}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {children}
      </div>
    </div>
  )
}

function TypeIcon({ type }: { type: HITLType }) {
  const icons: Record<HITLType, string> = {
    'descuadre':        '⊡',
    'traspaso':         '⇄',
    'alias-desconocido':'?',
    'merma-alta':       '△',
    'auto-cierre':      '◉',
  }
  const colors: Record<HITLType, string> = {
    'descuadre':        'var(--wheat)',
    'traspaso':         'var(--babka-blue-soft)',
    'alias-desconocido':'var(--crumb)',
    'merma-alta':       'rgba(220,122,51,0.15)',
    'auto-cierre':      'rgba(34,197,94,0.12)',
  }
  const textColors: Record<HITLType, string> = {
    'descuadre':        'var(--ink)',
    'traspaso':         'var(--babka-blue-deep)',
    'alias-desconocido':'var(--ink-soft)',
    'merma-alta':       'var(--babka-orange-deep)',
    'auto-cierre':      '#16a34a',
  }
  return (
    <div style={{
      width: '40px', height: '40px', borderRadius: 'var(--r-md)',
      background: colors[type], display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '18px', color: textColors[type], flexShrink: 0,
    }}>
      {icons[type]}
    </div>
  )
}

function HITLCard({ request, expanded, onToggle, onApprove, onDismiss }: {
  request: HITLRequest
  expanded: boolean
  onToggle: () => void
  onApprove: (id: string) => void
  onDismiss: (id: string) => void
}) {
  const branch = BRANCHES.find(b => b.id === request.branchId)!

  return (
    <div style={{
      background: 'var(--flour)',
      borderRadius: 'var(--r-lg)',
      boxShadow: expanded ? 'var(--shadow-lg)' : 'var(--shadow-md)',
      overflow: 'hidden',
      transition: 'box-shadow var(--transition)',
      border: '1.5px solid',
      borderColor: expanded ? 'var(--babka-blue)' : 'transparent',
    }}>
      {/* Header clickeable */}
      <div
        onClick={onToggle}
        style={{
          padding: 'var(--space-5) var(--space-6)',
          display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
          cursor: 'pointer',
        }}
      >
        <TypeIcon type={request.type} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-sm)', color: 'var(--ink)', marginBottom: '3px' }}>
            {request.description}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--bran)' }}>
            {branch.shortName} · {formatRelative(request.createdAt)}
          </div>
        </div>
        <div style={{ fontSize: '16px', color: 'var(--bran)', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform var(--transition)' }}>
          ∨
        </div>
      </div>

      {/* Expandido */}
      {expanded && (
        <div style={{ borderTop: '1px solid var(--line)', padding: 'var(--space-6)' }}>
          {/* Mensaje del agente */}
          {request.agentMessage && (
            <div style={{
              background: 'var(--babka-blue-soft)',
              borderRadius: 'var(--r-md)',
              padding: 'var(--space-4)',
              marginBottom: 'var(--space-4)',
            }}>
              <div style={{
                fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em',
                textTransform: 'uppercase', color: 'var(--babka-blue-deep)', marginBottom: 'var(--space-2)',
              }}>
                BABKA dice:
              </div>
              <p style={{ color: 'var(--babka-blue-deep)', fontSize: 'var(--text-sm)', margin: 0, lineHeight: 1.5 }}>
                {request.agentMessage}
              </p>
            </div>
          )}

          {/* Detalle */}
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', marginBottom: 'var(--space-4)', lineHeight: 1.6 }}>
            {request.details}
          </p>

          {/* Sugerencia */}
          {request.suggestedAction && (
            <div style={{
              background: 'var(--crumb)',
              borderRadius: 'var(--r-md)',
              padding: 'var(--space-3) var(--space-4)',
              marginBottom: 'var(--space-6)',
              display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
            }}>
              <span style={{ fontSize: '14px' }}>→</span>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)' }}>
                <strong style={{ color: 'var(--ink)' }}>Acción sugerida:</strong> {request.suggestedAction}
              </span>
            </div>
          )}

          {/* Acciones */}
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <ActionButton
              label="Aprobar"
              color="var(--babka-blue)"
              textColor="#fff"
              hoverColor="var(--babka-blue-deep)"
              onClick={() => onApprove(request.id)}
            />
            <ActionButton
              label="Descartar"
              color="var(--crumb)"
              textColor="var(--ink-soft)"
              hoverColor="var(--line)"
              onClick={() => onDismiss(request.id)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function ActionButton({ label, color, textColor, hoverColor, onClick }: {
  label: string
  color: string
  textColor: string
  hoverColor: string
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick() }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '10px 24px',
        borderRadius: 'var(--r-pill)',
        border: 'none',
        background: hovered ? hoverColor : color,
        color: textColor,
        fontFamily: 'var(--font-body)',
        fontSize: '12px',
        fontWeight: 'var(--weight-bold)',
        letterSpacing: 'var(--tracking-wide)',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'background var(--transition), transform var(--transition)',
        transform: hovered ? 'translateY(-1px)' : 'none',
      }}
    >
      {label}
    </button>
  )
}

function EmptyState() {
  return (
    <div style={{
      textAlign: 'center',
      padding: 'var(--space-18)',
      background: 'var(--flour)',
      borderRadius: 'var(--r-lg)',
      boxShadow: 'var(--shadow-md)',
    }}>
      <div style={{
        width: '64px', height: '64px',
        borderRadius: '50%',
        background: 'rgba(34,197,94,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto var(--space-4)',
        fontSize: '28px', color: '#16a34a',
      }}>
        ✓
      </div>
      <h3 style={{ marginBottom: 'var(--space-2)', color: '#16a34a' }}>Cola limpia</h3>
      <p style={{ color: 'var(--bran)', fontSize: 'var(--text-sm)' }}>
        No hay aprobaciones pendientes. BABKA está al día.
      </p>
    </div>
  )
}

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 60) return `hace ${mins} min`
  const hrs = Math.round(mins / 60)
  return `hace ${hrs}h`
}

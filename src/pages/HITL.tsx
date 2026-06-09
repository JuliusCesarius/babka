import { useState } from 'react'
import { HITL_REQUESTS, BRANCHES } from '../fixtures/branches'
import { useBreakpoint } from '../hooks/useBreakpoint'
import type { HITLRequest, HITLType, HITLTimelineActor } from '../types'

interface HITLProps {
  onNavigate?: (page: string) => void
  onPinContext?: (req: HITLRequest) => void
}

export function HITL({ onNavigate, onPinContext }: HITLProps) {
  const { isMobile } = useBreakpoint()
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

  const alta  = requests.filter(r => r.priority === 'alta')
  const media = requests.filter(r => r.priority === 'media')
  const baja  = requests.filter(r => r.priority === 'baja')

  return (
    <div>
      <div style={{ marginBottom: isMobile ? 'var(--space-6)' : 'var(--space-8)' }}>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)',
          letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--bran)',
          marginBottom: 'var(--space-2)',
        }}>
          Revisión · aprobaciones pendientes
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: isMobile ? 'var(--text-xl)' : 'var(--text-2xl)' }}>Revisión</h1>
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
        {!isMobile && (
          <p style={{ marginTop: 'var(--space-2)', color: 'var(--bran)', fontSize: 'var(--text-sm)' }}>
            Decisiones que BABKA no puede tomar solo.
          </p>
        )}
      </div>

      {requests.length === 0 ? (
        <EmptyState />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 'var(--space-6)' : 'var(--space-8)' }}>
          {alta.length  > 0 && (
            <Section title="Alta prioridad" color="var(--babka-orange)">
              {alta.map(r => (
                <HITLCard key={r.id} request={r}
                  expanded={expandedId === r.id}
                  onToggle={() => setExpandedId(expandedId === r.id ? null : r.id)}
                  onApprove={handleApprove} onDismiss={handleDismiss}
                  onNavigate={onNavigate} onPinContext={onPinContext}
                  isMobile={isMobile}
                />
              ))}
            </Section>
          )}
          {media.length > 0 && (
            <Section title="Media prioridad" color="var(--wheat)">
              {media.map(r => (
                <HITLCard key={r.id} request={r}
                  expanded={expandedId === r.id}
                  onToggle={() => setExpandedId(expandedId === r.id ? null : r.id)}
                  onApprove={handleApprove} onDismiss={handleDismiss}
                  onNavigate={onNavigate} onPinContext={onPinContext}
                  isMobile={isMobile}
                />
              ))}
            </Section>
          )}
          {baja.length  > 0 && (
            <Section title="Baja prioridad" color="var(--bran)">
              {baja.map(r => (
                <HITLCard key={r.id} request={r}
                  expanded={expandedId === r.id}
                  onToggle={() => setExpandedId(expandedId === r.id ? null : r.id)}
                  onApprove={handleApprove} onDismiss={handleDismiss}
                  onNavigate={onNavigate} onPinContext={onPinContext}
                  isMobile={isMobile}
                />
              ))}
            </Section>
          )}
        </div>
      )}
    </div>
  )
}

function Section({ title, color, children }: {
  title: string; color: string; children: React.ReactNode
}) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
        <div style={{ width: '4px', height: '18px', background: color, borderRadius: 'var(--r-pill)' }} />
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)',
          letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: 'var(--bran)',
        }}>{title}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>{children}</div>
    </div>
  )
}

function TypeIcon({ type }: { type: HITLType }) {
  const icons:  Record<HITLType, string> = { descuadre: '⊡', traspaso: '⇄', 'alias-desconocido': '?', 'merma-alta': '△', 'auto-cierre': '◉' }
  const colors: Record<HITLType, string> = { descuadre: 'var(--wheat)', traspaso: 'var(--babka-blue-soft)', 'alias-desconocido': 'var(--crumb)', 'merma-alta': 'rgba(220,122,51,0.15)', 'auto-cierre': 'rgba(34,197,94,0.12)' }
  const text:   Record<HITLType, string> = { descuadre: 'var(--ink)', traspaso: 'var(--babka-blue-deep)', 'alias-desconocido': 'var(--ink-soft)', 'merma-alta': 'var(--babka-orange-deep)', 'auto-cierre': '#16a34a' }
  return (
    <div style={{
      width: '40px', height: '40px', borderRadius: 'var(--r-md)', flexShrink: 0,
      background: colors[type], display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '17px', color: text[type],
    }}>{icons[type]}</div>
  )
}

// ─── HITL Card ──────────────────────────────────────────────────────────────

function HITLCard({ request, expanded, onToggle, onApprove, onDismiss, onNavigate, onPinContext, isMobile }: {
  request: HITLRequest; expanded: boolean; onToggle: () => void
  onApprove: (id: string) => void; onDismiss: (id: string) => void
  onNavigate?: (page: string) => void; onPinContext?: (req: HITLRequest) => void
  isMobile: boolean
}) {
  const branch      = BRANCHES.find(b => b.id === request.branchId)!
  const [mode, setMode] = useState<'summary' | 'investigate' | 'dismiss'>('summary')
  const [dismissComment, setDismissComment] = useState('')
  const pad = isMobile ? 'var(--space-4)' : 'var(--space-4) var(--space-6)'

  const handleDismissConfirm = () => {
    if (!dismissComment.trim()) return
    onDismiss(request.id)
  }

  const handleOtherAction = () => {
    onPinContext?.(request)
    onNavigate?.('chat')
  }

  return (
    <div style={{
      background: 'var(--flour)', borderRadius: 'var(--r-lg)',
      boxShadow: expanded ? 'var(--shadow-lg)' : 'var(--shadow-md)',
      overflow: 'hidden', transition: 'box-shadow var(--transition)',
      border: '1.5px solid', borderColor: expanded ? 'var(--babka-blue)' : 'transparent',
    }}>
      {/* Header row — always visible, click to expand/collapse */}
      <div onClick={onToggle} style={{ padding: pad, display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer' }}>
        <TypeIcon type={request.type} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-sm)', color: 'var(--ink)', marginBottom: '3px' }}>
            {request.description}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--bran)' }}>
            {branch.shortName} · {formatRelative(request.createdAt)}
          </div>
        </div>
        <span style={{ fontSize: '14px', color: 'var(--bran)', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform var(--transition)', flexShrink: 0 }}>∨</span>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div style={{ borderTop: '1px solid var(--line)' }}>
          {mode === 'summary' && (
            <SummaryPanel
              request={request} isMobile={isMobile}
              onInvestigate={() => setMode('investigate')}
              onDismissRequest={() => setMode('dismiss')}
              onApprove={() => onApprove(request.id)}
              onOtherAction={handleOtherAction}
            />
          )}
          {mode === 'investigate' && (
            <InvestigationPanel
              request={request} isMobile={isMobile}
              onBack={() => setMode('summary')}
              onApprove={() => onApprove(request.id)}
              onDismissRequest={() => setMode('dismiss')}
              onOtherAction={handleOtherAction}
            />
          )}
          {mode === 'dismiss' && (
            <DismissPanel
              comment={dismissComment}
              onCommentChange={setDismissComment}
              onConfirm={handleDismissConfirm}
              onCancel={() => setMode('summary')}
              isMobile={isMobile}
            />
          )}
        </div>
      )}
    </div>
  )
}

// ─── Summary panel (default expanded view) ─────────────────────────────────

function SummaryPanel({ request, isMobile, onInvestigate, onDismissRequest, onApprove, onOtherAction }: {
  request: HITLRequest; isMobile: boolean
  onInvestigate: () => void; onDismissRequest: () => void
  onApprove: () => void; onOtherAction: () => void
}) {
  const pad = isMobile ? 'var(--space-4)' : 'var(--space-6)'
  return (
    <div style={{ padding: pad, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {request.agentMessage && (
        <div style={{ background: 'var(--babka-blue-soft)', borderRadius: 'var(--r-md)', padding: 'var(--space-4)' }}>
          <div style={{ fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--babka-blue-deep)', marginBottom: 'var(--space-2)' }}>
            BABKA dice:
          </div>
          <p style={{ color: 'var(--babka-blue-deep)', fontSize: 'var(--text-sm)', margin: 0, lineHeight: 1.5 }}>
            {request.agentMessage}
          </p>
        </div>
      )}

      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', margin: 0, lineHeight: 1.6 }}>
        {request.details}
      </p>

      {request.suggestedAction && (
        <div style={{
          background: 'var(--crumb)', borderRadius: 'var(--r-md)',
          padding: 'var(--space-3) var(--space-4)',
          display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)',
        }}>
          <span style={{ fontSize: '13px', marginTop: '1px', flexShrink: 0 }}>→</span>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)' }}>
            <strong style={{ color: 'var(--ink)' }}>Acción sugerida:</strong> {request.suggestedAction}
          </span>
        </div>
      )}

      <CTARow
        onApprove={onApprove}
        onInvestigate={onInvestigate}
        onDismiss={onDismissRequest}
        onOtherAction={onOtherAction}
        hasTimeline={!!(request.timeline?.length)}
      />
    </div>
  )
}

// ─── Investigation panel ────────────────────────────────────────────────────

const ACTOR_META: Record<HITLTimelineActor, { icon: string; color: string; label: string }> = {
  sistema:  { icon: '⚙', color: 'var(--bran)',         label: 'Sistema' },
  agente:   { icon: '✦', color: 'var(--babka-blue)',   label: 'BABKA' },
  gerente:  { icon: '●', color: 'var(--wheat-deep)',   label: 'Gerente' },
  pos:      { icon: '⊡', color: 'var(--babka-blue)',  label: 'POS' },
}

function InvestigationPanel({ request, isMobile, onBack, onApprove, onDismissRequest, onOtherAction }: {
  request: HITLRequest; isMobile: boolean
  onBack: () => void; onApprove: () => void
  onDismissRequest: () => void; onOtherAction: () => void
}) {
  const pad = isMobile ? 'var(--space-4)' : 'var(--space-6)'
  const events = request.timeline ?? []

  return (
    <div style={{ padding: pad, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Sub-header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--babka-blue)', fontSize: 'var(--text-xs)',
            fontWeight: 'var(--weight-bold)', fontFamily: 'var(--font-body)',
            padding: 0,
          }}
        >
          ← Volver al resumen
        </button>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--bran)',
        }}>Trazabilidad</span>
      </div>

      {/* Timeline */}
      {events.length > 0 ? (
        <div style={{ position: 'relative' }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute', left: '15px', top: '16px',
            bottom: '16px', width: '1px', background: 'var(--line)',
          }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {events.map((ev, idx) => {
              const meta = ACTOR_META[ev.actor]
              const time = new Date(ev.time).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
              return (
                <div key={idx} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                  {/* Icon dot */}
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                    background: 'var(--flour-warm)', border: '1.5px solid var(--line)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', color: meta.color, zIndex: 1,
                  }}>{meta.icon}</div>
                  {/* Content */}
                  <div style={{ flex: 1, paddingTop: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '10px', fontWeight: 'var(--weight-bold)',
                        color: meta.color, background: `${meta.color}18`,
                        padding: '1px 6px', borderRadius: 'var(--r-pill)',
                        fontFamily: 'var(--font-body)',
                      }}>{meta.label}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--bran)' }}>{time}</span>
                    </div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink)', marginTop: '3px', fontWeight: 'var(--weight-medium)' }}>
                      {ev.event}
                    </div>
                    {ev.detail && (
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--bran)', marginTop: '2px', lineHeight: 1.4 }}>
                        {ev.detail}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--bran)', fontStyle: 'italic' }}>
          Sin eventos registrados para este ítem.
        </div>
      )}

      {/* Agent hypothesis */}
      {request.agentHypothesis && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.06) 0%, rgba(59,130,246,0.02) 100%)',
          border: '1px solid rgba(59,130,246,0.2)',
          borderRadius: 'var(--r-md)', padding: 'var(--space-4)',
        }}>
          <div style={{ fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--babka-blue-deep)', marginBottom: 'var(--space-2)' }}>
            Hipótesis del agente
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--babka-blue-deep)', margin: 0, lineHeight: 1.6 }}>
            {request.agentHypothesis}
          </p>
        </div>
      )}

      <CTARow
        onApprove={onApprove}
        onDismiss={onDismissRequest}
        onOtherAction={onOtherAction}
        hasTimeline={false}
        hideInvestigate
      />
    </div>
  )
}

// ─── Dismiss panel ──────────────────────────────────────────────────────────

function DismissPanel({ comment, onCommentChange, onConfirm, onCancel, isMobile }: {
  comment: string; onCommentChange: (v: string) => void
  onConfirm: () => void; onCancel: () => void; isMobile: boolean
}) {
  const pad = isMobile ? 'var(--space-4)' : 'var(--space-6)'
  const canConfirm = comment.trim().length > 0

  return (
    <div style={{ padding: pad, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--ink)', marginBottom: 'var(--space-2)' }}>
          ¿Por qué descartas esta alerta?
        </div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--bran)', marginBottom: 'var(--space-3)' }}>
          Tu motivo queda registrado en el log de decisiones.
        </div>
        <textarea
          value={comment}
          onChange={e => onCommentChange(e.target.value)}
          placeholder="Ej: Corregido directamente con el gerente, error de captura…"
          rows={3}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--r-md)',
            border: '1.5px solid var(--line)',
            background: 'var(--flour)',
            fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink)',
            resize: 'vertical', outline: 'none',
            transition: 'border-color 0.2s',
            lineHeight: 1.5,
          }}
          onFocus={e => { e.currentTarget.style.borderColor = 'var(--babka-blue)' }}
          onBlur={e => { e.currentTarget.style.borderColor = 'var(--line)' }}
        />
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
        <ActionBtn
          label="Confirmar descarte"
          bg={canConfirm ? 'var(--crumb)' : 'var(--line)'}
          color={canConfirm ? 'var(--ink)' : 'var(--bran)'}
          hover="rgba(220,80,50,0.1)"
          fullWidth={isMobile}
          disabled={!canConfirm}
          onClick={onConfirm}
        />
        <ActionBtn
          label="Cancelar"
          bg="transparent"
          color="var(--babka-blue)"
          hover="var(--babka-blue-soft)"
          fullWidth={isMobile}
          onClick={onCancel}
        />
      </div>
    </div>
  )
}

// ─── 4-action CTA row ───────────────────────────────────────────────────────

function CTARow({ onApprove, onInvestigate, onDismiss, onOtherAction, hasTimeline, hideInvestigate }: {
  onApprove: () => void; onDismiss: () => void; onOtherAction: () => void
  onInvestigate?: () => void
  hasTimeline: boolean; hideInvestigate?: boolean
}) {
  return (
    <div style={{
      display: 'flex', gap: 'var(--space-2)',
      flexWrap: 'wrap',
    }}>
      <ActionBtn
        label="Aprobar"
        bg="var(--babka-blue)" color="#fff" hover="var(--babka-blue-deep)"
        fullWidth={false} onClick={onApprove}
      />
      {!hideInvestigate && hasTimeline && (
        <ActionBtn
          label="Revisar →"
          bg="var(--babka-blue-soft)" color="var(--babka-blue-deep)" hover="rgba(59,130,246,0.15)"
          fullWidth={false} onClick={onInvestigate ?? (() => {})}
        />
      )}
      <ActionBtn
        label="Descartar"
        bg="var(--crumb)" color="var(--ink-soft)" hover="var(--line)"
        fullWidth={false} onClick={onDismiss}
      />
      <ActionBtn
        label="Otra acción ✦"
        bg="rgba(230,178,60,0.15)" color="var(--wheat-deep)" hover="rgba(230,178,60,0.25)"
        fullWidth={false} onClick={onOtherAction}
      />
    </div>
  )
}

// ─── Shared button ──────────────────────────────────────────────────────────

function ActionBtn({ label, bg, color, hover, fullWidth, disabled, onClick }: {
  label: string; bg: string; color: string; hover: string
  fullWidth: boolean; disabled?: boolean; onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={(e) => { e.stopPropagation(); if (!disabled) onClick() }}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={disabled}
      style={{
        flex: fullWidth ? 1 : undefined,
        padding: '9px 20px', borderRadius: 'var(--r-pill)', border: 'none',
        background: hovered && !disabled ? hover : bg,
        color: disabled ? 'var(--bran)' : color,
        fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 'var(--weight-bold)',
        letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background var(--transition), transform var(--transition)',
        transform: hovered && !disabled ? 'translateY(-1px)' : 'none',
        opacity: disabled ? 0.5 : 1,
        whiteSpace: 'nowrap',
      }}
    >{label}</button>
  )
}

// ─── Empty state ────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div style={{
      textAlign: 'center', padding: 'var(--space-18)',
      background: 'var(--flour)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-md)',
    }}>
      <div style={{
        width: '64px', height: '64px', borderRadius: '50%',
        background: 'rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto var(--space-4)', fontSize: '28px', color: '#16a34a',
      }}>✓</div>
      <h3 style={{ marginBottom: 'var(--space-2)', color: '#16a34a' }}>Cola limpia</h3>
      <p style={{ color: 'var(--bran)', fontSize: 'var(--text-sm)' }}>No hay aprobaciones pendientes.</p>
    </div>
  )
}

function formatRelative(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 60) return `hace ${mins} min`
  return `hace ${Math.round(mins / 60)}h`
}

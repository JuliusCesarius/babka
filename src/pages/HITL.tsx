import { useState } from 'react'
import { HITL_REQUESTS, BRANCHES } from '../fixtures/branches'
import { useBreakpoint } from '../hooks/useBreakpoint'
import type { HITLRequest, HITLType } from '../types'

export function HITL() {
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
      <div style={{ marginBottom: isMobile ? 'var(--space-5)' : 'var(--space-8)' }}>
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
          {alta.length  > 0 && <Section title="Alta prioridad"  color="var(--babka-orange)">{alta.map(r  => <HITLCard key={r.id} request={r} expanded={expandedId === r.id} onToggle={() => setExpandedId(expandedId === r.id ? null : r.id)} onApprove={handleApprove} onDismiss={handleDismiss} isMobile={isMobile} />)}</Section>}
          {media.length > 0 && <Section title="Media prioridad" color="var(--wheat)"        >{media.map(r => <HITLCard key={r.id} request={r} expanded={expandedId === r.id} onToggle={() => setExpandedId(expandedId === r.id ? null : r.id)} onApprove={handleApprove} onDismiss={handleDismiss} isMobile={isMobile} />)}</Section>}
          {baja.length  > 0 && <Section title="Baja prioridad"  color="var(--bran)"         >{baja.map(r  => <HITLCard key={r.id} request={r} expanded={expandedId === r.id} onToggle={() => setExpandedId(expandedId === r.id ? null : r.id)} onApprove={handleApprove} onDismiss={handleDismiss} isMobile={isMobile} />)}</Section>}
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
  const icons: Record<HITLType, string>  = { descuadre: '⊡', traspaso: '⇄', 'alias-desconocido': '?', 'merma-alta': '△', 'auto-cierre': '◉' }
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

function HITLCard({ request, expanded, onToggle, onApprove, onDismiss, isMobile }: {
  request: HITLRequest; expanded: boolean; onToggle: () => void
  onApprove: (id: string) => void; onDismiss: (id: string) => void; isMobile: boolean
}) {
  const branch = BRANCHES.find(b => b.id === request.branchId)!
  const pad = isMobile ? 'var(--space-4)' : 'var(--space-4) var(--space-6)'

  return (
    <div style={{
      background: 'var(--flour)', borderRadius: 'var(--r-lg)',
      boxShadow: expanded ? 'var(--shadow-lg)' : 'var(--shadow-md)',
      overflow: 'hidden', transition: 'box-shadow var(--transition)',
      border: '1.5px solid', borderColor: expanded ? 'var(--babka-blue)' : 'transparent',
    }}>
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

      {expanded && (
        <div style={{ borderTop: '1px solid var(--line)', padding: isMobile ? 'var(--space-4)' : 'var(--space-6)' }}>
          {request.agentMessage && (
            <div style={{ background: 'var(--babka-blue-soft)', borderRadius: 'var(--r-md)', padding: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
              <div style={{ fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--babka-blue-deep)', marginBottom: 'var(--space-2)' }}>
                BABKA dice:
              </div>
              <p style={{ color: 'var(--babka-blue-deep)', fontSize: 'var(--text-sm)', margin: 0, lineHeight: 1.5 }}>
                {request.agentMessage}
              </p>
            </div>
          )}

          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', marginBottom: 'var(--space-4)', lineHeight: 1.6 }}>
            {request.details}
          </p>

          {request.suggestedAction && (
            <div style={{
              background: 'var(--crumb)', borderRadius: 'var(--r-md)',
              padding: 'var(--space-3) var(--space-4)', marginBottom: 'var(--space-5)',
              display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)',
            }}>
              <span style={{ fontSize: '13px', marginTop: '1px', flexShrink: 0 }}>→</span>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)' }}>
                <strong style={{ color: 'var(--ink)' }}>Acción sugerida:</strong> {request.suggestedAction}
              </span>
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
            <ActionBtn label="Aprobar"   bg="var(--babka-blue)"  color="#fff"             hover="var(--babka-blue-deep)"  fullWidth={isMobile} onClick={() => onApprove(request.id)} />
            <ActionBtn label="Descartar" bg="var(--crumb)"       color="var(--ink-soft)"  hover="var(--line)"             fullWidth={isMobile} onClick={() => onDismiss(request.id)} />
          </div>
        </div>
      )}
    </div>
  )
}

function ActionBtn({ label, bg, color, hover, fullWidth, onClick }: {
  label: string; bg: string; color: string; hover: string; fullWidth: boolean; onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick() }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: fullWidth ? 1 : undefined,
        padding: '10px 24px', borderRadius: 'var(--r-pill)', border: 'none',
        background: hovered ? hover : bg, color,
        fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 'var(--weight-bold)',
        letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase',
        cursor: 'pointer', transition: 'background var(--transition), transform var(--transition)',
        transform: hovered ? 'translateY(-1px)' : 'none',
      }}
    >{label}</button>
  )
}

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

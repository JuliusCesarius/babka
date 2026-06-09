import { HITL_REQUESTS } from '../fixtures/branches'

const PAGE_LABELS: Record<string, string> = {
  resumen:        'Resumen',
  conciliaciones: 'Conciliaciones',
  hitl:           'Bandeja HITL',
  whatsapp:       'WhatsApp',
}

interface TopBarProps {
  page: string
  onNavigate: (page: string) => void
}

export function TopBar({ page, onNavigate }: TopBarProps) {
  const pendingHITL = HITL_REQUESTS.length

  return (
    <header style={{
      background: 'var(--ink)',
      padding: 'var(--space-3) var(--space-4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 'var(--z-overlay)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    }}>
      {/* Wordmark */}
      <div style={{
        fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-black)',
        fontStyle: 'italic', fontSize: 'var(--text-lg)', color: 'var(--wheat)',
        letterSpacing: 'var(--tracking-tight)',
      }}>
        BABKA
      </div>

      {/* Current page label */}
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
        fontWeight: 'var(--weight-medium)', color: 'rgba(255,255,255,0.7)',
      }}>
        {PAGE_LABELS[page] ?? page}
      </div>

      {/* Avatar + HITL badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        {pendingHITL > 0 && (
          <button
            onClick={() => onNavigate('hitl')}
            style={{
              background: 'var(--babka-orange)', color: '#fff',
              border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 'var(--weight-bold)',
              borderRadius: 'var(--r-pill)', padding: '2px 10px',
            }}
          >
            {pendingHITL}
          </button>
        )}
        <div style={{
          width: '30px', height: '30px', borderRadius: 'var(--r-pill)',
          background: 'var(--wheat)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-black)',
          fontSize: '13px', color: 'var(--ink)',
        }}>
          C
        </div>
      </div>
    </header>
  )
}

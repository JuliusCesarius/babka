import { HITL_REQUESTS } from '../fixtures/branches'
import type { UserRole } from '../App'

const PAGE_LABELS: Record<string, string> = {
  resumen:        'Resumen',
  conciliaciones: 'Conciliaciones',
  calendario:     'Calendario',
  hitl:           'Bandeja HITL',
  whatsapp:       'WhatsApp',
  chat:           'Clarisa AI',
}

interface TopBarProps {
  page: string
  onNavigate: (page: string) => void
  role: UserRole
  onRoleChange: (r: UserRole) => void
}

export function TopBar({ page, onNavigate, role, onRoleChange }: TopBarProps) {
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

      {/* Center: page label + role toggle */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
          fontWeight: 'var(--weight-medium)', color: 'rgba(255,255,255,0.7)',
        }}>
          {PAGE_LABELS[page] ?? page}
        </div>
        <RoleToggle role={role} onRoleChange={onRoleChange} compact />
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
          background: role === 'exec' ? 'var(--babka-orange)' : 'var(--wheat)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-black)',
          fontSize: '13px', color: 'var(--ink)',
        }}>
          {role === 'exec' ? 'E' : 'C'}
        </div>
      </div>
    </header>
  )
}

export function RoleToggle({ role, onRoleChange, compact = false }: {
  role: UserRole
  onRoleChange: (r: UserRole) => void
  compact?: boolean
}) {
  return (
    <div style={{
      display: 'flex',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: 'var(--r-pill)',
      padding: '2px',
      gap: '2px',
    }}>
      {(['ops', 'exec'] as UserRole[]).map(r => (
        <button
          key={r}
          onClick={() => onRoleChange(r)}
          style={{
            padding: compact ? '2px 10px' : '4px 16px',
            borderRadius: 'var(--r-pill)',
            border: 'none',
            background: role === r ? (r === 'exec' ? 'var(--babka-orange)' : 'var(--wheat)') : 'transparent',
            color: role === r ? 'var(--ink)' : 'rgba(255,255,255,0.55)',
            fontFamily: 'var(--font-body)',
            fontSize: compact ? '10px' : 'var(--text-xs)',
            fontWeight: 'var(--weight-black)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {r === 'ops' ? 'OPS' : 'EXEC'}
        </button>
      ))}
    </div>
  )
}

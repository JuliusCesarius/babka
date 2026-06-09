import { useState } from 'react'
import { HITL_REQUESTS } from '../fixtures/branches'

interface NavProps {
  page: string
  onNavigate: (page: string) => void
}

const NAV_ITEMS = [
  { id: 'resumen',         label: 'Resumen',        icon: '◈' },
  { id: 'conciliaciones',  label: 'Conciliaciones', icon: '⊞' },
  { id: 'hitl',            label: 'Bandeja HITL',   icon: '⊡' },
  { id: 'whatsapp',        label: 'WhatsApp',       icon: '◎' },
]

export function Nav({ page, onNavigate }: NavProps) {
  const pendingHITL = HITL_REQUESTS.length

  return (
    <nav style={{
      width: '220px',
      minHeight: '100vh',
      background: 'var(--ink)',
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--space-6)',
      gap: 'var(--space-2)',
      flexShrink: 0,
    }}>
      {/* Wordmark */}
      <div style={{ marginBottom: 'var(--space-8)', paddingBottom: 'var(--space-6)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 'var(--weight-black)',
          fontStyle: 'italic',
          fontSize: 'var(--text-xl)',
          color: 'var(--wheat)',
          letterSpacing: 'var(--tracking-tight)',
        }}>
          BABKA
        </div>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 'var(--weight-bold)',
          fontSize: '10px',
          letterSpacing: 'var(--tracking-widest)',
          textTransform: 'uppercase',
          color: 'var(--bran)',
          marginTop: '2px',
        }}>
          PAN DE HOY
        </div>
      </div>

      {/* Nav items */}
      {NAV_ITEMS.map(item => {
        const isActive = page === item.id
        return (
          <NavItem
            key={item.id}
            item={item}
            isActive={isActive}
            badge={item.id === 'hitl' ? pendingHITL : undefined}
            onClick={() => onNavigate(item.id)}
          />
        )
      })}

      {/* Footer */}
      <div style={{ marginTop: 'auto', paddingTop: 'var(--space-6)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
        }}>
          <div style={{
            width: '32px', height: '32px',
            borderRadius: 'var(--r-pill)',
            background: 'var(--wheat)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)',
            fontWeight: 'var(--weight-black)',
            fontSize: '14px',
            color: 'var(--ink)',
            flexShrink: 0,
          }}>
            C
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: '#fff' }}>Clarisa</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--bran)' }}>Operadora</div>
          </div>
        </div>
      </div>
    </nav>
  )
}

function NavItem({ item, isActive, badge, onClick }: {
  item: typeof NAV_ITEMS[number]
  isActive: boolean
  badge?: number
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        padding: '10px 12px',
        borderRadius: 'var(--r-md)',
        border: 'none',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
        background: isActive ? 'var(--wheat)' : hovered ? 'rgba(255,255,255,0.06)' : 'transparent',
        color: isActive ? 'var(--ink)' : 'rgba(255,255,255,0.7)',
        transition: 'background var(--transition), color var(--transition)',
        position: 'relative',
      }}
    >
      <span style={{ fontSize: '14px', flexShrink: 0 }}>{item.icon}</span>
      <span style={{
        fontFamily: 'var(--font-body)',
        fontWeight: isActive ? 'var(--weight-bold)' : 'var(--weight-medium)',
        fontSize: 'var(--text-sm)',
        flex: 1,
      }}>
        {item.label}
      </span>
      {badge !== undefined && badge > 0 && (
        <span style={{
          background: isActive ? 'var(--ink)' : 'var(--babka-orange)',
          color: '#fff',
          fontSize: '10px',
          fontWeight: 'var(--weight-bold)',
          fontFamily: 'var(--font-mono)',
          borderRadius: 'var(--r-pill)',
          padding: '1px 7px',
          minWidth: '20px',
          textAlign: 'center',
        }}>
          {badge}
        </span>
      )}
    </button>
  )
}

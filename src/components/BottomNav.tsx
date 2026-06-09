import { useState } from 'react'
import { HITL_REQUESTS } from '../fixtures/branches'

const NAV_ITEMS = [
  { id: 'resumen',        label: 'Resumen',   icon: '◈' },
  { id: 'conciliaciones', label: 'Cierres',   icon: '⊞' },
  { id: 'calendario',     label: 'Calendario',icon: '▦' },
  { id: 'hitl',           label: 'HITL',      icon: '⊡' },
  { id: 'chat',           label: 'Clarisa AI',icon: '✦' },
]

interface BottomNavProps {
  page: string
  onNavigate: (page: string) => void
}

export function BottomNav({ page, onNavigate }: BottomNavProps) {
  const pendingHITL = HITL_REQUESTS.length

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      background: 'var(--ink)',
      display: 'flex',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      zIndex: 'var(--z-overlay)',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    }}>
      {NAV_ITEMS.map(item => (
        <BottomItem
          key={item.id}
          item={item}
          isActive={page === item.id}
          badge={item.id === 'hitl' ? pendingHITL : undefined}
          onClick={() => onNavigate(item.id)}
        />
      ))}
    </nav>
  )
}

function BottomItem({ item, isActive, badge, onClick }: {
  item: typeof NAV_ITEMS[number]
  isActive: boolean
  badge?: number
  onClick: () => void
}) {
  const [pressed, setPressed] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '3px',
        padding: 'var(--space-3) var(--space-2)',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        transform: pressed ? 'scale(0.92)' : 'none',
        transition: 'transform 0.1s',
        position: 'relative',
      }}
    >
      {/* Active indicator */}
      {isActive && (
        <div style={{
          position: 'absolute',
          top: 0, left: '20%', right: '20%',
          height: '2px',
          background: 'var(--wheat)',
          borderRadius: '0 0 var(--r-pill) var(--r-pill)',
        }} />
      )}

      <span style={{
        fontSize: '18px',
        color: isActive ? 'var(--wheat)' : 'rgba(255,255,255,0.45)',
        position: 'relative',
        lineHeight: 1,
      }}>
        {item.icon}
        {badge !== undefined && badge > 0 && (
          <span style={{
            position: 'absolute', top: '-4px', right: '-7px',
            background: 'var(--babka-orange)', color: '#fff',
            fontSize: '9px', fontWeight: 'var(--weight-bold)',
            borderRadius: 'var(--r-pill)', padding: '1px 4px', lineHeight: 1,
          }}>{badge}</span>
        )}
      </span>
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: '10px',
        fontWeight: isActive ? 'var(--weight-bold)' : 'var(--weight-medium)',
        color: isActive ? 'var(--wheat)' : 'rgba(255,255,255,0.45)',
        letterSpacing: '0.04em',
      }}>
        {item.label}
      </span>
    </button>
  )
}

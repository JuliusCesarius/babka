import { useState } from 'react'
import { HITL_REQUESTS } from '../fixtures/branches'
import { RoleToggle } from './TopBar'
import type { UserRole } from '../App'

interface NavProps {
  page: string
  onNavigate: (page: string) => void
  collapsed?: boolean
  onToggleCollapse?: () => void
  role?: UserRole
  onRoleChange?: (r: UserRole) => void
}

const NAV_ITEMS = [
  { id: 'resumen',        label: 'Resumen',        icon: '◈' },
  { id: 'conciliaciones', label: 'Conciliaciones', icon: '⊞' },
  { id: 'calendario',     label: 'Calendario',     icon: '▦' },
  { id: 'hitl',           label: 'Revisión',       icon: '⊡' },
  { id: 'whatsapp',       label: 'WhatsApp',       icon: '◎' },
  { id: 'chat',           label: 'Clarisa AI',     icon: '✦' },
]

export function Nav({ page, onNavigate, collapsed = false, onToggleCollapse, role = 'ops', onRoleChange }: NavProps) {
  const pendingHITL = HITL_REQUESTS.length
  const width = collapsed ? '64px' : '220px'

  return (
    <nav style={{
      width,
      minHeight: '100vh',
      background: 'var(--ink)',
      display: 'flex',
      flexDirection: 'column',
      padding: collapsed ? 'var(--space-4) var(--space-2)' : 'var(--space-6)',
      gap: 'var(--space-2)',
      flexShrink: 0,
      transition: 'width 0.3s var(--ease-out)',
      overflowX: 'hidden',
    }}>
      {/* Wordmark / icon + collapse toggle */}
      <div style={{
        marginBottom: 'var(--space-6)',
        paddingBottom: 'var(--space-4)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
      }}>
        {collapsed ? (
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-black)',
            fontStyle: 'italic', fontSize: 'var(--text-lg)', color: 'var(--wheat)',
          }}>B</div>
        ) : (
          <div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-black)',
              fontStyle: 'italic', fontSize: 'var(--text-xl)', color: 'var(--wheat)',
              letterSpacing: 'var(--tracking-tight)',
            }}>BABKA</div>
            <div style={{
              fontFamily: 'var(--font-body)', fontWeight: 'var(--weight-bold)',
              fontSize: '10px', letterSpacing: 'var(--tracking-widest)',
              textTransform: 'uppercase', color: 'var(--bran)', marginTop: '2px',
            }}>PAN DE HOY</div>
          </div>
        )}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: 'none', cursor: 'pointer',
              borderRadius: 'var(--r-md)',
              width: '24px', height: '24px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.45)',
              fontSize: '12px', flexShrink: 0,
              transition: 'background var(--transition), color var(--transition)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.8)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.45)'
            }}
          >
            {collapsed ? '›' : '‹'}
          </button>
        )}
      </div>

      {/* Nav items */}
      {NAV_ITEMS.map(item => (
        <NavItem
          key={item.id}
          item={item}
          isActive={page === item.id}
          badge={item.id === 'hitl' ? pendingHITL : undefined}
          onClick={() => onNavigate(item.id)}
          collapsed={collapsed}
        />
      ))}

      {/* Footer: role toggle + avatar */}
      {!collapsed && (
        <div style={{ marginTop: 'auto', paddingTop: 'var(--space-4)', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {onRoleChange && (
            <RoleToggle role={role} onRoleChange={onRoleChange} />
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Avatar letter={role === 'exec' ? 'E' : 'C'} accent={role === 'exec'} />
            <div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: '#fff' }}>
                {role === 'exec' ? 'Ejecutivo' : 'Clarisa'}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--bran)' }}>
                {role === 'exec' ? 'Vista C-Level' : 'Operadora'}
              </div>
            </div>
          </div>
        </div>
      )}
      {collapsed && (
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center' }}>
          <Avatar letter="C" />
        </div>
      )}
    </nav>
  )
}

function NavItem({ item, isActive, badge, onClick, collapsed }: {
  item: typeof NAV_ITEMS[number]
  isActive: boolean
  badge?: number
  onClick: () => void
  collapsed: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={collapsed ? item.label : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: collapsed ? 0 : 'var(--space-3)',
        padding: collapsed ? '10px' : '10px 12px',
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
      <span style={{ fontSize: '15px', flexShrink: 0, position: 'relative' }}>
        {item.icon}
        {collapsed && badge !== undefined && badge > 0 && (
          <span style={{
            position: 'absolute', top: '-4px', right: '-6px',
            background: 'var(--babka-orange)', color: '#fff',
            fontSize: '9px', fontWeight: 'var(--weight-bold)',
            borderRadius: 'var(--r-pill)', padding: '1px 4px',
            lineHeight: 1,
          }}>{badge}</span>
        )}
      </span>
      {!collapsed && (
        <>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontWeight: isActive ? 'var(--weight-bold)' : 'var(--weight-medium)',
            fontSize: 'var(--text-sm)', flex: 1,
          }}>
            {item.label}
          </span>
          {badge !== undefined && badge > 0 && (
            <span style={{
              background: isActive ? 'var(--ink)' : 'var(--babka-orange)', color: '#fff',
              fontSize: '10px', fontWeight: 'var(--weight-bold)', fontFamily: 'var(--font-mono)',
              borderRadius: 'var(--r-pill)', padding: '1px 7px', minWidth: '20px', textAlign: 'center',
            }}>{badge}</span>
          )}
        </>
      )}
    </button>
  )
}

function Avatar({ letter, accent }: { letter: string; accent?: boolean }) {
  return (
    <div style={{
      width: '32px', height: '32px', borderRadius: 'var(--r-pill)',
      background: accent ? 'var(--babka-orange)' : 'var(--wheat)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-black)',
      fontSize: '14px', color: 'var(--ink)', flexShrink: 0,
    }}>
      {letter}
    </div>
  )
}

import type { ReactNode } from 'react'
import { Nav } from './Nav'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import { useBreakpoint } from '../hooks/useBreakpoint'

interface LayoutProps {
  page: string
  onNavigate: (page: string) => void
  children: ReactNode
}

export function Layout({ page, onNavigate, children }: LayoutProps) {
  const { isMobile, isTablet } = useBreakpoint()

  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--flour-warm)' }}>
        <TopBar page={page} onNavigate={onNavigate} />
        <main style={{ flex: 1, padding: 'var(--space-4)', paddingBottom: '72px' }}>
          {children}
        </main>
        <BottomNav page={page} onNavigate={onNavigate} />
      </div>
    )
  }

  if (isTablet) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--flour-warm)' }}>
        <Nav page={page} onNavigate={onNavigate} collapsed />
        <main style={{ flex: 1, padding: 'var(--space-6)', minWidth: 0 }}>
          {children}
        </main>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--flour-warm)' }}>
      <Nav page={page} onNavigate={onNavigate} />
      <main style={{ flex: 1, padding: 'var(--space-8)', minWidth: 0 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  )
}

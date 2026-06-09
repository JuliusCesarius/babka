import type { ReactNode } from 'react'
import { Nav } from './Nav'

interface LayoutProps {
  page: string
  onNavigate: (page: string) => void
  children: ReactNode
}

export function Layout({ page, onNavigate, children }: LayoutProps) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--flour-warm)' }}>
      <Nav page={page} onNavigate={onNavigate} />
      <main style={{ flex: 1, padding: 'var(--space-8)', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        {children}
      </main>
    </div>
  )
}

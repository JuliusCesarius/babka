import { useState, useEffect } from 'react'
import { Layout } from './components/Layout'
import { Resumen } from './pages/Resumen'
import { Conciliaciones } from './pages/Conciliaciones'
import { Calendario } from './pages/Calendario'
import { HITL } from './pages/HITL'
import { WhatsAppSim } from './pages/WhatsAppSim'
import { AgentChat } from './pages/AgentChat'
import type { BranchId, ChatContext } from './types'

export type UserRole = 'ops' | 'exec'

const PAGE_TO_PATH: Record<string, string> = {
  resumen:        '/',
  conciliaciones: '/conciliaciones',
  calendario:     '/calendario',
  hitl:           '/revision',
  whatsapp:       '/whatsapp',
  chat:           '/chat',
}

const PATH_TO_PAGE: Record<string, string> = Object.fromEntries(
  Object.entries(PAGE_TO_PATH).map(([page, path]) => [path, page])
)

function pageFromPath(path: string): string {
  return PATH_TO_PAGE[path] ?? 'resumen'
}

export default function App() {
  const [page, setPage]                       = useState(() => pageFromPath(window.location.pathname))
  const [selectedBranchId, setSelectedBranchId] = useState<BranchId | undefined>(undefined)
  const [role, setRole]                       = useState<UserRole>('ops')
  const [chatContext, setChatContext]          = useState<ChatContext | null>(null)

  const navigate = (newPage: string, branchId?: BranchId) => {
    const path = PAGE_TO_PATH[newPage] ?? '/'
    const params = branchId ? `?sucursal=${branchId}` : ''
    window.history.pushState({ page: newPage, branchId }, '', path + params)
    setPage(newPage)
    setSelectedBranchId(branchId)
  }

  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const state = e.state as { page?: string; branchId?: BranchId } | null
      if (state?.page) {
        setPage(state.page)
        setSelectedBranchId(state.branchId)
      } else {
        const params = new URLSearchParams(window.location.search)
        setPage(pageFromPath(window.location.pathname))
        setSelectedBranchId((params.get('sucursal') as BranchId) ?? undefined)
      }
    }
    window.addEventListener('popstate', onPop)
    // Replace the initial history entry so popstate fires correctly on first back
    const initParams = new URLSearchParams(window.location.search)
    const initBranch = (initParams.get('sucursal') as BranchId) ?? undefined
    window.history.replaceState({ page, branchId: initBranch }, '', window.location.href)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const handlePinContext = (ctx: ChatContext) => {
    setChatContext(ctx)
    navigate('chat')
  }

  return (
    <Layout page={page} onNavigate={navigate} role={role}>
      {page === 'resumen'        && <Resumen onNavigate={navigate} role={role} onRoleChange={setRole} />}
      {page === 'conciliaciones' && <Conciliaciones initialBranchId={selectedBranchId} onNavigate={navigate} onPinContext={handlePinContext} />}
      {page === 'calendario'     && <Calendario />}
      {page === 'hitl'           && <HITL onNavigate={navigate} onPinContext={handlePinContext} />}
      {page === 'whatsapp'       && <WhatsAppSim />}
      {page === 'chat'           && <AgentChat role={role} pinnedContext={chatContext} onClearContext={() => setChatContext(null)} />}
    </Layout>
  )
}

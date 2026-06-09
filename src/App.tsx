import { useState } from 'react'
import { Layout } from './components/Layout'
import { Resumen } from './pages/Resumen'
import { Conciliaciones } from './pages/Conciliaciones'
import { Calendario } from './pages/Calendario'
import { HITL } from './pages/HITL'
import { WhatsAppSim } from './pages/WhatsAppSim'
import { AgentChat } from './pages/AgentChat'
import type { BranchId, HITLRequest } from './types'

export type UserRole = 'ops' | 'exec'

export default function App() {
  const [page, setPage]                       = useState('resumen')
  const [selectedBranchId, setSelectedBranchId] = useState<BranchId | undefined>(undefined)
  const [role, setRole]                       = useState<UserRole>('ops')
  const [chatContext, setChatContext]          = useState<HITLRequest | null>(null)

  const navigate = (newPage: string, branchId?: BranchId) => {
    setPage(newPage)
    setSelectedBranchId(branchId)
  }

  const handlePinContext = (req: HITLRequest) => {
    setChatContext(req)
    navigate('chat')
  }

  return (
    <Layout page={page} onNavigate={navigate} role={role} onRoleChange={setRole}>
      {page === 'resumen'        && <Resumen onNavigate={navigate} role={role} />}
      {page === 'conciliaciones' && <Conciliaciones initialBranchId={selectedBranchId} onNavigate={navigate} />}
      {page === 'calendario'     && <Calendario />}
      {page === 'hitl'           && <HITL onNavigate={navigate} onPinContext={handlePinContext} />}
      {page === 'whatsapp'       && <WhatsAppSim />}
      {page === 'chat'           && <AgentChat role={role} pinnedContext={chatContext} onClearContext={() => setChatContext(null)} />}
    </Layout>
  )
}

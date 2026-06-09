import { useState } from 'react'
import { Layout } from './components/Layout'
import { Resumen } from './pages/Resumen'
import { Conciliaciones } from './pages/Conciliaciones'
import { Calendario } from './pages/Calendario'
import { HITL } from './pages/HITL'
import { WhatsAppSim } from './pages/WhatsAppSim'
import { AgentChat } from './pages/AgentChat'
import type { BranchId } from './types'

export type UserRole = 'ops' | 'exec'

export default function App() {
  const [page, setPage] = useState('resumen')
  const [selectedBranchId, setSelectedBranchId] = useState<BranchId | undefined>(undefined)
  const [role, setRole] = useState<UserRole>('ops')

  const navigate = (newPage: string, branchId?: BranchId) => {
    setPage(newPage)
    setSelectedBranchId(branchId)
  }

  return (
    <Layout page={page} onNavigate={navigate} role={role} onRoleChange={setRole}>
      {page === 'resumen'        && <Resumen onNavigate={navigate} role={role} />}
      {page === 'conciliaciones' && <Conciliaciones initialBranchId={selectedBranchId} />}
      {page === 'calendario'     && <Calendario />}
      {page === 'hitl'           && <HITL />}
      {page === 'whatsapp'       && <WhatsAppSim />}
      {page === 'chat'           && <AgentChat role={role} />}
    </Layout>
  )
}

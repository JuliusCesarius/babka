import { useState } from 'react'
import { Layout } from './components/Layout'
import { Resumen } from './pages/Resumen'
import { Conciliaciones } from './pages/Conciliaciones'
import { HITL } from './pages/HITL'
import { WhatsAppSim } from './pages/WhatsAppSim'
import type { BranchId } from './types'

export default function App() {
  const [page, setPage] = useState('resumen')
  const [selectedBranchId, setSelectedBranchId] = useState<BranchId | undefined>(undefined)

  const navigate = (newPage: string, branchId?: BranchId) => {
    setPage(newPage)
    setSelectedBranchId(branchId)
  }

  return (
    <Layout page={page} onNavigate={navigate}>
      {page === 'resumen'        && <Resumen onNavigate={navigate} />}
      {page === 'conciliaciones' && <Conciliaciones initialBranchId={selectedBranchId} />}
      {page === 'hitl'           && <HITL />}
      {page === 'whatsapp'       && <WhatsAppSim />}
    </Layout>
  )
}

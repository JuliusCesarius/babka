// ─── BABKA CONTRACT TYPES ──────────────────────────────────────────────────
// Estos tipos son la fuente de verdad del contrato de la API.
// El backend (Fase 2+) implementará modelos Pydantic que reflejen esta forma exacta.

export type BranchId = 'centro' | 'norte' | 'montes-ame' | 'marista' | 'slowfood'

export type ReconciliationStatus = 'cerrado' | 'abierto' | 'descuadre' | 'pendiente'

export type TrafficLight = 'verde' | 'amarillo' | 'rojo'

export interface Branch {
  id: BranchId
  name: string
  shortName: string
  manager: string
  phone: string
}

export interface BranchSummary {
  branchId: BranchId
  date: string // ISO date
  light: TrafficLight
  reconciliationStatus: ReconciliationStatus
  totalUnits: number
  soldUnits: number
  transferUnits: number
  wasteUnits: number
  staffUnits: number
  diferencia: number // debe ser 0 para cerrar
  lastUpdate: string // ISO datetime
}

export type ReconciliationDestino =
  | 'vendido'
  | 'traspaso'
  | 'merma'
  | 'personal'
  | 'evento'
  | 'muestra'
  | 'devolucion'

export interface ReconciliationItem {
  id: string
  productName: string
  sku: string
  opening: number
  produced: number
  closing: number
  vendido: number
  traspaso: number
  merma: number
  personal: number
  evento: number
  muestra: number
  devolucion: number
  diferencia: number // opening + produced - closing - sum(destinos)
  unit: 'pieza' | 'kg' | 'lt'
}

export interface Reconciliation {
  id: string
  branchId: BranchId
  date: string
  status: ReconciliationStatus
  items: ReconciliationItem[]
  totalDiferencia: number
  createdAt: string
  closedAt?: string
  closedBy?: string
  notes?: string
}

export type HITLType =
  | 'descuadre'
  | 'traspaso'
  | 'alias-desconocido'
  | 'merma-alta'
  | 'auto-cierre'

export type HITLPriority = 'alta' | 'media' | 'baja'

export interface HITLRequest {
  id: string
  type: HITLType
  branchId: BranchId
  description: string
  details: string
  priority: HITLPriority
  createdAt: string
  agentMessage?: string
  suggestedAction?: string
  reconciliationId?: string
}

export type WhatsAppRole = 'user' | 'agent' | 'system'

export type MessageStatus = 'enviado' | 'recibido' | 'leido'

export interface WhatsAppMessage {
  id: string
  role: WhatsAppRole
  content: string
  timestamp: string
  status?: MessageStatus
  imageUrl?: string
  isVoice?: boolean
}

export interface WhatsAppConversation {
  branchId: BranchId
  contactName: string
  contactPhone: string
  messages: WhatsAppMessage[]
}

export interface DailySnapshot {
  date: string
  branchId: BranchId
  status: ReconciliationStatus
  light: TrafficLight
  diferencia: number
  totalUnits: number
}

export interface BakeryOrderItem {
  sku: string
  productName: string
  quantity: number
}

export interface BakeryOrder {
  id: string
  date: string
  orderDate: string
  supplier: string
  items: BakeryOrderItem[]
  totalPiezas: number
  status: 'pendiente' | 'confirmado' | 'entregado'
  notes?: string
}

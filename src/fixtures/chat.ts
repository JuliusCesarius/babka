
export interface ChatMessage {
  id: string
  role: 'user' | 'agent'
  content: string
  timestamp: string
  card?: ChatCard
}

export interface ChatCard {
  type: 'branch-summary' | 'hitl-alert' | 'reconciliation-delta'
  branchName?: string
  status?: string
  light?: string
  diferencia?: number
  totalUnits?: number
  soldUnits?: number
  pending?: number
}

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'init-1',
    role: 'agent',
    content: 'Hola Clarisa. Soy BABKA. Hoy son las 9:18 pm y tengo el resumen del día listo. ¿Qué necesitas revisar?',
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: 'init-2',
    role: 'agent',
    content: '3 sucursales cerraron sin problemas. Norte tiene un descuadre de 4 piezas esperando tu aprobación. Marista aún no reportó.',
    timestamp: new Date(Date.now() - 1000 * 60 * 10 + 800).toISOString(),
    card: {
      type: 'hitl-alert',
      pending: 4,
    },
  },
]

// Respuestas simuladas por keyword — Fase 0
export type SimResponse = { content: string; card?: ChatCard }

export function getSimulatedResponse(input: string): SimResponse[] {
  const q = input.toLowerCase()

  if (match(q, ['norte'])) {
    return [
      { content: 'Norte cerró con un descuadre de 4 piezas de Babka chocolate. Sofía reportó el cierre a las 8:47 pm.' },
      {
        content: 'El inventario indica 47 piezas consumidas pero solo 43 están contabilizadas. Las 4 restantes pueden ser merma no reportada o un traspaso sin confirmar desde Centro.',
        card: { type: 'branch-summary', branchName: 'Norte', status: 'Descuadre', light: 'amarillo', diferencia: 4, totalUnits: 210, soldUnits: 178 },
      },
    ]
  }

  if (match(q, ['centro'])) {
    return [
      {
        content: 'Centro cerró limpio a las 9:03 pm. Diego reportó 184 unidades totales, diferencia en cero.',
        card: { type: 'branch-summary', branchName: 'Centro', status: 'Cerrado', light: 'verde', diferencia: 0, totalUnits: 184, soldUnits: 156 },
      },
    ]
  }

  if (match(q, ['marista'])) {
    return [
      { content: 'Marista no ha reportado el cierre de vitrina. El último movimiento fue a las 9:12 am cuando se registró la apertura.' },
      { content: '¿Quieres que le mande un recordatorio a Valeria por WhatsApp?' },
    ]
  }

  if (match(q, ['slowfood', 'slow food'])) {
    return [
      {
        content: 'Slowfood cerró sin problemas a las 9:18 pm. Ana reportó 96 unidades, diferencia en cero.',
        card: { type: 'branch-summary', branchName: 'Slowfood', status: 'Cerrado', light: 'verde', diferencia: 0, totalUnits: 96, soldUnits: 81 },
      },
    ]
  }

  if (match(q, ['montes', 'montes ame'])) {
    return [
      {
        content: 'Montes Ame cerró sin problemas a las 8:55 pm. Carlos reportó 142 unidades, diferencia en cero.',
        card: { type: 'branch-summary', branchName: 'Montes', status: 'Cerrado', light: 'verde', diferencia: 0, totalUnits: 142, soldUnits: 118 },
      },
    ]
  }

  if (match(q, ['hitl', 'cola', 'pendiente', 'aprobac', 'aprobar'])) {
    return [
      { content: 'Hay 4 items en la bandeja de aprobaciones:' },
      { content: '1. ↑ Alta — Descuadre de 4 piezas en Norte\n2. → Media — Traspaso Centro → Norte sin confirmar\n3. → Media — Alias desconocido "bab choco grande"\n4. ↓ Baja — Merma alta en croissants Centro' },
    ]
  }

  if (match(q, ['resumen', 'resúm', 'día', 'hoy', 'estado'])) {
    return [
      { content: 'Resumen del día (8 jun 2026):' },
      { content: '✅ Centro — cerrado, Δ = 0\n⚠️ Norte — descuadre, Δ = +4\n✅ Montes — cerrado, Δ = 0\n🔴 Marista — sin reportar\n✅ Slowfood — cerrado, Δ = 0' },
    ]
  }

  if (match(q, ['merma'])) {
    return [
      { content: 'Hoy hay una merma inusual en Centro: 7 croissants vs el promedio de 2.1 en los últimos 30 días. Está en la bandeja HITL como baja prioridad.' },
    ]
  }

  if (match(q, ['traspaso'])) {
    return [
      { content: 'Hay un traspaso pendiente de confirmación: 5 Babka chocolate de Centro a Norte (4:00 pm). Diego lo registró pero Norte aún no confirma recepción en su conciliación.' },
    ]
  }

  if (match(q, ['gracias', 'ok', 'entendido', 'listo', 'perfecto'])) {
    return [
      { content: 'Con gusto. Estoy aquí cuando necesites.' },
    ]
  }

  // Default
  return [
    { content: 'Entendido. Puedo ayudarte con el estado de las sucursales, la bandeja HITL, traspasos o mermas. ¿Qué quieres revisar?' },
  ]
}

function match(input: string, keywords: string[]): boolean {
  return keywords.some(k => input.includes(k))
}

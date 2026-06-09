import type { ItemEvent, ReconciliationDestino } from '../types'

type EventMap = Record<string, Partial<Record<ReconciliationDestino, ItemEvent[]>>>

const ITEM_EVENTS: EventMap = {
  // ─── Centro · Babka chocolate ───────────────────────────────────────────
  'ri-001': {
    vendido: [
      { id: 'ev-001', time: '2026-06-08T10:15:00', source: 'pos', description: 'Venta mostrador', quantity: 12 },
      { id: 'ev-002', time: '2026-06-08T12:32:00', source: 'pos', description: 'Venta mostrador', quantity: 8 },
      { id: 'ev-003', time: '2026-06-08T14:17:00', source: 'pos', description: 'Venta mostrador', quantity: 11 },
      { id: 'ev-004', time: '2026-06-08T17:44:00', source: 'pos', description: 'Venta mostrador', quantity: 7 },
    ],
    merma: [
      { id: 'ev-005', time: '2026-06-08T16:00:00', source: 'manual', description: 'Aplastamiento en transporte', quantity: 2, operator: 'Diego Alonzo' },
      { id: 'ev-006', time: '2026-06-08T19:30:00', source: 'manual', description: 'Caducidad por cierre', quantity: 1, operator: 'Diego Alonzo' },
    ],
    traspaso: [
      { id: 'ev-007', time: '2026-06-08T15:15:00', source: 'traspaso', description: 'Enviado a Babka Norte', quantity: 5, operator: 'Diego Alonzo' },
    ],
    personal: [
      { id: 'ev-008', time: '2026-06-08T13:00:00', source: 'manual', description: 'Consumo personal cocina', quantity: 2, operator: 'Diego Alonzo' },
    ],
  },
  // ─── Centro · Focaccia romero ────────────────────────────────────────────
  'ri-002': {
    vendido: [
      { id: 'ev-010', time: '2026-06-08T11:00:00', source: 'pos', description: 'Venta mostrador', quantity: 10 },
      { id: 'ev-011', time: '2026-06-08T13:45:00', source: 'pos', description: 'Venta mostrador', quantity: 8 },
    ],
    merma: [
      { id: 'ev-012', time: '2026-06-08T20:00:00', source: 'manual', description: 'Caducidad por cierre', quantity: 2, operator: 'Diego Alonzo' },
    ],
    traspaso: [
      { id: 'ev-013', time: '2026-06-08T15:15:00', source: 'traspaso', description: 'Enviado a Babka Norte', quantity: 4, operator: 'Diego Alonzo' },
    ],
  },
  // ─── Centro · Croissant mantequilla ─────────────────────────────────────
  'ri-003': {
    vendido: [
      { id: 'ev-015', time: '2026-06-08T09:45:00', source: 'pos', description: 'Venta mostrador', quantity: 14 },
      { id: 'ev-016', time: '2026-06-08T12:10:00', source: 'pos', description: 'Venta mostrador', quantity: 9 },
      { id: 'ev-017', time: '2026-06-08T15:30:00', source: 'pos', description: 'Venta mostrador', quantity: 9 },
    ],
    merma: [
      { id: 'ev-018', time: '2026-06-08T19:00:00', source: 'manual', description: 'Caducidad por cierre', quantity: 3, operator: 'Diego Alonzo' },
    ],
    personal: [
      { id: 'ev-019', time: '2026-06-08T08:30:00', source: 'manual', description: 'Degustación apertura', quantity: 2, operator: 'Diego Alonzo' },
      { id: 'ev-020', time: '2026-06-08T14:00:00', source: 'manual', description: 'Consumo personal', quantity: 2, operator: 'Diego Alonzo' },
    ],
    traspaso: [
      { id: 'ev-021', time: '2026-06-08T15:15:00', source: 'traspaso', description: 'Enviado a Babka Norte', quantity: 3, operator: 'Diego Alonzo' },
    ],
  },
  // ─── Centro · Sourdough 500g ─────────────────────────────────────────────
  'ri-004': {
    vendido: [
      { id: 'ev-025', time: '2026-06-08T10:00:00', source: 'pos', description: 'Venta mostrador', quantity: 8 },
      { id: 'ev-026', time: '2026-06-08T14:20:00', source: 'pos', description: 'Venta mostrador', quantity: 10 },
    ],
    personal: [
      { id: 'ev-027', time: '2026-06-08T09:00:00', source: 'manual', description: 'Consumo personal cocina', quantity: 2, operator: 'Diego Alonzo' },
    ],
    evento: [
      { id: 'ev-028', time: '2026-06-08T11:30:00', source: 'manual', description: 'Cena corporativa Hotel Hyatt', quantity: 6, operator: 'Diego Alonzo' },
    ],
  },
  // ─── Centro · Pain au chocolat ───────────────────────────────────────────
  'ri-005': {
    vendido: [
      { id: 'ev-030', time: '2026-06-08T09:00:00', source: 'pos', description: 'Venta mostrador', quantity: 15 },
      { id: 'ev-031', time: '2026-06-08T11:30:00', source: 'pos', description: 'Venta mostrador', quantity: 9 },
    ],
    muestra: [
      { id: 'ev-032', time: '2026-06-08T10:00:00', source: 'manual', description: 'Muestras a prensa', quantity: 4, operator: 'Diego Alonzo' },
      { id: 'ev-033', time: '2026-06-08T16:00:00', source: 'manual', description: 'Muestras a cliente corporativo', quantity: 3, operator: 'Diego Alonzo' },
    ],
  },
  // ─── Norte · Babka chocolate (tiene descuadre +4) ────────────────────────
  'ri-006': {
    vendido: [
      { id: 'ev-040', time: '2026-06-08T09:30:00', source: 'pos', description: 'Venta mostrador', quantity: 18 },
      { id: 'ev-041', time: '2026-06-08T13:20:00', source: 'pos', description: 'Venta mostrador', quantity: 10 },
      { id: 'ev-042', time: '2026-06-08T16:55:00', source: 'pos', description: 'Venta mostrador', quantity: 7 },
    ],
    merma: [
      { id: 'ev-043', time: '2026-06-08T18:00:00', source: 'manual', description: 'Daño en vitrina', quantity: 2, operator: 'Sofía Ruiz' },
    ],
    traspaso: [
      { id: 'ev-044', time: '2026-06-08T15:30:00', source: 'traspaso', description: 'Recibido de Babka Centro', quantity: 4, operator: 'Sofía Ruiz' },
    ],
    personal: [
      { id: 'ev-045', time: '2026-06-08T12:00:00', source: 'manual', description: 'Consumo personal', quantity: 2, operator: 'Sofía Ruiz' },
    ],
  },
  // ─── Norte · Croissant mantequilla ──────────────────────────────────────
  'ri-008': {
    vendido: [
      { id: 'ev-050', time: '2026-06-08T09:15:00', source: 'pos', description: 'Venta mostrador', quantity: 20 },
      { id: 'ev-051', time: '2026-06-08T12:40:00', source: 'pos', description: 'Venta mostrador', quantity: 10 },
      { id: 'ev-052', time: '2026-06-08T16:10:00', source: 'pos', description: 'Venta mostrador', quantity: 8 },
    ],
    merma: [
      { id: 'ev-053', time: '2026-06-08T20:30:00', source: 'manual', description: 'Caducidad por cierre', quantity: 3, operator: 'Sofía Ruiz' },
    ],
  },
}

export function getItemEvents(itemId: string, destino: ReconciliationDestino): ItemEvent[] {
  return ITEM_EVENTS[itemId]?.[destino] ?? []
}

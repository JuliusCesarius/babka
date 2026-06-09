import type { BakeryOrder } from '../types'

export const BAKERY_ORDERS: BakeryOrder[] = [
  {
    id: 'ord-001',
    date: '2026-06-09',
    orderDate: '2026-06-08',
    supplier: 'Panadería San Ildefonso',
    status: 'confirmado',
    items: [
      { sku: 'BAB-CHO-01', productName: 'Babka chocolate (masa)',       quantity: 120 },
      { sku: 'FOC-ROM-01', productName: 'Focaccia romero (masa)',        quantity: 80  },
      { sku: 'CRO-MAN-01', productName: 'Croissant mantequilla (masa)',  quantity: 200 },
    ],
    totalPiezas: 400,
  },
  {
    id: 'ord-002',
    date: '2026-06-12',
    orderDate: '2026-06-10',
    supplier: 'Panadería San Ildefonso',
    status: 'pendiente',
    items: [
      { sku: 'BAB-CHO-01', productName: 'Babka chocolate (masa)',        quantity: 150 },
      { sku: 'SRD-500-01', productName: 'Sourdough 500g (masa)',         quantity: 60  },
      { sku: 'PAI-CHO-01', productName: 'Pain au chocolat (masa)',       quantity: 100 },
    ],
    totalPiezas: 310,
    notes: 'Incluye pedido especial evento San Ildefonso 13 jun',
  },
  {
    id: 'ord-003',
    date: '2026-06-16',
    orderDate: '2026-06-14',
    supplier: 'Panadería San Ildefonso',
    status: 'pendiente',
    items: [
      { sku: 'BAB-CHO-01', productName: 'Babka chocolate (masa)',        quantity: 130 },
      { sku: 'CRO-MAN-01', productName: 'Croissant mantequilla (masa)',  quantity: 180 },
      { sku: 'CON-VAI-01', productName: 'Concha vainilla (masa)',        quantity: 90  },
    ],
    totalPiezas: 400,
  },
  {
    id: 'ord-004',
    date: '2026-06-19',
    orderDate: '2026-06-17',
    supplier: 'Panadería San Ildefonso',
    status: 'pendiente',
    items: [
      { sku: 'BAB-CHO-01', productName: 'Babka chocolate (masa)',        quantity: 140 },
      { sku: 'FOC-ROM-01', productName: 'Focaccia romero (masa)',        quantity: 70  },
      { sku: 'SRD-1KG-01', productName: 'Sourdough 1kg (masa)',         quantity: 40  },
    ],
    totalPiezas: 250,
  },
  {
    id: 'ord-005',
    date: '2026-06-23',
    orderDate: '2026-06-21',
    supplier: 'Panadería San Ildefonso',
    status: 'pendiente',
    items: [
      { sku: 'BAB-CHO-01', productName: 'Babka chocolate (masa)',        quantity: 160 },
      { sku: 'CRO-MAN-01', productName: 'Croissant mantequilla (masa)',  quantity: 200 },
      { sku: 'FOC-ROM-01', productName: 'Focaccia romero (masa)',        quantity: 80  },
    ],
    totalPiezas: 440,
  },
  {
    id: 'ord-006',
    date: '2026-06-26',
    orderDate: '2026-06-24',
    supplier: 'Panadería San Ildefonso',
    status: 'pendiente',
    items: [
      { sku: 'BAB-CHO-01', productName: 'Babka chocolate (masa)',        quantity: 130 },
      { sku: 'SRD-500-01', productName: 'Sourdough 500g (masa)',         quantity: 50  },
    ],
    totalPiezas: 180,
  },
]

export const ORDER_DATES = new Set(BAKERY_ORDERS.map(o => o.date))

export function getOrdersForDate(date: string): BakeryOrder[] {
  return BAKERY_ORDERS.filter(o => o.date === date)
}

import { useState } from 'react'
import { BRANCHES, BRANCH_SUMMARIES } from '../fixtures/branches'
import { getSnapshotsForDate } from '../fixtures/history'
import { BAKERY_ORDERS, ORDER_DATES, getOrdersForDate } from '../fixtures/orders'
import { useBreakpoint } from '../hooks/useBreakpoint'
import type { DailySnapshot, BranchSummary, BakeryOrder, TrafficLight } from '../types'

const TODAY = '2026-06-08'
const MONTH_DAYS = 30   // June 2026
const START_DOW  = 1    // June 1 = Monday (0=Sun, 1=Mon)

const DOW_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const MONTH_LABEL = 'Junio 2026'

type AnySnap = DailySnapshot | BranchSummary

function getSnapsForDay(day: number): AnySnap[] {
  const iso = `2026-06-${String(day).padStart(2, '0')}`
  if (iso === TODAY) return BRANCH_SUMMARIES
  return getSnapshotsForDate(iso)
}

function snapStatus(s: AnySnap): string {
  return 'reconciliationStatus' in s ? s.reconciliationStatus : s.status
}
function snapLight(s: AnySnap): TrafficLight {
  return s.light
}

export function Calendario() {
  const { isMobile } = useBreakpoint()
  const [selectedDay, setSelectedDay] = useState<number>(8) // today

  const selectedIso = `2026-06-${String(selectedDay).padStart(2, '0')}`
  const selectedSnaps = getSnapsForDay(selectedDay)
  const selectedOrders = getOrdersForDate(selectedIso)
  const isFuture = selectedIso > TODAY
  const isPast   = selectedIso < TODAY

  // Build calendar grid (42 cells: 6 rows × 7 cols)
  const cells: Array<number | null> = []
  for (let i = 0; i < START_DOW - 1; i++) cells.push(null) // Mon offset (Mon=1 → 0 leading nulls since 1-1=0)
  // Actually if START_DOW=1 (Monday) and we use Mon-first week, offset = 0
  // Let me redo: Mon-first, June 1 is Monday → offset = 0
  for (let d = 1; d <= MONTH_DAYS; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  const upcomingOrders = BAKERY_ORDERS.filter(o => o.date >= TODAY).slice(0, 4)

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)',
          letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--bran)',
          marginBottom: '4px',
        }}>Calendario operativo</div>
        <h1 style={{ fontSize: isMobile ? 'var(--text-xl)' : 'var(--text-3xl)', lineHeight: 1.1 }}>
          {MONTH_LABEL}
        </h1>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'flex-start', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
        {/* Calendar grid */}
        <div style={{ flex: isMobile ? '1 1 100%' : '1 1 auto', minWidth: 0 }}>
          <div style={{ background: 'var(--flour)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
            {/* Day-of-week header */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '2px solid var(--line)' }}>
              {DOW_LABELS.map(d => (
                <div key={d} style={{
                  padding: isMobile ? '8px 4px' : '10px 8px', textAlign: 'center',
                  fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 'var(--weight-bold)',
                  letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--bran)',
                }}>{d}</div>
              ))}
            </div>

            {/* Day grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {cells.map((day, idx) => {
                if (day === null) {
                  return (
                    <div key={`empty-${idx}`} style={{
                      borderBottom: '1px solid var(--line)', borderRight: (idx + 1) % 7 !== 0 ? '1px solid var(--line)' : 'none',
                      background: 'var(--crumb)', minHeight: isMobile ? '52px' : '72px',
                    }} />
                  )
                }

                const iso = `2026-06-${String(day).padStart(2, '0')}`
                const isToday = iso === TODAY
                const isFut = iso > TODAY
                const isSelected = day === selectedDay
                const snaps = isFut ? [] : getSnapsForDay(day)
                const hasOrder = ORDER_DATES.has(iso)
                const hasIssue = snaps.some(s => snapStatus(s) === 'descuadre' || snapStatus(s) === 'pendiente')

                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    style={{
                      borderBottom: '1px solid var(--line)',
                      borderRight: (idx + 1) % 7 !== 0 ? '1px solid var(--line)' : 'none',
                      minHeight: isMobile ? '52px' : '72px',
                      padding: isMobile ? '6px' : '8px',
                      cursor: 'pointer',
                      background: isSelected ? 'var(--ink)' : isToday ? 'rgba(41,82,163,0.06)' : 'transparent',
                      display: 'flex', flexDirection: 'column', gap: '4px',
                      transition: 'background var(--transition)',
                    }}
                  >
                    {/* Day number */}
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: isMobile ? '11px' : '13px',
                      fontWeight: isToday || isSelected ? 'var(--weight-black)' : 'var(--weight-medium)',
                      color: isSelected ? 'var(--wheat)' : isToday ? 'var(--babka-blue)' : isFut ? 'var(--bran)' : 'var(--ink)',
                      lineHeight: 1,
                    }}>{day}</div>

                    {/* Status dots */}
                    {!isFut && snaps.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
                        {snaps.slice(0, isMobile ? 3 : 5).map(s => (
                          <StatusDot key={s.branchId} light={snapLight(s)} selected={isSelected} />
                        ))}
                        {isMobile && snaps.length > 3 && (
                          <span style={{ fontSize: '8px', color: isSelected ? 'rgba(255,255,255,0.6)' : 'var(--bran)' }}>+{snaps.length - 3}</span>
                        )}
                      </div>
                    )}

                    {/* Order indicator */}
                    {hasOrder && (
                      <div style={{
                        fontSize: '9px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.04em',
                        color: isSelected ? 'var(--wheat)' : 'var(--babka-blue-deep)',
                        background: isSelected ? 'rgba(255,255,255,0.1)' : 'var(--babka-blue-soft)',
                        borderRadius: '2px', padding: '1px 4px', width: 'fit-content',
                        lineHeight: 1.4,
                      }}>📦</div>
                    )}

                    {/* Issue indicator dot (mobile) */}
                    {isMobile && hasIssue && !isSelected && (
                      <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--wheat)', marginTop: '2px' }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-3)', flexWrap: 'wrap' }}>
            <Legend color="#22C55E" label="Cerrado limpio" />
            <Legend color="var(--wheat)" label="Descuadre" />
            <Legend color="var(--babka-orange)" label="Sin reportar" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px' }}>📦</span>
              <span style={{ fontSize: '11px', color: 'var(--bran)', fontFamily: 'var(--font-body)' }}>Entrega panadería</span>
            </div>
          </div>
        </div>

        {/* Detail panel */}
        <div style={{ width: isMobile ? '100%' : '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Selected day detail */}
          <div style={{ background: 'var(--flour)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
            <div style={{
              padding: 'var(--space-4)', borderBottom: '1px solid var(--line)',
              background: 'var(--ink)',
            }}>
              <div style={{ fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '2px' }}>
                {isFuture ? 'Próximo' : isPast ? 'Histórico' : 'Hoy'}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-black)', fontSize: 'var(--text-xl)', color: 'var(--wheat)', fontStyle: 'italic' }}>
                {dayLabel(selectedDay)}
              </div>
            </div>

            {isFuture && selectedOrders.length === 0 && (
              <div style={{ padding: 'var(--space-4)', color: 'var(--bran)', fontSize: 'var(--text-sm)', textAlign: 'center' }}>
                Sin eventos registrados
              </div>
            )}

            {!isFuture && selectedSnaps.length === 0 && (
              <div style={{ padding: 'var(--space-4)', color: 'var(--bran)', fontSize: 'var(--text-sm)', textAlign: 'center' }}>
                Sin datos para este día
              </div>
            )}

            {!isFuture && selectedSnaps.map(snap => {
              const branch = BRANCHES.find(b => b.id === snap.branchId)!
              const status = snapStatus(snap)
              return (
                <div key={snap.branchId} style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                  padding: 'var(--space-3) var(--space-4)',
                  borderBottom: '1px solid var(--line)',
                }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: lightColor(snap.light), flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: 'var(--weight-bold)', color: 'var(--ink)' }}>{branch.shortName}</div>
                    {snap.totalUnits > 0 && (
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--bran)' }}>{snap.totalUnits} unidades</div>
                    )}
                  </div>
                  <StatusMini status={status} diferencia={snap.diferencia} />
                </div>
              )
            })}

            {/* Orders for this day */}
            {selectedOrders.map(order => (
              <div key={order.id} style={{
                padding: 'var(--space-3) var(--space-4)',
                borderTop: '1px solid var(--line)',
                background: 'var(--babka-blue-soft)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: '4px' }}>
                  <span>📦</span>
                  <span style={{ fontSize: '12px', fontWeight: 'var(--weight-bold)', color: 'var(--babka-blue-deep)' }}>Entrega panadería</span>
                  <OrderStatusChip status={order.status} />
                </div>
                <div style={{ fontSize: '11px', color: 'var(--babka-blue-deep)' }}>
                  {order.totalPiezas} piezas · {order.supplier}
                </div>
                {order.notes && <div style={{ fontSize: '10px', color: 'var(--bran)', marginTop: '3px' }}>{order.notes}</div>}
                <div style={{ marginTop: 'var(--space-2)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {order.items.map(item => (
                    <div key={item.sku} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--bran)' }}>
                      <span>{item.productName}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-bold)' }}>{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming orders list */}
          {upcomingOrders.length > 0 && (
            <div style={{ background: 'var(--flour)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
              <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--line)' }}>
                <div style={{ fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--bran)' }}>
                  Próximas entregas
                </div>
              </div>
              {upcomingOrders.map((order, i) => (
                <div key={order.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: 'var(--space-3) var(--space-4)',
                  borderBottom: i < upcomingOrders.length - 1 ? '1px solid var(--line)' : 'none',
                }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 'var(--weight-medium)', color: 'var(--ink)' }}>
                      {shortDateLabel(order.date)}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--bran)' }}>
                      {order.totalPiezas} pzas
                    </div>
                  </div>
                  <OrderStatusChip status={order.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatusDot({ light, selected }: { light: TrafficLight; selected: boolean }) {
  const c = selected ? 'rgba(255,255,255,0.7)' : lightColor(light)
  return <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: c, flexShrink: 0 }} />
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span style={{ fontSize: '11px', color: 'var(--bran)', fontFamily: 'var(--font-body)' }}>{label}</span>
    </div>
  )
}

function StatusMini({ status, diferencia }: { status: string; diferencia: number }) {
  if (status === 'cerrado') return <span style={{ fontSize: '10px', color: '#16a34a', fontWeight: 'var(--weight-bold)' }}>✓</span>
  if (status === 'descuadre') return <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--wheat-deep)', fontWeight: 'var(--weight-bold)' }}>+{diferencia}</span>
  return <span style={{ fontSize: '10px', color: 'var(--babka-orange)', fontWeight: 'var(--weight-bold)' }}>—</span>
}

function OrderStatusChip({ status }: { status: BakeryOrder['status'] }) {
  const map = {
    confirmado: { bg: 'rgba(34,197,94,0.12)', color: '#16a34a', label: 'Confirmado' },
    pendiente:  { bg: 'rgba(230,178,60,0.15)', color: 'var(--wheat-deep)', label: 'Pendiente' },
    entregado:  { bg: 'var(--crumb)', color: 'var(--bran)', label: 'Entregado' },
  }
  const s = map[status]
  return (
    <span style={{
      background: s.bg, color: s.color, fontSize: '9px',
      fontWeight: 'var(--weight-bold)', letterSpacing: '0.06em', textTransform: 'uppercase',
      padding: '2px 6px', borderRadius: 'var(--r-pill)', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
    }}>{s.label}</span>
  )
}

function lightColor(light: TrafficLight): string {
  const map: Record<TrafficLight, string> = { verde: '#22C55E', amarillo: '#D4A017', rojo: '#E05C2A' }
  return map[light]
}

function dayLabel(day: number): string {
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
  // June 1 = Mon (index 0), so day-1 maps to day index
  const dow = (day - 1) % 7
  return `${days[dow]} ${day} jun`
}

function shortDateLabel(iso: string): string {
  const day = parseInt(iso.split('-')[2])
  return dayLabel(day)
}

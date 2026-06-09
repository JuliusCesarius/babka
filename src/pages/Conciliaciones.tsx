import { useState } from 'react'
import { BRANCHES, RECONCILIATIONS, BRANCH_SUMMARIES, HITL_REQUESTS } from '../fixtures/branches'
import { getItemEvents } from '../fixtures/events'
import { useBreakpoint } from '../hooks/useBreakpoint'
import type { BranchId, Reconciliation, ReconciliationItem, ReconciliationDestino, ItemEvent } from '../types'

interface ConciliacionesProps {
  initialBranchId?: BranchId
  onNavigate?: (page: string) => void
}

const DESTINOS: Array<{ key: keyof ReconciliationItem; label: string }> = [
  { key: 'vendido',    label: 'Vendido' },
  { key: 'traspaso',   label: 'Traspaso' },
  { key: 'merma',      label: 'Merma' },
  { key: 'personal',   label: 'Personal' },
  { key: 'evento',     label: 'Evento' },
  { key: 'muestra',    label: 'Muestra' },
  { key: 'devolucion', label: 'Dev.' },
]

export function Conciliaciones({ initialBranchId, onNavigate }: ConciliacionesProps) {
  const { isMobile, isTablet } = useBreakpoint()
  const isNarrow = isMobile || isTablet

  const [selectedBranchId, setSelectedBranchId] = useState<BranchId | 'todas'>(initialBranchId ?? 'todas')
  const [selectedRecId, setSelectedRecId] = useState<string | null>(
    initialBranchId ? (RECONCILIATIONS.find(r => r.branchId === initialBranchId)?.id ?? null) : null
  )
  const [showDetail, setShowDetail] = useState(!!initialBranchId)

  const filteredRecs = selectedBranchId === 'todas'
    ? RECONCILIATIONS
    : RECONCILIATIONS.filter(r => r.branchId === selectedBranchId)

  const selectedRec = selectedRecId ? RECONCILIATIONS.find(r => r.id === selectedRecId) : null

  const handleSelectRec = (id: string) => {
    if (isNarrow) {
      setSelectedRecId(id)
      setShowDetail(true)
    } else {
      setSelectedRecId(selectedRecId === id ? null : id)
    }
  }

  return (
    <div>
      {/* Back button in narrow + detail view */}
      {isNarrow && showDetail && selectedRec ? (
        <div>
          <button
            onClick={() => { setShowDetail(false); setSelectedRecId(null) }}
            style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--babka-blue)', fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-medium)', fontFamily: 'var(--font-body)',
              padding: '0 0 var(--space-4)',
            }}
          >
            ← Volver a la lista
          </button>
          <RecDetail rec={selectedRec} isMobile={isMobile} />
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: isMobile ? 'var(--space-4)' : 'var(--space-6)' }}>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)',
              letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--bran)',
              marginBottom: 'var(--space-2)',
            }}>8 de junio, 2026</div>
            <h1 style={{ fontSize: isMobile ? 'var(--text-xl)' : 'var(--text-2xl)' }}>Conciliaciones</h1>
          </div>

          <BranchFilter selected={selectedBranchId} onChange={(id) => { setSelectedBranchId(id); setSelectedRecId(null) }} isMobile={isMobile} />

          {isNarrow ? (
            /* Mobile/Tablet: lista única, toca para ver detalle */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
              {filteredRecs.map(rec => (
                <RecCard key={rec.id} rec={rec} isSelected={false} onClick={() => handleSelectRec(rec.id)} onNavigate={onNavigate} />
              ))}
            </div>
          ) : (
            /* Desktop: split panel */
            <div style={{ display: 'grid', gridTemplateColumns: selectedRec ? '300px 1fr' : '1fr', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {filteredRecs.map(rec => (
                  <RecCard key={rec.id} rec={rec} isSelected={selectedRecId === rec.id} onClick={() => handleSelectRec(rec.id)} onNavigate={onNavigate} />
                ))}
              </div>
              {selectedRec && <RecDetail rec={selectedRec} isMobile={false} />}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function BranchFilter({ selected, onChange, isMobile }: {
  selected: BranchId | 'todas'
  onChange: (id: BranchId | 'todas') => void
  isMobile: boolean
}) {
  const options: Array<{ id: BranchId | 'todas'; label: string }> = [
    { id: 'todas', label: 'Todas' },
    ...BRANCHES.map(b => ({ id: b.id as BranchId, label: b.shortName })),
  ]
  return (
    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
      {options.map(opt => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          style={{
            padding: isMobile ? '6px 14px' : '7px 18px',
            borderRadius: 'var(--r-pill)',
            border: '1.5px solid',
            borderColor: selected === opt.id ? 'var(--babka-blue)' : 'var(--line)',
            background: selected === opt.id ? 'var(--babka-blue)' : 'var(--flour)',
            color: selected === opt.id ? '#fff' : 'var(--ink)',
            fontFamily: 'var(--font-body)',
            fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)',
            fontWeight: 'var(--weight-medium)',
            cursor: 'pointer',
            transition: 'all var(--transition)',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function RecCard({ rec, isSelected, onClick, onNavigate }: {
  rec: Reconciliation; isSelected: boolean; onClick: () => void; onNavigate?: (page: string) => void
}) {
  const branch   = BRANCHES.find(b => b.id === rec.branchId)!
  const summary  = BRANCH_SUMMARIES.find(s => s.branchId === rec.branchId)!
  const hitlItem = HITL_REQUESTS.find(r => r.branchId === rec.branchId && r.reconciliationId === rec.id)
    ?? HITL_REQUESTS.find(r => r.branchId === rec.branchId)

  const isAlert = rec.status === 'descuadre' || rec.status === 'pendiente'

  const statusColor: Record<Reconciliation['status'], string> = {
    cerrado: '#22C55E', abierto: 'var(--babka-blue)',
    descuadre: 'var(--wheat-deep)', pendiente: 'var(--babka-orange)',
  }
  const statusLabel: Record<Reconciliation['status'], string> = {
    cerrado: 'Cerrado', abierto: 'Abierto', descuadre: 'Descuadre', pendiente: 'Sin reportar',
  }

  const alertBorderColor = rec.status === 'descuadre' ? 'rgba(230,178,60,0.5)' : 'rgba(220,122,51,0.4)'
  const alertBg          = rec.status === 'descuadre' ? 'rgba(230,178,60,0.04)' : 'rgba(220,122,51,0.04)'

  return (
    <div
      onClick={onClick}
      style={{
        background: isSelected ? 'var(--babka-blue)' : isAlert ? alertBg : 'var(--flour)',
        borderRadius: 'var(--r-lg)', padding: 'var(--space-6)',
        cursor: 'pointer', boxShadow: 'var(--shadow-md)',
        transition: 'all var(--transition)',
        border: '2px solid',
        borderColor: isSelected ? 'var(--babka-blue)' : isAlert ? alertBorderColor : 'transparent',
      }}
    >
      {/* Top row: name + badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-black)', fontSize: 'var(--text-lg)', color: isSelected ? '#fff' : 'var(--ink)' }}>
            {branch.shortName}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--bran)', marginTop: '2px' }}>
            {branch.manager}
          </div>
        </div>
        <span style={{
          background: isSelected ? 'rgba(255,255,255,0.2)' : `${statusColor[rec.status]}20`,
          color: isSelected ? '#fff' : statusColor[rec.status],
          fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em',
          textTransform: 'uppercase', padding: '3px 10px', borderRadius: 'var(--r-pill)',
          fontFamily: 'var(--font-body)',
        }}>
          {statusLabel[rec.status]}
        </span>
      </div>

      {/* Units + delta */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isAlert ? 'var(--space-3)' : 0 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: isSelected ? 'rgba(255,255,255,0.85)' : 'var(--ink-soft)' }}>
          {summary.totalUnits} unidades
        </span>
        {rec.totalDiferencia !== 0 && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: isSelected ? 'var(--wheat-light)' : 'var(--wheat-deep)' }}>
            Δ +{rec.totalDiferencia}
          </span>
        )}
      </div>

      {/* Agent inference block — only for descuadre / pendiente */}
      {isAlert && !isSelected && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            borderTop: `1px solid ${alertBorderColor}`,
            paddingTop: 'var(--space-3)',
            display: 'flex', flexDirection: 'column', gap: 'var(--space-2)',
          }}
        >
          {/* Agent message */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '11px', color: 'var(--bran)', flexShrink: 0, marginTop: '1px' }}>✦</span>
            <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              {hitlItem?.agentMessage ?? (
                rec.status === 'pendiente'
                  ? 'Sin actividad registrada desde apertura. El gerente no ha iniciado el proceso de cierre.'
                  : 'Hay unidades no contabilizadas en esta conciliación.'
              )}
            </p>
          </div>

          {/* Suggested action */}
          {hitlItem?.suggestedAction && (
            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', color: 'var(--bran)', flexShrink: 0 }}>→</span>
              <span style={{ fontSize: '11px', color: statusColor[rec.status], fontWeight: 'var(--weight-medium)' }}>
                {hitlItem.suggestedAction}
              </span>
            </div>
          )}

          {/* CTA */}
          {onNavigate && (
            <button
              onClick={e => { e.stopPropagation(); onNavigate('hitl') }}
              style={{
                alignSelf: 'flex-start',
                marginTop: '2px',
                padding: '5px 14px',
                borderRadius: 'var(--r-pill)',
                border: `1.5px solid ${statusColor[rec.status]}`,
                background: 'transparent',
                color: statusColor[rec.status],
                fontFamily: 'var(--font-body)',
                fontSize: '11px', fontWeight: 'var(--weight-bold)',
                cursor: 'pointer',
                transition: 'all var(--transition)',
              }}
              onMouseEnter={e => {
                const btn = e.currentTarget
                btn.style.background = statusColor[rec.status]
                btn.style.color = '#fff'
              }}
              onMouseLeave={e => {
                const btn = e.currentTarget
                btn.style.background = 'transparent'
                btn.style.color = statusColor[rec.status]
              }}
            >
              Acción requerida →
            </button>
          )}
        </div>
      )}
    </div>
  )
}

type ActiveCell = { itemId: string; destino: ReconciliationDestino; label: string; productName: string; total: number } | null

function RecDetail({ rec, isMobile }: { rec: Reconciliation; isMobile: boolean }) {
  const branch = BRANCHES.find(b => b.id === rec.branchId)!
  const activeDestinos = DESTINOS.filter(d => rec.items.some(i => (i[d.key] as number) > 0))
  const [activeCell, setActiveCell] = useState<ActiveCell>(null)

  const handleCellClick = (item: ReconciliationItem, destino: ReconciliationDestino, label: string) => {
    const total = item[destino] as number
    if (total === 0) return
    const key = `${item.id}:${destino}`
    const currentKey = activeCell ? `${activeCell.itemId}:${activeCell.destino}` : null
    setActiveCell(currentKey === key ? null : { itemId: item.id, destino, label, productName: item.productName, total })
  }

  return (
    <div style={{ background: 'var(--flour)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: isMobile ? 'var(--space-4)' : 'var(--space-6)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
          <div>
            <h3 style={{ marginBottom: '4px', fontSize: isMobile ? 'var(--text-xl)' : 'var(--text-2xl)' }}>{branch.name}</h3>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--bran)' }}>
              {rec.closedBy ? `Cerrado por ${rec.closedBy}` : branch.manager}
              {rec.closedAt && ` · ${new Date(rec.closedAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`}
            </div>
          </div>
          <DeltaBadge value={rec.totalDiferencia} />
        </div>
      </div>

      {/* Tabla con scroll horizontal */}
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? '480px' : 'auto' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--line)' }}>
              <Th align="left">Producto</Th>
              <Th>Apertura</Th>
              <Th>Prod.</Th>
              {activeDestinos.map(d => <Th key={d.key}>{d.label}</Th>)}
              <Th>Cierre</Th>
              <Th>Δ</Th>
            </tr>
          </thead>
          <tbody>
            {rec.items.map((item, idx) => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--line)', background: idx % 2 === 0 ? 'transparent' : 'var(--flour-warm)' }}>
                <td style={{ padding: 'var(--space-3) var(--space-4)', minWidth: '140px' }}>
                  <div style={{ fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-sm)', color: 'var(--ink)' }}>
                    {item.productName}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--bran)' }}>
                    {item.sku}
                  </div>
                </td>
                <Td>{item.opening}</Td>
                <Td>{item.produced}</Td>
                {activeDestinos.map(d => {
                  const isActive = activeCell?.itemId === item.id && activeCell?.destino === d.key
                  const val = item[d.key] as number
                  return (
                    <Td
                      key={d.key}
                      highlight={d.key === 'vendido'}
                      clickable={val > 0}
                      active={isActive}
                      onClick={val > 0 ? () => handleCellClick(item, d.key as ReconciliationDestino, d.label) : undefined}
                    >
                      {val}
                    </Td>
                  )
                })}
                <Td>{item.closing}</Td>
                <Td accent={item.diferencia !== 0}>{item.diferencia === 0 ? '—' : `+${item.diferencia}`}</Td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: '2px solid var(--line)', background: 'var(--crumb)' }}>
              <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-sm)' }}>
                Total
              </td>
              <Td bold>{rec.items.reduce((s, i) => s + i.opening, 0)}</Td>
              <Td bold>{rec.items.reduce((s, i) => s + i.produced, 0)}</Td>
              {activeDestinos.map(d => (
                <Td key={d.key} bold>{rec.items.reduce((s, i) => s + (i[d.key] as number), 0)}</Td>
              ))}
              <Td bold>{rec.items.reduce((s, i) => s + i.closing, 0)}</Td>
              <Td bold accent={rec.totalDiferencia !== 0}>{rec.totalDiferencia === 0 ? '0' : `+${rec.totalDiferencia}`}</Td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Cell event detail panel */}
      {activeCell && (
        <CellEventPanel cell={activeCell} onClose={() => setActiveCell(null)} />
      )}
    </div>
  )
}

function Th({ children, align = 'right' }: { children: React.ReactNode; align?: 'left' | 'right' }) {
  return (
    <th style={{
      padding: 'var(--space-3) var(--space-3)',
      textAlign: align, fontSize: '10px', fontWeight: 'var(--weight-bold)',
      letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--bran)',
      fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
    }}>{children}</th>
  )
}

function Td({ children, bold, highlight, accent, clickable, active, onClick }: {
  children: React.ReactNode
  bold?: boolean
  highlight?: boolean
  accent?: boolean
  clickable?: boolean
  active?: boolean
  onClick?: () => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <td
      onClick={onClick}
      onMouseEnter={() => clickable && setHovered(true)}
      onMouseLeave={() => clickable && setHovered(false)}
      style={{
        padding: 'var(--space-3) var(--space-3)',
        textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)',
        color: accent ? 'var(--wheat-deep)' : highlight ? 'var(--babka-blue)' : 'var(--ink-soft)',
        fontWeight: bold || accent ? 'var(--weight-bold)' : 'var(--weight-regular)',
        whiteSpace: 'nowrap',
        cursor: clickable ? 'pointer' : 'default',
        background: active
          ? 'rgba(59,130,246,0.1)'
          : hovered
            ? 'rgba(59,130,246,0.05)'
            : 'transparent',
        borderBottom: active ? '2px solid var(--babka-blue)' : '2px solid transparent',
        transition: 'background 0.12s, border-color 0.12s',
        position: 'relative',
      }}
    >
      {children}
      {clickable && !active && (
        <span style={{ fontSize: '8px', color: 'var(--bran)', marginLeft: '3px', verticalAlign: 'middle', opacity: hovered ? 1 : 0, transition: 'opacity 0.12s' }}>▾</span>
      )}
    </td>
  )
}

const SOURCE_META: Record<string, { icon: string; color: string; label: string }> = {
  pos:      { icon: '⊡', color: 'var(--babka-blue)',     label: 'POS' },
  manual:   { icon: '✎', color: 'var(--wheat-deep)',      label: 'Manual' },
  traspaso: { icon: '⇄', color: '#8B5CF6',               label: 'Traspaso' },
  sistema:  { icon: '⚙', color: 'var(--bran)',            label: 'Sistema' },
}

function CellEventPanel({ cell, onClose }: { cell: NonNullable<ActiveCell>; onClose: () => void }) {
  const events: ItemEvent[] = getItemEvents(cell.itemId, cell.destino)
  const registeredTotal = events.reduce((s, e) => s + e.quantity, 0)
  const unaccounted = cell.total - registeredTotal

  return (
    <div style={{
      borderTop: '2px solid var(--babka-blue)',
      background: 'var(--flour-warm)',
      padding: 'var(--space-4)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--babka-blue)' }}>
            {cell.label}
          </span>
          <span style={{ fontSize: '10px', color: 'var(--bran)', margin: '0 6px' }}>·</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--bran)' }}>
            {cell.productName}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-black)', color: 'var(--ink)' }}>
            {cell.total} pzas
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--bran)', fontSize: '16px', lineHeight: 1, padding: '0 2px' }}>×</button>
        </div>
      </div>

      {/* Event list */}
      {events.length === 0 ? (
        <div style={{ padding: 'var(--space-3) 0', fontSize: 'var(--text-xs)', color: 'var(--bran)', fontStyle: 'italic' }}>
          Sin registros individuales — total ingresado manualmente al cierre
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {events.map(ev => {
            const meta = SOURCE_META[ev.source] ?? SOURCE_META.manual
            const time = new Date(ev.time).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
            return (
              <div key={ev.id} style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                padding: '6px 10px', borderRadius: 'var(--r-md)',
                background: 'var(--flour)', border: '1px solid var(--line)',
              }}>
                <span style={{ fontSize: '13px', color: meta.color, flexShrink: 0, width: '18px', textAlign: 'center' }}>{meta.icon}</span>
                <span style={{ fontSize: '10px', fontWeight: 'var(--weight-bold)', color: meta.color, background: `${meta.color}18`, padding: '1px 6px', borderRadius: 'var(--r-pill)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {meta.label}
                </span>
                <span style={{ flex: 1, fontSize: 'var(--text-xs)', color: 'var(--ink)' }}>{ev.description}</span>
                {ev.operator && (
                  <span style={{ fontSize: '10px', color: 'var(--bran)', whiteSpace: 'nowrap', flexShrink: 0 }}>{ev.operator}</span>
                )}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--bran)', whiteSpace: 'nowrap', flexShrink: 0 }}>{time}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--ink)', flexShrink: 0, minWidth: '28px', textAlign: 'right' }}>
                  {ev.quantity}
                </span>
              </div>
            )
          })}

          {/* Unaccounted warning */}
          {unaccounted > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
              padding: '6px 10px', borderRadius: 'var(--r-md)',
              background: 'rgba(220,80,50,0.08)', border: '1px solid rgba(220,80,50,0.3)',
            }}>
              <span style={{ fontSize: '13px', color: 'var(--babka-orange)', width: '18px', textAlign: 'center' }}>⚠</span>
              <span style={{ flex: 1, fontSize: 'var(--text-xs)', color: 'var(--babka-orange)', fontWeight: 'var(--weight-medium)' }}>
                {unaccounted} pzas sin evento registrado
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--babka-orange)' }}>
                +{unaccounted}
              </span>
            </div>
          )}

          {/* Summary row */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', paddingTop: '4px', borderTop: '1px solid var(--line)', marginTop: '2px' }}>
            <span style={{ fontSize: '10px', color: 'var(--bran)' }}>{events.length} evento{events.length !== 1 ? 's' : ''} · total registrado</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-black)', color: registeredTotal === cell.total ? '#16a34a' : 'var(--wheat-deep)' }}>
              {registeredTotal} / {cell.total}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

function DeltaBadge({ value }: { value: number }) {
  if (value === 0) return (
    <span style={{
      background: 'rgba(34,197,94,0.12)', color: '#16a34a',
      fontSize: '12px', fontWeight: 'var(--weight-bold)', fontFamily: 'var(--font-mono)',
      padding: '5px 14px', borderRadius: 'var(--r-pill)', whiteSpace: 'nowrap',
    }}>Δ = 0 ✓</span>
  )
  return (
    <span style={{
      background: 'rgba(230,178,60,0.2)', color: 'var(--wheat-deep)',
      fontSize: '12px', fontWeight: 'var(--weight-bold)', fontFamily: 'var(--font-mono)',
      padding: '5px 14px', borderRadius: 'var(--r-pill)', whiteSpace: 'nowrap',
    }}>Δ = +{value}</span>
  )
}

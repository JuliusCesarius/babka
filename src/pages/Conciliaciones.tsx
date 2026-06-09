import { useState } from 'react'
import { BRANCHES, RECONCILIATIONS, BRANCH_SUMMARIES } from '../fixtures/branches'
import type { BranchId, Reconciliation, ReconciliationItem } from '../types'

interface ConciliacionesProps {
  initialBranchId?: BranchId
}

const DESTINOS: Array<{ key: keyof ReconciliationItem; label: string; color: string }> = [
  { key: 'vendido',    label: 'Vendido',    color: 'var(--babka-blue)' },
  { key: 'traspaso',   label: 'Traspaso',   color: 'var(--wheat)' },
  { key: 'merma',      label: 'Merma',      color: 'var(--babka-orange)' },
  { key: 'personal',   label: 'Personal',   color: 'var(--crust)' },
  { key: 'evento',     label: 'Evento',     color: 'var(--babka-blue-soft)' },
  { key: 'muestra',    label: 'Muestra',    color: 'var(--crumb)' },
  { key: 'devolucion', label: 'Devolución', color: 'var(--line)' },
]

export function Conciliaciones({ initialBranchId }: ConciliacionesProps) {
  const [selectedBranchId, setSelectedBranchId] = useState<BranchId | 'todas'>(initialBranchId ?? 'todas')
  const [selectedRecId, setSelectedRecId] = useState<string | null>(
    initialBranchId ? (RECONCILIATIONS.find(r => r.branchId === initialBranchId)?.id ?? null) : null
  )

  const filteredRecs = selectedBranchId === 'todas'
    ? RECONCILIATIONS
    : RECONCILIATIONS.filter(r => r.branchId === selectedBranchId)

  const selectedRec = selectedRecId ? RECONCILIATIONS.find(r => r.id === selectedRecId) : null

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)',
          letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--bran)', marginBottom: 'var(--space-2)',
        }}>
          8 de junio, 2026
        </div>
        <h1>Conciliaciones</h1>
      </div>

      {/* Filtro de sucursal */}
      <BranchFilter selected={selectedBranchId} onChange={(id) => { setSelectedBranchId(id); setSelectedRecId(null) }} />

      <div style={{ display: 'grid', gridTemplateColumns: selectedRec ? '320px 1fr' : '1fr', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
        {/* Lista */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {filteredRecs.map(rec => (
            <RecCard
              key={rec.id}
              rec={rec}
              isSelected={selectedRecId === rec.id}
              onClick={() => setSelectedRecId(selectedRecId === rec.id ? null : rec.id)}
            />
          ))}
        </div>

        {/* Detalle */}
        {selectedRec && <RecDetail rec={selectedRec} />}
      </div>
    </div>
  )
}

function BranchFilter({ selected, onChange }: {
  selected: BranchId | 'todas'
  onChange: (id: BranchId | 'todas') => void
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
            padding: '7px 18px',
            borderRadius: 'var(--r-pill)',
            border: '1.5px solid',
            borderColor: selected === opt.id ? 'var(--babka-blue)' : 'var(--line)',
            background: selected === opt.id ? 'var(--babka-blue)' : 'var(--flour)',
            color: selected === opt.id ? '#fff' : 'var(--ink)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
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

function RecCard({ rec, isSelected, onClick }: {
  rec: Reconciliation
  isSelected: boolean
  onClick: () => void
}) {
  const branch = BRANCHES.find(b => b.id === rec.branchId)!
  const summary = BRANCH_SUMMARIES.find(s => s.branchId === rec.branchId)!

  const statusColor: Record<Reconciliation['status'], string> = {
    cerrado:   '#22C55E',
    abierto:   'var(--babka-blue)',
    descuadre: 'var(--wheat-deep)',
    pendiente: 'var(--babka-orange)',
  }
  const statusLabel: Record<Reconciliation['status'], string> = {
    cerrado:   'Cerrado',
    abierto:   'Abierto',
    descuadre: 'Descuadre',
    pendiente: 'Pendiente',
  }

  return (
    <div
      onClick={onClick}
      style={{
        background: isSelected ? 'var(--babka-blue)' : 'var(--flour)',
        borderRadius: 'var(--r-lg)',
        padding: 'var(--space-5) var(--space-6)',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-md)',
        transition: 'all var(--transition)',
        border: '2px solid',
        borderColor: isSelected ? 'var(--babka-blue)' : 'transparent',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-black)',
            fontSize: 'var(--text-lg)', color: isSelected ? '#fff' : 'var(--ink)',
          }}>
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

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: isSelected ? 'rgba(255,255,255,0.9)' : 'var(--ink-soft)' }}>
            {summary.totalUnits} unidades
          </div>
        </div>
        {rec.totalDiferencia !== 0 && (
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)',
            color: isSelected ? 'var(--wheat-light)' : 'var(--wheat-deep)', fontWeight: 'var(--weight-bold)',
          }}>
            Δ +{rec.totalDiferencia}
          </div>
        )}
      </div>
    </div>
  )
}

function RecDetail({ rec }: { rec: Reconciliation }) {
  const branch = BRANCHES.find(b => b.id === rec.branchId)!

  return (
    <div style={{ background: 'var(--flour)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: 'var(--space-6)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ marginBottom: '4px' }}>{branch.name}</h3>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--bran)' }}>
              {rec.closedBy ? `Cerrado por ${rec.closedBy}` : branch.manager}
              {rec.closedAt && ` · ${formatDateTime(rec.closedAt)}`}
            </div>
          </div>
          {rec.totalDiferencia === 0 ? (
            <DeltaBadge value={0} />
          ) : (
            <DeltaBadge value={rec.totalDiferencia} />
          )}
        </div>
      </div>

      {/* Tabla */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--line)' }}>
              <Th align="left">Producto</Th>
              <Th>Apertura</Th>
              <Th>Producido</Th>
              {DESTINOS.filter(d => rec.items.some(i => (i[d.key] as number) > 0)).map(d => (
                <Th key={d.key}>{d.label}</Th>
              ))}
              <Th>Cierre</Th>
              <Th>Δ</Th>
            </tr>
          </thead>
          <tbody>
            {rec.items.map((item, idx) => {
              const activeDestinos = DESTINOS.filter(d => rec.items.some(i => (i[d.key] as number) > 0))
              return (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--line)', background: idx % 2 === 0 ? 'transparent' : 'var(--flour-warm)' }}>
                  <td style={{ padding: 'var(--space-3) var(--space-4)', minWidth: '180px' }}>
                    <div style={{ fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-sm)', color: 'var(--ink)' }}>
                      {item.productName}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--bran)' }}>
                      {item.sku}
                    </div>
                  </td>
                  <Td>{item.opening}</Td>
                  <Td>{item.produced}</Td>
                  {activeDestinos.map(d => (
                    <Td key={d.key} highlight={d.key === 'vendido'}>
                      {item[d.key] as number}
                    </Td>
                  ))}
                  <Td>{item.closing}</Td>
                  <Td accent={item.diferencia !== 0}>{item.diferencia === 0 ? '—' : `+${item.diferencia}`}</Td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: '2px solid var(--line)', background: 'var(--crumb)' }}>
              <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-sm)' }}>
                Total
              </td>
              <Td bold>{rec.items.reduce((s, i) => s + i.opening, 0)}</Td>
              <Td bold>{rec.items.reduce((s, i) => s + i.produced, 0)}</Td>
              {DESTINOS.filter(d => rec.items.some(i => (i[d.key] as number) > 0)).map(d => (
                <Td key={d.key} bold>{rec.items.reduce((s, i) => s + (i[d.key] as number), 0)}</Td>
              ))}
              <Td bold>{rec.items.reduce((s, i) => s + i.closing, 0)}</Td>
              <Td bold accent={rec.totalDiferencia !== 0}>
                {rec.totalDiferencia === 0 ? '0' : `+${rec.totalDiferencia}`}
              </Td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

function Th({ children, align = 'right' }: { children: React.ReactNode; align?: 'left' | 'right' }) {
  return (
    <th style={{
      padding: 'var(--space-3) var(--space-4)',
      textAlign: align,
      fontSize: '11px',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: 'var(--bran)',
      fontFamily: 'var(--font-body)',
      whiteSpace: 'nowrap',
    }}>
      {children}
    </th>
  )
}

function Td({ children, bold, highlight, accent }: {
  children: React.ReactNode
  bold?: boolean
  highlight?: boolean
  accent?: boolean
}) {
  return (
    <td style={{
      padding: 'var(--space-3) var(--space-4)',
      textAlign: 'right',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-sm)',
      color: accent ? 'var(--wheat-deep)' : highlight ? 'var(--babka-blue)' : 'var(--ink-soft)',
      fontWeight: bold || accent ? 'var(--weight-bold)' : 'var(--weight-regular)',
      whiteSpace: 'nowrap',
    }}>
      {children}
    </td>
  )
}

function DeltaBadge({ value }: { value: number }) {
  if (value === 0) {
    return (
      <span style={{
        background: 'rgba(34,197,94,0.12)', color: '#16a34a',
        fontSize: '12px', fontWeight: 'var(--weight-bold)', fontFamily: 'var(--font-mono)',
        padding: '6px 16px', borderRadius: 'var(--r-pill)',
      }}>
        Δ = 0 ✓
      </span>
    )
  }
  return (
    <span style={{
      background: 'rgba(230,178,60,0.2)', color: 'var(--wheat-deep)',
      fontSize: '12px', fontWeight: 'var(--weight-bold)', fontFamily: 'var(--font-mono)',
      padding: '6px 16px', borderRadius: 'var(--r-pill)',
    }}>
      Δ = +{value}
    </span>
  )
}

function formatDateTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
}

import { useState } from 'react'
import { BRANCHES, BRANCH_SUMMARIES } from '../fixtures/branches'
import { DAILY_SNAPSHOTS } from '../fixtures/history'
import { HITL_REQUESTS } from '../fixtures/branches'
import { useBreakpoint } from '../hooks/useBreakpoint'
import type { BranchId, BranchSummary, DailySnapshot, TrafficLight } from '../types'

interface ResumenProps {
  onNavigate: (page: string, branchId?: BranchId) => void
}

type DateFilter = 'hoy' | 'ayer' | 'semana'

const DATE_LABELS: Record<string, string> = {
  '2026-06-08': 'Lun 8 jun',
  '2026-06-07': 'Dom 7 jun',
  '2026-06-06': 'Sáb 6 jun',
  '2026-06-05': 'Vie 5 jun',
  '2026-06-04': 'Jue 4 jun',
  '2026-06-03': 'Mié 3 jun',
  '2026-06-02': 'Mar 2 jun',
  '2026-06-01': 'Lun 1 jun',
}

function getSummariesForFilter(filter: DateFilter): Array<BranchSummary | DailySnapshot> {
  if (filter === 'hoy') return BRANCH_SUMMARIES
  if (filter === 'ayer') return DAILY_SNAPSHOTS.filter(s => s.date === '2026-06-07')
  // semana: last 7 days, one row per branch (most recent)
  const dates = ['2026-06-07','2026-06-06','2026-06-05','2026-06-04','2026-06-03','2026-06-02','2026-06-01']
  const seen = new Set<BranchId>()
  const result: DailySnapshot[] = []
  for (const date of dates) {
    for (const snap of DAILY_SNAPSHOTS.filter(s => s.date === date)) {
      if (!seen.has(snap.branchId)) { seen.add(snap.branchId); result.push(snap) }
    }
  }
  return result
}

export function Resumen({ onNavigate }: ResumenProps) {
  const { isMobile, isTablet } = useBreakpoint()
  const isNarrow = isMobile || isTablet
  const [filter, setFilter] = useState<DateFilter>('hoy')

  const rows = getSummariesForFilter(filter)

  const cerradas  = rows.filter(r => getStatus(r) === 'cerrado').length
  const descuadre = rows.filter(r => getStatus(r) === 'descuadre').length
  const pendientes = rows.filter(r => getStatus(r) === 'pendiente').length

  return (
    <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'flex-start' }}>
      {/* Main column */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header + date filter */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 'var(--space-3)',
          marginBottom: 'var(--space-4)',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)',
              letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase',
              color: 'var(--bran)', marginBottom: '4px',
            }}>
              Resumen operativo · SOCO Mérida
            </div>
            <h1 style={{ fontSize: isMobile ? 'var(--text-xl)' : 'var(--text-3xl)', lineHeight: 1.1 }}>
              Conciliaciones
            </h1>
          </div>
          <DatePicker value={filter} onChange={setFilter} />
        </div>

        {/* KPI strip */}
        <div style={{
          display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)',
          flexWrap: 'wrap',
        }}>
          <KpiPill label="Cerradas"  value={cerradas}  color="#22C55E" />
          <KpiPill label="Descuadre" value={descuadre} color="var(--wheat-deep)" />
          <KpiPill label="Pendientes" value={pendientes} color="var(--babka-orange)" />
          {filter === 'hoy' && (
            <KpiPill label="HITL" value={HITL_REQUESTS.length} color="var(--babka-blue)" onClick={() => onNavigate('hitl')} />
          )}
        </div>

        {/* Branch table */}
        <div style={{
          background: 'var(--flour)', borderRadius: 'var(--r-lg)',
          boxShadow: 'var(--shadow-md)', overflow: 'hidden',
        }}>
          {isNarrow ? (
            <MobileList rows={rows} filter={filter} onNavigate={onNavigate} />
          ) : (
            <DesktopTable rows={rows} filter={filter} onNavigate={onNavigate} />
          )}
        </div>
      </div>

      {/* Agent feed — desktop only */}
      {!isNarrow && <AgentFeed onNavigate={onNavigate} />}
    </div>
  )
}

function DatePicker({ value, onChange }: { value: DateFilter; onChange: (v: DateFilter) => void }) {
  const opts: { id: DateFilter; label: string }[] = [
    { id: 'hoy',    label: 'Hoy' },
    { id: 'ayer',   label: 'Ayer' },
    { id: 'semana', label: 'Semana' },
  ]
  return (
    <div style={{ display: 'flex', gap: '4px', background: 'var(--crumb)', borderRadius: 'var(--r-md)', padding: '3px' }}>
      {opts.map(o => (
        <button key={o.id} onClick={() => onChange(o.id)} style={{
          padding: '5px 14px', borderRadius: 'calc(var(--r-md) - 2px)', border: 'none',
          background: value === o.id ? 'var(--flour)' : 'transparent',
          color: value === o.id ? 'var(--ink)' : 'var(--bran)',
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)',
          cursor: 'pointer', boxShadow: value === o.id ? 'var(--shadow-sm)' : 'none',
          transition: 'all var(--transition)',
        }}>{o.label}</button>
      ))}
    </div>
  )
}

function KpiPill({ label, value, color, onClick }: { label: string; value: number; color: string; onClick?: () => void }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
      background: 'var(--flour)', borderRadius: 'var(--r-pill)',
      padding: '6px 14px', boxShadow: 'var(--shadow-sm)',
      cursor: onClick ? 'pointer' : 'default',
      border: '1px solid var(--line)',
    }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', fontWeight: 'var(--weight-black)', color, lineHeight: 1 }}>
        {value}
      </span>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--bran)' }}>
        {label}
      </span>
    </div>
  )
}

type AnyRow = BranchSummary | DailySnapshot

function getStatus(r: AnyRow) {
  return 'reconciliationStatus' in r ? r.reconciliationStatus : r.status
}

function DesktopTable({ rows, filter, onNavigate }: { rows: AnyRow[]; filter: DateFilter; onNavigate: ResumenProps['onNavigate'] }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid var(--line)' }}>
          <Th align="left" width={28}></Th>
          <Th align="left">Sucursal</Th>
          {filter === 'semana' && <Th align="center">Fecha</Th>}
          <Th align="center">Estado</Th>
          <Th align="right">Δ</Th>
          <Th align="right">Unidades</Th>
          <Th align="right">Hora cierre</Th>
          <Th align="center" width={40}></Th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => {
          const branch = BRANCHES.find(b => b.id === row.branchId)!
          const status = getStatus(row)
          const isEven = i % 2 === 0
          return (
            <tr
              key={`${row.branchId}-${row.date}`}
              onClick={() => onNavigate('conciliaciones', row.branchId)}
              style={{
                borderBottom: '1px solid var(--line)',
                background: isEven ? 'transparent' : 'var(--flour-warm)',
                cursor: 'pointer',
                transition: 'background var(--transition)',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--babka-blue-soft)')}
              onMouseLeave={e => (e.currentTarget.style.background = isEven ? 'transparent' : 'var(--flour-warm)')}
            >
              <td style={{ padding: '10px 12px 10px 16px' }}>
                <TrafficDot light={row.light} />
              </td>
              <td style={{ padding: '10px 12px' }}>
                <div style={{ fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-sm)', color: 'var(--ink)' }}>{branch.shortName}</div>
                <div style={{ fontSize: '11px', color: 'var(--bran)' }}>{branch.manager}</div>
              </td>
              {filter === 'semana' && (
                <td style={{ padding: '10px 12px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--bran)', whiteSpace: 'nowrap' }}>
                  {DATE_LABELS[row.date] ?? row.date}
                </td>
              )}
              <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                <StatusBadge status={status} />
              </td>
              <td style={{ padding: '10px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: row.diferencia > 0 ? 'var(--wheat-deep)' : row.diferencia < 0 ? 'var(--babka-orange)' : 'var(--bran)' }}>
                {row.diferencia === 0 ? '—' : `+${row.diferencia}`}
              </td>
              <td style={{ padding: '10px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)' }}>
                {row.totalUnits > 0 ? row.totalUnits : '—'}
              </td>
              <td style={{ padding: '10px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--bran)', whiteSpace: 'nowrap' }}>
                {status !== 'pendiente' && 'lastUpdate' in row ? formatTime(row.lastUpdate) : '—'}
              </td>
              <td style={{ padding: '10px 16px', textAlign: 'center', color: 'var(--bran)', fontSize: 'var(--text-sm)' }}>→</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function MobileList({ rows, filter, onNavigate }: { rows: AnyRow[]; filter: DateFilter; onNavigate: ResumenProps['onNavigate'] }) {
  return (
    <div>
      {rows.map((row, i) => {
        const branch = BRANCHES.find(b => b.id === row.branchId)!
        const status = getStatus(row)
        const isLast = i === rows.length - 1
        return (
          <div
            key={`${row.branchId}-${row.date}`}
            onClick={() => onNavigate('conciliaciones', row.branchId)}
            style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
              padding: 'var(--space-3) var(--space-4)',
              borderBottom: isLast ? 'none' : '1px solid var(--line)',
              cursor: 'pointer',
            }}
          >
            <TrafficDot light={row.light} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-sm)', color: 'var(--ink)' }}>{branch.shortName}</span>
                {filter === 'semana' && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--bran)' }}>{DATE_LABELS[row.date]}</span>}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--bran)', marginTop: '1px' }}>{branch.manager}</div>
            </div>
            <StatusBadge status={status} />
            {row.diferencia !== 0 && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 'var(--weight-bold)', color: 'var(--wheat-deep)' }}>
                +{row.diferencia}
              </span>
            )}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--bran)' }}>
              {row.totalUnits > 0 ? row.totalUnits : '—'}
            </span>
            <span style={{ color: 'var(--bran)', fontSize: '12px' }}>›</span>
          </div>
        )
      })}
    </div>
  )
}

function AgentFeed({ onNavigate }: { onNavigate: (page: string) => void }) {
  const hitlCount = HITL_REQUESTS.length

  const events = [
    { time: '9:18 pm', icon: '✓', color: '#22C55E', label: 'Slowfood procesado', detail: 'Δ=0 · 96 unidades' },
    { time: '9:03 pm', icon: '✓', color: '#22C55E', label: 'Centro procesado',   detail: 'Δ=0 · 184 unidades' },
    { time: '8:55 pm', icon: '✓', color: '#22C55E', label: 'Montes procesado',   detail: 'Δ=0 · 142 unidades' },
    { time: '8:47 pm', icon: '⚠', color: 'var(--wheat-deep)', label: 'Norte escalado HITL', detail: '+4 pzas · pendiente aprobación' },
    { time: '9:12 am', icon: '○', color: 'var(--babka-orange)', label: 'Marista sin reporte', detail: 'Último movimiento apertura' },
  ]

  return (
    <div style={{
      width: '240px', flexShrink: 0,
      background: 'var(--flour)', borderRadius: 'var(--r-lg)',
      boxShadow: 'var(--shadow-md)', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: 'var(--space-4)',
        borderBottom: '1px solid var(--line)',
        background: 'var(--ink)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: '4px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-black)', fontSize: 'var(--text-sm)', color: 'var(--wheat)', fontStyle: 'italic' }}>
            Clarisa AI
          </span>
        </div>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>
          Actividad del agente · hoy
        </div>
      </div>

      {/* Event feed */}
      <div style={{ padding: 'var(--space-3)' }}>
        {events.map((ev, i) => (
          <div key={i} style={{
            display: 'flex', gap: 'var(--space-2)', padding: 'var(--space-2) 0',
            borderBottom: i < events.length - 1 ? '1px solid var(--line)' : 'none',
          }}>
            <span style={{ fontSize: '13px', color: ev.color, flexShrink: 0, width: '16px', textAlign: 'center', marginTop: '1px' }}>
              {ev.icon}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '12px', fontWeight: 'var(--weight-medium)', color: 'var(--ink)', lineHeight: 1.3 }}>
                {ev.label}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--bran)', marginTop: '1px' }}>
                {ev.detail}
              </div>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--bran)', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {ev.time}
            </div>
          </div>
        ))}
      </div>

      {/* HITL alert */}
      {hitlCount > 0 && (
        <div style={{ margin: 'var(--space-3)', padding: 'var(--space-3)', background: 'rgba(230,178,60,0.12)', borderRadius: 'var(--r-md)', border: '1px solid rgba(230,178,60,0.3)' }}>
          <div style={{ fontSize: '11px', fontWeight: 'var(--weight-bold)', color: 'var(--wheat-deep)', marginBottom: '6px' }}>
            {hitlCount} ítems requieren aprobación
          </div>
          <button
            onClick={() => onNavigate('hitl')}
            style={{
              width: '100%', padding: '6px', background: 'var(--ink)', color: 'var(--wheat)',
              border: 'none', borderRadius: 'var(--r-md)', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 'var(--weight-bold)',
            }}
          >
            Ir a bandeja HITL →
          </button>
        </div>
      )}
    </div>
  )
}

function TrafficDot({ light }: { light: TrafficLight }) {
  const colors: Record<TrafficLight, string> = { verde: '#22C55E', amarillo: 'var(--wheat)', rojo: 'var(--babka-orange)' }
  return (
    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: colors[light], flexShrink: 0 }} />
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    cerrado:   { bg: 'rgba(34,197,94,0.12)',  color: '#16a34a', label: 'Cerrado' },
    abierto:   { bg: 'var(--babka-blue-soft)', color: 'var(--babka-blue-deep)', label: 'Abierto' },
    descuadre: { bg: 'rgba(230,178,60,0.2)',  color: 'var(--wheat-deep)', label: 'Descuadre' },
    pendiente: { bg: 'rgba(220,122,51,0.15)', color: 'var(--babka-orange-deep)', label: 'Sin reportar' },
  }
  const s = map[status] ?? map.pendiente
  return (
    <span style={{
      background: s.bg, color: s.color,
      fontSize: '10px', fontWeight: 'var(--weight-bold)',
      letterSpacing: '0.05em', textTransform: 'uppercase',
      padding: '2px 8px', borderRadius: 'var(--r-pill)',
      fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
    }}>{s.label}</span>
  )
}

function Th({ children, align = 'left', width }: { children?: React.ReactNode; align?: string; width?: number }) {
  return (
    <th style={{
      padding: '8px 12px', textAlign: align as 'left' | 'right' | 'center',
      fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.06em',
      textTransform: 'uppercase', color: 'var(--bran)', fontFamily: 'var(--font-body)',
      whiteSpace: 'nowrap', width: width ? `${width}px` : undefined,
      ...(align === 'left' && children === undefined ? { paddingLeft: '16px' } : {}),
    }}>{children}</th>
  )
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
}

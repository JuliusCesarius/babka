import { useState } from 'react'
import { BRANCHES, BRANCH_SUMMARIES } from '../fixtures/branches'
import { DAILY_SNAPSHOTS } from '../fixtures/history'
import { HITL_REQUESTS } from '../fixtures/branches'
import { useBreakpoint } from '../hooks/useBreakpoint'
import type { BranchId, BranchSummary, DailySnapshot, TrafficLight } from '../types'
import type { UserRole } from '../App'

interface ResumenProps {
  onNavigate: (page: string, branchId?: BranchId) => void
  role: UserRole
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

export function Resumen({ onNavigate, role }: ResumenProps) {
  if (role === 'exec') return <CLevelResumen onNavigate={onNavigate} />
  return <OperativoResumen onNavigate={onNavigate} />
}

function OperativoResumen({ onNavigate }: { onNavigate: ResumenProps['onNavigate'] }) {
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
            <h1 style={{ fontSize: isMobile ? 'var(--text-lg)' : 'var(--text-xl)', lineHeight: 1.2, fontFamily: 'var(--font-body)', fontWeight: 'var(--weight-black)', color: 'var(--ink)' }}>
              {cerradas === rows.length
                ? `Todo cerrado · ${cerradas} sucursales ✓`
                : descuadre > 0 && pendientes > 0
                  ? `${cerradas} cerradas · ${descuadre} descuadre · ${pendientes} sin reportar`
                  : descuadre > 0
                    ? `${cerradas} de ${rows.length} cerradas · ${descuadre} con descuadre`
                    : pendientes > 0
                      ? `${cerradas} de ${rows.length} cerradas · ${pendientes} sin reportar`
                      : `${cerradas} de ${rows.length} cerradas`
              }
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
  const isAction = !!onClick
  return (
    <div
      onClick={onClick}
      role={isAction ? 'button' : undefined}
      tabIndex={isAction ? 0 : undefined}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
        background: isAction ? color : 'var(--flour)',
        borderRadius: 'var(--r-pill)',
        padding: '5px 12px',
        boxShadow: 'var(--shadow-sm)',
        cursor: isAction ? 'pointer' : 'default',
        border: isAction ? 'none' : '1px solid var(--line)',
        transition: 'opacity var(--transition)',
      }}
    >
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', fontWeight: 'var(--weight-black)',
        color: isAction ? '#fff' : color, lineHeight: 1,
      }}>
        {value}
      </span>
      <span style={{
        fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 'var(--weight-bold)',
        letterSpacing: '0.05em', textTransform: 'uppercase',
        color: isAction ? 'rgba(255,255,255,0.85)' : 'var(--bran)',
      }}>
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
              <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                {row.diferencia === 0
                  ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--bran)' }}>—</span>
                  : <span style={{
                      display: 'inline-block',
                      background: row.diferencia > 0 ? 'rgba(230,178,60,0.18)' : 'rgba(220,80,50,0.15)',
                      color: row.diferencia > 0 ? 'var(--wheat-deep)' : 'var(--babka-orange)',
                      fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-black)',
                      padding: '2px 8px', borderRadius: 'var(--r-pill)',
                      border: `1px solid ${row.diferencia > 0 ? 'rgba(230,178,60,0.4)' : 'rgba(220,80,50,0.3)'}`,
                    }}>
                      {row.diferencia > 0 ? `+${row.diferencia}` : row.diferencia}
                    </span>
                }
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

  type FeedEvent = {
    time: string; icon: string; color: string; label: string; detail: string; alert?: boolean
  }
  const events: FeedEvent[] = [
    { time: '9:18 pm', icon: '✓', color: '#22C55E', label: 'Slowfood procesado', detail: 'Δ=0 · 96 unidades' },
    { time: '9:03 pm', icon: '✓', color: '#22C55E', label: 'Centro procesado',   detail: 'Δ=0 · 184 unidades' },
    { time: '8:55 pm', icon: '✓', color: '#22C55E', label: 'Montes procesado',   detail: 'Δ=0 · 142 unidades' },
    { time: '8:47 pm', icon: '⚠', color: 'var(--wheat-deep)', label: 'Norte · Δ+4 en HITL', detail: 'Requiere aprobación supervisor', alert: true },
    { time: '9:12 am', icon: '!', color: 'var(--babka-orange)', label: 'Marista sin reporte', detail: 'Sin actividad desde apertura', alert: true },
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
            display: 'flex', gap: 'var(--space-2)',
            padding: ev.alert ? '6px 8px' : 'var(--space-2) 0',
            marginBottom: ev.alert ? '4px' : 0,
            borderRadius: ev.alert ? 'var(--r-md)' : 0,
            background: ev.alert
              ? ev.color === 'var(--wheat-deep)'
                ? 'rgba(230,178,60,0.1)'
                : 'rgba(220,80,50,0.08)'
              : 'transparent',
            borderLeft: ev.alert ? `3px solid ${ev.color}` : 'none',
            borderBottom: !ev.alert && i < events.length - 1 ? '1px solid var(--line)' : 'none',
          }}>
            <span style={{
              fontSize: ev.alert ? '11px' : '13px',
              fontWeight: ev.alert ? 'var(--weight-black)' : 'normal',
              color: ev.color, flexShrink: 0, width: '16px', textAlign: 'center', marginTop: '1px',
            }}>
              {ev.icon}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '12px',
                fontWeight: ev.alert ? 'var(--weight-bold)' : 'var(--weight-medium)',
                color: ev.alert ? ev.color : 'var(--ink)',
                lineHeight: 1.3,
              }}>
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

      {/* HITL action row */}
      {hitlCount > 0 && (
        <div style={{ borderTop: '1px solid var(--line)', padding: 'var(--space-3)' }}>
          <button
            onClick={() => onNavigate('hitl')}
            style={{
              width: '100%', padding: '7px 12px',
              background: 'rgba(230,178,60,0.12)',
              color: 'var(--wheat-deep)',
              border: '1px solid rgba(230,178,60,0.35)',
              borderRadius: 'var(--r-md)', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 'var(--weight-bold)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}
          >
            <span>{hitlCount} pendientes en HITL</span>
            <span style={{ opacity: 0.7 }}>→</span>
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

// ─── C-LEVEL EXECUTIVE VIEW ────────────────────────────────────────────────

const TODAY_DATE = '2026-06-08'

interface CLevelBranch {
  branchId: BranchId
  weeklyUnits: number
  soldPct: number | null
  wastePct: number | null
  deltaAccum: number
  efficiency: number
  cleanDays: number
  totalActiveDays: number
  dailyUnits: number[]
  dailyStatus: string[]
}

function computeCLevelData(): CLevelBranch[] {
  return BRANCHES.map(branch => {
    const snaps = DAILY_SNAPSHOTS.filter(s => s.branchId === branch.id)
      .sort((a, b) => a.date.localeCompare(b.date))
    const todaySummary = BRANCH_SUMMARIES.find(s => s.branchId === branch.id)!

    const todaySnap: DailySnapshot = {
      date: TODAY_DATE,
      branchId: branch.id as BranchId,
      status: todaySummary.reconciliationStatus,
      light: todaySummary.light,
      diferencia: todaySummary.diferencia,
      totalUnits: todaySummary.totalUnits,
    }

    const allDays = [...snaps, todaySnap]
    const activeDays = allDays.filter(d => !(d.status === 'pendiente' && d.totalUnits === 0))

    const weeklyUnits = allDays.reduce((sum, d) => sum + d.totalUnits, 0)
    const deltaAccum  = allDays.reduce((sum, d) => sum + d.diferencia, 0)
    const cleanDays   = allDays.filter(d => d.status === 'cerrado').length
    const totalActiveDays = activeDays.length

    const soldPct  = todaySummary.totalUnits > 0
      ? Math.round((todaySummary.soldUnits  / todaySummary.totalUnits) * 100)
      : null
    const wastePct = todaySummary.totalUnits > 0
      ? Math.round((todaySummary.wasteUnits / todaySummary.totalUnits) * 1000) / 10
      : null

    const efficiency = totalActiveDays > 0 ? Math.round((cleanDays / totalActiveDays) * 100) : 0

    return {
      branchId: branch.id as BranchId,
      weeklyUnits,
      soldPct,
      wastePct,
      deltaAccum,
      efficiency,
      cleanDays,
      totalActiveDays,
      dailyUnits:  allDays.map(d => d.totalUnits),
      dailyStatus: allDays.map(d => d.status),
    }
  })
}

function CLevelResumen({ onNavigate }: { onNavigate: ResumenProps['onNavigate'] }) {
  const { isMobile } = useBreakpoint()
  const branches = computeCLevelData()

  const totalWeekly = branches.reduce((sum, b) => sum + b.weeklyUnits, 0)
  const activeBranches = branches.filter(b => b.soldPct !== null)
  const avgSoldPct  = activeBranches.length ? Math.round(activeBranches.reduce((s, b) => s + (b.soldPct ?? 0), 0) / activeBranches.length) : 0
  const avgWastePct = activeBranches.length ? Math.round(activeBranches.reduce((s, b) => s + (b.wastePct ?? 0), 0) / activeBranches.length * 10) / 10 : 0
  const totalDelta  = branches.reduce((sum, b) => sum + b.deltaAccum, 0)
  const overallEff  = Math.round(branches.reduce((s, b) => s + b.efficiency, 0) / branches.length)

  const execAlerts = [
    { icon: '⚠', color: 'var(--wheat-deep)', bg: 'rgba(230,178,60,0.1)', text: 'Norte · Descuadre acumulado +7 pzas en 8 días — patrón recurrente (2 eventos)', action: 'Ver conciliaciones' },
    { icon: '↗', color: 'var(--babka-orange)', bg: 'rgba(220,122,51,0.08)', text: 'Centro · Merma atípica en croissants (+230% vs prom. 30 días) · Jun 2', action: 'Ver histórico' },
    { icon: '○', color: 'var(--bran)', bg: 'rgba(0,0,0,0.04)', text: 'Marista · Sin operación en domingos — patrón esperado', action: null },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)',
          letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--bran)', marginBottom: '4px',
        }}>Vista ejecutiva · SOCO Mérida</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <h1 style={{ fontSize: isMobile ? 'var(--text-xl)' : 'var(--text-3xl)', lineHeight: 1.1 }}>
            Semana 2–9 jun 2026
          </h1>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--bran)', fontFamily: 'var(--font-body)' }}>
            Última actualización: hoy 9:18 pm
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-6)',
      }}>
        <ExecKPI label="Unidades semana" value={totalWeekly.toLocaleString('es-MX')} trend="+8% vs s. anterior" trendUp />
        <ExecKPI label="Vendido promedio" value={`${avgSoldPct}%`} trend="+2pp vs meta" trendUp />
        <ExecKPI label="Merma promedio" value={`${avgWastePct}%`} trend="↓ mejorando vs prom." trendUp />
        <ExecKPI label="Δ acumulado sem." value={`+${totalDelta}`} trend="↑ vs +3 semana ant." trendUp={false} warn={totalDelta > 5} />
      </div>

      {/* Efficiency bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
        background: 'var(--flour)', borderRadius: 'var(--r-lg)', padding: 'var(--space-4)',
        boxShadow: 'var(--shadow-md)', marginBottom: 'var(--space-6)',
      }}>
        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--bran)', whiteSpace: 'nowrap' }}>
          Eficiencia operativa
        </div>
        <div style={{ flex: 1, height: '8px', background: 'var(--crumb)', borderRadius: 'var(--r-pill)', overflow: 'hidden' }}>
          <div style={{ width: `${overallEff}%`, height: '100%', background: overallEff >= 90 ? '#22C55E' : overallEff >= 75 ? 'var(--wheat)' : 'var(--babka-orange)', borderRadius: 'var(--r-pill)', transition: 'width 0.5s' }} />
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-black)', fontSize: 'var(--text-lg)', color: overallEff >= 90 ? '#16a34a' : 'var(--wheat-deep)', whiteSpace: 'nowrap' }}>
          {overallEff}%
        </div>
      </div>

      {/* Branch efficiency matrix */}
      <div style={{ background: 'var(--flour)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-md)', overflow: 'hidden', marginBottom: 'var(--space-6)' }}>
        <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '2px solid var(--line)' }}>
          <div style={{ fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--bran)' }}>
            Rendimiento por sucursal · 8 días
          </div>
        </div>
        {isMobile ? (
          <MobileExecTable branches={branches} onNavigate={onNavigate} />
        ) : (
          <DesktopExecTable branches={branches} onNavigate={onNavigate} />
        )}
      </div>

      {/* Executive alerts */}
      <div style={{ background: 'var(--flour)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--line)' }}>
          <div style={{ fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--bran)' }}>
            Alertas ejecutivas
          </div>
        </div>
        {execAlerts.map((alert, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
            padding: 'var(--space-3) var(--space-6)',
            borderBottom: i < execAlerts.length - 1 ? '1px solid var(--line)' : 'none',
            background: alert.bg,
          }}>
            <span style={{ fontSize: '16px', color: alert.color, flexShrink: 0 }}>{alert.icon}</span>
            <div style={{ flex: 1, fontSize: 'var(--text-sm)', color: 'var(--ink)', lineHeight: 1.4 }}>{alert.text}</div>
            {alert.action && (
              <button
                onClick={() => onNavigate('conciliaciones')}
                style={{
                  padding: '4px 12px', borderRadius: 'var(--r-pill)', border: '1px solid var(--line)',
                  background: 'transparent', color: 'var(--babka-blue-deep)',
                  fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 'var(--weight-bold)',
                  cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                }}
              >
                {alert.action} →
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ExecKPI({ label, value, trend, trendUp, warn }: {
  label: string; value: string; trend: string; trendUp: boolean; warn?: boolean
}) {
  return (
    <div style={{
      background: warn ? 'rgba(230,178,60,0.08)' : 'var(--flour)',
      borderRadius: 'var(--r-lg)', padding: 'var(--space-4) var(--space-6)',
      boxShadow: 'var(--shadow-md)',
      border: warn ? '1px solid rgba(230,178,60,0.3)' : '1px solid transparent',
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-black)', color: warn ? 'var(--wheat-deep)' : 'var(--ink)', lineHeight: 1, marginBottom: '6px' }}>
        {value}
      </div>
      <div style={{ fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--bran)', marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{ fontSize: '10px', color: trendUp ? '#16a34a' : 'var(--babka-orange)', fontFamily: 'var(--font-body)' }}>
        {trend}
      </div>
    </div>
  )
}

function Sparkline({ units, statuses }: { units: number[]; statuses: string[] }) {
  const maxU = Math.max(...units.filter(u => u > 0), 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '28px' }}>
      {units.map((u, i) => {
        const h = u > 0 ? Math.max(3, Math.round((u / maxU) * 28)) : 3
        const color = statuses[i] === 'cerrado'   ? '#22C55E'
                    : statuses[i] === 'descuadre' ? '#D4A017'
                    : statuses[i] === 'pendiente' && u === 0 ? '#E05C2A'
                    : '#CBD5E1'
        const isToday = i === units.length - 1
        return (
          <div key={i} style={{
            width: isToday ? '8px' : '6px',
            height: `${h}px`,
            borderRadius: '2px',
            background: color,
            flexShrink: 0,
            opacity: isToday ? 1 : 0.7,
          }} />
        )
      })}
    </div>
  )
}

function EfficiencyScore({ score }: { score: number }) {
  const color = score >= 90 ? '#16a34a' : score >= 75 ? 'var(--wheat-deep)' : 'var(--babka-orange)'
  const label = score >= 90 ? '✓' : score >= 75 ? '⚠' : '✗'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-sm)', color }}>
        {score}%
      </span>
      <span style={{ fontSize: '12px', color }}>{label}</span>
    </div>
  )
}

function DesktopExecTable({ branches, onNavigate }: { branches: CLevelBranch[]; onNavigate: ResumenProps['onNavigate'] }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--line)' }}>
          {['Sucursal', 'Semana', 'Vendido%', 'Merma%', 'Δ acum.', 'Tendencia (8d)', 'Eficiencia'].map(h => (
            <th key={h} style={{ padding: '8px 16px', textAlign: h === 'Sucursal' ? 'left' : 'right', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--bran)', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {branches.map((b, i) => {
          const branch = BRANCHES.find(br => br.id === b.branchId)!
          const isEven = i % 2 === 0
          return (
            <tr key={b.branchId}
              onClick={() => onNavigate('conciliaciones', b.branchId)}
              style={{ borderBottom: '1px solid var(--line)', background: isEven ? 'transparent' : 'var(--flour-warm)', cursor: 'pointer', transition: 'background var(--transition)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--babka-blue-soft)')}
              onMouseLeave={e => (e.currentTarget.style.background = isEven ? 'transparent' : 'var(--flour-warm)')}
            >
              <td style={{ padding: '12px 16px' }}>
                <div style={{ fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-sm)' }}>{branch.shortName}</div>
                <div style={{ fontSize: '10px', color: 'var(--bran)' }}>{branch.manager}</div>
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--ink)' }}>
                {b.weeklyUnits > 0 ? b.weeklyUnits.toLocaleString('es-MX') : '—'}
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: b.soldPct !== null && b.soldPct >= 85 ? '#16a34a' : 'var(--ink)' }}>
                {b.soldPct !== null ? `${b.soldPct}%` : '—'}
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: b.wastePct !== null && b.wastePct > 6 ? 'var(--babka-orange)' : 'var(--ink)' }}>
                {b.wastePct !== null ? `${b.wastePct}%` : '—'}
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: b.deltaAccum > 0 ? 'var(--wheat-deep)' : '#16a34a' }}>
                {b.deltaAccum > 0 ? `+${b.deltaAccum}` : '0'}
              </td>
              <td style={{ padding: '12px 16px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <Sparkline units={b.dailyUnits} statuses={b.dailyStatus} />
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                <EfficiencyScore score={b.efficiency} />
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function MobileExecTable({ branches, onNavigate }: { branches: CLevelBranch[]; onNavigate: ResumenProps['onNavigate'] }) {
  return (
    <div>
      {branches.map((b, i) => {
        const branch = BRANCHES.find(br => br.id === b.branchId)!
        return (
          <div key={b.branchId}
            onClick={() => onNavigate('conciliaciones', b.branchId)}
            style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: i < branches.length - 1 ? '1px solid var(--line)' : 'none', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
              <div>
                <div style={{ fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-sm)' }}>{branch.shortName}</div>
                <div style={{ fontSize: '10px', color: 'var(--bran)' }}>{branch.manager}</div>
              </div>
              <EfficiencyScore score={b.efficiency} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <div>
                  <div style={{ fontSize: '9px', color: 'var(--bran)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Vendido</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 'var(--weight-bold)' }}>{b.soldPct !== null ? `${b.soldPct}%` : '—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '9px', color: 'var(--bran)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Merma</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 'var(--weight-bold)' }}>{b.wastePct !== null ? `${b.wastePct}%` : '—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '9px', color: 'var(--bran)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Δ acum.</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 'var(--weight-bold)', color: b.deltaAccum > 0 ? 'var(--wheat-deep)' : '#16a34a' }}>{b.deltaAccum > 0 ? `+${b.deltaAccum}` : '0'}</div>
                </div>
              </div>
              <Sparkline units={b.dailyUnits} statuses={b.dailyStatus} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

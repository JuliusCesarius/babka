import { useState } from 'react'
import { BRANCHES, BRANCH_SUMMARIES } from '../fixtures/branches'
import { useBreakpoint } from '../hooks/useBreakpoint'
import type { BranchId, BranchSummary, TrafficLight } from '../types'

interface ResumenProps {
  onNavigate: (page: string, branchId?: BranchId) => void
}

export function Resumen({ onNavigate }: ResumenProps) {
  const { isMobile } = useBreakpoint()
  const totalCerradas  = BRANCH_SUMMARIES.filter(s => s.reconciliationStatus === 'cerrado').length
  const totalDescuadre = BRANCH_SUMMARIES.filter(s => s.reconciliationStatus === 'descuadre').length
  const totalPendientes= BRANCH_SUMMARIES.filter(s => s.reconciliationStatus === 'pendiente').length

  return (
    <div>
      <PageHeader isMobile={isMobile} />

      {/* KPIs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: isMobile ? 'var(--space-3)' : 'var(--space-4)',
        marginBottom: isMobile ? 'var(--space-6)' : 'var(--space-8)',
      }}>
        <KpiCard label="Cerradas" value={totalCerradas}  total={5} color="var(--babka-blue)"    isMobile={isMobile} />
        <KpiCard label="Descuadre" value={totalDescuadre} total={5} color="var(--wheat)"         isMobile={isMobile} />
        <KpiCard label="Pendientes" value={totalPendientes} total={5} color="var(--babka-orange)" isMobile={isMobile} />
      </div>

      {/* Branch cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile
          ? '1fr'
          : 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: isMobile ? 'var(--space-4)' : 'var(--space-6)',
      }}>
        {BRANCH_SUMMARIES.map(summary => {
          const branch = BRANCHES.find(b => b.id === summary.branchId)!
          return (
            <BranchCard
              key={summary.branchId}
              summary={summary}
              branch={branch}
              isMobile={isMobile}
              onNavigate={onNavigate}
            />
          )
        })}
      </div>
    </div>
  )
}

function PageHeader({ isMobile }: { isMobile: boolean }) {
  return (
    <div style={{ marginBottom: isMobile ? 'var(--space-5)' : 'var(--space-8)' }}>
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)',
        letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase',
        color: 'var(--bran)', marginBottom: 'var(--space-2)',
      }}>
        Lunes 8 de junio, 2026
      </div>
      <h1 style={{ fontSize: isMobile ? 'var(--text-2xl)' : 'var(--text-4xl)', marginBottom: 'var(--space-2)' }}>
        Resumen del día
      </h1>
      <p style={{ color: 'var(--bran)', fontSize: 'var(--text-sm)' }}>
        Estado de conciliación — SOCO Mérida
      </p>
    </div>
  )
}

function KpiCard({ label, value, total, color, isMobile }: {
  label: string; value: number; total: number; color: string; isMobile: boolean
}) {
  return (
    <div style={{
      background: 'var(--flour)',
      borderRadius: isMobile ? 'var(--r-md)' : 'var(--r-lg)',
      padding: isMobile ? 'var(--space-4)' : 'var(--space-6)',
      boxShadow: 'var(--shadow-md)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-1)', marginBottom: 'var(--space-1)' }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: isMobile ? 'var(--text-2xl)' : 'var(--text-3xl)',
          fontWeight: 'var(--weight-black)', color, lineHeight: 1,
        }}>{value}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--bran)', marginBottom: '2px' }}>
          /{total}
        </span>
      </div>
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: isMobile ? '9px' : 'var(--text-xs)',
        fontWeight: 'var(--weight-bold)', letterSpacing: '0.06em',
        textTransform: 'uppercase', color: 'var(--bran)',
      }}>
        {label}
      </div>
    </div>
  )
}

function TrafficDot({ light }: { light: TrafficLight }) {
  const colors: Record<TrafficLight, string> = { verde: '#22C55E', amarillo: 'var(--wheat)', rojo: 'var(--babka-orange)' }
  const animations: Record<TrafficLight, string> = {
    verde: 'pulse-verde 2s ease-in-out infinite',
    amarillo: 'none',
    rojo: 'pulse-rojo 1.5s ease-in-out infinite',
  }
  return (
    <div style={{
      width: '10px', height: '10px', borderRadius: '50%',
      background: colors[light], flexShrink: 0, animation: animations[light],
    }} />
  )
}

function StatusBadge({ status }: { status: BranchSummary['reconciliationStatus'] }) {
  const styles: Record<string, { bg: string; color: string; label: string }> = {
    cerrado:   { bg: 'rgba(34,197,94,0.12)',  color: '#16a34a', label: 'Cerrado' },
    abierto:   { bg: 'var(--babka-blue-soft)', color: 'var(--babka-blue-deep)', label: 'Abierto' },
    descuadre: { bg: 'rgba(230,178,60,0.2)',  color: 'var(--wheat-deep)', label: 'Descuadre' },
    pendiente: { bg: 'rgba(220,122,51,0.15)', color: 'var(--babka-orange-deep)', label: 'Sin reportar' },
  }
  const s = styles[status]
  return (
    <span style={{
      background: s.bg, color: s.color,
      fontSize: '10px', fontWeight: 'var(--weight-bold)',
      letterSpacing: '0.06em', textTransform: 'uppercase',
      padding: '3px 10px', borderRadius: 'var(--r-pill)',
      fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
    }}>{s.label}</span>
  )
}

function BranchCard({ summary, branch, isMobile, onNavigate }: {
  summary: BranchSummary
  branch: (typeof BRANCHES)[number]
  isMobile: boolean
  onNavigate: ResumenProps['onNavigate']
}) {
  const [hovered, setHovered] = useState(false)

  const accentColors: Record<TrafficLight, string> = {
    verde:    '#22C55E',
    amarillo: 'var(--wheat)',
    rojo:     'var(--babka-orange)',
  }

  return (
    <div
      onClick={() => onNavigate('conciliaciones', summary.branchId)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--flour)',
        borderRadius: 'var(--r-lg)',
        boxShadow: hovered ? 'var(--shadow-lg)' : 'var(--shadow-md)',
        transform: hovered && !isMobile ? 'translateY(-3px)' : 'none',
        transition: 'box-shadow var(--transition), transform var(--transition)',
        cursor: 'pointer',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        background: accentColors[summary.light],
        padding: isMobile ? 'var(--space-3) var(--space-4)' : 'var(--space-4) var(--space-6)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-black)',
          fontSize: isMobile ? 'var(--text-lg)' : 'var(--text-xl)', color: 'var(--ink)',
        }}>
          {branch?.shortName}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <TrafficDot light={summary.light} />
          <StatusBadge status={summary.reconciliationStatus} />
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: isMobile ? 'var(--space-4)' : 'var(--space-6)' }}>
        <div style={{ marginBottom: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--bran)' }}>
          {branch?.manager} · {formatTime(summary.lastUpdate)}
        </div>

        {summary.reconciliationStatus === 'pendiente' ? (
          <div style={{
            padding: 'var(--space-4)', background: 'var(--crumb)',
            borderRadius: 'var(--r-md)', textAlign: 'center',
            color: 'var(--bran)', fontSize: 'var(--text-sm)',
          }}>
            Sin reporte de cierre
          </div>
        ) : (
          <>
            <DistributionBar summary={summary} />
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--space-3)',
              marginTop: 'var(--space-4)',
            }}>
              <Metric label="Vendido"  value={summary.soldUnits}     total={summary.totalUnits} />
              <Metric label="Traspaso" value={summary.transferUnits}  total={summary.totalUnits} />
              <Metric label="Merma"    value={summary.wasteUnits}     total={summary.totalUnits} />
              <Metric label="Personal" value={summary.staffUnits}     total={summary.totalUnits} />
            </div>
            {summary.diferencia !== 0 && (
              <div style={{
                marginTop: 'var(--space-3)',
                padding: 'var(--space-3) var(--space-4)',
                background: 'rgba(230,178,60,0.15)', borderRadius: 'var(--r-md)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--wheat-deep)', fontWeight: 'var(--weight-medium)' }}>
                  Diferencia
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--wheat-deep)' }}>
                  +{summary.diferencia} pzas
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function DistributionBar({ summary }: { summary: BranchSummary }) {
  const total = summary.totalUnits || 1
  const segments = [
    { value: summary.soldUnits,     color: 'var(--babka-blue)' },
    { value: summary.transferUnits, color: 'var(--wheat)' },
    { value: summary.wasteUnits,    color: 'var(--babka-orange)' },
    { value: summary.staffUnits,    color: 'var(--crumb)' },
  ]
  return (
    <div style={{ height: '8px', borderRadius: 'var(--r-pill)', overflow: 'hidden', display: 'flex' }}>
      {segments.map((seg, i) => (
        <div key={i} style={{ width: `${(seg.value / total) * 100}%`, background: seg.color }} />
      ))}
    </div>
  )
}

function Metric({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--bran)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 'var(--weight-medium)' }}>
          {label}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-soft)', fontWeight: 'var(--weight-medium)' }}>
          {value}
        </span>
      </div>
      <div style={{ height: '3px', background: 'var(--crumb)', borderRadius: 'var(--r-pill)', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: 'var(--babka-blue)', borderRadius: 'var(--r-pill)' }} />
      </div>
    </div>
  )
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
}

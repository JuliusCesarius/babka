import { useState, useRef, useCallback } from 'react'
import { BRANCHES, RECONCILIATIONS, BRANCH_SUMMARIES, HITL_REQUESTS } from '../fixtures/branches'
import { getItemEvents } from '../fixtures/events'
import { getSnapshotsForDate } from '../fixtures/history'
import { useBreakpoint } from '../hooks/useBreakpoint'
import type { BranchId, Reconciliation, ReconciliationItem, ReconciliationDestino, ItemEvent, ChatContext } from '../types'

interface ConciliacionesProps {
  initialBranchId?: BranchId
  onNavigate?: (page: string) => void
  onPinContext?: (ctx: ChatContext) => void
}

const TODAY = '2026-06-08'
const AVAILABLE_DATES = [
  '2026-06-01', '2026-06-02', '2026-06-03', '2026-06-04',
  '2026-06-05', '2026-06-06', '2026-06-07', '2026-06-08',
]

const DESTINOS: Array<{ key: keyof ReconciliationItem; label: string }> = [
  { key: 'vendido',    label: 'Vendido' },
  { key: 'traspaso',   label: 'Traspaso' },
  { key: 'merma',      label: 'Merma' },
  { key: 'personal',   label: 'Personal' },
  { key: 'evento',     label: 'Evento' },
  { key: 'muestra',    label: 'Muestra' },
  { key: 'devolucion', label: 'Dev.' },
]

type BranchCard = {
  branchId: BranchId
  shortName: string
  totalUnits: number
  status: 'cerrado' | 'descuadre' | 'pendiente' | 'abierto'
  light: 'verde' | 'amarillo' | 'rojo'
}

type AggRow = {
  sku: string; productName: string
  opening: number; produced: number; closing: number; diferencia: number
  vendido: number; traspaso: number; merma: number; personal: number
  evento: number; muestra: number; devolucion: number
}

type DestinoKey = 'vendido' | 'traspaso' | 'merma' | 'personal' | 'evento' | 'muestra' | 'devolucion'
type SortDir = 'asc' | 'desc' | null
type ColKey = 'productName' | 'opening' | 'produced' | 'closing' | 'diferencia' | DestinoKey
type NoteTargetType = 'row' | 'cell' | 'branch' | 'day'
type NoteTarget = { type: NoteTargetType; key: string; label: string }
type NoteEntry = { id: string; target: NoteTarget; actor: string; time: string; content: string }
type NotesMap = Map<string, NoteEntry[]>
type ActiveNoteState = { target: NoteTarget; rect: DOMRect; onRequestAgent?: () => void }

const COL_DEFAULTS: Record<string, number> = {
  productName: 150, opening: 65, produced: 65, closing: 65, diferencia: 60,
  vendido: 65, traspaso: 70, merma: 60, personal: 70, evento: 60, muestra: 65, devolucion: 65,
}

function useColResize() {
  const [colWidths, setColWidths] = useState<Record<string, number>>({})
  const resizingRef = useRef<{ key: string; startX: number; startWidth: number } | null>(null)
  const startResize = useCallback((key: string, e: React.MouseEvent, el: HTMLTableCellElement) => {
    e.preventDefault()
    const width = el.getBoundingClientRect().width
    resizingRef.current = { key, startX: e.clientX, startWidth: width }
    const onMove = (ev: MouseEvent) => {
      if (!resizingRef.current) return
      const delta = ev.clientX - resizingRef.current.startX
      setColWidths(prev => ({ ...prev, [resizingRef.current!.key]: Math.max(50, resizingRef.current!.startWidth + delta) }))
    }
    const onUp = () => {
      resizingRef.current = null
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [])
  return { colWidths, startResize }
}

function formatDate(isoDate: string) {
  return new Date(isoDate + 'T12:00:00').toLocaleDateString('es-MX', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).toUpperCase()
}

export function Conciliaciones({ initialBranchId, onNavigate, onPinContext }: ConciliacionesProps) {
  const { isMobile } = useBreakpoint()

  const [selectedDate, setSelectedDate]     = useState(TODAY)
  const [selectedBranchId, setSelectedBranchId] = useState<BranchId | 'todas'>(initialBranchId ?? 'todas')
  const [mobileShowDetail, setMobileShowDetail] = useState(!!initialBranchId)
  const [notesMap, setNotesMap] = useState<NotesMap>(new Map())
  const [activeNote, setActiveNote] = useState<ActiveNoteState | null>(null)

  const openNote = useCallback((target: NoteTarget, rect: DOMRect, onRequestAgent?: () => void) => {
    setActiveNote({ target, rect, onRequestAgent })
  }, [])
  const closeNote = useCallback(() => setActiveNote(null), [])
  const addNote = useCallback((target: NoteTarget, content: string) => {
    const entry: NoteEntry = {
      id: `${target.key}-${target.type}-${Math.random().toString(36).slice(2)}`,
      target, actor: 'Gerente',
      time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      content,
    }
    setNotesMap(prev => {
      const updated = new Map(prev)
      updated.set(target.key, [...(prev.get(target.key) ?? []), entry])
      return updated
    })
  }, [])

  const isToday  = selectedDate === TODAY
  const dateIdx  = AVAILABLE_DATES.indexOf(selectedDate)

  const branchCards: BranchCard[] = isToday
    ? BRANCHES.map(b => {
        const s = BRANCH_SUMMARIES.find(x => x.branchId === b.id)!
        return {
          branchId: b.id as BranchId, shortName: b.shortName, totalUnits: s.totalUnits,
          status: s.reconciliationStatus as BranchCard['status'], light: s.light as BranchCard['light'],
        }
      })
    : getSnapshotsForDate(selectedDate).map(s => {
        const b = BRANCHES.find(x => x.id === s.branchId)!
        return {
          branchId: s.branchId as BranchId, shortName: b.shortName, totalUnits: s.totalUnits,
          status: s.status as BranchCard['status'], light: s.light as BranchCard['light'],
        }
      })

  const alertRecs = isToday
    ? RECONCILIATIONS.filter(r => r.status === 'descuadre' || r.status === 'pendiente')
    : []

  const selectedRec = isToday && selectedBranchId !== 'todas'
    ? RECONCILIATIONS.find(r => r.branchId === selectedBranchId) ?? null
    : null

  const handlePrev = () => {
    if (dateIdx > 0) {
      setSelectedDate(AVAILABLE_DATES[dateIdx - 1])
      setSelectedBranchId('todas')
      setMobileShowDetail(false)
    }
  }

  const handleNext = () => {
    if (dateIdx < AVAILABLE_DATES.length - 1) {
      setSelectedDate(AVAILABLE_DATES[dateIdx + 1])
      setSelectedBranchId('todas')
      setMobileShowDetail(false)
    }
  }

  const handleSelectBranch = (id: BranchId | 'todas') => {
    setSelectedBranchId(id)
    if (isMobile && id !== 'todas' && isToday) setMobileShowDetail(true)
    else setMobileShowDetail(false)
  }

  // Mobile: full-screen detail view
  if (isMobile && mobileShowDetail && selectedRec) {
    return (
      <div>
        <button
          onClick={() => { setMobileShowDetail(false); setSelectedBranchId('todas') }}
          style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--babka-blue)', fontSize: 'var(--text-sm)',
            fontWeight: 'var(--weight-medium)', fontFamily: 'var(--font-body)',
            padding: '0 0 var(--space-4)',
          }}
        >
          ← Volver
        </button>
        {(selectedRec.status === 'descuadre' || selectedRec.status === 'pendiente') && (
          <div style={{ marginBottom: 'var(--space-3)' }}>
            <AlertBanner rec={selectedRec} onNavigate={onNavigate} />
          </div>
        )}
        <RecDetail key={selectedRec.id} rec={selectedRec} isMobile={true} onNavigate={onNavigate} onPinContext={onPinContext} notesMap={notesMap} openNote={openNote} addNote={addNote} />
        {activeNote && (
          <NoteSheet activeNote={activeNote} notes={notesMap.get(activeNote.target.key) ?? []} isMobile={true} onClose={closeNote} onAdd={addNote} />
        )}
      </div>
    )
  }

  return (
    <div>
      {/* Header with date nav */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)',
          letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--bran)',
          marginBottom: 'var(--space-2)',
        }}>Conciliaciones</div>
        <DateNav
          formatted={formatDate(selectedDate)}
          onPrev={handlePrev}
          onNext={handleNext}
          prevDisabled={dateIdx === 0}
          nextDisabled={isToday}
          isMobile={isMobile}
          dayNoteCount={notesMap.get(selectedDate)?.length ?? 0}
          onDayNote={(rect) => openNote({ type: 'day', key: selectedDate, label: formatDate(selectedDate) }, rect)}
        />
      </div>

      {/* Branch mini-cards */}
      <BranchMiniCardRow
        cards={branchCards}
        selected={selectedBranchId}
        onSelect={handleSelectBranch}
        alertRecs={alertRecs}
      />

      {/* Main content */}
      <div style={{ marginTop: 'var(--space-4)' }}>
        {!isToday ? (
          <HistoricalView branchCards={branchCards} selected={selectedBranchId} />
        ) : selectedBranchId === 'todas' ? (
          <>
            {alertRecs.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                {alertRecs.map(r => <AlertBanner key={r.id} rec={r} onNavigate={onNavigate} />)}
              </div>
            )}
            <AggregatedTable isMobile={isMobile} notesMap={notesMap} openNote={openNote} addNote={addNote} />
          </>
        ) : selectedRec ? (
          <>
            {(selectedRec.status === 'descuadre' || selectedRec.status === 'pendiente') && (
              <div style={{ marginBottom: 'var(--space-3)' }}>
                <AlertBanner rec={selectedRec} onNavigate={onNavigate} />
              </div>
            )}
            <RecDetail key={selectedRec.id} rec={selectedRec} isMobile={isMobile} onNavigate={onNavigate} onPinContext={onPinContext} notesMap={notesMap} openNote={openNote} addNote={addNote} />
          </>
        ) : null}
      </div>
      {activeNote && (
        <NoteSheet
          activeNote={activeNote}
          notes={notesMap.get(activeNote.target.key) ?? []}
          isMobile={isMobile}
          onClose={closeNote}
          onAdd={addNote}
        />
      )}
    </div>
  )
}

// ─── Date navigation ───────────────────────────────────────────────────────

function DateNav({ formatted, onPrev, onNext, prevDisabled, nextDisabled, isMobile, dayNoteCount, onDayNote }: {
  formatted: string; onPrev: () => void; onNext: () => void
  prevDisabled: boolean; nextDisabled: boolean; isMobile: boolean
  dayNoteCount?: number; onDayNote?: (rect: DOMRect) => void
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
      <ArrowBtn onClick={onPrev} disabled={prevDisabled}>←</ArrowBtn>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <h1 style={{ margin: 0, fontSize: isMobile ? 'var(--text-xl)' : 'var(--text-2xl)' }}>
          {formatted}
        </h1>
        {onDayNote && (
          <NoteAnchor
            target={{ type: 'day', key: formatted, label: formatted }}
            count={dayNoteCount ?? 0}
            onOpen={(_t, rect) => onDayNote(rect)}
          />
        )}
      </div>
      <ArrowBtn onClick={onNext} disabled={nextDisabled}>→</ArrowBtn>
    </div>
  )
}

function ArrowBtn({ onClick, disabled, children }: {
  onClick: () => void; disabled: boolean; children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '32px', height: '32px', flexShrink: 0,
        borderRadius: 'var(--r-md)', border: '1.5px solid',
        borderColor: disabled ? 'var(--line)' : 'var(--bran)',
        background: 'transparent',
        color: disabled ? 'var(--line)' : 'var(--ink)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: disabled ? 'default' : 'pointer',
        fontSize: '14px', transition: 'all var(--transition)',
      }}
    >{children}</button>
  )
}

// ─── Branch mini-cards ──────────────────────────────────────────────────────

const STATUS_LIGHT: Record<string, string> = {
  verde: '#22C55E', amarillo: 'var(--wheat-deep)', rojo: 'var(--babka-orange)',
}

function BranchMiniCardRow({ cards, selected, onSelect, alertRecs }: {
  cards: BranchCard[]
  selected: BranchId | 'todas'
  onSelect: (id: BranchId | 'todas') => void
  alertRecs: Reconciliation[]
}) {
  const alertBranchIds = new Set(alertRecs.map(r => r.branchId))
  const hasPendiente   = alertRecs.some(r => r.status === 'pendiente')
  const todasLight     = alertRecs.length > 0 ? 'amarillo' : 'verde'
  const todasAlert     = alertRecs.length > 0
    ? (hasPendiente ? 'pendiente' : 'descuadre') as 'pendiente' | 'descuadre'
    : undefined
  const totalUnits     = cards.reduce((s, c) => s + c.totalUnits, 0)

  return (
    <div style={{
      display: 'flex', gap: 'var(--space-2)',
      overflowX: 'auto', paddingBottom: '4px',
      WebkitOverflowScrolling: 'touch',
      scrollbarWidth: 'none', msOverflowStyle: 'none',
    } as React.CSSProperties}>
      <BranchMiniCard
        shortName="Todas" units={totalUnits}
        light={todasLight} isSelected={selected === 'todas'}
        alertStatus={todasAlert}
        onClick={() => onSelect('todas')}
      />
      {cards.map(c => (
        <BranchMiniCard
          key={c.branchId}
          shortName={c.shortName} units={c.totalUnits}
          light={c.light} isSelected={selected === c.branchId}
          alertStatus={alertBranchIds.has(c.branchId)
            ? (c.status === 'pendiente' ? 'pendiente' : 'descuadre')
            : undefined}
          onClick={() => onSelect(c.branchId)}
        />
      ))}
    </div>
  )
}

function BranchMiniCard({ shortName, units, light, isSelected, alertStatus, onClick }: {
  shortName: string; units: number; light: string
  isSelected: boolean; alertStatus?: 'descuadre' | 'pendiente'; onClick: () => void
}) {
  const alertColor = alertStatus === 'pendiente' ? 'var(--babka-orange)' : 'var(--wheat-deep)'
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: '7px',
        padding: '6px 10px',
        borderRadius: 'var(--r-pill)', border: '1.5px solid',
        borderColor: isSelected ? 'var(--babka-blue)' : 'var(--line)',
        background: isSelected ? 'var(--babka-blue)' : 'var(--flour)',
        cursor: 'pointer',
        transition: 'all var(--transition)', textAlign: 'left',
        position: 'relative', whiteSpace: 'nowrap',
      }}
    >
      <div style={{
        width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
        background: isSelected ? 'rgba(255,255,255,0.7)' : STATUS_LIGHT[light] ?? '#ccc',
      }} />
      <span style={{
        fontFamily: 'var(--font-body)', fontWeight: 'var(--weight-bold)',
        fontSize: 'var(--text-xs)', color: isSelected ? '#fff' : 'var(--ink)',
      }}>{shortName}</span>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: '10px',
        color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--bran)',
      }}>{units}u</span>
      {alertStatus && (
        <div style={{
          position: 'absolute', top: '-3px', right: '-3px',
          width: '8px', height: '8px', borderRadius: '50%',
          background: alertColor, boxShadow: `0 0 0 1.5px var(--flour)`,
        }} />
      )}
    </button>
  )
}

// ─── Alert banner (compact, before table) ──────────────────────────────────

function AlertBanner({ rec, onNavigate }: {
  rec: Reconciliation; onNavigate?: (page: string) => void
}) {
  const branch   = BRANCHES.find(b => b.id === rec.branchId)!
  const hitlItem = HITL_REQUESTS.find(r => r.branchId === rec.branchId && r.reconciliationId === rec.id)
    ?? HITL_REQUESTS.find(r => r.branchId === rec.branchId)

  const isDescuadre  = rec.status === 'descuadre'
  const accentColor  = isDescuadre ? 'var(--wheat-deep)' : 'var(--babka-orange)'
  const borderColor  = isDescuadre ? 'rgba(230,178,60,0.45)' : 'rgba(220,122,51,0.4)'
  const bg           = isDescuadre ? 'rgba(230,178,60,0.05)' : 'rgba(220,122,51,0.05)'

  const message = hitlItem?.agentMessage ?? (
    isDescuadre
      ? 'Hay unidades no contabilizadas en esta conciliación.'
      : 'Sin actividad registrada desde apertura. El gerente no ha iniciado el proceso de cierre.'
  )

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
      padding: '9px var(--space-4)',
      borderRadius: 'var(--r-md)',
      border: `1.5px solid ${borderColor}`,
      background: bg,
    }}>
      <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: accentColor, flexShrink: 0 }} />
      <span style={{
        fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-black)',
        fontSize: 'var(--text-sm)', color: 'var(--ink)', flexShrink: 0,
      }}>
        {branch.shortName}
      </span>
      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--bran)', flexShrink: 0 }}>·</span>
      <span style={{
        fontSize: 'var(--text-xs)', color: 'var(--ink-soft)', flex: 1,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {message}
      </span>
      {onNavigate && (
        <button
          onClick={() => onNavigate('hitl')}
          style={{
            flexShrink: 0, padding: '4px 12px',
            borderRadius: 'var(--r-pill)', border: `1.5px solid ${accentColor}`,
            background: 'transparent', color: accentColor,
            fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 'var(--weight-bold)',
            cursor: 'pointer', letterSpacing: 'var(--tracking-wide)',
            textTransform: 'uppercase', whiteSpace: 'nowrap',
            transition: 'all var(--transition)',
          }}
        >
          Revisión →
        </button>
      )}
    </div>
  )
}

// ─── Aggregated table (Todas + today) ──────────────────────────────────────

function AggregatedTable({ isMobile, notesMap, openNote, addNote }: {
  isMobile: boolean
  notesMap: NotesMap
  openNote: (target: NoteTarget, rect: DOMRect, onRequestAgent?: () => void) => void
  addNote: (target: NoteTarget, content: string) => void
}) {
  const [sort, setSort] = useState<{ key: ColKey | null; dir: SortDir }>({ key: null, dir: null })
  const [activeCell, setActiveCell] = useState<ActiveCell>(null)
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)
  const { colWidths, startResize } = useColResize()

  const handleSort = (key: ColKey) => {
    setSort(prev => ({
      key,
      dir: prev.key === key ? (prev.dir === 'asc' ? 'desc' : prev.dir === 'desc' ? null : 'asc') : 'asc',
    }))
  }

  const rowMap = new Map<string, AggRow>()
  const skuToItemIds = new Map<string, string[]>()
  for (const rec of RECONCILIATIONS) {
    for (const item of rec.items) {
      const ids = skuToItemIds.get(item.sku) ?? []
      if (!ids.length) skuToItemIds.set(item.sku, ids)
      if (!ids.includes(item.id)) ids.push(item.id)

      const ex = rowMap.get(item.sku)
      if (ex) {
        ex.opening    += item.opening;    ex.produced   += item.produced
        ex.closing    += item.closing;    ex.diferencia += item.diferencia
        ex.vendido    += item.vendido;    ex.traspaso   += item.traspaso
        ex.merma      += item.merma;      ex.personal   += item.personal
        ex.evento     += item.evento;     ex.muestra    += item.muestra
        ex.devolucion += item.devolucion
      } else {
        rowMap.set(item.sku, {
          sku: item.sku, productName: item.productName,
          opening: item.opening, produced: item.produced, closing: item.closing, diferencia: item.diferencia,
          vendido: item.vendido, traspaso: item.traspaso, merma: item.merma, personal: item.personal,
          evento: item.evento, muestra: item.muestra, devolucion: item.devolucion,
        })
      }
    }
  }

  const handleAggCellClick = (row: AggRow, destino: DestinoKey, label: string) => {
    const val = row[destino]
    if (val === 0) return
    const ids = skuToItemIds.get(row.sku) ?? []
    setActiveCell(prev =>
      prev && prev.sku === row.sku && prev.destino === (destino as ReconciliationDestino)
        ? null
        : { itemIds: ids, sku: row.sku, destino: destino as ReconciliationDestino, label, productName: row.productName, total: val, noteKey: `${row.sku}:${destino}` }
    )
  }
  let rows = Array.from(rowMap.values()).sort((a, b) => b.vendido - a.vendido)
  if (sort.key && sort.dir) {
    const k = sort.key, d = sort.dir
    rows = [...rows].sort((a, b) => {
      const av = a[k as keyof AggRow], bv = b[k as keyof AggRow]
      const cmp = typeof av === 'number' ? (av as number) - (bv as number) : String(av).localeCompare(String(bv))
      return d === 'asc' ? cmp : -cmp
    })
  }

  const activeDestinos = DESTINOS.filter(d => rows.some(r => r[d.key as DestinoKey] > 0))
  const totals = rows.reduce(
    (acc, r) => ({
      opening: acc.opening + r.opening, produced: acc.produced + r.produced,
      closing: acc.closing + r.closing, diferencia: acc.diferencia + r.diferencia,
      vendido: acc.vendido + r.vendido, traspaso: acc.traspaso + r.traspaso,
      merma: acc.merma + r.merma, personal: acc.personal + r.personal,
      evento: acc.evento + r.evento, muestra: acc.muestra + r.muestra, devolucion: acc.devolucion + r.devolucion,
    }),
    { opening: 0, produced: 0, closing: 0, diferencia: 0, vendido: 0, traspaso: 0, merma: 0, personal: 0, evento: 0, muestra: 0, devolucion: 0 }
  )

  const cw = (k: string) => colWidths[k] ?? COL_DEFAULTS[k]
  const rs = (k: string) => (e: React.MouseEvent, el: HTMLTableCellElement) => startResize(k, e, el)

  return (
    <div style={{ background: 'var(--flour)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
      <div style={{ padding: isMobile ? 'var(--space-4)' : 'var(--space-6)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ marginBottom: '4px', fontSize: isMobile ? 'var(--text-xl)' : 'var(--text-2xl)' }}>Acumulado por producto</h3>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--bran)' }}>
              {RECONCILIATIONS.length} sucursales · todas las líneas
            </div>
          </div>
          <span style={{
            background: 'rgba(34,197,94,0.12)', color: '#16a34a',
            fontSize: '12px', fontWeight: 'var(--weight-bold)', fontFamily: 'var(--font-mono)',
            padding: '5px 14px', borderRadius: 'var(--r-pill)', whiteSpace: 'nowrap',
          }}>
            {totals.vendido} vendidos
          </span>
        </div>
      </div>

      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', minWidth: isMobile ? '480px' : 'auto' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--line)' }}>
              <Th align="left" sortable sortDir={sort.key === 'productName' ? sort.dir : null} onSort={() => handleSort('productName')} width={cw('productName')} onResizeStart={rs('productName')}>Producto</Th>
              <Th sortable sortDir={sort.key === 'opening' ? sort.dir : null} onSort={() => handleSort('opening')} width={cw('opening')} onResizeStart={rs('opening')}>Apertura</Th>
              <Th sortable sortDir={sort.key === 'produced' ? sort.dir : null} onSort={() => handleSort('produced')} width={cw('produced')} onResizeStart={rs('produced')}>Prod.</Th>
              {activeDestinos.map(d => (
                <Th key={d.key} sortable sortDir={sort.key === d.key ? sort.dir : null} onSort={() => handleSort(d.key as ColKey)} width={cw(d.key)} onResizeStart={rs(d.key)}>{d.label}</Th>
              ))}
              <Th sortable sortDir={sort.key === 'closing' ? sort.dir : null} onSort={() => handleSort('closing')} width={cw('closing')} onResizeStart={rs('closing')}>Cierre</Th>
              <Th sortable sortDir={sort.key === 'diferencia' ? sort.dir : null} onSort={() => handleSort('diferencia')} width={cw('diferencia')} onResizeStart={rs('diferencia')}>Δ</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const rowNoteCount = notesMap.get(row.sku)?.length ?? 0
              return (
                <tr
                  key={row.sku}
                  onMouseEnter={() => setHoveredRow(row.sku)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{ borderBottom: '1px solid var(--line)', background: idx % 2 === 0 ? 'transparent' : 'var(--flour-warm)' }}
                >
                  <td style={{ padding: 'var(--space-2) var(--space-3)', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <div style={{ fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-sm)', color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{row.productName}</div>
                      <span style={{ opacity: isMobile || hoveredRow === row.sku || rowNoteCount > 0 ? 1 : 0, transition: 'opacity 0.12s', flexShrink: 0 }}>
                        <NoteAnchor
                          target={{ type: 'row', key: row.sku, label: row.productName }}
                          count={rowNoteCount}
                          onOpen={openNote}
                        />
                      </span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--bran)', whiteSpace: 'nowrap' }}>{row.sku}</div>
                  </td>
                  <Td>{row.opening}</Td><Td>{row.produced}</Td>
                  {activeDestinos.map(d => {
                    const isActive = activeCell?.sku === row.sku && activeCell.destino === d.key
                    const val = row[d.key as DestinoKey]
                    return (
                      <Td key={d.key} highlight={d.key === 'vendido'} clickable={val > 0} active={isActive}
                        onClick={val > 0 ? () => handleAggCellClick(row, d.key as DestinoKey, d.label) : undefined}
                      >{val}</Td>
                    )
                  })}
                  <Td>{row.closing}</Td>
                  <Td accent={row.diferencia !== 0}>{row.diferencia === 0 ? '—' : `+${row.diferencia}`}</Td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: '2px solid var(--line)', background: 'var(--crumb)' }}>
              <td style={{ padding: 'var(--space-2) var(--space-3)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-sm)', whiteSpace: 'nowrap' }}>Total</td>
              <Td bold>{totals.opening}</Td><Td bold>{totals.produced}</Td>
              {activeDestinos.map(d => <Td key={d.key} bold>{totals[d.key as DestinoKey]}</Td>)}
              <Td bold>{totals.closing}</Td>
              <Td bold accent={totals.diferencia !== 0}>{totals.diferencia === 0 ? '0' : `+${totals.diferencia}`}</Td>
            </tr>
          </tfoot>
        </table>
      </div>
      {activeCell && <CellModal cell={activeCell} onClose={() => setActiveCell(null)} notes={notesMap.get(activeCell.noteKey) ?? []} onAddNote={(content) => addNote({ type: 'cell', key: activeCell.noteKey, label: activeCell.label }, content)} />}
    </div>
  )
}

// ─── Historical view (past dates) ──────────────────────────────────────────

const STATUS_COLOR: Record<string, string> = {
  cerrado: '#22C55E', abierto: 'var(--babka-blue)',
  descuadre: 'var(--wheat-deep)', pendiente: 'var(--babka-orange)',
}
const STATUS_LABEL: Record<string, string> = {
  cerrado: 'Cerrado', abierto: 'Abierto', descuadre: 'Descuadre', pendiente: 'Sin reportar',
}

function HistoricalView({ branchCards, selected }: {
  branchCards: BranchCard[]; selected: BranchId | 'todas'
}) {
  const display = selected === 'todas' ? branchCards : branchCards.filter(c => c.branchId === selected)
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: selected === 'todas' ? 'repeat(auto-fill, minmax(160px, 1fr))' : '1fr',
      gap: 'var(--space-3)',
    }}>
      {display.map(card => (
        <div key={card.branchId} style={{
          background: 'var(--flour)', borderRadius: 'var(--r-lg)',
          boxShadow: 'var(--shadow-md)', padding: 'var(--space-6)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-black)', fontSize: 'var(--text-lg)', color: 'var(--ink)' }}>
              {card.shortName}
            </span>
            <span style={{
              background: `${STATUS_COLOR[card.status]}20`, color: STATUS_COLOR[card.status],
              fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em',
              textTransform: 'uppercase', padding: '3px 10px', borderRadius: 'var(--r-pill)',
              fontFamily: 'var(--font-body)',
            }}>
              {STATUS_LABEL[card.status]}
            </span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--bran)' }}>
            {card.totalUnits > 0 ? `${card.totalUnits} unidades` : 'Sin actividad'}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── RecDetail (item-level table, today only) ───────────────────────────────

type ActiveCell = { itemIds: string[]; sku: string; destino: ReconciliationDestino; label: string; productName: string; total: number; noteKey: string } | null

function RecDetail({ rec, isMobile, onNavigate, onPinContext, notesMap, openNote, addNote }: {
  rec: Reconciliation; isMobile: boolean
  onNavigate?: (page: string) => void; onPinContext?: (ctx: ChatContext) => void
  notesMap: NotesMap
  openNote: (target: NoteTarget, rect: DOMRect, onRequestAgent?: () => void) => void
  addNote: (target: NoteTarget, content: string) => void
}) {
  const branch = BRANCHES.find(b => b.id === rec.branchId)!
  const activeDestinos = DESTINOS.filter(d => rec.items.some(i => (i[d.key] as number) > 0))
  const [activeCell, setActiveCell] = useState<ActiveCell>(null)
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)
  const [sort, setSort] = useState<{ key: ColKey | null; dir: SortDir }>({ key: null, dir: null })
  const { colWidths, startResize } = useColResize()

  const makeRequestAgent = () => {
    if (onPinContext && onNavigate) {
      onPinContext({ type: 'reconciliation', reconciliationId: rec.id, branchId: rec.branchId, branchName: branch.name, totalDiferencia: rec.totalDiferencia, closedBy: rec.closedBy, closedAt: rec.closedAt })
      onNavigate('chat')
    }
  }

  const handleSort = (key: ColKey) => {
    setSort(prev => ({
      key,
      dir: prev.key === key ? (prev.dir === 'asc' ? 'desc' : prev.dir === 'desc' ? null : 'asc') : 'asc',
    }))
  }

  const handleCellClick = (item: ReconciliationItem, destino: ReconciliationDestino, label: string) => {
    const total = item[destino] as number
    if (total === 0) return
    setActiveCell(prev =>
      prev && prev.sku === item.sku && prev.destino === destino
        ? null
        : { itemIds: [item.id], sku: item.sku, destino, label, productName: item.productName, total, noteKey: `${item.id}:${destino}` }
    )
  }

  let items = rec.items
  if (sort.key && sort.dir) {
    const k = sort.key, d = sort.dir
    items = [...items].sort((a, b) => {
      const av = a[k as keyof ReconciliationItem], bv = b[k as keyof ReconciliationItem]
      const cmp = typeof av === 'number' ? (av as number) - (bv as number) : String(av).localeCompare(String(bv))
      return d === 'asc' ? cmp : -cmp
    })
  }

  const cw = (k: string) => colWidths[k] ?? COL_DEFAULTS[k]
  const rs = (k: string) => (e: React.MouseEvent, el: HTMLTableCellElement) => startResize(k, e, el)

  return (
    <div style={{ background: 'var(--flour)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
      <div style={{ padding: isMobile ? 'var(--space-4)' : 'var(--space-6)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: '4px' }}>
              <h3 style={{ margin: 0, fontSize: isMobile ? 'var(--text-xl)' : 'var(--text-2xl)' }}>{branch.name}</h3>
              <NoteAnchor
                target={{ type: 'branch', key: rec.branchId, label: branch.name }}
                count={notesMap.get(rec.branchId)?.length ?? 0}
                onOpen={(target, rect) => openNote(target, rect, makeRequestAgent)}
              />
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--bran)' }}>
              {rec.closedBy ? `Cerrado por ${rec.closedBy}` : branch.manager}
              {rec.closedAt && ` · ${new Date(rec.closedAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`}
            </div>
          </div>
          <DeltaBadge value={rec.totalDiferencia} />
        </div>
      </div>

      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', minWidth: isMobile ? '480px' : 'auto' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--line)' }}>
              <Th align="left" sortable sortDir={sort.key === 'productName' ? sort.dir : null} onSort={() => handleSort('productName')} width={cw('productName')} onResizeStart={rs('productName')}>Producto</Th>
              <Th sortable sortDir={sort.key === 'opening' ? sort.dir : null} onSort={() => handleSort('opening')} width={cw('opening')} onResizeStart={rs('opening')}>Apertura</Th>
              <Th sortable sortDir={sort.key === 'produced' ? sort.dir : null} onSort={() => handleSort('produced')} width={cw('produced')} onResizeStart={rs('produced')}>Prod.</Th>
              {activeDestinos.map(d => (
                <Th key={d.key} sortable sortDir={sort.key === d.key ? sort.dir : null} onSort={() => handleSort(d.key as ColKey)} width={cw(d.key)} onResizeStart={rs(d.key)}>{d.label}</Th>
              ))}
              <Th sortable sortDir={sort.key === 'closing' ? sort.dir : null} onSort={() => handleSort('closing')} width={cw('closing')} onResizeStart={rs('closing')}>Cierre</Th>
              <Th sortable sortDir={sort.key === 'diferencia' ? sort.dir : null} onSort={() => handleSort('diferencia')} width={cw('diferencia')} onResizeStart={rs('diferencia')}>Δ</Th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const rowNoteCount = notesMap.get(item.id)?.length ?? 0
              return (
                <tr
                  key={item.id}
                  onMouseEnter={() => setHoveredRow(item.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{ borderBottom: '1px solid var(--line)', background: idx % 2 === 0 ? 'transparent' : 'var(--flour-warm)' }}
                >
                  <td style={{ padding: 'var(--space-2) var(--space-3)', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <div style={{ fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-sm)', color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{item.productName}</div>
                      <span style={{ opacity: isMobile || hoveredRow === item.id || rowNoteCount > 0 ? 1 : 0, transition: 'opacity 0.12s', flexShrink: 0 }}>
                        <NoteAnchor
                          target={{ type: 'row', key: item.id, label: item.productName }}
                          count={rowNoteCount}
                          onOpen={(target, rect) => openNote(target, rect, makeRequestAgent)}
                        />
                      </span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--bran)', whiteSpace: 'nowrap' }}>{item.sku}</div>
                  </td>
                  <Td>{item.opening}</Td><Td>{item.produced}</Td>
                  {activeDestinos.map(d => {
                    const isActive = activeCell?.sku === item.sku && activeCell?.destino === d.key
                    const val = item[d.key] as number
                    return (
                      <Td key={d.key} highlight={d.key === 'vendido'} clickable={val > 0} active={isActive}
                        onClick={val > 0 ? () => handleCellClick(item, d.key as ReconciliationDestino, d.label) : undefined}
                      >{val}</Td>
                    )
                  })}
                  <Td>{item.closing}</Td>
                  <Td accent={item.diferencia !== 0}>{item.diferencia === 0 ? '—' : `+${item.diferencia}`}</Td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: '2px solid var(--line)', background: 'var(--crumb)' }}>
              <td style={{ padding: 'var(--space-2) var(--space-3)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-sm)', whiteSpace: 'nowrap' }}>Total</td>
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

      {activeCell && <CellModal cell={activeCell} onClose={() => setActiveCell(null)} notes={notesMap.get(activeCell.noteKey) ?? []} onAddNote={(content) => addNote({ type: 'cell', key: activeCell.noteKey, label: activeCell.label }, content)} onRequestAgent={makeRequestAgent} />}
    </div>
  )
}

// ─── Table helpers ──────────────────────────────────────────────────────────

function Th({ children, align = 'right', sortDir, sortable, onSort, width, onResizeStart }: {
  children: React.ReactNode; align?: 'left' | 'right'
  sortDir?: SortDir; sortable?: boolean; onSort?: () => void
  width?: number; onResizeStart?: (e: React.MouseEvent, el: HTMLTableCellElement) => void
}) {
  const ref = useRef<HTMLTableCellElement>(null)
  return (
    <th
      ref={ref}
      onClick={sortable ? onSort : undefined}
      style={{
        padding: 'var(--space-2) var(--space-3)',
        paddingRight: onResizeStart ? 'calc(var(--space-3) + 6px)' : 'var(--space-3)',
        textAlign: align,
        fontSize: '10px', fontWeight: 'var(--weight-bold)',
        letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--bran)',
        fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
        cursor: sortable ? 'pointer' : 'default',
        userSelect: 'none',
        position: 'relative',
        width: width != null ? `${width}px` : undefined,
        overflow: 'hidden',
      }}
    >
      {children}
      {sortable && (
        <span style={{ marginLeft: '4px', fontSize: '9px', opacity: sortDir != null ? 1 : 0.3, verticalAlign: 'middle' }}>
          {sortDir === 'asc' ? '↑' : sortDir === 'desc' ? '↓' : '↕'}
        </span>
      )}
      {onResizeStart && (
        <ResizeHandle onMouseDown={e => { e.stopPropagation(); if (ref.current) onResizeStart(e, ref.current) }} />
      )}
    </th>
  )
}

function ResizeHandle({ onMouseDown }: { onMouseDown: (e: React.MouseEvent) => void }) {
  const [active, setActive] = useState(false)
  return (
    <div
      onMouseDown={onMouseDown}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      style={{
        position: 'absolute', right: 0, top: '15%', bottom: '15%', width: '4px',
        cursor: 'col-resize', borderRadius: '2px',
        background: active ? 'var(--babka-blue)' : 'var(--line)',
        transition: 'background 0.12s',
      }}
    />
  )
}

function Td({ children, bold, highlight, accent, clickable, active, onClick, noteCount, onNoteClick }: {
  children: React.ReactNode
  bold?: boolean; highlight?: boolean; accent?: boolean
  clickable?: boolean; active?: boolean; onClick?: () => void
  noteCount?: number; onNoteClick?: (rect: DOMRect) => void
}) {
  const [hovered, setHovered] = useState(false)
  const ref = useRef<HTMLTableCellElement>(null)
  return (
    <td
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => clickable && setHovered(true)}
      onMouseLeave={() => clickable && setHovered(false)}
      style={{
        padding: 'var(--space-3)', textAlign: 'right',
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)',
        color: accent ? 'var(--wheat-deep)' : highlight ? 'var(--babka-blue)' : 'var(--ink-soft)',
        fontWeight: bold || accent ? 'var(--weight-bold)' : 'var(--weight-regular)',
        whiteSpace: 'nowrap',
        cursor: clickable ? 'pointer' : 'default',
        background: active ? 'rgba(59,130,246,0.1)' : hovered ? 'rgba(59,130,246,0.05)' : 'transparent',
        borderBottom: active ? '2px solid var(--babka-blue)' : '2px solid transparent',
        transition: 'background 0.12s',
        position: 'relative',
      }}
    >
      {clickable ? (
        <span style={{
          textDecoration: 'underline',
          textDecorationStyle: 'dotted',
          textDecorationColor: 'rgba(59,130,246,0.4)',
          textUnderlineOffset: '2px',
        }}>{children}</span>
      ) : children}
      {onNoteClick && noteCount != null && noteCount > 0 && (
        <button
          onClick={e => {
            e.stopPropagation()
            if (ref.current) onNoteClick(ref.current.getBoundingClientRect())
          }}
          title={`${noteCount} nota${noteCount > 1 ? 's' : ''}`}
          style={{
            position: 'absolute', top: '2px', right: '2px',
            background: 'var(--babka-blue)', color: '#fff',
            border: 'none', borderRadius: '50%',
            width: '14px', height: '14px',
            fontSize: '8px', fontWeight: 'var(--weight-bold)', fontFamily: 'var(--font-mono)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', lineHeight: 1,
          }}
        >{noteCount > 9 ? '9+' : noteCount}</button>
      )}
    </td>
  )
}

const SOURCE_META: Record<string, { icon: string; color: string; label: string }> = {
  pos:      { icon: '⊡', color: 'var(--babka-blue)',  label: 'POS' },
  manual:   { icon: '✎', color: 'var(--wheat-deep)',   label: 'Manual' },
  traspaso: { icon: '⇄', color: '#8B5CF6',            label: 'Traspaso' },
  sistema:  { icon: '⚙', color: 'var(--bran)',         label: 'Sistema' },
}

function CellModal({ cell, onClose, notes = [], onAddNote, onRequestAgent }: {
  cell: NonNullable<ActiveCell>; onClose: () => void
  notes?: NoteEntry[]; onAddNote?: (content: string) => void; onRequestAgent?: () => void
}) {
  const [noteInput, setNoteInput] = useState('')
  const events: ItemEvent[] = cell.itemIds.flatMap(id => getItemEvents(id, cell.destino))
  const registeredTotal = events.reduce((s, e) => s + e.quantity, 0)
  const unaccounted     = cell.total - registeredTotal

  const handleSaveNote = () => {
    if (!noteInput.trim() || !onAddNote) return
    onAddNote(noteInput.trim())
    setNoteInput('')
  }
  const handleRequestAgent = () => {
    if (noteInput.trim() && onAddNote) { onAddNote(noteInput.trim()); setNoteInput('') }
    onRequestAgent?.()
    onClose()
  }

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0,
        background: 'rgba(26,23,20,0.4)',
        backdropFilter: 'blur(2px)',
        zIndex: 300,
      }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '100%', maxWidth: '640px', maxHeight: 'calc(100vh - 40px)',
        background: 'var(--flour)',
        borderRadius: 'var(--r-lg)',
        boxShadow: 'var(--shadow-xl)',
        zIndex: 301,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: 'var(--space-4)',
          borderBottom: '2px solid var(--babka-blue)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
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

        <div style={{ overflowY: 'auto', padding: 'var(--space-4)', flex: 1 }}>
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
                    background: 'var(--flour-warm)', border: '1px solid var(--line)',
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', paddingTop: '4px', borderTop: '1px solid var(--line)', marginTop: '2px' }}>
                <span style={{ fontSize: '10px', color: 'var(--bran)' }}>{events.length} evento{events.length !== 1 ? 's' : ''} · total registrado</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-black)', color: registeredTotal === cell.total ? '#16a34a' : 'var(--wheat-deep)' }}>
                  {registeredTotal} / {cell.total}
                </span>
              </div>
            </div>
          )}

          <div style={{ marginTop: 'var(--space-4)', borderTop: '1px solid var(--line)', paddingTop: 'var(--space-3)' }}>
            <div style={{ fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--bran)', marginBottom: 'var(--space-2)' }}>Notas</div>
            {notes.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                {notes.map(note => (
                  <div key={note.id} style={{ borderLeft: '2px solid var(--babka-blue)', paddingLeft: 'var(--space-3)' }}>
                    <div style={{ fontSize: '10px', color: 'var(--bran)', marginBottom: '2px' }}>{note.actor} · {note.time}</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink)', lineHeight: 1.4 }}>{note.content}</div>
                  </div>
                ))}
              </div>
            )}
            <textarea
              value={noteInput}
              onChange={e => setNoteInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSaveNote() } }}
              placeholder="Añadir nota..."
              style={{
                width: '100%', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--r-md)',
                border: '1px solid var(--line)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
                color: 'var(--ink)', resize: 'none', minHeight: '52px',
                background: 'var(--flour-warm)', boxSizing: 'border-box',
              } as React.CSSProperties}
            />
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
              <button
                onClick={handleSaveNote}
                disabled={!noteInput.trim()}
                style={{
                  flex: 1, padding: '6px var(--space-3)', borderRadius: 'var(--r-md)',
                  border: '1px solid var(--line)',
                  background: noteInput.trim() ? 'var(--babka-blue)' : 'var(--line)',
                  color: noteInput.trim() ? '#fff' : 'var(--bran)',
                  fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--weight-bold)', cursor: noteInput.trim() ? 'pointer' : 'default',
                }}
              >Guardar</button>
              {onRequestAgent && (notes.length > 0 || noteInput.trim()) && (
                <button
                  onClick={handleRequestAgent}
                  style={{
                    flex: 1, padding: '6px var(--space-3)', borderRadius: 'var(--r-md)',
                    border: '1px solid var(--babka-blue)', background: 'transparent',
                    color: 'var(--babka-blue)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--weight-bold)', cursor: 'pointer',
                  }}
                >Dante →</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Contextual annotation components ──────────────────────────────────────

function BubbleIcon({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="currentColor">
      <path d="M1 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H6.5L4.5 10V8H2a1 1 0 0 1-1-1V2z"/>
    </svg>
  )
}

function NoteAnchor({ target, count, onOpen }: {
  target: NoteTarget; count: number
  onOpen: (target: NoteTarget, rect: DOMRect) => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  return (
    <button
      ref={ref}
      onClick={e => {
        e.stopPropagation()
        if (ref.current) onOpen(target, ref.current.getBoundingClientRect())
      }}
      title={count > 0 ? `${count} nota${count > 1 ? 's' : ''}` : 'Añadir nota'}
      style={{
        background: count > 0 ? 'rgba(59,130,246,0.1)' : 'none',
        border: count > 0 ? '1px solid rgba(59,130,246,0.25)' : '1px solid transparent',
        cursor: 'pointer',
        padding: '6px 8px',
        minWidth: '28px', minHeight: '28px',
        borderRadius: 'var(--r-sm)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '3px',
        color: count > 0 ? 'var(--babka-blue)' : 'var(--bran)',
        fontSize: '11px', lineHeight: 1,
        transition: 'all 0.12s',
        fontFamily: 'var(--font-body)',
        flexShrink: 0,
      }}
    >
      <BubbleIcon />
      {count > 0 && (
        <span style={{ fontSize: '9px', fontWeight: 'var(--weight-bold)', fontFamily: 'var(--font-mono)' }}>
          {count}
        </span>
      )}
    </button>
  )
}

function NoteSheet({ activeNote, notes, isMobile, onClose, onAdd }: {
  activeNote: ActiveNoteState
  notes: NoteEntry[]
  isMobile: boolean
  onClose: () => void
  onAdd: (target: NoteTarget, content: string) => void
}) {
  const [input, setInput] = useState('')
  const { rect } = activeNote
  const SHEET_W = 300

  const handleSave = () => {
    if (!input.trim()) return
    onAdd(activeNote.target, input.trim())
    setInput('')
  }
  const handleRequestAgent = () => {
    if (input.trim()) {
      onAdd(activeNote.target, input.trim())
      setInput('')
    }
    activeNote.onRequestAgent?.()
    onClose()
  }

  const sheetStyle: React.CSSProperties = isMobile ? {
    position: 'fixed', bottom: 0, left: 0, right: 0,
    borderRadius: 'var(--r-lg) var(--r-lg) 0 0',
    maxHeight: '60vh',
  } : (() => {
    const below = rect.bottom + 8
    const top = below + 360 > window.innerHeight ? Math.max(8, rect.top - 368) : below
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - SHEET_W - 8))
    return { position: 'fixed', top, left, width: `${SHEET_W}px`, maxHeight: '380px', borderRadius: 'var(--r-lg)' }
  })()

  const TYPE_LABEL: Record<NoteTargetType, string> = { row: 'Fila', cell: 'Celda', branch: 'Sucursal', day: 'Día' }

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: isMobile ? 'rgba(26,23,20,0.4)' : 'transparent',
          backdropFilter: isMobile ? 'blur(2px)' : 'none',
          zIndex: 302,
        }}
      />
      <div style={{
        ...sheetStyle,
        background: 'var(--flour)',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--line)',
        zIndex: 303,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: 'var(--space-3) var(--space-4)',
          borderBottom: '1px solid var(--line)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: '9px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--bran)', background: 'var(--flour-warm)', padding: '2px 7px', borderRadius: 'var(--r-pill)', border: '1px solid var(--line)' }}>
              {TYPE_LABEL[activeNote.target.type]}
            </span>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
              {activeNote.target.label}
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--bran)', fontSize: '16px', lineHeight: 1, padding: '0 2px', flexShrink: 0 }}>×</button>
        </div>

        {notes.length > 0 && (
          <div style={{ overflowY: 'auto', flex: 1, padding: 'var(--space-3) var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {notes.map(note => (
              <div key={note.id} style={{ borderLeft: '2px solid var(--babka-blue)', paddingLeft: 'var(--space-3)' }}>
                <div style={{ fontSize: '10px', color: 'var(--bran)', marginBottom: '2px' }}>{note.actor} · {note.time}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink)', lineHeight: 1.4 }}>{note.content}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ padding: 'var(--space-3) var(--space-4)', borderTop: notes.length > 0 ? '1px solid var(--line)' : 'none', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSave() } }}
            placeholder="Añadir nota..."
            autoFocus
            style={{
              width: '100%', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--r-md)',
              border: '1px solid var(--line)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
              color: 'var(--ink)', resize: 'none', minHeight: '56px',
              background: 'var(--flour-warm)', boxSizing: 'border-box',
            } as React.CSSProperties}
          />
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button
              onClick={handleSave}
              disabled={!input.trim()}
              style={{
                flex: 1, padding: '6px var(--space-3)', borderRadius: 'var(--r-md)',
                border: '1px solid var(--line)',
                background: input.trim() ? 'var(--babka-blue)' : 'var(--line)',
                color: input.trim() ? '#fff' : 'var(--bran)',
                fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
                fontWeight: 'var(--weight-bold)', cursor: input.trim() ? 'pointer' : 'default',
              }}
            >Guardar</button>
            {activeNote.onRequestAgent && (notes.length > 0 || input.trim()) && (
              <button
                onClick={handleRequestAgent}
                style={{
                  flex: 1, padding: '6px var(--space-3)', borderRadius: 'var(--r-md)',
                  border: '1px solid var(--babka-blue)', background: 'transparent',
                  color: 'var(--babka-blue)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--weight-bold)', cursor: 'pointer',
                }}
              >Dante →</button>
            )}
          </div>
        </div>
      </div>
    </>
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

import type { DailySnapshot } from '../types'

// Historical daily snapshots June 1–7, 2026
// June 8 (today) lives in fixtures/branches.ts as BRANCH_SUMMARIES
export const DAILY_SNAPSHOTS: DailySnapshot[] = [
  // Jun 1 — all clean
  { date: '2026-06-01', branchId: 'centro',     status: 'cerrado',   light: 'verde',   diferencia: 0, totalUnits: 176 },
  { date: '2026-06-01', branchId: 'norte',       status: 'cerrado',   light: 'verde',   diferencia: 0, totalUnits: 198 },
  { date: '2026-06-01', branchId: 'montes-ame',  status: 'cerrado',   light: 'verde',   diferencia: 0, totalUnits: 135 },
  { date: '2026-06-01', branchId: 'marista',     status: 'cerrado',   light: 'verde',   diferencia: 0, totalUnits: 185 },
  { date: '2026-06-01', branchId: 'slowfood',    status: 'cerrado',   light: 'verde',   diferencia: 0, totalUnits: 88  },
  // Jun 2 — Centro descuadre +1
  { date: '2026-06-02', branchId: 'centro',      status: 'descuadre', light: 'amarillo', diferencia: 1, totalUnits: 181 },
  { date: '2026-06-02', branchId: 'norte',       status: 'cerrado',   light: 'verde',   diferencia: 0, totalUnits: 204 },
  { date: '2026-06-02', branchId: 'montes-ame',  status: 'cerrado',   light: 'verde',   diferencia: 0, totalUnits: 138 },
  { date: '2026-06-02', branchId: 'marista',     status: 'cerrado',   light: 'verde',   diferencia: 0, totalUnits: 192 },
  { date: '2026-06-02', branchId: 'slowfood',    status: 'cerrado',   light: 'verde',   diferencia: 0, totalUnits: 91  },
  // Jun 3 — all clean
  { date: '2026-06-03', branchId: 'centro',      status: 'cerrado',   light: 'verde',   diferencia: 0, totalUnits: 179 },
  { date: '2026-06-03', branchId: 'norte',       status: 'cerrado',   light: 'verde',   diferencia: 0, totalUnits: 207 },
  { date: '2026-06-03', branchId: 'montes-ame',  status: 'cerrado',   light: 'verde',   diferencia: 0, totalUnits: 140 },
  { date: '2026-06-03', branchId: 'marista',     status: 'cerrado',   light: 'verde',   diferencia: 0, totalUnits: 189 },
  { date: '2026-06-03', branchId: 'slowfood',    status: 'cerrado',   light: 'verde',   diferencia: 0, totalUnits: 93  },
  // Jun 4 — all clean
  { date: '2026-06-04', branchId: 'centro',      status: 'cerrado',   light: 'verde',   diferencia: 0, totalUnits: 183 },
  { date: '2026-06-04', branchId: 'norte',       status: 'cerrado',   light: 'verde',   diferencia: 0, totalUnits: 211 },
  { date: '2026-06-04', branchId: 'montes-ame',  status: 'cerrado',   light: 'verde',   diferencia: 0, totalUnits: 144 },
  { date: '2026-06-04', branchId: 'marista',     status: 'cerrado',   light: 'verde',   diferencia: 0, totalUnits: 196 },
  { date: '2026-06-04', branchId: 'slowfood',    status: 'cerrado',   light: 'verde',   diferencia: 0, totalUnits: 95  },
  // Jun 5 (Friday) — Norte descuadre +3, alto volumen
  { date: '2026-06-05', branchId: 'centro',      status: 'cerrado',   light: 'verde',   diferencia: 0, totalUnits: 210 },
  { date: '2026-06-05', branchId: 'norte',       status: 'descuadre', light: 'amarillo', diferencia: 3, totalUnits: 248 },
  { date: '2026-06-05', branchId: 'montes-ame',  status: 'cerrado',   light: 'verde',   diferencia: 0, totalUnits: 168 },
  { date: '2026-06-05', branchId: 'marista',     status: 'cerrado',   light: 'verde',   diferencia: 0, totalUnits: 221 },
  { date: '2026-06-05', branchId: 'slowfood',    status: 'cerrado',   light: 'verde',   diferencia: 0, totalUnits: 112 },
  // Jun 6 (Saturday) — pico semana, todo limpio
  { date: '2026-06-06', branchId: 'centro',      status: 'cerrado',   light: 'verde',   diferencia: 0, totalUnits: 235 },
  { date: '2026-06-06', branchId: 'norte',       status: 'cerrado',   light: 'verde',   diferencia: 0, totalUnits: 267 },
  { date: '2026-06-06', branchId: 'montes-ame',  status: 'cerrado',   light: 'verde',   diferencia: 0, totalUnits: 185 },
  { date: '2026-06-06', branchId: 'marista',     status: 'cerrado',   light: 'verde',   diferencia: 0, totalUnits: 238 },
  { date: '2026-06-06', branchId: 'slowfood',    status: 'cerrado',   light: 'verde',   diferencia: 0, totalUnits: 128 },
  // Jun 7 (Sunday) — Marista cerrado domingos
  { date: '2026-06-07', branchId: 'centro',      status: 'cerrado',   light: 'verde',   diferencia: 0, totalUnits: 158 },
  { date: '2026-06-07', branchId: 'norte',       status: 'cerrado',   light: 'verde',   diferencia: 0, totalUnits: 177 },
  { date: '2026-06-07', branchId: 'montes-ame',  status: 'cerrado',   light: 'verde',   diferencia: 0, totalUnits: 121 },
  { date: '2026-06-07', branchId: 'marista',     status: 'pendiente', light: 'rojo',    diferencia: 0, totalUnits: 0   },
  { date: '2026-06-07', branchId: 'slowfood',    status: 'cerrado',   light: 'verde',   diferencia: 0, totalUnits: 83  },
]

export function getSnapshotsForDate(date: string): DailySnapshot[] {
  return DAILY_SNAPSHOTS.filter(s => s.date === date)
}

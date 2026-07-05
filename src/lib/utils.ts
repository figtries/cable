import { DRUM_SIZES } from './constants'

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

export function fmt0(n: number): string {
  return Math.round(n).toLocaleString('id-ID')
}

export function fmtDec(n: number): string {
  return n.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

export function packDrums(
  lengths: number[],
  drumSize: number,
  splice: boolean
): { count: number; oversize: number[] } {
  const sorted = [...lengths].sort((a, b) => b - a)
  const drums: { r: number }[] = []
  const oversize: number[] = []

  for (const len of sorted) {
    if (len > drumSize) {
      if (splice) {
        const n = Math.ceil(len / drumSize)
        for (let i = 0; i < n; i++) drums.push({ r: 0 })
      } else {
        oversize.push(len)
        drums.push({ r: 0 })
      }
      continue
    }
    let placed = false
    for (const d of drums) {
      if (d.r >= len) { d.r -= len; placed = true; break }
    }
    if (!placed) drums.push({ r: drumSize - len })
  }
  return { count: drums.length, oversize }
}

export function bestDrumSize(lengths: number[], splice: boolean): number | null {
  const need = lengths.reduce((a, b) => a + b, 0)
  let best: { size: number; util: number } | null = null
  for (const d of DRUM_SIZES) {
    const pk = packDrums(lengths, d, splice)
    if (pk.oversize.length) continue
    const total = pk.count * d
    const util = total > 0 ? need / total : 0
    if (!best || util > best.util) best = { size: d, util }
  }
  return best ? best.size : null
}

export interface RunParams {
  horizontal: number
  vertical: number
  bends: number
  termPerEnd: number
  tolerance: number
}

export interface RunResult {
  horizontal: number
  vertical: number
  routed: number
  bendsAdd: number
  termAdd: number
  installed: number
  tolAdd: number
  cut: number
}

export function computeRun(p: RunParams): RunResult {
  const routed = p.horizontal + p.vertical
  const bendsAdd = routed * (p.bends / 100)
  const termAdd = p.termPerEnd * 2
  const installed = routed + bendsAdd + termAdd
  const tolAdd = installed * (p.tolerance / 100)
  const cut = Math.ceil(installed + tolAdd)
  return { horizontal: p.horizontal, vertical: p.vertical, routed, bendsAdd, termAdd, installed, tolAdd, cut }
}

'use client'

import { Trash2 } from 'lucide-react'
import { Cable } from '@/lib/types'
import { CAT_CONFIG } from '@/lib/constants'

function hl(text: string, tokens: string[]): React.ReactNode {
  if (!tokens.length || !text) return text
  const escaped = tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const parts = text.split(new RegExp(`(${escaped.join('|')})`, 'gi'))
  return parts.map((p, i) =>
    tokens.some(t => p.toLowerCase() === t.toLowerCase())
      ? <mark key={i} className="bg-yellow-100 text-inherit rounded-sm px-px">{p}</mark>
      : p
  )
}

interface CableTableProps {
  cables: Cable[]
  tokens: string[]
  onDelete: (id: string) => void
}

const COL_HEADS = ['Cable Information', 'Area Location', 'Tool Connection', 'Route Deployment', 'Length Estimate', '']

export default function CableTable({ cables, tokens, onDelete }: CableTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50/80 border-b border-gray-100">
            {COL_HEADS.map((h, i) => (
              <th
                key={i}
                className={`py-3 px-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap
                  ${i === 4 ? 'text-right' : 'text-left'}
                  ${i === 5 ? 'w-10' : ''}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cables.map((cable, rowIdx) => {
            const cat = CAT_CONFIG[cable.cat] ?? CAT_CONFIG['instrument']
            const toolConn = [cable.equip, cable.jb].filter(Boolean).join(' · ') || '—'
            const route = cable.from || cable.to
              ? `${cable.from || '?'} → ${cable.to || '?'}`
              : '—'

            return (
              <tr
                key={cable.id}
                style={{ animationDelay: `${rowIdx * 30}ms` }}
                className="animate-fade-in border-b border-gray-50 hover:bg-blue-50/30 group transition-colors duration-150"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 text-[13px]">
                      {hl(cable.name, tokens)}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${cat.tagClass}`}>
                      {cat.label.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5 uppercase tracking-wide">
                    {hl(cable.spec, tokens)}
                    {cable.func ? ` · ${cable.func}` : ''}
                  </div>
                </td>
                <td className="py-4 px-4 text-[13px] text-gray-600">
                  {cable.area ? hl(cable.area, tokens) : '—'}
                </td>
                <td className="py-4 px-4 text-[13px] text-gray-600">
                  {toolConn !== '—' ? hl(toolConn, tokens) : '—'}
                </td>
                <td className="py-4 px-4">
                  <span className="text-[12px] font-mono text-gray-600">{route}</span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="font-bold text-gray-900 text-[13px] tabular-nums">{cable.cut} M</span>
                </td>
                <td className="py-4 px-3">
                  <button
                    onClick={() => onDelete(cable.id)}
                    className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg
                      hover:bg-red-50 hover:text-red-500 text-gray-400
                      transition-all duration-150 active:scale-90"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

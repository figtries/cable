'use client'

import type { ReactNode } from 'react'
import { Trash2 } from 'lucide-react'
import { Cable } from '@/lib/types'
import { CAT_CONFIG } from '@/lib/constants'

function hl(text: string, tokens: string[]): ReactNode {
  if (!tokens.length || !text) return text

  const escaped = tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const parts = text.split(new RegExp(`(${escaped.join('|')})`, 'gi'))

  return parts.map((p, i) =>
    tokens.some(t => p.toLowerCase() === t.toLowerCase()) ? (
      <mark key={i} className="rounded-sm bg-yellow-100 px-px text-inherit">
        {p}
      </mark>
    ) : (
      p
    )
  )
}

interface CableTableProps {
  cables: Cable[]
  tokens: string[]
  onDelete: (id: string) => void
}

const COL_HEADS = [
  'Cable Information',
  'Area Location',
  'Tool Connection',
  'Route Deployment',
  'Length Estimate',
  '',
]

export default function CableTable({ cables, tokens, onDelete }: CableTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px] max-w-[1180px] table-fixed">
        <colgroup>
          <col className="w-[24%]" />
          <col className="w-[20%]" />
          <col className="w-[21%]" />
          <col className="w-[22%]" />
          <col className="w-[10%]" />
          <col className="w-[3%]" />
        </colgroup>

        <thead>
          <tr className="h-[54px]">
            {COL_HEADS.map((h, i) => (
              <th
                key={i}
                className={`
                  px-[20px] pt-[18px] text-left align-top text-[9px] font-bold uppercase leading-[10px] tracking-[0.12em] text-[#747B86]
                  ${i === 0 ? 'pl-[24px]' : ''}
                  ${i === 5 ? 'px-0' : ''}
                `}
              >
                {h ? (
                  <>
                    {h.split(' ')[0]}
                    <br />
                    {h.split(' ').slice(1).join(' ')}
                  </>
                ) : null}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {cables.map((cable, rowIdx) => {
            const cat = CAT_CONFIG[cable.cat] ?? CAT_CONFIG.instrument
            const toolConn = [cable.equip, cable.jb].filter(Boolean)

            const route =
              cable.from || cable.to
                ? `${cable.from || '?'} →\n${cable.to || '?'}`
                : '—'

            return (
              <tr
                key={cable.id}
                style={{ animationDelay: `${rowIdx * 30}ms` }}
                className="group h-[70px] animate-fade-in transition-colors duration-150 hover:bg-blue-50/20"
              >
                <td className="pl-[24px] pr-[20px] pt-[13px] align-top">
                  <div className="flex items-center gap-[7px]">
                    <span className="text-[13px] font-bold uppercase leading-none text-[#171C26]">
                      {hl(cable.name, tokens)}
                    </span>

                    <span
                      className={`rounded-[3px] px-[5px] py-[2px] text-[8px] font-bold uppercase leading-none ${cat.tagClass}`}
                    >
                      {cat.label.toUpperCase()}
                    </span>
                  </div>

                  <div className="mt-[8px] max-w-[260px] truncate text-[10px] font-semibold uppercase leading-none tracking-[0.02em] text-[#171C26]">
                    {hl(cable.spec, tokens)}
                    {cable.func ? ` · ${cable.func}` : ''}
                  </div>
                </td>

                <td className="px-[20px] pt-[18px] align-top">
                  <span className="block truncate text-[13px] font-bold uppercase leading-none tracking-[0.01em] text-[#202733]">
                    {cable.area ? hl(cable.area, tokens) : '—'}
                  </span>
                </td>

                <td className="px-[20px] pt-[14px] align-top">
                  <div className="text-[11px] font-bold uppercase leading-[14px] tracking-[0.01em] text-[#171C26]">
                    {toolConn.length > 0 ? (
                      <>
                        <div>{hl(toolConn[0], tokens)}</div>
                        {toolConn[1] ? <div>JB: {hl(toolConn[1], tokens)}</div> : null}
                      </>
                    ) : (
                      '—'
                    )}
                  </div>
                </td>

                <td className="px-[20px] pt-[14px] align-top">
                  <span className="block whitespace-pre-line text-[11px] font-medium uppercase leading-[14px] tracking-[0.01em] text-[#374151]">
                    {route}
                  </span>
                </td>

                <td className="px-[20px] pt-[15px] align-top">
                  <span className="block text-[13px] font-bold uppercase leading-none tracking-[0.01em] text-[#0F274A]">
                    {cable.cut} M
                  </span>
                </td>

                <td className="pr-[12px] pt-[10px] align-top">
                  <button
                    onClick={() => onDelete(cable.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 opacity-0 transition-all duration-150 hover:bg-red-50 hover:text-red-500 active:scale-90 group-hover:opacity-100"
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
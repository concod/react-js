import { useEffect, useRef, useState, type MouseEvent } from 'react'
import type { Channel, Day } from './data'

function useWidth() {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(600)
  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])
  return [ref, width] as const
}

function niceMax(v: number) {
  const step = 10 ** Math.floor(Math.log10(v))
  return Math.ceil(v / step) * step
}

const compact = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, '')}K` : String(Math.round(n))

const fmtDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

type LineChartProps = {
  data: Day[]
  format: (v: number) => string
}

export function LineChart({ data, format }: LineChartProps) {
  const [ref, width] = useWidth()
  const [hover, setHover] = useState<number | null>(null)
  const height = 240
  const m = { top: 12, right: 12, bottom: 28, left: 44 }
  const w = width - m.left - m.right
  const h = height - m.top - m.bottom
  const max = niceMax(Math.max(...data.map((d) => d.revenue)))
  const x = (i: number) => m.left + (data.length === 1 ? w / 2 : (i / (data.length - 1)) * w)
  const y = (v: number) => m.top + h - (v / max) * h
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max)
  const line = data.map((d, i) => `${i ? 'L' : 'M'}${x(i)},${y(d.revenue)}`).join('')
  const area = `${line}L${x(data.length - 1)},${y(0)}L${x(0)},${y(0)}Z`
  const labelEvery = Math.ceil(data.length / Math.max(2, Math.floor(w / 80)))

  function onMove(e: MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const i = Math.round(((e.clientX - rect.left - m.left) / w) * (data.length - 1))
    setHover(Math.max(0, Math.min(data.length - 1, i)))
  }

  const point = hover ?? data.length - 1

  return (
    <div ref={ref} className="chart">
      <svg width={width} height={height} onMouseMove={onMove} onMouseLeave={() => setHover(null)} role="img"
        aria-label="Revenue per day line chart">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={m.left} x2={width - m.right} y1={y(t)} y2={y(t)} className={t ? 'gridline' : 'baseline'} />
            <text x={m.left - 8} y={y(t)} className="tick" textAnchor="end" dominantBaseline="middle">
              {compact(t)}
            </text>
          </g>
        ))}
        {data.map((d, i) =>
          i % labelEvery === 0 ? (
            <text key={i} x={x(i)} y={height - 8} className="tick" textAnchor="middle">
              {fmtDate(d.date)}
            </text>
          ) : null,
        )}
        <path d={area} className="area" />
        <path d={line} className="line" />
        {hover != null && <line x1={x(hover)} x2={x(hover)} y1={m.top} y2={y(0)} className="crosshair" />}
        <circle cx={x(point)} cy={y(data[point].revenue)} r={5} className="dot" />
      </svg>
      {hover != null && (
        <div className="tooltip" style={{ left: Math.min(x(hover) + 12, width - 150), top: m.top }}>
          <div className="tooltip-label">{fmtDate(data[hover].date)}</div>
          <div className="tooltip-value">{format(data[hover].revenue)}</div>
        </div>
      )}
    </div>
  )
}

export function BarChart({ data }: { data: Channel[] }) {
  const [ref, width] = useWidth()
  const [hover, setHover] = useState<number | null>(null)
  const total = data.reduce((t, d) => t + d.visitors, 0)
  const max = Math.max(...data.map((d) => d.visitors))
  const labelW = 112
  const valueW = 48
  const row = 40
  const bar = 20
  const w = Math.max(0, width - labelW - valueW)

  return (
    <div ref={ref} className="chart">
      <svg width={width} height={data.length * row} role="img" aria-label="Visitors by channel bar chart">
        <line x1={labelW} x2={labelW} y1={0} y2={data.length * row} className="baseline" />
        {data.map((d, i) => {
          const bw = (d.visitors / max) * w
          const yy = i * row + (row - bar) / 2
          const flat = Math.max(0, bw - 4)
          return (
            <g key={d.name} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <rect x={0} y={i * row} width={width} height={row} fill="transparent" />
              <text x={labelW - 10} y={yy + bar / 2} className="bar-label" textAnchor="end" dominantBaseline="middle">
                {d.name}
              </text>
              <path
                className={`bar ${hover != null && hover !== i ? 'dim' : ''}`}
                d={`M${labelW},${yy}h${flat}a4,4 0 0 1 4,4v${bar - 8}a4,4 0 0 1 -4,4h${-flat}Z`}
              />
              <text x={labelW + bw + 8} y={yy + bar / 2} className="bar-value" dominantBaseline="middle">
                {compact(d.visitors)}
              </text>
            </g>
          )
        })}
      </svg>
      {hover != null && (
        <div className="tooltip" style={{ left: labelW + 12, top: hover * row + row }}>
          <div className="tooltip-label">{data[hover].name}</div>
          <div className="tooltip-value">
            {data[hover].visitors.toLocaleString()} visitors · {Math.round((data[hover].visitors / total) * 100)}%
          </div>
        </div>
      )}
    </div>
  )
}

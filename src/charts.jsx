import React, { useRef, useState } from 'react'

// Hand-rolled SVG charts following the dataviz mark specs:
// 2px lines, ≥8px markers with a 2px surface ring, hairline solid gridlines,
// 2px surface gaps between stacked fills, text in ink tokens (never series color).

const SURFACE = '#fcfcfb'

function niceTicks(max, count = 4) {
  const raw = max / count
  const mag = Math.pow(10, Math.floor(Math.log10(raw)))
  const norm = raw / mag
  const step = (norm >= 5 ? 10 : norm >= 2 ? 5 : norm >= 1 ? 2 : 1) * mag
  const ticks = []
  for (let v = 0; v <= max + step * 0.001; v += step) ticks.push(v)
  return ticks
}

// ---- Multi-series line chart with crosshair + tooltip ----------------------
export function LineChart({ series, labels, formatY, height = 230, ariaLabel }) {
  const wrapRef = useRef(null)
  const [hover, setHover] = useState(null) // index into labels
  const W = 720
  const H = height
  const pad = { l: 44, r: 14, t: 12, b: 26 }
  const iw = W - pad.l - pad.r
  const ih = H - pad.t - pad.b
  const maxY = Math.max(...series.flatMap((s) => s.values))
  const ticks = niceTicks(maxY)
  const yMax = ticks[ticks.length - 1]
  const x = (i) => pad.l + (labels.length === 1 ? iw / 2 : (i / (labels.length - 1)) * iw)
  const y = (v) => pad.t + ih - (v / yMax) * ih

  const onMove = (e) => {
    const rect = wrapRef.current.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * W
    const i = Math.round(((px - pad.l) / iw) * (labels.length - 1))
    setHover(Math.max(0, Math.min(labels.length - 1, i)))
  }

  return (
    <div>
      {series.length > 1 && (
        <div className="legend">
          {series.map((s) => (
            <span className="key" key={s.name}>
              <span className="linekey" style={{ background: s.color }} />
              {s.name}
            </span>
          ))}
        </div>
      )}
      <div
        className="chart-wrap"
        ref={wrapRef}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="#e1e0d9" strokeWidth="1" />
              <text x={pad.l - 8} y={y(t) + 3.5} textAnchor="end" fontSize="10.5" fill="#898781">
                {formatY(t)}
              </text>
            </g>
          ))}
          {labels.map((l, i) =>
            i % Math.ceil(labels.length / 6) === 0 || i === labels.length - 1 ? (
              <text key={l} x={x(i)} y={H - 8} textAnchor="middle" fontSize="10.5" fill="#898781">
                {l}
              </text>
            ) : null
          )}
          {hover != null && (
            <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={pad.t + ih} stroke="#c3c2b7" strokeWidth="1" />
          )}
          {series.map((s) => (
            <g key={s.name}>
              <path
                d={s.values.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(v)}`).join(' ')}
                fill="none"
                stroke={s.color}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {s.area && (
                <path
                  d={
                    s.values.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(v)}`).join(' ') +
                    ` L${x(s.values.length - 1)},${y(0)} L${x(0)},${y(0)} Z`
                  }
                  fill={s.color}
                  opacity="0.08"
                />
              )}
              {/* end marker with surface ring */}
              <circle cx={x(s.values.length - 1)} cy={y(s.values[s.values.length - 1])} r="6" fill={SURFACE} />
              <circle cx={x(s.values.length - 1)} cy={y(s.values[s.values.length - 1])} r="4" fill={s.color} />
              {hover != null && (
                <>
                  <circle cx={x(hover)} cy={y(s.values[hover])} r="6" fill={SURFACE} />
                  <circle cx={x(hover)} cy={y(s.values[hover])} r="4" fill={s.color} />
                </>
              )}
            </g>
          ))}
        </svg>
        {hover != null && (
          <div
            className="tooltip"
            style={{ left: `${(x(hover) / W) * 100}%`, top: `${(y(Math.max(...series.map((s) => s.values[hover]))) / H) * 100}%` }}
          >
            <div className="t-title">{labels[hover]}</div>
            {series.map((s) => (
              <div className="t-row" key={s.name}>
                <span className="swatch" style={{ background: s.color }} />
                {s.name}: {formatY(s.values[hover])}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ---- Horizontal 100% stacked bar rows (cap table history, allocation) ------
export function StackRow({ label, segments, valueLabel }) {
  // segments: [{name, share (0..1), color}]
  return (
    <div className="stack-row">
      <span className="stack-label">{label}</span>
      <div
        className="stack-bar"
        role="img"
        aria-label={`${label}: ${segments.map((s) => `${s.name} ${(s.share * 100).toFixed(1)}%`).join(', ')}`}
      >
        {segments.map((s) => (
          <span
            key={s.name}
            className="stack-seg"
            style={{ width: `${s.share * 100}%`, background: s.color }}
            title={`${s.name}: ${(s.share * 100).toFixed(1)}%`}
          />
        ))}
      </div>
      <span className="stack-val">{valueLabel}</span>
    </div>
  )
}

export function StackLegend({ items }) {
  return (
    <div className="legend">
      {items.map((it) => (
        <span className="key" key={it.name}>
          <span className="swatch" style={{ background: it.color }} />
          {it.name}
        </span>
      ))}
    </div>
  )
}

// ---- Step/valuation chart with markers and selective direct labels ---------
export function ValuationChart({ points, formatY, height = 190, ariaLabel }) {
  // points: [{label, value}] — single series, so no legend (title names it).
  const [hover, setHover] = useState(null)
  const W = 640
  const H = height
  const pad = { l: 44, r: 40, t: 22, b: 26 }
  const iw = W - pad.l - pad.r
  const ih = H - pad.t - pad.b
  const maxY = Math.max(...points.map((p) => p.value))
  const ticks = niceTicks(maxY)
  const yMax = ticks[ticks.length - 1]
  const x = (i) => pad.l + (points.length === 1 ? iw / 2 : (i / (points.length - 1)) * iw)
  const y = (v) => pad.t + ih - (v / yMax) * ih
  const color = '#2a78d6'

  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="#e1e0d9" strokeWidth="1" />
            <text x={pad.l - 8} y={y(t) + 3.5} textAnchor="end" fontSize="10.5" fill="#898781">
              {formatY(t)}
            </text>
          </g>
        ))}
        <path
          d={points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(p.value)}`).join(' ')}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {points.map((p, i) => (
          <g key={p.label}>
            <circle cx={x(i)} cy={y(p.value)} r="6" fill={SURFACE} />
            <circle
              cx={x(i)}
              cy={y(p.value)}
              r={hover === i ? 5 : 4}
              fill={color}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            />
            <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="10.5" fill="#898781">
              {p.label}
            </text>
            {/* selective direct label: last point only */}
            {i === points.length - 1 && (
              <text x={x(i)} y={y(p.value) - 12} textAnchor="middle" fontSize="11.5" fontWeight="600" fill="#0b0b0b">
                {formatY(p.value)}
              </text>
            )}
          </g>
        ))}
      </svg>
      {hover != null && (
        <div
          className="tooltip"
          style={{ left: `${(x(hover) / W) * 100}%`, top: `${(y(points[hover].value) / H) * 100}%` }}
        >
          <div className="t-title">{points[hover].label}</div>
          {formatY(points[hover].value)}
        </div>
      )}
    </div>
  )
}

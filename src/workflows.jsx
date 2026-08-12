import React, { useEffect, useMemo, useState } from 'react'
import {
  companies, investors, pipeline,
  companyMetrics, enrichRounds, capTableHistory, investorSummary, fundTotals,
  qSignals, REF_DATE, fmtM, fmtPct, fmtX,
} from './data.js'
import { StackRow, StackLegend } from './charts.jsx'

// ---------------------------------------------------------------------------
// Advanced copilot workflows: each one is a deterministic, multi-step
// "simulated analysis" over the illustrative dataset — the steps narrate what
// the production agent would retrieve/join/compute, and the result is a real
// SVG/CSS visualization with evidence rows that link into the dashboard.
// ---------------------------------------------------------------------------

const SEGMENT_COLORS = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300']
const INK = '#14140f'
const MUTED = '#898781'
const HAIR = '#e1e0d9'
const SURFACE = '#fcfcfb'

function segColorMap() {
  const alloc = fundTotals().allocation
  const map = {}
  alloc.forEach((a, i) => { map[a.segment] = SEGMENT_COLORS[i % SEGMENT_COLORS.length] })
  return map
}

// ---- Small visualization primitives (panel-width, responsive) --------------

function PairedBars({ rows, labels, colors, format }) {
  const max = Math.max(...rows.flatMap((r) => [r.a, r.b]))
  return (
    <div>
      <div className="legend" style={{ marginBottom: 6 }}>
        <span className="key"><span className="swatch" style={{ background: colors[0] }} />{labels[0]}</span>
        <span className="key"><span className="swatch" style={{ background: colors[1] }} />{labels[1]}</span>
      </div>
      {rows.map((r) => (
        <div className="pair-row" key={r.label}>
          <span className="pair-label">{r.label}</span>
          <span
            className="pair-bars"
            role="img"
            aria-label={`${r.label}: ${labels[0]} ${format(r.a)}, ${labels[1]} ${format(r.b)}`}
          >
            <span className="pair-bar" style={{ width: `${(r.a / max) * 100}%`, background: colors[0] }} />
            <span className="pair-bar" style={{ width: `${(r.b / max) * 100}%`, background: colors[1] }} />
          </span>
          <span className="pair-vals">{format(r.a)} → {format(r.b)}</span>
        </div>
      ))}
    </div>
  )
}

function MiniScatter({ points, xLabel, yLabel, xMax, yMax, highlighted }) {
  const W = 300, H = 190
  const pad = { l: 30, r: 12, t: 14, b: 28 }
  const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b
  const x = (v) => pad.l + (v / xMax) * iw
  const y = (v) => pad.t + ih - (v / yMax) * ih
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img"
      aria-label={`Scatter plot of ${yLabel} against ${xLabel}. ${points.map((p) => `${p.name}: ${p.x}, ${p.y}`).join('; ')}`}>
      {[0, 0.5, 1].map((f) => (
        <g key={f}>
          <line x1={pad.l} x2={W - pad.r} y1={y(yMax * f)} y2={y(yMax * f)} stroke={HAIR} strokeWidth="1" />
          <text x={pad.l - 5} y={y(yMax * f) + 3} textAnchor="end" fontSize="8.5" fill={MUTED}>{Math.round(yMax * f)}</text>
          <text x={x(xMax * f)} y={H - 16} textAnchor="middle" fontSize="8.5" fill={MUTED}>{Math.round(xMax * f)}</text>
        </g>
      ))}
      <text x={W / 2} y={H - 4} textAnchor="middle" fontSize="9" fill={MUTED}>{xLabel}</text>
      <text x={9} y={pad.t - 4} textAnchor="start" fontSize="9" fill={MUTED}>{yLabel}</text>
      {points.map((p) => {
        const hot = highlighted.includes(p.id)
        return (
          <g key={p.id}>
            <circle cx={x(p.x)} cy={y(p.y)} r="6.5" fill={SURFACE} />
            <circle cx={x(p.x)} cy={y(p.y)} r={hot ? 5 : 4} fill="#2a78d6" opacity={hot ? 1 : 0.45} />
            {hot && (
              <text x={x(p.x)} y={y(p.y) - 9} textAnchor="middle" fontSize="9" fontWeight="600" fill={INK}>
                {p.name}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

function MiniLines({ series, labels, yFormat }) {
  const W = 300, H = 170
  const pad = { l: 34, r: 12, t: 12, b: 20 }
  const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b
  const yMax = Math.max(...series.flatMap((s) => s.values)) * 1.15
  const x = (i) => pad.l + (i / (labels.length - 1)) * iw
  const y = (v) => pad.t + ih - (v / yMax) * ih
  return (
    <div>
      <div className="legend" style={{ marginBottom: 6 }}>
        {series.map((s) => (
          <span className="key" key={s.name}><span className="linekey" style={{ background: s.color }} />{s.name}</span>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img"
        aria-label={`Line chart. ${series.map((s) => `${s.name} ends at ${yFormat(s.values[s.values.length - 1])}`).join('; ')}`}>
        {[0, 0.5, 1].map((f) => (
          <g key={f}>
            <line x1={pad.l} x2={W - pad.r} y1={y(yMax * f)} y2={y(yMax * f)} stroke={HAIR} strokeWidth="1" />
            <text x={pad.l - 5} y={y(yMax * f) + 3} textAnchor="end" fontSize="8.5" fill={MUTED}>{yFormat(yMax * f)}</text>
          </g>
        ))}
        {labels.map((l, i) => (
          <text key={l} x={x(i)} y={H - 6} textAnchor="middle" fontSize="8.5" fill={MUTED}>{l}</text>
        ))}
        {series.map((s) => (
          <g key={s.name}>
            <path
              d={s.values.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(v)}`).join(' ')}
              fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"
            />
            <circle cx={x(s.values.length - 1)} cy={y(s.values[s.values.length - 1])} r="5.5" fill={SURFACE} />
            <circle cx={x(s.values.length - 1)} cy={y(s.values[s.values.length - 1])} r="3.5" fill={s.color} />
          </g>
        ))}
      </svg>
    </div>
  )
}

const HEAT = {
  good: { glyph: '✓', word: 'on track', bg: '#e7f3e7', ink: '#006300' },
  watch: { glyph: '△', word: 'watch', bg: '#faf0dc', ink: '#8a5f0a' },
  risk: { glyph: '✕', word: 'at risk', bg: '#f9e7e7', ink: '#a32b2b' },
}

function HeatmapGrid({ cols, rows, go }) {
  return (
    <div>
      <div className="heatmap" style={{ gridTemplateColumns: `minmax(0,1.4fr) repeat(${cols.length}, minmax(34px, 1fr))` }}>
        <span className="hm-head" aria-hidden="true" />
        {cols.map((c) => <span className="hm-head" key={c}>{c}</span>)}
        {rows.map((r) => (
          <React.Fragment key={r.id}>
            <button className="hm-name" onClick={() => go({ view: 'company', id: r.id })}>{r.name}</button>
            {r.cells.map((cell, i) => (
              <span
                key={i}
                className="hm-cell"
                style={{ background: HEAT[cell.level].bg, color: HEAT[cell.level].ink }}
                role="img"
                aria-label={`${r.name}, ${cols[i]}: ${HEAT[cell.level].word} — ${cell.note}`}
                title={`${cols[i]}: ${cell.note}`}
              >
                {HEAT[cell.level].glyph}
              </span>
            ))}
          </React.Fragment>
        ))}
      </div>
      <div className="legend" style={{ marginTop: 8 }}>
        {Object.values(HEAT).map((h) => (
          <span className="key" key={h.word}>
            <span className="swatch" style={{ background: h.bg, color: h.ink, fontSize: 8, lineHeight: '10px', textAlign: 'center' }}>{h.glyph}</span>
            {h.word}
          </span>
        ))}
      </div>
    </div>
  )
}

const EDGE_STYLE = {
  competes: { dash: 'none', width: 2.2, color: '#d03b3b', word: 'competes' },
  adjacent: { dash: '5 4', width: 1.6, color: '#c98500', word: 'adjacent' },
  referred: { dash: '1.5 3.5', width: 1.6, color: '#2a78d6', word: 'referred by' },
}

function OverlapMap({ left, right, edges, go }) {
  const rowH = 34
  const H = Math.max(left.length, right.length) * rowH + 26
  const W = 300
  const ly = (i) => 24 + i * rowH + ((Math.max(left.length, right.length) - left.length) * rowH) / 2
  const ry = (i) => 24 + i * rowH + ((Math.max(left.length, right.length) - right.length) * rowH) / 2
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img"
        aria-label={`Overlap map between pipeline and portfolio. ${edges.map((e) => `${e.leftName} ${EDGE_STYLE[e.kind].word} ${e.rightName}`).join('; ')}`}>
        <text x="4" y="11" fontSize="8.5" fill={MUTED} style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Pipeline</text>
        <text x={W - 4} y="11" fontSize="8.5" fill={MUTED} textAnchor="end" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Portfolio</text>
        {edges.map((e, i) => {
          const s = EDGE_STYLE[e.kind]
          return (
            <line
              key={i}
              x1={104} y1={ly(e.li)} x2={196} y2={ry(e.ri)}
              stroke={s.color} strokeWidth={s.width}
              strokeDasharray={s.dash === 'none' ? undefined : s.dash}
              strokeLinecap="round"
            />
          )
        })}
        {left.map((n, i) => (
          <g key={n.id} onClick={() => go({ view: 'deal', id: n.id })} style={{ cursor: 'pointer' }}
            tabIndex={0} role="link" aria-label={`Open deal ${n.name}`}
            onKeyDown={(e) => { if (e.key === 'Enter') go({ view: 'deal', id: n.id }) }}>
            <circle cx={100} cy={ly(i)} r="3.5" fill={INK} />
            <text x={4} y={ly(i) + 3.5} fontSize="10" fill={INK} fontWeight="600">{n.name}</text>
          </g>
        ))}
        {right.map((n, i) => (
          <g key={n.id} onClick={() => go({ view: 'company', id: n.id })} style={{ cursor: 'pointer' }}
            tabIndex={0} role="link" aria-label={`Open company ${n.name}`}
            onKeyDown={(e) => { if (e.key === 'Enter') go({ view: 'company', id: n.id }) }}>
            <circle cx={200} cy={ry(i)} r="3.5" fill="#1f3d2b" />
            <text x={W - 4} y={ry(i) + 3.5} fontSize="10" fill={INK} fontWeight="600" textAnchor="end">{n.name}</text>
          </g>
        ))}
      </svg>
      <div className="legend" style={{ marginTop: 6 }}>
        {Object.entries(EDGE_STYLE).map(([k, s]) => (
          <span className="key" key={k}>
            <svg width="18" height="6" aria-hidden="true">
              <line x1="1" y1="3" x2="17" y2="3" stroke={s.color} strokeWidth={s.width}
                strokeDasharray={s.dash === 'none' ? undefined : s.dash} strokeLinecap="round" />
            </svg>
            {s.word}
          </span>
        ))}
      </div>
    </div>
  )
}

// ---- Workflow definitions ---------------------------------------------------

const STRESS_BY_STAGE = { Seed: 0.15, 'Seed+': 0.15, 'Series A': 0.25, 'Series B': 0.35 }

export const WORKFLOWS = [
  {
    id: 'stress',
    label: 'Stress-test concentration: downside scenario by segment',
    steps: [
      'Loading 13 active positions with latest fair-value marks',
      'Grouping syndicate value by segment and financing stage',
      'Applying stage-weighted downside: −15% seed, −25% Series A, −35% Series B',
      'Recomputing allocation, syndicate value and concentration',
      'Preparing before/after chart and most-affected list',
    ],
    build() {
      const active = companies.filter((c) => c.status === 'active')
        .map((c) => {
          const m = companyMetrics(c)
          const cut = STRESS_BY_STAGE[c.stage] ?? 0.2
          return { c, before: m.currentValue, after: m.currentValue * (1 - cut), cut }
        })
      const bySeg = {}
      for (const r of active) {
        bySeg[r.c.segment] = bySeg[r.c.segment] || { a: 0, b: 0 }
        bySeg[r.c.segment].a += r.before
        bySeg[r.c.segment].b += r.after
      }
      const rows = Object.entries(bySeg)
        .map(([label, v]) => ({ label, ...v }))
        .sort((x, y) => y.a - x.a)
      const totB = rows.reduce((s, r) => s + r.a, 0)
      const totA = rows.reduce((s, r) => s + r.b, 0)
      const hit = active.slice().sort((x, y) => (y.before - y.after) - (x.before - x.after)).slice(0, 3)
      const topShare = rows[0].a / totB
      return {
        intro: `A stage-weighted downside would cut unrealized value from ${fmtM(totB)} to ${fmtM(totA)} (−${fmtPct(1 - totA / totB)}). ${rows[0].label} is the concentration point at ${fmtPct(topShare, 0)} of the book — later-stage marks there absorb the deepest cut.`,
        viz: <PairedBars rows={rows} labels={['Current mark', 'Stressed']} colors={['#2a78d6', '#eb6834']} format={fmtM} />,
        evidence: [
          ...hit.map((h) => ({
            text: `${h.c.name} — −${fmtM(h.before - h.after)} (${h.c.stage} mark −${Math.round(h.cut * 100)}%)`,
            route: { view: 'company', id: h.c.id }, routeLabel: 'Open',
          })),
          { text: `Marks sourced from each company's latest round agreement and quarterly update on file.` },
        ],
        actions: [{ label: 'Open portfolio list', route: { view: 'portfolio' } }],
      }
    },
  },
  {
    id: 'followon',
    label: 'Find follow-on candidates for the next two quarters',
    steps: [
      'Reading runway and growth from the latest quarterly updates',
      'Computing mark-vs-last-round trend from round agreements',
      'Checking syndicate ownership headroom per company',
      'Netting out watch-outs flagged in updates',
      'Ranking candidates and preparing the runway × growth scatter',
    ],
    build() {
      const scored = companies.filter((c) => c.status === 'active').map((c) => {
        const m = companyMetrics(c)
        const s = qSignals(c)
        const raisingSoon = s.runway >= 9 && s.runway <= 18
        const score = s.growth * 2 + (raisingSoon ? 15 : 0) + (s.markTrend > 1.05 ? 10 : 0)
          + (m.ownership < 0.08 ? 8 : 0) - s.watchouts * 6
        return { c, m, s, score, raisingSoon }
      }).sort((a, b) => b.score - a.score)
      const top = scored.slice(0, 3)
      return {
        intro: `Three names stand out for follow-on reserves: ${top.map((t) => t.c.name).join(', ')} — strong quarter-over-quarter growth, marks at or above the last round, and (for two of them) runway that points to a raise within two quarters.`,
        viz: (
          <MiniScatter
            points={scored.map((x) => ({ id: x.c.id, name: x.c.name.split(' ')[0], x: x.s.runway, y: Math.max(0, x.s.growth) }))}
            highlighted={top.map((t) => t.c.id)}
            xLabel="Runway (months)" yLabel="Growth % QoQ" xMax={25} yMax={20}
          />
        ),
        evidence: top.map((t) => ({
          text: `${t.c.name} — +${t.s.growth}% QoQ, ${t.s.runway} mo runway, we hold ${fmtPct(t.m.ownership)}${t.s.markTrend > 1.05 ? `, marked ${fmtX(t.s.markTrend)} last post` : ''}${t.s.watchouts ? ` (${t.s.watchouts} watch-out${t.s.watchouts > 1 ? 's' : ''} on file)` : ''} — per "${t.s.updateDoc}"`,
          route: { view: 'company', id: t.c.id, tab: 'sim' }, routeLabel: 'Simulate',
        })),
        actions: [{ label: 'Open portfolio list', route: { view: 'portfolio' } }],
      }
    },
  },
  {
    id: 'exposure',
    label: 'Build Arden Family Office’s full exposure report',
    steps: [
      'Joining Arden’s per-round participations across 8 companies',
      'Computing look-through ownership after each later round’s dilution',
      'Grouping current value by segment; adding realized exit proceeds',
      'Locating the largest dilution event in the round history',
      'Rendering allocation and evidence',
    ],
    build() {
      const s = investorSummary('arden')
      const segMap = segColorMap()
      const bySeg = {}
      for (const p of s.positions) {
        if (p.currentValue <= 0) continue
        bySeg[p.company.segment] = (bySeg[p.company.segment] || 0) + p.currentValue
      }
      const rows = Object.entries(bySeg).map(([seg, v]) => ({ seg, v })).sort((a, b) => b.v - a.v)
      // largest dilution event: biggest drop in Arden's stake caused by a later round
      let worst = null
      for (const p of s.positions) {
        const rounds = enrichRounds(p.company)
        let stake = 0
        rounds.forEach((r) => {
          const before = stake
          stake = stake * (r.pre / r.post) + (r.check * (r.mix.arden || 0)) / r.post
          const lost = before * (1 - r.pre / r.post)
          if (before > 0 && (!worst || lost > worst.lost)) {
            worst = { company: p.company, round: r, lost, before, after: before * (r.pre / r.post) + (r.check * (r.mix.arden || 0)) / r.post }
          }
        })
      }
      const exits = s.positions.filter((p) => p.realized > 0)
      return {
        intro: `Arden has ${fmtM(s.invested)} at work across ${s.positions.length} companies, marked at ${fmtM(s.currentValue)} with ${fmtM(s.realized)} realized — TVPI ${fmtX((s.currentValue + s.realized) / s.invested)}. Current value skews to ${rows[0].seg} (${fmtPct(rows[0].v / s.currentValue, 0)}).`,
        viz: (
          <div>
            <StackLegend items={rows.map((r) => ({ name: r.seg, color: segMap[r.seg] }))} />
            {rows.map((r) => (
              <StackRow
                key={r.seg} label={r.seg} valueLabel={fmtM(r.v)}
                segments={[
                  { name: r.seg, share: r.v / s.currentValue, color: segMap[r.seg] },
                  { name: 'rest', share: 1 - r.v / s.currentValue, color: 'var(--surface-2)' },
                ]}
              />
            ))}
          </div>
        ),
        evidence: [
          ...exits.map((p) => ({
            text: `Exit: ${p.company.name} returned ${fmtM(p.realized)} to Arden (${p.company.exit.date})`,
            route: { view: 'company', id: p.company.id }, routeLabel: 'Open',
          })),
          worst && {
            text: `Largest dilution event: ${worst.company.name} ${worst.round.name} took Arden from ${fmtPct(worst.before, 2)} to ${fmtPct(worst.after, 2)} look-through`,
            route: { view: 'company', id: worst.company.id, tab: 'captable' }, routeLabel: 'Cap table',
          },
        ].filter(Boolean),
        actions: [{ label: 'Open Arden’s statement & report preview', route: { view: 'investor', id: 'arden' } }],
      }
    },
  },
  {
    id: 'scenarios',
    label: 'Compare Restora financing scenarios: up / flat / down round',
    steps: [
      'Reconstructing our ownership after each executed Restora round',
      'Scenario A — $30M at $130M pre, syndicate takes pro-rata',
      'Scenario B — $30M at $96M pre (flat to mark), no participation',
      'Scenario C — $30M at $60M pre (down round), no participation',
      'Plotting the three ownership curves and round math',
    ],
    build() {
      const c = companies.find((x) => x.id === 'restora')
      const rounds = enrichRounds(c)
      const hist = rounds.map((r) => r.ownAfter * 100)
      const own = rounds[rounds.length - 1].ownAfter
      const raise = 30
      const mk = (pre, prorata) => {
        const post = pre + raise
        const check = prorata ? own * raise : 0
        return { pre, post, check, after: own * (pre / post) + check / post }
      }
      const A = mk(130, true), B = mk(96, false), C = mk(60, false)
      const labels = [...rounds.map((r) => r.name.replace('Series ', '')), 'Next']
      return {
        intro: `Today the syndicate holds ${fmtPct(own)} of Restora. A $30M round leaves us at ${fmtPct(A.after)} if we take pro-rata at $130M pre, ${fmtPct(B.after)} sitting out a flat round, or ${fmtPct(C.after)} sitting out a $60M-pre down round.`,
        viz: (
          <MiniLines
            labels={labels}
            yFormat={(v) => `${v.toFixed(1)}%`}
            series={[
              { name: 'Up + pro-rata', color: '#2a78d6', values: [...hist, A.after * 100] },
              { name: 'Flat, sit out', color: '#eb6834', values: [...hist, B.after * 100] },
              { name: 'Down, sit out', color: '#1baf7a', values: [...hist, C.after * 100] },
            ]}
          />
        ),
        evidence: [
          { text: `A: ${fmtM(130)} pre / ${fmtM(A.post)} post — pro-rata check ${fmtM(A.check)}, stake ${fmtPct(A.after)}` },
          { text: `B: ${fmtM(96)} pre / ${fmtM(B.post)} post — no check, stake ${fmtPct(B.after)} (−${fmtPct(own - B.after)} pts)` },
          { text: `C: ${fmtM(60)} pre / ${fmtM(C.post)} post — no check, stake ${fmtPct(C.after)} (−${fmtPct(own - C.after)} pts)` },
          { text: 'Round history reconstructed from the executed SPAs under source documents.', route: { view: 'company', id: 'restora', tab: 'docs' }, routeLabel: 'Documents' },
        ],
        actions: [{ label: 'Open the live simulator with sliders', route: { view: 'company', id: 'restora', tab: 'sim' } }],
      }
    },
  },
  {
    id: 'health',
    label: 'Run a portfolio health review (risk heatmap)',
    steps: [
      'Parsing growth and runway from each latest quarterly update',
      'Comparing current marks to last-round post-money',
      'Checking update freshness against reporting cadence',
      'Counting open watch-outs per company',
      'Composing the risk heatmap, worst-first',
    ],
    build() {
      const cols = ['Growth', 'Runway', 'Mark', 'Updates']
      const rows = companies.filter((c) => c.status === 'active').map((c) => {
        const s = qSignals(c)
        const cells = [
          s.growth >= 8 ? { level: 'good', note: `+${s.growth}% QoQ` }
            : s.growth > 0 ? { level: 'watch', note: `+${s.growth}% QoQ` }
            : { level: 'risk', note: 'flat / declining' },
          s.runway >= 15 ? { level: 'good', note: `${s.runway} months` }
            : s.runway >= 10 ? { level: 'watch', note: `${s.runway} months` }
            : { level: 'risk', note: `${s.runway} months` },
          s.markTrend >= 1.05 ? { level: 'good', note: `${fmtX(s.markTrend)} last post` }
            : s.markTrend >= 0.95 ? { level: 'watch', note: 'held flat to last round' }
            : { level: 'risk', note: 'below last round' },
          s.updateAgeDays <= 45 ? { level: 'good', note: `update ${s.updateAgeDays}d ago` }
            : s.updateAgeDays <= 90 ? { level: 'watch', note: `update ${s.updateAgeDays}d ago` }
            : { level: 'risk', note: `no update for ${s.updateAgeDays} days` },
        ]
        const riskCount = cells.filter((x) => x.level === 'risk').length
        const watchCount = cells.filter((x) => x.level === 'watch').length
        return { id: c.id, name: c.name, cells, riskCount, watchCount, next: c.quarterly.watchouts[0] }
      }).sort((a, b) => b.riskCount - a.riskCount || b.watchCount - a.watchCount)
      const flagged = rows.filter((r) => r.riskCount >= 2)
      return {
        intro: `${flagged.length} of ${rows.length} active companies carry two or more red flags; ${rows.filter((r) => r.riskCount === 0 && r.watchCount <= 1).length} are clean. Signals below come from the quarterly updates and round records on file (as of ${REF_DATE}).`,
        viz: <HeatmapGrid cols={cols} rows={rows} go={this._go} />,
        evidence: flagged.map((r) => ({
          text: `${r.name} — ${r.riskCount} red flags. Next action on file: ${r.next || 'partner review'}`,
          route: { view: 'company', id: r.id, tab: 'quarter' }, routeLabel: 'Quarterly',
        })),
        actions: [{ label: 'Open fund overview', route: { view: 'overview' } }],
      }
    },
  },
  {
    id: 'conflicts',
    label: 'Check pipeline ↔ portfolio conflicts and overlaps',
    steps: [
      'Loading live pipeline and active portfolio records',
      'Matching segments and product descriptions for overlap',
      'Tracing who introduced each deal through the relationship log',
      'Classifying edges: head-on competition, adjacency, referral',
      'Drawing the overlap map',
    ],
    build() {
      const linked = pipeline.filter((d) => d.links && d.stage !== 'Passed')
      const left = linked.map((d) => ({ id: d.id, name: d.company }))
      const rightIds = [...new Set(linked.flatMap((d) => d.links.map((l) => l.companyId)))]
      const right = rightIds.map((id) => ({ id, name: companies.find((c) => c.id === id).name }))
      const edges = linked.flatMap((d, li) =>
        d.links.map((l) => ({
          li, ri: rightIds.indexOf(l.companyId), kind: l.kind,
          leftName: d.company, rightName: companies.find((c) => c.id === l.companyId).name,
          note: l.note, dealId: d.id,
        }))
      )
      const competes = edges.filter((e) => e.kind === 'competes')
      const referred = edges.filter((e) => e.kind === 'referred')
      return {
        intro: `${edges.length} connections between the live pipeline and the portfolio: ${competes.length} head-on competition flag${competes.length === 1 ? '' : 's'}, ${referred.length} portfolio referrals, ${edges.length - competes.length - referred.length} adjacencies. The competition flag needs clearing before Somnia moves past screening.`,
        viz: <OverlapMap left={left} right={right} edges={edges} go={this._go} />,
        evidence: edges
          .slice()
          .sort((a, b) => (a.kind === 'competes' ? -1 : 1) - (b.kind === 'competes' ? -1 : 1))
          .map((e) => ({
            text: `${e.leftName} ↔ ${e.rightName} (${EDGE_STYLE[e.kind].word}): ${e.note}`,
            route: { view: 'deal', id: e.dealId }, routeLabel: 'Deal file',
          })),
        actions: [{ label: 'Open the pipeline board', route: { view: 'dealflow' } }],
      }
    },
  },
]

// ---- Execution panel --------------------------------------------------------

export function WorkflowRun({ wf, go, onTick, onDone }) {
  const instant = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [step, setStep] = useState(instant ? wf.steps.length : 0)
  const done = step >= wf.steps.length

  useEffect(() => {
    if (done) { onDone(); onTick(); return undefined }
    const t = setTimeout(() => { setStep((s) => s + 1); onTick() }, 420)
    return () => clearTimeout(t)
  }, [step, done])

  // Bind go so build() helpers (heatmap, overlap map) can navigate.
  const result = useMemo(() => {
    wf._go = go
    return wf.build()
  }, [wf, go])

  return (
    <div className="run-card">
      <div className="run-head">
        <strong>{wf.label}</strong>
        <span className="run-tag">Simulated analysis · illustrative records</span>
      </div>
      <ol className="run-steps">
        {wf.steps.map((s, i) => (
          <li
            key={s}
            className={i < step ? 'done' : i === step ? 'active' : 'pending'}
            aria-current={i === step ? 'step' : undefined}
          >
            <span className="step-mark" aria-hidden="true">{i < step ? '✓' : i === step ? '●' : '○'}</span>
            {s}
          </li>
        ))}
      </ol>
      {done && (
        <div className="run-result">
          <p className="run-intro">{result.intro}</p>
          <div className="run-viz">{result.viz}</div>
          {result.evidence?.length > 0 && (
            <div className="ev-list" role="list" aria-label="Supporting evidence">
              <span className="prompts-label">Evidence</span>
              {result.evidence.map((e, i) => (
                <div className="ev-row" role="listitem" key={i}>
                  <span>{e.text}</span>
                  {e.route && (
                    <button className="ev-link" onClick={() => go(e.route)}>
                      {e.routeLabel} →
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          {result.actions?.map((a) => (
            <button key={a.label} className="run-action" onClick={() => go(a.route)}>
              {a.label} →
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

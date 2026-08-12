import React from 'react'
import { FUND, navSeries, fmtM, fmtPct, fmtX, fundTotals, investors } from '../data.js'
import { LineChart, StackRow, StackLegend } from '../charts.jsx'

const SEGMENT_COLORS = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300']

export function segmentColor(allocation, segment) {
  const i = allocation.findIndex((a) => a.segment === segment)
  return SEGMENT_COLORS[i % SEGMENT_COLORS.length]
}

export default function Overview({ go }) {
  const t = fundTotals()

  return (
    <div>
      <div className="page-head">
        <h1>Fund overview</h1>
        <span className="asof">As of {FUND.asOf} · {FUND.model} · Vintage {FUND.vintage}</span>
      </div>
      <p style={{ margin: '0 0 4px', color: 'var(--ink-2)', maxWidth: 640 }}>
        The standing picture of the fund. Every figure is clickable and drills down to the
        underlying companies, rounds and documents.
      </p>

      <h2 className="section-title">Standing metrics</h2>
      <div className="tile-row">
        <button className="tile" onClick={() => go({ view: 'portfolio' })}>
          <span className="label">Investments</span>
          <span className="value" style={{ display: 'block' }}>{t.per.length}</span>
          <span className="sub" style={{ display: 'block' }}>{t.active.length} active · {t.exited.length} exited</span>
          <span className="hint" style={{ display: 'block' }}>View companies</span>
        </button>
        <button className="tile" onClick={() => go({ view: 'portfolio' })}>
          <span className="label">Total invested</span>
          <span className="value" style={{ display: 'block' }}>{fmtM(t.invested)}</span>
          <span className="sub" style={{ display: 'block' }}>across {t.per.reduce((s, x) => s + x.c.rounds.length, 0)} rounds</span>
          <span className="hint" style={{ display: 'block' }}>Breakdown</span>
        </button>
        <button className="tile" onClick={() => go({ view: 'portfolio' })}>
          <span className="label">Current value (unrealized)</span>
          <span className="value" style={{ display: 'block' }}>{fmtM(t.currentValue)}</span>
          <span className="sub" style={{ display: 'block' }}><span className="up">TVPI {fmtX(t.tvpi)}</span></span>
          <span className="hint" style={{ display: 'block' }}>By company</span>
        </button>
        <div className="tile">
          <span className="label">Net IRR</span>
          <span className="value" style={{ display: 'block' }}>{fmtPct(FUND.netIRR)}</span>
          <span className="sub" style={{ display: 'block' }}>since {FUND.vintage} vintage</span>
        </div>
        <div className="tile">
          <span className="label">DPI</span>
          <span className="value" style={{ display: 'block' }}>{fmtX(t.dpi)}</span>
          <span className="sub" style={{ display: 'block' }}>{fmtM(t.realized)} distributed</span>
        </div>
        <button className="tile" onClick={() => go({ view: 'portfolio', filter: 'exited' })}>
          <span className="label">Exits · realized</span>
          <span className="value" style={{ display: 'block' }}>{t.exited.length}</span>
          <span className="sub" style={{ display: 'block' }}>{fmtM(t.realized)} proceeds</span>
          <span className="hint" style={{ display: 'block' }}>See exits</span>
        </button>
        <button className="tile" onClick={() => go({ view: 'dealflow' })}>
          <span className="label">Active diligence</span>
          <span className="value" style={{ display: 'block' }}>{t.activeDiligence}</span>
          <span className="sub" style={{ display: 'block' }}>1 at investment committee</span>
          <span className="hint" style={{ display: 'block' }}>Open pipeline</span>
        </button>
        <button className="tile" onClick={() => go({ view: 'investors' })}>
          <span className="label">Co-investors</span>
          <span className="value" style={{ display: 'block' }}>{investors.length}</span>
          <span className="sub" style={{ display: 'block' }}>co-investment model</span>
          <span className="hint" style={{ display: 'block' }}>Per-investor view</span>
        </button>
      </div>

      <h2 className="section-title">Capital &amp; value</h2>
      <div className="cols-main-side">
        <div className="card chart-card">
          <h3>Invested capital vs. portfolio fair value</h3>
          <p className="chart-sub">Quarterly, USD millions. Hover for values.</p>
          <LineChart
            labels={navSeries.map((p) => p.q)}
            series={[
              { name: 'Fair value', color: '#2a78d6', values: navSeries.map((p) => p.value), area: true },
              { name: 'Invested (cumulative)', color: '#eb6834', values: navSeries.map((p) => p.invested) },
            ]}
            formatY={(v) => `$${Math.round(v)}M`}
            ariaLabel="Line chart of cumulative invested capital and portfolio fair value by quarter"
          />
        </div>
        <div className="card chart-card">
          <h3>Allocation by segment</h3>
          <p className="chart-sub">Share of invested capital.</p>
          <StackLegend
            items={t.allocation.map((a, i) => ({ name: a.segment, color: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }))}
          />
          {t.allocation.map((a, i) => (
            <StackRow
              key={a.segment}
              label={a.segment}
              valueLabel={fmtM(a.amount)}
              segments={[
                { name: a.segment, share: a.share, color: SEGMENT_COLORS[i % SEGMENT_COLORS.length] },
                { name: 'rest', share: 1 - a.share, color: 'var(--surface-2)' },
              ]}
            />
          ))}
          <p className="chart-sub" style={{ marginTop: 10, marginBottom: 0 }}>
            Largest position: {t.allocation[0].segment} at {fmtPct(t.allocation[0].share, 0)} of invested capital.
          </p>
        </div>
      </div>

      <h2 className="section-title">Needs attention</h2>
      <div className="cols-2">
        <button className="tile" onClick={() => go({ view: 'deal', id: 'nimbuscare' })}>
          <span className="label">Investment committee</span>
          <span className="sub" style={{ display: 'block', marginTop: 4, fontSize: 13, color: 'var(--ink)' }}>
            <strong>NimbusCare</strong> — IC vote scheduled Aug 19. Memo v3 and draft term sheet in the data room.
          </span>
          <span className="hint" style={{ display: 'block' }}>Open deal</span>
        </button>
        <button className="tile" onClick={() => go({ view: 'company', id: 'lucent' })}>
          <span className="label">Portfolio watch</span>
          <span className="sub" style={{ display: 'block', marginTop: 4, fontSize: 13, color: 'var(--ink)' }}>
            <strong>Lucent Dermics</strong> — 10 months runway; bridge terms under discussion before Series A.
          </span>
          <span className="hint" style={{ display: 'block' }}>Open company</span>
        </button>
        <button className="tile" onClick={() => go({ view: 'deal', id: 'briochem' })}>
          <span className="label">Diligence follow-up</span>
          <span className="sub" style={{ display: 'block', marginTop: 4, fontSize: 13, color: 'var(--ink)' }}>
            <strong>BrioChem</strong> — founder call on CAC drift due Aug 12 (today).
          </span>
          <span className="hint" style={{ display: 'block' }}>Open deal</span>
        </button>
      </div>
    </div>
  )
}

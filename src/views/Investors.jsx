import React, { useState } from 'react'
import { FUND, investors, investorSummary, fmtM, fmtPct, fmtX } from '../data.js'

export function InvestorList({ go }) {
  const rows = investors
    .map((inv) => ({ inv, s: investorSummary(inv.id) }))
    .sort((a, b) => b.s.invested - a.s.invested)
  return (
    <div>
      <div className="crumbs">
        <button onClick={() => go({ view: 'overview' })}>Fund overview</button>
        <span className="sep">/</span> Co-investors
      </div>
      <div className="page-head">
        <h1>Co-investors</h1>
        <span className="asof">Co-investment model — each investor is a separate entity per round</span>
      </div>
      <p style={{ margin: '0 0 16px', color: 'var(--ink-2)', maxWidth: 640 }}>
        Every check is split by investor at the round level, so each investor's ownership,
        value and distributions are tracked per company. Select an investor for their
        statement and quarterly report preview.
      </p>
      <div className="card" style={{ padding: '4px 6px', overflowX: 'auto' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Investor</th><th>Type</th>
              <th className="num">Positions</th>
              <th className="num">Invested</th>
              <th className="num">Current value</th>
              <th className="num">Realized</th>
              <th className="num">TVPI</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ inv, s }) => (
              <tr
                key={inv.id} className="rowlink" tabIndex={0}
                onClick={() => go({ view: 'investor', id: inv.id })}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go({ view: 'investor', id: inv.id }) } }}
                aria-label={`Open ${inv.name}`}
              >
                <td className="co">{inv.name}</td>
                <td><span className="badge">{inv.type}</span></td>
                <td className="num">{s.positions.length}</td>
                <td className="num">{fmtM(s.invested)}</td>
                <td className="num">{fmtM(s.currentValue)}</td>
                <td className="num">{fmtM(s.realized)}</td>
                <td className="num">{fmtX((s.currentValue + s.realized) / s.invested)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function InvestorDetail({ id, go }) {
  const inv = investors.find((i) => i.id === id)
  const [showReport, setShowReport] = useState(false)
  if (!inv) return <p>Investor not found.</p>
  const s = investorSummary(id)
  const tvpi = (s.currentValue + s.realized) / s.invested

  return (
    <div>
      <div className="crumbs">
        <button onClick={() => go({ view: 'overview' })}>Fund overview</button>
        <span className="sep">/</span>
        <button onClick={() => go({ view: 'investors' })}>Co-investors</button>
        <span className="sep">/</span> {inv.name}
      </div>
      <div className="page-head">
        <h1>{inv.name}</h1>
        <span className="asof">{inv.type} · statement as of {FUND.asOf}</span>
      </div>

      <div className="tile-row">
        <div className="tile"><span className="label">Invested</span><span className="value" style={{ display: 'block' }}>{fmtM(s.invested)}</span><span className="sub" style={{ display: 'block' }}>{s.positions.length} companies</span></div>
        <div className="tile"><span className="label">Current value</span><span className="value" style={{ display: 'block' }}>{fmtM(s.currentValue)}</span><span className="sub" style={{ display: 'block' }}>unrealized</span></div>
        <div className="tile"><span className="label">Realized proceeds</span><span className="value" style={{ display: 'block' }}>{fmtM(s.realized)}</span><span className="sub" style={{ display: 'block' }}>from exits</span></div>
        <div className="tile"><span className="label">TVPI</span><span className="value" style={{ display: 'block' }}>{fmtX(tvpi)}</span><span className="sub" style={{ display: 'block' }}>DPI {fmtX(s.realized / s.invested)}</span></div>
      </div>

      <h2 className="section-title">Positions</h2>
      <div className="card" style={{ padding: '4px 6px', overflowX: 'auto' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Company</th>
              <th className="num">Invested</th>
              <th className="num">Ownership</th>
              <th className="num">Current value</th>
              <th className="num">Realized</th>
            </tr>
          </thead>
          <tbody>
            {s.positions
              .sort((a, b) => (b.currentValue + b.realized) - (a.currentValue + a.realized))
              .map((p) => (
                <tr
                  key={p.company.id} className="rowlink" tabIndex={0}
                  onClick={() => go({ view: 'company', id: p.company.id })}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go({ view: 'company', id: p.company.id }) } }}
                  aria-label={`Open ${p.company.name}`}
                >
                  <td className="co">{p.company.name}<small>{p.company.status === 'exited' ? `Exited ${p.company.exit.date}` : p.company.stage}</small></td>
                  <td className="num">{fmtM(p.invested)}</td>
                  <td className="num">{p.company.status === 'exited' ? '—' : fmtPct(p.ownership, 2)}</td>
                  <td className="num">{fmtM(p.currentValue)}</td>
                  <td className="num">{p.realized > 0 ? fmtM(p.realized) : '—'}</td>
                </tr>
              ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td className="num">{fmtM(s.invested)}</td>
              <td className="num" />
              <td className="num">{fmtM(s.currentValue)}</td>
              <td className="num">{fmtM(s.realized)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <h2 className="section-title">Quarterly report</h2>
      {!showReport ? (
        <button className="tile" onClick={() => setShowReport(true)} style={{ maxWidth: 420 }}>
          <span className="label">Q2 2026 statement</span>
          <span className="sub" style={{ display: 'block', marginTop: 4, fontSize: 13, color: 'var(--ink)' }}>
            Generate the quarterly report preview for {inv.name} — the same letter the fund
            sends each investor every quarter.
          </span>
          <span className="hint" style={{ display: 'block' }}>Preview report</span>
        </button>
      ) : (
        <div className="report" aria-label={`Quarterly report preview for ${inv.name}`}>
          <div className="r-head">
            <h4>{FUND.name}</h4>
            <div className="r-meta">Quarterly statement<br />Q2 2026 · prepared for {inv.name}</div>
          </div>
          <p>
            Dear investor, — during the quarter your portfolio of {s.positions.length} co-investments
            was marked at <strong>{fmtM(s.currentValue)}</strong> against <strong>{fmtM(s.invested)}</strong>{' '}
            invested, with <strong>{fmtM(s.realized)}</strong> already returned from{' '}
            {s.positions.filter((p) => p.realized > 0).length} exits — a total value multiple of{' '}
            <strong>{fmtX(tvpi)}</strong>.
          </p>
          <p>
            Largest position: {s.positions.slice().sort((a, b) => b.currentValue - a.currentValue)[0].company.name}.
            Notable this quarter: Sagelight grew 18% QoQ; NimbusCare is at investment committee;
            Lucent Dermics is negotiating a bridge round.
          </p>
          <table className="tbl" style={{ margin: '10px 0' }}>
            <thead>
              <tr><th>Company</th><th className="num">Invested</th><th className="num">Value</th><th className="num">Realized</th></tr>
            </thead>
            <tbody>
              {s.positions.slice(0, 5).map((p) => (
                <tr key={p.company.id}>
                  <td>{p.company.name}</td>
                  <td className="num">{fmtM(p.invested)}</td>
                  <td className="num">{fmtM(p.currentValue)}</td>
                  <td className="num">{p.realized > 0 ? fmtM(p.realized) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="r-foot">
            Illustrative mockup — all names and figures fictional. In production this report is
            assembled from the same round-level records shown on this page and exported to PDF.
          </div>
        </div>
      )}
    </div>
  )
}

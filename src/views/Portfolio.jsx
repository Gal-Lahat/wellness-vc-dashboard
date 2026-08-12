import React, { useState } from 'react'
import { companies, companyMetrics, fmtM, fmtPct, fmtX } from '../data.js'

export default function Portfolio({ go, initialFilter }) {
  const [filter, setFilter] = useState(initialFilter || 'all')
  const rows = companies
    .map((c) => ({ c, m: companyMetrics(c) }))
    .filter(({ c }) => (filter === 'all' ? true : c.status === filter))
    .sort((a, b) => (b.m.currentValue + b.m.realized) - (a.m.currentValue + a.m.realized))

  return (
    <div>
      <div className="crumbs">
        <button onClick={() => go({ view: 'overview' })}>Fund overview</button>
        <span className="sep">/</span> Portfolio
      </div>
      <div className="page-head">
        <h1>Portfolio — {rows.length} {filter === 'all' ? 'investments' : filter === 'active' ? 'active companies' : 'exits'}</h1>
        <div className="sim-toggle" role="group" aria-label="Filter portfolio">
          {[['all', 'All'], ['active', 'Active'], ['exited', 'Exited']].map(([k, l]) => (
            <button key={k} aria-pressed={filter === k} onClick={() => setFilter(k)}>{l}</button>
          ))}
        </div>
      </div>
      <p style={{ margin: '0 0 16px', color: 'var(--ink-2)' }}>
        Select a company to see rounds, ownership, cap-table history, documents and simulations.
      </p>

      <div className="card" style={{ padding: '4px 6px', overflowX: 'auto' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Company</th>
              <th>Segment</th>
              <th>Stage</th>
              <th className="num">Invested</th>
              <th className="num">Ownership</th>
              <th className="num">Value / proceeds</th>
              <th className="num">MOIC</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ c, m }) => (
              <tr
                key={c.id}
                className="rowlink"
                tabIndex={0}
                onClick={() => go({ view: 'company', id: c.id })}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go({ view: 'company', id: c.id }) } }}
                aria-label={`Open ${c.name}`}
              >
                <td className="co">
                  {c.name}
                  <small>{c.oneLiner}</small>
                </td>
                <td><span className="badge">{c.segment}</span></td>
                <td>{c.status === 'exited' ? <span className="badge exited">Exited {c.exit.date.slice(0, 4)}</span> : <span className="badge brand">{c.stage}</span>}</td>
                <td className="num">{fmtM(m.invested)}</td>
                <td className="num">{c.status === 'exited' ? '—' : fmtPct(m.ownership)}</td>
                <td className="num">{c.status === 'exited' ? fmtM(m.realized) : fmtM(m.currentValue)}</td>
                <td className="num">{fmtX(m.moic)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Total ({rows.length})</td>
              <td /><td />
              <td className="num">{fmtM(rows.reduce((s, r) => s + r.m.invested, 0))}</td>
              <td className="num" />
              <td className="num">{fmtM(rows.reduce((s, r) => s + r.m.currentValue + r.m.realized, 0))}</td>
              <td className="num" />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

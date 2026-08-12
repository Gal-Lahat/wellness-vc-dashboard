import React, { useState } from 'react'
import {
  companies, investors, companyMetrics, capTableHistory,
  fmtM, fmtPct, fmtX,
} from '../data.js'
import { StackRow, StackLegend, ValuationChart } from '../charts.jsx'

const CAP_COLORS = [
  { key: 'founders', name: 'Founders', color: '#2a78d6' },
  { key: 'us', name: 'Meridian syndicate', color: '#eb6834' },
  { key: 'others', name: 'Other investors', color: '#1baf7a' },
  { key: 'esop', name: 'ESOP', color: '#eda100' },
]

const TABS = [
  ['rounds', 'Rounds & ownership'],
  ['captable', 'Cap-table history'],
  ['sim', 'Simulation'],
  ['docs', 'Documents'],
  ['quarter', 'Quarterly summary'],
]

export default function Company({ id, tab, go }) {
  const company = companies.find((c) => c.id === id)
  const [activeTab, setActiveTab] = useState(tab || 'rounds')
  if (!company) return <p>Company not found.</p>
  const m = companyMetrics(company)
  const caps = capTableHistory(company)

  return (
    <div>
      <div className="crumbs">
        <button onClick={() => go({ view: 'overview' })}>Fund overview</button>
        <span className="sep">/</span>
        <button onClick={() => go({ view: 'portfolio' })}>Portfolio</button>
        <span className="sep">/</span> {company.name}
      </div>
      <div className="page-head">
        <h1>{company.name}</h1>
        <span className="asof">{company.hq} · {company.segment}</span>
      </div>
      <p style={{ margin: '2px 0 10px', color: 'var(--ink-2)' }}>
        {company.oneLiner}.{' '}
        {company.status === 'exited'
          ? <>Acquired {company.exit.date} by {company.exit.acquirer.toLowerCase()}; {fmtM(company.exit.proceeds)} distributed to the syndicate.</>
          : <>Held at a {fmtM(company.currentValuation)} fair-value mark.</>}
      </p>

      <div className="tile-row">
        <div className="tile"><span className="label">Invested</span><span className="value" style={{ display: 'block' }}>{fmtM(m.invested)}</span><span className="sub" style={{ display: 'block' }}>{m.rounds.length} round{m.rounds.length > 1 ? 's' : ''}</span></div>
        <div className="tile"><span className="label">Syndicate ownership</span><span className="value" style={{ display: 'block' }}>{company.status === 'exited' ? '—' : fmtPct(m.ownership)}</span><span className="sub" style={{ display: 'block' }}>fully diluted</span></div>
        <div className="tile"><span className="label">{company.status === 'exited' ? 'Realized proceeds' : 'Current value'}</span><span className="value" style={{ display: 'block' }}>{fmtM(company.status === 'exited' ? m.realized : m.currentValue)}</span><span className="sub" style={{ display: 'block' }}>MOIC {fmtX(m.moic)}</span></div>
        <div className="tile"><span className="label">Last round</span><span className="value" style={{ display: 'block', fontSize: 19 }}>{m.rounds[m.rounds.length - 1].name}</span><span className="sub" style={{ display: 'block' }}>{m.rounds[m.rounds.length - 1].date} · {fmtM(m.rounds[m.rounds.length - 1].post)} post</span></div>
      </div>

      <div className="tabs" role="tablist" aria-label="Company sections">
        {TABS.map(([k, label]) => (
          <button key={k} role="tab" aria-selected={activeTab === k} onClick={() => setActiveTab(k)}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'rounds' && <RoundsTab company={company} m={m} />}
      {activeTab === 'captable' && <CapTableTab caps={caps} />}
      {activeTab === 'sim' && <SimTab company={company} m={m} />}
      {activeTab === 'docs' && <DocsTab company={company} />}
      {activeTab === 'quarter' && <QuarterTab company={company} m={m} />}
    </div>
  )
}

function RoundsTab({ company, m }) {
  return (
    <div>
      <div className="cols-main-side">
        <div className="card" style={{ padding: '4px 6px', overflowX: 'auto' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Round</th><th>Date</th>
                <th className="num">Pre-money</th><th className="num">Raised</th>
                <th className="num">Post-money</th><th className="num">Our check</th>
                <th className="num">Ownership after</th>
              </tr>
            </thead>
            <tbody>
              {m.rounds.map((r) => (
                <tr key={r.name}>
                  <td className="co">{r.name}</td>
                  <td>{r.date}</td>
                  <td className="num">{fmtM(r.pre)}</td>
                  <td className="num">{fmtM(r.raised)}</td>
                  <td className="num">{fmtM(r.post)}</td>
                  <td className="num">{fmtM(r.check)}</td>
                  <td className="num">{fmtPct(r.ownAfter)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card chart-card">
          <h3>Post-money valuation by round</h3>
          <p className="chart-sub">USD millions. Hover a point for the value.</p>
          <ValuationChart
            points={m.rounds.map((r) => ({ label: r.name, value: r.post }))}
            formatY={(v) => `$${Math.round(v)}M`}
            ariaLabel={`Post-money valuation of ${company.name} by round`}
          />
        </div>
      </div>

      <h2 className="section-title">Who invested in each round</h2>
      <div className="cols-2">
        {m.rounds.map((r) => (
          <div className="card" key={r.name}>
            <h3>{r.name} — syndicate check {fmtM(r.check)}</h3>
            <p className="chart-sub">{r.date} · {fmtM(r.pre)} pre / {fmtM(r.post)} post</p>
            <table className="tbl">
              <tbody>
                {Object.entries(r.mix).map(([invId, frac]) => {
                  const inv = investors.find((i) => i.id === invId)
                  return (
                    <tr key={invId}>
                      <td>{inv.name}</td>
                      <td className="num">{fmtM(r.check * frac)}</td>
                      <td className="num" style={{ color: 'var(--muted)' }}>{fmtPct(frac, 0)} of check</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  )
}

function CapTableTab({ caps }) {
  return (
    <div className="card chart-card">
      <h3>Cap-table evolution</h3>
      <p className="chart-sub">
        Fully diluted ownership after each round, reconstructed from the signed agreements.
        Hover a segment for its share.
      </p>
      <StackLegend items={CAP_COLORS} />
      {caps.map((snap) => (
        <StackRow
          key={snap.label}
          label={snap.label}
          valueLabel={fmtPct(snap.us)}
          segments={CAP_COLORS.map((c) => ({ name: c.name, share: snap[c.key], color: c.color }))}
        />
      ))}
      <p className="chart-sub" style={{ margin: '6px 0 14px' }}>Right-hand figure: Meridian syndicate stake at each point.</p>
      <table className="tbl">
        <thead>
          <tr><th>Snapshot</th>{CAP_COLORS.map((c) => <th key={c.key} className="num">{c.name}</th>)}</tr>
        </thead>
        <tbody>
          {caps.map((snap) => (
            <tr key={snap.label}>
              <td>{snap.label}</td>
              {CAP_COLORS.map((c) => <td key={c.key} className="num">{fmtPct(snap[c.key])}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SimTab({ company, m }) {
  const last = m.rounds[m.rounds.length - 1]
  const [raise, setRaise] = useState(Math.round(last.raised * 1.5))
  const [pre, setPre] = useState(Math.round((company.currentValuation ?? last.post) * 1.1))
  const [proRata, setProRata] = useState(true)

  const post = pre + raise
  const proRataCheck = proRata ? m.ownership * raise : 0
  const ownAfter = m.ownership * (pre / post) + proRataCheck / post
  const dilution = m.ownership > 0 ? (ownAfter - m.ownership) / m.ownership : 0
  const valueAfter = ownAfter * post
  const valueBefore = company.status === 'exited' ? 0 : m.currentValue

  return (
    <div className="cols-main-side">
      <div className="card">
        <h3>Next-round dilution &amp; valuation sensitivity</h3>
        <p className="chart-sub">
          Model a hypothetical next round for {company.name} and see the effect on the
          syndicate's stake — the "what happens to us if they raise" question, computed live.
        </p>
        <div className="sim-controls">
          <label>
            <span className="ctl-head">Round size <span className="ctl-val">{fmtM(raise)}</span></span>
            <input type="range" min="2" max="60" step="1" value={raise}
              onChange={(e) => setRaise(+e.target.value)} aria-label="Hypothetical round size in millions" />
          </label>
          <label>
            <span className="ctl-head">Pre-money valuation <span className="ctl-val">{fmtM(pre)}</span></span>
            <input type="range" min={Math.max(4, Math.round(last.post * 0.4))} max={Math.round(last.post * 4)} step="2" value={pre}
              onChange={(e) => setPre(+e.target.value)} aria-label="Hypothetical pre-money valuation in millions" />
          </label>
          <div>
            <span className="ctl-head" style={{ fontSize: 12, color: 'var(--ink-2)' }}>Our participation</span>
            <div className="sim-toggle" role="group" aria-label="Participation scenario">
              <button aria-pressed={proRata} onClick={() => setProRata(true)}>Invest pro-rata ({fmtM(m.ownership * raise)})</button>
              <button aria-pressed={!proRata} onClick={() => setProRata(false)}>Don't participate</button>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <h3>Outcome</h3>
        <p className="chart-sub">Post-money {fmtM(post)}{pre < last.post ? ' · down round vs. last post-money' : ''}</p>
        <div style={{ display: 'grid', gap: 6, marginBottom: 12 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--ink-2)' }}>
              <span>Stake today</span><span>{fmtPct(m.ownership)}</span>
            </div>
            <div className="meter" role="img" aria-label={`Current stake ${fmtPct(m.ownership)}`}>
              <span style={{ width: `${Math.min(100, m.ownership * 500)}%`, background: 'var(--baseline)' }} />
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--ink-2)' }}>
              <span>Stake after round</span><span>{fmtPct(ownAfter)}</span>
            </div>
            <div className="meter" role="img" aria-label={`Stake after round ${fmtPct(ownAfter)}`}>
              <span style={{ width: `${Math.min(100, ownAfter * 500)}%`, background: 'var(--brand)' }} />
            </div>
          </div>
        </div>
        <div className="sim-out">
          <div className="cell">
            <div className="label">Dilution of our stake</div>
            <div className={`value ${dilution < -0.001 ? 'down' : 'up'}`}>{dilution >= 0 ? '+' : ''}{fmtPct(dilution)}</div>
          </div>
          <div className="cell">
            <div className="label">New capital required</div>
            <div className="value">{proRata ? fmtM(proRataCheck) : '$0M'}</div>
          </div>
          <div className="cell">
            <div className="label">Stake value at new mark</div>
            <div className="value">{fmtM(valueAfter)}</div>
          </div>
          <div className="cell">
            <div className="label">vs. current holding value</div>
            <div className={`value ${valueAfter - valueBefore >= 0 ? 'up' : 'down'}`}>
              {valueAfter - valueBefore >= 0 ? '+' : '−'}{fmtM(Math.abs(valueAfter - valueBefore))}
            </div>
          </div>
        </div>
        <p className="chart-sub" style={{ marginTop: 12, marginBottom: 0 }}>
          Simplified model: single new share class, no option-pool top-up, no liquidation preferences.
        </p>
      </div>
    </div>
  )
}

function DocsTab({ company }) {
  return (
    <div className="card">
      <h3>Source documents</h3>
      <p className="chart-sub">
        The numbers on this page are extracted from these files. In the live system each figure
        links back to the exact clause or sheet it came from.
      </p>
      <ul className="doc-list">
        {company.docs.map((d) => (
          <li key={d.name}>
            <span className="doc-ico" aria-hidden="true">▤</span>
            <span>{d.name}</span>
            <span className="badge doc-kind">{d.kind}</span>
            <span className="doc-date">{d.date}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function QuarterTab({ company, m }) {
  const q = company.quarterly
  return (
    <div className="cols-main-side">
      <div className="card">
        <h3>Quarterly summary — {q.period}</h3>
        <p className="chart-sub">Auto-drafted from the company's investor update and board materials; partner-reviewed.</p>
        <table className="tbl">
          <tbody>
            <tr><td>Revenue</td><td className="num">{q.revenueRun}</td></tr>
            <tr><td>Cash position</td><td className="num">{q.cash}</td></tr>
            <tr><td>Our stake</td><td className="num">{company.status === 'exited' ? '—' : `${fmtPct(m.ownership)} · ${fmtM(m.currentValue)}`}</td></tr>
          </tbody>
        </table>
        <h3 style={{ marginTop: 16 }}>Highlights</h3>
        <ul className="qlist">
          {q.highlights.map((h) => <li key={h}>{h}</li>)}
        </ul>
        {q.watchouts.length > 0 && (
          <>
            <h3 style={{ marginTop: 16 }}>Watch-outs</h3>
            <ul className="qlist">
              {q.watchouts.map((w) => <li key={w}>⚠ {w}</li>)}
            </ul>
          </>
        )}
      </div>
      <div className="card">
        <h3>How this summary is built</h3>
        <p className="chart-sub" style={{ marginBottom: 8 }}>Workflow mirrored from the fund's current manual process:</p>
        <ol className="qlist" style={{ fontSize: 13, color: 'var(--ink-2)' }}>
          <li>Investor update lands by email → filed automatically.</li>
          <li>Key figures extracted and reconciled against the last board deck.</li>
          <li>Deltas vs. prior quarter flagged for partner review.</li>
          <li>Approved summary flows into the fund-level quarterly report.</li>
        </ol>
      </div>
    </div>
  )
}

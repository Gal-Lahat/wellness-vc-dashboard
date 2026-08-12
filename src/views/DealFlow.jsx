import React from 'react'
import { pipeline } from '../data.js'

const STAGES = ['Sourcing', 'Screening', 'Diligence', 'Investment committee', 'Passed']
const STAGE_CLASS = {
  Sourcing: 'stage-Sourcing', Screening: 'stage-Screening', Diligence: 'stage-Diligence',
  'Investment committee': 'stage-IC', Passed: 'stage-Passed',
}

function fitClass(fit) { return fit >= 80 ? 'hi' : fit >= 65 ? 'mid' : 'lo' }

export function DealFlow({ go }) {
  return (
    <div>
      <div className="crumbs">
        <button onClick={() => go({ view: 'overview' })}>Fund overview</button>
        <span className="sep">/</span> Deal flow
      </div>
      <div className="page-head">
        <h1>Deal flow &amp; diligence</h1>
        <span className="asof">{pipeline.filter((d) => d.stage !== 'Passed').length} live · sourced via referrers, portfolio and thesis work</span>
      </div>
      <p style={{ margin: '0 0 16px', color: 'var(--ink-2)', maxWidth: 680 }}>
        From first deck to investment committee. Each card tracks who introduced the company,
        mandate fit, scoring, open questions and the next action — select one to open the full file.
      </p>
      <div className="pipeline-cols">
        {STAGES.map((stage) => {
          const deals = pipeline.filter((d) => d.stage === stage)
          return (
            <div className="pipe-col" key={stage}>
              <h4>{stage} · {deals.length}</h4>
              {deals.map((d) => (
                <button className="deal-card" key={d.id} onClick={() => go({ view: 'deal', id: d.id })}>
                  <div className="d-name">{d.company}</div>
                  <div className="d-line">{d.oneLiner}</div>
                  <div className="d-meta">
                    <span>{d.referrer.split('(')[0].trim()}</span>
                    <span className={`fit ${fitClass(d.mandateFit)}`}>fit {d.mandateFit}</span>
                  </div>
                </button>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function DealDetail({ id, go }) {
  const d = pipeline.find((x) => x.id === id)
  if (!d) return <p>Deal not found.</p>
  return (
    <div>
      <div className="crumbs">
        <button onClick={() => go({ view: 'overview' })}>Fund overview</button>
        <span className="sep">/</span>
        <button onClick={() => go({ view: 'dealflow' })}>Deal flow</button>
        <span className="sep">/</span> {d.company}
      </div>
      <div className="page-head">
        <h1>{d.company}</h1>
        <span className="asof">{d.segment} · owner: {d.owner} · last touch {d.lastTouch}</span>
      </div>
      <p style={{ margin: '2px 0 12px', color: 'var(--ink-2)' }}>
        {d.oneLiner}. <span className={`badge ${STAGE_CLASS[d.stage]}`}>{d.stage}</span>
      </p>

      <div className="next-action" style={{ marginBottom: 14 }}>
        <strong>Next action:</strong> {d.nextAction.what}
        <span className="when">{d.nextAction.when}</span>
      </div>
      {d.passReason && (
        <p style={{ margin: '0 0 14px', color: 'var(--ink-2)' }}><strong>Pass rationale:</strong> {d.passReason}</p>
      )}

      <div className="cols-2">
        <div className="card">
          <h3>Sourcing &amp; relationship</h3>
          <table className="tbl">
            <tbody>
              <tr><td>Founder</td><td>{d.founder}</td></tr>
              <tr><td>Introduced by</td><td>{d.referrer}</td></tr>
              <tr><td>Mandate fit</td><td><span className={`fit ${fitClass(d.mandateFit)}`}>{d.mandateFit} / 100</span> — wellness thesis, stage and check size</td></tr>
              <tr><td>Deal owner</td><td>{d.owner}</td></tr>
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3>Scoring criteria</h3>
          {d.scores ? (
            <div className="score-grid">
              {Object.entries(d.scores).map(([k, v]) => (
                <React.Fragment key={k}>
                  <span className="s-label">{k}</span>
                  <span className="score-dots" role="img" aria-label={`${k}: ${v} of 5`}>
                    {[1, 2, 3, 4, 5].map((n) => <span key={n} className={n <= v ? 'on' : ''} />)}
                  </span>
                  <span className="score-num">{v}/5</span>
                </React.Fragment>
              ))}
            </div>
          ) : (
            <p className="chart-sub" style={{ marginBottom: 0 }}>
              Not yet scored — scoring happens at Screening, after the first partner meeting.
            </p>
          )}
        </div>

        <div className="card">
          <h3>Open questions</h3>
          {d.openQuestions.length ? (
            <ul className="qlist">{d.openQuestions.map((q) => <li key={q}>{q}</li>)}</ul>
          ) : (
            <p className="chart-sub" style={{ marginBottom: 0 }}>None outstanding.</p>
          )}
        </div>

        <div className="card">
          <h3>Documents</h3>
          <ul className="doc-list">
            {d.docs.map((doc) => (
              <li key={doc.name}>
                <span className="doc-ico" aria-hidden="true">▤</span>
                <span>{doc.name}</span>
                <span className="badge doc-kind">{doc.kind}</span>
                <span className="doc-date">{doc.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

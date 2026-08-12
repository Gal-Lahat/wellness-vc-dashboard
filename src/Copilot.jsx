import React, { useEffect, useRef, useState } from 'react'
import {
  pipeline, investorSummary, fundTotals,
  fmtM, fmtPct, fmtX,
} from './data.js'
import { WORKFLOWS, WorkflowRun } from './workflows.jsx'

// The copilot is deliberately secondary: the standing dashboard is the source
// of truth, and each prompt both answers from the same dataset and drives the
// dashboard to the screen that shows the underlying detail.

const TODAY = new Date('2026-08-12')
const daysSince = (iso) => Math.round((TODAY - new Date(iso)) / 86_400_000)

function buildPrompts(go) {
  return [
    {
      label: 'How is the fund positioned right now?',
      run: () => {
        const t = fundTotals()
        go({ view: 'overview' })
        return `Standing view: ${t.per.length} investments, ${fmtM(t.invested)} deployed, marked at ${fmtM(t.currentValue)} with ${fmtM(t.realized)} already distributed (DPI ${fmtX(t.dpi)}, TVPI ${fmtX(t.tvpi)}). ${t.activeDiligence} deals are in active diligence, and the largest allocation is ${t.allocation[0].segment} at ${fmtPct(t.allocation[0].share, 0)} of invested capital. Every tile on the overview clicks through to the detail behind it.`
      },
    },
    {
      label: 'Any deals waiting on a follow-up?',
      run: () => {
        const stale = pipeline.filter((d) => d.stage !== 'Passed' && daysSince(d.lastTouch) > 10)
        go({ view: 'dealflow' })
        if (!stale.length) return 'Nothing stale — every active deal has been touched recently.'
        return `Yes — ${stale.map((d) => `${d.company} (${daysSince(d.lastTouch)} days since last touch, next: ${d.nextAction.what.toLowerCase()})`).join('; ')}. The pipeline board is open; owner and next action sit on each card. In the live system I'd draft the follow-up note for you.`
      },
    },
    {
      label: 'Draft the Q2 letter for Arden Family Office',
      run: () => {
        const s = investorSummary('arden')
        go({ view: 'investor', id: 'arden' })
        return `Arden's page is open — use "Preview report" for the formatted letter. The numbers behind it: ${fmtM(s.invested)} invested across ${s.positions.length} companies, marked at ${fmtM(s.currentValue)} with ${fmtM(s.realized)} realized (TVPI ${fmtX((s.currentValue + s.realized) / s.invested)}). In production this exports to PDF and is emailed to each investor quarterly.`
      },
    },
  ]
}

export default function Copilot({ go, open, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: 'I sit alongside the dashboard — the standing screens always come first. Ask me to pull, cross-reference or simulate, and I\'ll drive the view to the answer. Try a prompt below.',
    },
  ])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [tick, setTick] = useState(0)
  const logRef = useRef(null)
  const prompts = buildPrompts(go)

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [messages, busy, tick])

  const ask = (label, runner) => {
    if (busy) return
    setMessages((m) => [...m, { role: 'user', text: label }])
    setBusy(true)
    setTimeout(() => {
      const text = runner
        ? runner()
        : 'In this mockup the suggested prompts answer with live numbers from the dataset on screen. In the production system, free-form questions run against the agent with access to the drive, agreements and updates — anything you would ask an analyst.'
      setMessages((m) => [...m, { role: 'ai', text }])
      setBusy(false)
    }, 400)
  }

  const runWorkflow = (wf) => {
    if (busy) return
    setBusy(true)
    setMessages((m) => [...m, { role: 'user', text: wf.label }, { role: 'run', wfId: wf.id }])
  }

  const submit = (e) => {
    e.preventDefault()
    const q = input.trim()
    if (!q) return
    setInput('')
    ask(q, null)
  }

  return (
    <aside className={open ? 'copilot open' : 'copilot'} aria-label="AI copilot panel">
      <div className="copilot-head">
        <h2>
          <span className="dot" aria-hidden="true" /> Copilot
          <button className="copilot-close" onClick={onClose} aria-label="Close copilot panel">✕</button>
        </h2>
        <p>Secondary to the dashboard — it explains, pulls and simulates. Illustrative.</p>
      </div>

      <div className="copilot-body" ref={logRef} aria-live="polite">
        {messages.map((m, i) => {
          if (m.role === 'run') {
            const wf = WORKFLOWS.find((w) => w.id === m.wfId)
            return (
              <WorkflowRun
                key={i}
                wf={wf}
                go={go}
                onTick={() => setTick((t) => t + 1)}
                onDone={() => setBusy(false)}
              />
            )
          }
          return (
            <div key={i} className={`msg ${m.role}`}>
              {m.role === 'ai' && <span className="msg-tag">Copilot</span>}
              {m.text}
            </div>
          )
        })}
        {busy && messages[messages.length - 1]?.role !== 'run' && (
          <div className="msg ai" aria-label="Working">…</div>
        )}
      </div>

      <div className="prompts" role="group" aria-label="Example prompts">
        <span className="prompts-label">Deep analyses — multi-step</span>
        {WORKFLOWS.map((wf) => (
          <button key={wf.id} className="prompt-chip deep" disabled={busy} onClick={() => runWorkflow(wf)}>
            {wf.label}
          </button>
        ))}
        <span className="prompts-label" style={{ marginTop: 6 }}>Quick questions</span>
        {prompts.map((p) => (
          <button key={p.label} className="prompt-chip" disabled={busy} onClick={() => ask(p.label, p.run)}>
            {p.label}
          </button>
        ))}
      </div>

      <form className="copilot-input" onSubmit={submit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the portfolio…"
          aria-label="Ask the copilot"
        />
        <button type="submit" disabled={busy || !input.trim()}>Send</button>
      </form>
    </aside>
  )
}

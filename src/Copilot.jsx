import React, { useEffect, useRef, useState } from 'react'
import {
  companies, investors, pipeline,
  companyMetrics, capTableHistory, investorPosition, investorSummary, fundTotals,
  fmtM, fmtPct, fmtX,
} from './data.js'

// The copilot is deliberately secondary: the standing dashboard is the source
// of truth, and each prompt both answers from the same dataset and drives the
// dashboard to the screen that shows the underlying detail.

const TODAY = new Date('2026-08-12')
const daysSince = (iso) => Math.round((TODAY - new Date(iso)) / 86_400_000)

function buildPrompts(go) {
  return [
    {
      label: 'Simulate dilution: Restora raises a $30M Series C',
      run: () => {
        const c = companies.find((x) => x.id === 'restora')
        const m = companyMetrics(c)
        const pre = 130, raise = 30, post = pre + raise
        const proRata = m.ownership * raise
        const ownAfter = m.ownership * (pre / post) + proRata / post
        go({ view: 'company', id: 'restora', tab: 'sim' })
        return `Restora's simulator is open. At $130M pre / ${fmtM(post)} post, a $30M round dilutes the syndicate from ${fmtPct(m.ownership)} to ${fmtPct(m.ownership * (pre / post))} if we sit out, or holds us at ${fmtPct(ownAfter)} with a ${fmtM(proRata)} pro-rata check. Stake value at the new mark: ${fmtM(ownAfter * post)}. Drag the sliders to test other terms — the math updates live.`
      },
    },
    {
      label: 'How is the fund positioned right now?',
      run: () => {
        const t = fundTotals()
        go({ view: 'overview' })
        return `Standing view: ${t.per.length} investments, ${fmtM(t.invested)} deployed, marked at ${fmtM(t.currentValue)} with ${fmtM(t.realized)} already distributed (DPI ${fmtX(t.dpi)}, TVPI ${fmtX(t.tvpi)}). ${t.activeDiligence} deals are in active diligence, and the largest allocation is ${t.allocation[0].segment} at ${fmtPct(t.allocation[0].share, 0)} of invested capital. Every tile on the overview clicks through to the detail behind it.`
      },
    },
    {
      label: "Explain Restora's cap-table history",
      run: () => {
        const c = companies.find((x) => x.id === 'restora')
        const caps = capTableHistory(c)
        const last = caps[caps.length - 1]
        go({ view: 'company', id: 'restora', tab: 'captable' })
        return `Restora's cap-table page is open. Across Seed → Series A → Series B the syndicate built up to ${fmtPct(last.us)} fully diluted, while founders diluted to ${fmtPct(last.founders)} and other investors hold ${fmtPct(last.others)}. Each bar is reconstructed from the executed agreements listed under source documents — in the live system every figure links to the clause it came from.`
      },
    },
    {
      label: 'Which co-investor has the most mental-health exposure?',
      run: () => {
        let best = null
        for (const inv of investors) {
          const exp = companies
            .filter((c) => c.segment === 'Mental health')
            .map((c) => investorPosition(c, inv.id))
            .filter(Boolean)
            .reduce((s, p) => s + p.invested, 0)
          if (!best || exp > best.exp) best = { inv, exp }
        }
        go({ view: 'investor', id: best.inv.id })
        return `${best.inv.name} — ${fmtM(best.exp)} invested across the mental-health positions (Kinetic Mind, Sagelight, Calmora, MindTide). Their entity page is open: per-company invested amounts, look-through ownership, current value and realized proceeds, plus the quarterly report preview.`
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
  const logRef = useRef(null)
  const prompts = buildPrompts(go)

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [messages, busy])

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
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            {m.role === 'ai' && <span className="msg-tag">Copilot</span>}
            {m.text}
          </div>
        ))}
        {busy && <div className="msg ai" aria-label="Working">…</div>}
      </div>

      <div className="prompts" role="group" aria-label="Example prompts">
        <span className="prompts-label">Try asking</span>
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

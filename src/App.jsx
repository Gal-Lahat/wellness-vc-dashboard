import React, { useEffect, useState } from 'react'
import { FUND } from './data.js'
import Overview from './views/Overview.jsx'
import Portfolio from './views/Portfolio.jsx'
import Company from './views/Company.jsx'
import { InvestorList, InvestorDetail } from './views/Investors.jsx'
import { DealFlow, DealDetail } from './views/DealFlow.jsx'
import Copilot from './Copilot.jsx'

const NAV = [
  { view: 'overview', label: 'Fund overview', glyph: '◧' },
  { view: 'portfolio', label: 'Portfolio', glyph: '▦' },
  { view: 'investors', label: 'Co-investors', glyph: '◔' },
  { view: 'dealflow', label: 'Deal flow', glyph: '▷' },
]

function routeFromHash() {
  const h = window.location.hash.replace(/^#\/?/, '')
  const [view, id, tab] = h.split('/')
  if (['portfolio', 'investors', 'dealflow', 'overview'].includes(view)) return { view }
  if (['company', 'investor', 'deal'].includes(view) && id) return { view, id, tab }
  return { view: 'overview' }
}

export default function App() {
  const [route, setRoute] = useState(routeFromHash)
  const [copilotOpen, setCopilotOpen] = useState(false)

  const go = (r) => {
    setRoute(r)
    const path = r.id ? `#/${r.view}/${r.id}${r.tab ? `/${r.tab}` : ''}` : `#/${r.view}`
    if (window.location.hash !== path) window.history.pushState(null, '', path)
    window.scrollTo({ top: 0 })
  }

  useEffect(() => {
    const onPop = () => setRoute(routeFromHash())
    window.addEventListener('popstate', onPop)
    window.addEventListener('hashchange', onPop)
    return () => {
      window.removeEventListener('popstate', onPop)
      window.removeEventListener('hashchange', onPop)
    }
  }, [])

  const activeNav =
    route.view === 'company' ? 'portfolio'
    : route.view === 'investor' ? 'investors'
    : route.view === 'deal' ? 'dealflow'
    : route.view

  let main
  if (route.view === 'portfolio') main = <Portfolio go={go} initialFilter={route.filter} />
  else if (route.view === 'company') main = <Company id={route.id} tab={route.tab} go={go} key={`${route.id}-${route.tab || ''}`} />
  else if (route.view === 'investors') main = <InvestorList go={go} />
  else if (route.view === 'investor') main = <InvestorDetail id={route.id} go={go} key={route.id} />
  else if (route.view === 'dealflow') main = <DealFlow go={go} />
  else if (route.view === 'deal') main = <DealDetail id={route.id} go={go} key={route.id} />
  else main = <Overview go={go} />

  return (
    <div className="shell">
      <aside className="sidebar">
        <h1 className="wordmark">
          {FUND.name}
          <small>Portfolio operating system</small>
        </h1>
        <nav className="nav" aria-label="Primary">
          {NAV.map((n) => (
            <button
              key={n.view}
              aria-current={activeNav === n.view}
              onClick={() => go({ view: n.view })}
            >
              <span className="glyph" aria-hidden="true">{n.glyph}</span>
              {n.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          <span className="illustrative">Illustrative data</span>
          <p style={{ margin: '8px 0 0' }}>
            Design mockup — all companies, investors, people and figures are fictional.
          </p>
        </div>
      </aside>

      <main className="main">{main}</main>

      <Copilot go={go} open={copilotOpen} onClose={() => setCopilotOpen(false)} />
      <button
        className="copilot-fab"
        onClick={() => setCopilotOpen(true)}
        aria-label="Open AI copilot panel"
      >
        ✦ Copilot
      </button>
    </div>
  )
}

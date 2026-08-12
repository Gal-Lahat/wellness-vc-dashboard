# Meridian Wellness Partners — Portfolio Operating System (design mockup)

An interactive frontend mockup of a wellness-focused VC operating system, built
to match the client meeting transcript: a **standing, click-through dashboard as
the primary interface**, with an **AI copilot as a secondary side panel**. There
is no backend — everything runs locally on an illustrative dataset.

> **All companies, investors, people, amounts and documents are fictional.**
> The sidebar carries an "Illustrative data" badge on every screen.

## What the transcript asked for → where it lives

| Transcript requirement | Where |
|---|---|
| "One view" standing dashboard, visible **before** asking the AI anything | **Fund overview** — standing metric tiles, invested-vs-value chart, allocation, "needs attention" list |
| "Click, click, click to reach the information" — 15 investments → list → company → rounds/dates/amounts/percentages | Overview "Investments: 15" tile → **Portfolio** table → **Company page** |
| Rounds, dates, amounts, ownership, valuations | Company page — rounds table + post-money valuation chart |
| Cap-table per round, reconstructed from executed agreements | Company page — cap-table history (stacked bars + table) with the source documents one tab over |
| Quarterly summary per company | Company page — quarterly summary tab (with the manual→automated workflow it replaces) |
| Sensitivity analyses & cap-table simulations | Company page — dilution/valuation simulator (round size, pre-money, pro-rata participation) |
| Co-investment model: every investor a separate entity, per-round breakdown | **Co-investors** — invested / ownership / current value / realized per entity; per-round splits on each company page |
| Quarterly investor statement ("like a fund sends its LPs") | Investor page — report preview |
| Fund-level metrics: total invested, value, IRR, DPI, exits, active diligence, allocation | Overview tiles (invested/value/DPI/exits computed from the round-level dataset; IRR a stated illustrative figure) |
| Deal flow: who introduced the company, relationship tracking, mandate fit | **Deal flow** — pipeline board (Sourcing → Screening → Diligence → IC → Passed) + deal pages |
| Scoring startups against criteria | Deal page — 1–5 scoring across Team / Market / Product / Traction / Mandate fit |
| Due diligence: data room, legal docs, investment memorandum | Deal page — documents (data room index, legal, memo drafts), open questions, next action |
| Follow-up reminders | Overview "needs attention" tiles; copilot prompt "Any deals waiting on a follow-up?" |
| AI on the side: "a place to send a query", incl. cap-table graphs & dilution simulations | **Copilot panel** — clickable prompts that compute from the same dataset and drive the dashboard to the answer |

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build (dist/)
npm run preview  # serve the build
```

## Stack & structure

React 18 + Vite, no other runtime dependencies. Charts are hand-rolled SVG using
a validated colorblind-safe categorical palette (fixed slot order); UI chrome is
a restrained investment-office theme (paper surfaces, hairline rules, serif
headings, sans figures — no gradients, no chat-first layout).

```
src/
  data.js            # illustrative dataset + derivations (round math, cap-table
                     #   history, per-investor look-through, fund totals, formatting)
  charts.jsx         # SVG charts: line w/ crosshair+tooltip, stacked bars, valuation chart
  App.jsx            # shell, sidebar nav, hash routing
  Copilot.jsx        # side-panel copilot with example prompts wired to the data
  views/
    Overview.jsx     # standing fund dashboard
    Portfolio.jsx    # 15-investment list with active/exited filter
    Company.jsx      # rounds, cap-table history, simulation, docs, quarterly summary
    Investors.jsx    # co-investor list + entity page + report preview
    DealFlow.jsx     # pipeline board + deal detail (scoring, questions, docs, next action)
```

## Notes

- Routing is a tiny hash router (`#/company/restora`, `#/company/restora/sim`,
  `#/investor/arden`…) — back/forward work, views are linkable.
- Accessibility: semantic tables, keyboard-activatable rows and tiles,
  `aria-label`s on charts (with data tables alongside), visible focus rings,
  reduced-motion support.
- Responsive: the copilot docks beside the content on wide screens and becomes
  an overlay drawer (floating "Copilot" button) under 1180px; the sidebar
  collapses to a top bar on phones; tables scroll horizontally.
- No secrets, no network calls, nothing persisted.

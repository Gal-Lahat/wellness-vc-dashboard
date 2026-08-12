// ---------------------------------------------------------------------------
// Meridian Wellness Partners — illustrative dataset.
// Every name, figure and document in this file is fictional, created for a
// product mockup. Nothing here describes a real fund, company or person.
// ---------------------------------------------------------------------------

export const FUND = {
  name: 'Meridian Wellness Partners',
  shortName: 'Meridian',
  model: 'Co-investment syndicate',
  vintage: 2020,
  netIRR: 0.271, // stated fund-level figure (illustrative)
  asOf: 'Q2 2026',
}

// --- Co-investors (the syndicate) ------------------------------------------
export const investors = [
  { id: 'arden', name: 'Arden Family Office', type: 'Family office' },
  { id: 'feld', name: 'Dr. Maya Feld', type: 'Angel — physician' },
  { id: 'cypress', name: 'Cypress Holdings', type: 'Family office' },
  { id: 'brandt', name: 'N. Brandt', type: 'Angel — operator' },
  { id: 'shore', name: 'Shorewater Capital', type: 'Family office' },
  { id: 'rosen', name: 'Dr. E. Rosen', type: 'Angel — physician' },
  { id: 'tamar', name: 'Tamar Group', type: 'Holding company' },
]

// Recurring syndicate mixes (fractions of each round's syndicate check).
const MIX_A = { arden: 0.3, feld: 0.15, cypress: 0.25, brandt: 0.1, shore: 0.2 }
const MIX_B = { arden: 0.25, cypress: 0.2, shore: 0.25, rosen: 0.15, tamar: 0.15 }
const MIX_C = { feld: 0.2, brandt: 0.2, rosen: 0.25, tamar: 0.35 }
const MIX_D = { arden: 0.4, cypress: 0.3, tamar: 0.3 }
const MIX_E = { feld: 0.3, shore: 0.35, rosen: 0.35 }

// --- Portfolio ---------------------------------------------------------------
// Amounts in USD millions. `pre` = pre-money, `raised` = full round size,
// `check` = the syndicate's share of the round, split by `mix`.
export const companies = [
  {
    id: 'restora', name: 'Restora Sleep Health', segment: 'Digital care',
    oneLiner: 'Sleep clinics paired with a CBT-I digital program', hq: 'Tel Aviv',
    status: 'active', currentValuation: 96, stage: 'Series B',
    rounds: [
      { name: 'Seed', date: '2020-06', pre: 8, raised: 3, check: 1.2, mix: MIX_A },
      { name: 'Series A', date: '2022-03', pre: 30, raised: 10, check: 1.8, mix: MIX_A },
      { name: 'Series B', date: '2024-09', pre: 72, raised: 24, check: 2.0, mix: MIX_B },
    ],
    quarterly: {
      period: 'Q2 2026',
      revenueRun: '$14.2M ARR, +11% QoQ', cash: '21 months runway',
      highlights: [
        'Opened 4th clinic (Haifa); digital program now 61% of gross margin.',
        'Payer pilot with a national HMO expanded to 12,000 covered members.',
        'Hired VP Clinical Ops (ex-hospital network COO).',
      ],
      watchouts: ['Clinic build-outs pushing capex above plan by ~8%.'],
    },
    docs: [
      { name: 'Series B — Share Purchase Agreement.pdf', kind: 'Agreement', date: '2024-09-14' },
      { name: 'Series B — Cap table (post-closing).xlsx', kind: 'Cap table', date: '2024-09-20' },
      { name: 'Q2 2026 investor update.pdf', kind: 'Update', date: '2026-07-08' },
      { name: 'Board deck — June 2026.pdf', kind: 'Board', date: '2026-06-19' },
    ],
  },
  {
    id: 'kinetic', name: 'Kinetic Mind', segment: 'Mental health',
    oneLiner: 'Employer-sponsored mental-health care platform', hq: 'London',
    status: 'active', currentValuation: 64, stage: 'Series A',
    rounds: [
      { name: 'Seed', date: '2021-02', pre: 10, raised: 4, check: 1.5, mix: MIX_B },
      { name: 'Series A', date: '2023-05', pre: 42, raised: 14, check: 2.2, mix: MIX_B },
    ],
    quarterly: {
      period: 'Q2 2026',
      revenueRun: '$9.8M ARR, +7% QoQ', cash: '17 months runway',
      highlights: ['Signed two Fortune-500 logos.', 'Clinical outcomes paper accepted (peer-reviewed).'],
      watchouts: ['Net revenue retention dipped to 104% on one downsell.'],
    },
    docs: [
      { name: 'Series A — SPA.pdf', kind: 'Agreement', date: '2023-05-30' },
      { name: 'Q2 2026 investor update.pdf', kind: 'Update', date: '2026-07-15' },
    ],
  },
  {
    id: 'verdebiome', name: 'VerdeBiome', segment: 'Nutrition & metabolic',
    oneLiner: 'Microbiome-guided nutrition programs', hq: 'Berlin',
    status: 'active', currentValuation: 30, stage: 'Seed+',
    rounds: [
      { name: 'Seed', date: '2021-09', pre: 9, raised: 3.5, check: 1.0, mix: MIX_C },
      { name: 'Seed extension', date: '2023-11', pre: 18, raised: 5, check: 0.8, mix: MIX_C },
    ],
    quarterly: {
      period: 'Q2 2026',
      revenueRun: '$3.1M ARR, +5% QoQ', cash: '11 months runway',
      highlights: ['Retail partnership pilot in 40 pharmacies.'],
      watchouts: ['Series A timing depends on H2 retention data.'],
    },
    docs: [
      { name: 'Seed extension — SAFE.pdf', kind: 'Agreement', date: '2023-11-02' },
      { name: 'Q2 2026 investor update.pdf', kind: 'Update', date: '2026-07-11' },
    ],
  },
  {
    id: 'pulseform', name: 'Pulseform', segment: 'Movement & recovery',
    oneLiner: 'Recovery wearable for athletes and physio clinics', hq: 'Amsterdam',
    status: 'active', currentValuation: 48, stage: 'Series A',
    rounds: [
      { name: 'Seed', date: '2020-11', pre: 7, raised: 2.5, check: 0.9, mix: MIX_A },
      { name: 'Series A', date: '2022-10', pre: 32, raised: 11, check: 1.6, mix: MIX_D },
    ],
    quarterly: {
      period: 'Q2 2026',
      revenueRun: '$7.4M revenue run-rate, +9% QoQ', cash: '14 months runway',
      highlights: ['Clinic channel now 45% of sales.'],
      watchouts: ['Hardware margin pressure from component costs.'],
    },
    docs: [
      { name: 'Series A — SPA.pdf', kind: 'Agreement', date: '2022-10-21' },
      { name: 'Q2 2026 investor update.pdf', kind: 'Update', date: '2026-07-04' },
    ],
  },
  {
    id: 'nutrigraph', name: 'NutriGraph', segment: 'Nutrition & metabolic',
    oneLiner: 'CGM-based metabolic coaching for pre-diabetics', hq: 'Tel Aviv',
    status: 'active', currentValuation: 55, stage: 'Series A',
    rounds: [
      { name: 'Pre-seed', date: '2021-05', pre: 5, raised: 1.5, check: 0.6, mix: MIX_E },
      { name: 'Seed', date: '2022-08', pre: 14, raised: 5, check: 1.1, mix: MIX_A },
      { name: 'Series A', date: '2025-01', pre: 40, raised: 15, check: 1.4, mix: MIX_B },
    ],
    quarterly: {
      period: 'Q2 2026',
      revenueRun: '$6.0M ARR, +14% QoQ', cash: '23 months runway',
      highlights: ['FDA breakthrough-device pathway conversation opened.', 'Churn at all-time low (1.9% monthly).'],
      watchouts: ['CGM supply agreement renewal due Q4.'],
    },
    docs: [
      { name: 'Series A — SPA.pdf', kind: 'Agreement', date: '2025-01-17' },
      { name: 'Q2 2026 investor update.pdf', kind: 'Update', date: '2026-07-09' },
    ],
  },
  {
    id: 'ovacare', name: 'OvaCare Health', segment: 'Femtech & family',
    oneLiner: 'Fertility diagnostics and care navigation', hq: 'Boston',
    status: 'active', currentValuation: 70, stage: 'Series A',
    rounds: [
      { name: 'Seed', date: '2021-11', pre: 12, raised: 4.5, check: 1.3, mix: MIX_B },
      { name: 'Series A', date: '2024-02', pre: 48, raised: 16, check: 1.9, mix: MIX_D },
    ],
    quarterly: {
      period: 'Q2 2026',
      revenueRun: '$8.6M ARR, +10% QoQ', cash: '19 months runway',
      highlights: ['Employer channel doubled YoY.'],
      watchouts: ['Key-person dependency on chief medical officer.'],
    },
    docs: [
      { name: 'Series A — SPA.pdf', kind: 'Agreement', date: '2024-02-12' },
      { name: 'Q2 2026 investor update.pdf', kind: 'Update', date: '2026-07-18' },
    ],
  },
  {
    id: 'stridewell', name: 'Stridewell', segment: 'Movement & recovery',
    oneLiner: 'Digital musculoskeletal physiotherapy', hq: 'Stockholm',
    status: 'active', currentValuation: 26, stage: 'Seed',
    rounds: [
      { name: 'Seed', date: '2022-04', pre: 11, raised: 4, check: 1.2, mix: MIX_C },
    ],
    quarterly: {
      period: 'Q2 2026',
      revenueRun: '$2.4M ARR, +6% QoQ', cash: '13 months runway',
      highlights: ['Nordic insurer pilot converted to contract.'],
      watchouts: ['Competitive pressure from US entrants in EU tenders.'],
    },
    docs: [
      { name: 'Seed — SPA.pdf', kind: 'Agreement', date: '2022-04-26' },
      { name: 'Q2 2026 investor update.pdf', kind: 'Update', date: '2026-07-02' },
    ],
  },
  {
    id: 'lucent', name: 'Lucent Dermics', segment: 'Digital care',
    oneLiner: 'Tele-dermatology with AI triage', hq: 'Barcelona',
    status: 'active', currentValuation: 22, stage: 'Seed',
    rounds: [
      { name: 'Seed', date: '2022-09', pre: 9, raised: 3.5, check: 1.0, mix: MIX_E },
    ],
    quarterly: {
      period: 'Q2 2026',
      revenueRun: '$1.8M ARR, +8% QoQ', cash: '10 months runway',
      highlights: ['CE-mark for triage algorithm granted.'],
      watchouts: ['Bridge likely before Series A; term discussion started.'],
    },
    docs: [
      { name: 'Seed — SPA.pdf', kind: 'Agreement', date: '2022-09-13' },
      { name: 'Q2 2026 investor update.pdf', kind: 'Update', date: '2026-07-21' },
    ],
  },
  {
    id: 'everbloom', name: 'Everbloom Senior', segment: 'Clinics & longevity',
    oneLiner: 'Wellness and fall-prevention programs for seniors', hq: 'Tel Aviv',
    status: 'active', currentValuation: 34, stage: 'Series A',
    rounds: [
      { name: 'Seed', date: '2020-09', pre: 6, raised: 2, check: 0.8, mix: MIX_A },
      { name: 'Series A', date: '2023-01', pre: 24, raised: 8, check: 1.2, mix: MIX_C },
    ],
    quarterly: {
      period: 'Q1 2026 (latest received)',
      revenueRun: '$5.2M revenue run-rate, +4% QoQ', cash: '16 months runway',
      highlights: ['Municipal program renewed in 3 cities.'],
      watchouts: ['Reimbursement policy change under review.', 'No Q2 update received yet — chased twice.'],
    },
    docs: [
      { name: 'Series A — SPA.pdf', kind: 'Agreement', date: '2023-01-19' },
      { name: 'Q1 2026 investor update.pdf', kind: 'Update', date: '2026-04-06' },
    ],
  },
  {
    id: 'solstice', name: 'Solstice Longevity', segment: 'Clinics & longevity',
    oneLiner: 'Preventive longevity clinics with diagnostics membership', hq: 'Zurich',
    status: 'active', currentValuation: 58, stage: 'Series A',
    rounds: [
      { name: 'Seed', date: '2022-06', pre: 16, raised: 6, check: 1.5, mix: MIX_D },
      { name: 'Series A', date: '2024-12', pre: 44, raised: 14, check: 1.6, mix: MIX_B },
    ],
    quarterly: {
      period: 'Q2 2026',
      revenueRun: '$11.0M revenue run-rate, +12% QoQ', cash: '20 months runway',
      highlights: ['Membership waitlist at 2 locations.', 'Second clinic broke even in month 9.'],
      watchouts: ['Physician recruiting is the scaling constraint.'],
    },
    docs: [
      { name: 'Series A — SPA.pdf', kind: 'Agreement', date: '2024-12-05' },
      { name: 'Q2 2026 investor update.pdf', kind: 'Update', date: '2026-07-13' },
    ],
  },
  {
    id: 'coreox', name: 'CoreOx Performance', segment: 'Movement & recovery',
    oneLiner: 'Corporate fitness and breathwork programs', hq: 'Dublin',
    status: 'active', currentValuation: 12, stage: 'Seed',
    rounds: [
      { name: 'Seed', date: '2021-07', pre: 8, raised: 2.5, check: 0.7, mix: MIX_E },
    ],
    quarterly: {
      period: 'Q1 2026 (latest received)',
      revenueRun: '$1.1M ARR, flat QoQ', cash: '8 months runway',
      highlights: ['Pivoted to channel sales via insurers.'],
      watchouts: ['Held at cost internally pending pivot evidence; growth stalled two quarters.', 'Q2 update overdue.'],
    },
    docs: [
      { name: 'Seed — SPA.pdf', kind: 'Agreement', date: '2021-07-22' },
      { name: 'Q1 2026 investor update.pdf', kind: 'Update', date: '2026-04-19' },
    ],
  },
  {
    id: 'halewell', name: 'Halewell Clinics', segment: 'Clinics & longevity',
    oneLiner: 'Hybrid primary-care and wellness clinics', hq: 'Manchester',
    status: 'active', currentValuation: 40, stage: 'Series A',
    rounds: [
      { name: 'Seed', date: '2021-03', pre: 10, raised: 3.5, check: 1.1, mix: MIX_B },
      { name: 'Series A', date: '2023-09', pre: 28, raised: 10, check: 1.3, mix: MIX_A },
    ],
    quarterly: {
      period: 'Q2 2026',
      revenueRun: '$7.9M revenue run-rate, +6% QoQ', cash: '15 months runway',
      highlights: ['5th clinic opened; NPS 74.'],
      watchouts: ['Nurse staffing costs above plan.'],
    },
    docs: [
      { name: 'Series A — SPA.pdf', kind: 'Agreement', date: '2023-09-08' },
      { name: 'Q2 2026 investor update.pdf', kind: 'Update', date: '2026-07-16' },
    ],
  },
  {
    id: 'sagelight', name: 'Sagelight', segment: 'Mental health',
    oneLiner: 'AI-assisted therapist tooling and notes', hq: 'Tel Aviv',
    status: 'active', currentValuation: 45, stage: 'Seed+',
    rounds: [
      { name: 'Seed', date: '2023-04', pre: 14, raised: 5, check: 1.4, mix: MIX_A },
      { name: 'Seed extension', date: '2025-06', pre: 34, raised: 8, check: 1.0, mix: MIX_E },
    ],
    quarterly: {
      period: 'Q2 2026',
      revenueRun: '$4.4M ARR, +18% QoQ', cash: '22 months runway',
      highlights: ['Fastest-growing company in the portfolio this quarter.'],
      watchouts: ['Category is crowding; moat rests on EHR integrations.'],
    },
    docs: [
      { name: 'Seed extension — SPA.pdf', kind: 'Agreement', date: '2025-06-11' },
      { name: 'Q2 2026 investor update.pdf', kind: 'Update', date: '2026-07-22' },
    ],
  },
  // --- Exited ---------------------------------------------------------------
  {
    id: 'calmora', name: 'Calmora', segment: 'Mental health',
    oneLiner: 'Consumer meditation and sleep audio (acquired 2024)', hq: 'Lisbon',
    status: 'exited', stage: 'Acquired',
    exit: { date: '2024-05', acquirer: 'A global audio-streaming platform', proceeds: 6.8 },
    rounds: [
      { name: 'Seed', date: '2020-04', pre: 6, raised: 2, check: 0.8, mix: MIX_A },
      { name: 'Series A', date: '2022-01', pre: 25, raised: 8, check: 1.0, mix: MIX_C },
    ],
    quarterly: {
      period: 'Q2 2024 (final)',
      revenueRun: '—', cash: '—',
      highlights: ['Acquisition closed May 2024; proceeds distributed June 2024.'],
      watchouts: [],
    },
    docs: [
      { name: 'Merger agreement (executed).pdf', kind: 'Agreement', date: '2024-05-28' },
      { name: 'Distribution notice — June 2024.pdf', kind: 'Distribution', date: '2024-06-14' },
    ],
  },
  {
    id: 'mindtide', name: 'MindTide', segment: 'Mental health',
    oneLiner: 'Adolescent mental-health screening for schools (acquired 2025)', hq: 'Toronto',
    status: 'exited', stage: 'Acquired',
    exit: { date: '2025-10', acquirer: 'A listed digital-health group', proceeds: 8.9 },
    rounds: [
      { name: 'Seed', date: '2021-01', pre: 9, raised: 3, check: 1.1, mix: MIX_B },
      { name: 'Series A', date: '2023-03', pre: 36, raised: 12, check: 1.5, mix: MIX_D },
    ],
    quarterly: {
      period: 'Q4 2025 (final)',
      revenueRun: '—', cash: '—',
      highlights: ['Acquisition closed October 2025 at ~2.1× our blended cost.'],
      watchouts: [],
    },
    docs: [
      { name: 'Share purchase agreement (exit).pdf', kind: 'Agreement', date: '2025-10-03' },
      { name: 'Distribution notice — Nov 2025.pdf', kind: 'Distribution', date: '2025-11-10' },
    ],
  },
]

// --- Deal flow & diligence pipeline -----------------------------------------
export const pipeline = [
  {
    id: 'auracycle', company: 'AuraCycle', segment: 'Femtech & family',
    oneLiner: 'Hormone-cycle-aware training and nutrition app',
    stage: 'Sourcing', founder: 'Dana K. (2nd-time founder)', referrer: 'Dr. Maya Feld (co-investor)',
    mandateFit: 82, lastTouch: '2026-08-03', owner: 'Galia',
    scores: null,
    openQuestions: ['Retention beyond 90 days?', 'Regulated-claim exposure on hormone guidance?'],
    docs: [{ name: 'Intro deck (12 slides).pdf', kind: 'Deck', date: '2026-08-01' }],
    nextAction: { what: 'Second partner meeting', when: '2026-08-18' },
    links: [
      { companyId: 'ovacare', kind: 'adjacent', note: 'Both sell into the women’s-health employer channel; OvaCare CMO knows the founder.' },
    ],
  },
  {
    id: 'fernhealth', company: 'Fern Health Kitchens', segment: 'Nutrition & metabolic',
    oneLiner: 'Medically tailored meals reimbursed by insurers',
    stage: 'Sourcing', founder: 'T. Okafor (ex-hospital dietetics lead)', referrer: 'Inbound — conference',
    mandateFit: 61, lastTouch: '2026-07-22', owner: 'Sagi',
    scores: null,
    openQuestions: ['Unit economics of last-mile delivery?', 'Is this venture-scale or a services business?'],
    docs: [{ name: 'One-pager.pdf', kind: 'Deck', date: '2026-07-20' }],
    nextAction: { what: 'Decide pass / first call', when: '2026-08-14' },
  },
  {
    id: 'somnia', company: 'Somnia Labs', segment: 'Digital care',
    oneLiner: 'At-home sleep-apnea diagnostics',
    stage: 'Screening', founder: 'R. Adler & O. Peled', referrer: 'Restora founder (portfolio)',
    mandateFit: 88, lastTouch: '2026-08-06', owner: 'Galia',
    scores: { Team: 4, Market: 4, Product: 3, Traction: 3, 'Mandate fit': 5 },
    openQuestions: ['FDA 510(k) timeline realistic?', 'Overlap / synergy with Restora — conflict check.'],
    docs: [
      { name: 'Seed deck.pdf', kind: 'Deck', date: '2026-07-30' },
      { name: 'Clinical validation summary.pdf', kind: 'Clinical', date: '2026-08-05' },
    ],
    nextAction: { what: 'Reference calls (2 clinicians)', when: '2026-08-15' },
    links: [
      { companyId: 'restora', kind: 'competes', note: 'Home diagnostics could cannibalize Restora’s clinic intake funnel — flagged in open questions.' },
      { companyId: 'restora', kind: 'referred', note: 'Introduced by the Restora founder (portfolio referral).' },
    ],
  },
  {
    id: 'vitalpath', company: 'VitalPath', segment: 'Clinics & longevity',
    oneLiner: 'Longevity-clinic operating software',
    stage: 'Screening', founder: 'M. Haas (ex-Solstice eng lead)', referrer: 'Solstice CEO (portfolio)',
    mandateFit: 74, lastTouch: '2026-07-29', owner: 'Sagi',
    scores: { Team: 4, Market: 3, Product: 4, Traction: 2, 'Mandate fit': 4 },
    openQuestions: ['Is the buyer the clinic or the physician group?', 'Pipeline beyond the 3 design partners?'],
    docs: [{ name: 'Product demo notes.pdf', kind: 'Notes', date: '2026-07-28' }],
    nextAction: { what: 'Follow-up: pipeline data room', when: '2026-08-20' },
    links: [
      { companyId: 'solstice', kind: 'referred', note: 'Founder is an ex-Solstice engineering lead; intro by the Solstice CEO.' },
      { companyId: 'solstice', kind: 'adjacent', note: 'Would become a vendor to Solstice clinics — customer-conflict check needed.' },
    ],
  },
  {
    id: 'thermwell', company: 'Thermwell', segment: 'Movement & recovery',
    oneLiner: 'Contrast-therapy studios (sauna / cold plunge) franchise',
    stage: 'Diligence', founder: 'L. Navarro', referrer: 'Arden Family Office (co-investor)',
    mandateFit: 79, lastTouch: '2026-08-08', owner: 'Galia',
    scores: { Team: 3, Market: 4, Product: 4, Traction: 4, 'Mandate fit': 4 },
    openQuestions: ['Franchise-model quality control?', 'Lease liabilities on the balance sheet?', 'Defensibility vs. gym chains adding the same amenity.'],
    docs: [
      { name: 'Data room index.pdf', kind: 'Data room', date: '2026-08-01' },
      { name: 'Unit economics model.xlsx', kind: 'Financial', date: '2026-08-04' },
      { name: 'Franchise agreement (draft).pdf', kind: 'Legal', date: '2026-08-06' },
    ],
    nextAction: { what: 'Legal review of franchise terms', when: '2026-08-13' },
  },
  {
    id: 'gutlogic', company: 'GutLogic', segment: 'Nutrition & metabolic',
    oneLiner: 'IBS care pathway with dietitian marketplace',
    stage: 'Diligence', founder: 'S. Whitfield, MD', referrer: 'Outbound — thesis search',
    mandateFit: 85, lastTouch: '2026-08-10', owner: 'Sagi',
    scores: { Team: 5, Market: 4, Product: 4, Traction: 3, 'Mandate fit': 5 },
    openQuestions: ['Dietitian supply liquidity at scale?', 'Payer coverage beyond the two pilot states?'],
    docs: [
      { name: 'Data room index.pdf', kind: 'Data room', date: '2026-07-25' },
      { name: 'Payer contracts (redacted).pdf', kind: 'Legal', date: '2026-08-02' },
      { name: 'Cohort retention export.xlsx', kind: 'Financial', date: '2026-08-09' },
    ],
    nextAction: { what: 'Draft investment memorandum', when: '2026-08-22' },
    links: [
      { companyId: 'verdebiome', kind: 'adjacent', note: 'Gut-health overlap with VerdeBiome’s microbiome programs — competition memo section required.' },
    ],
  },
  {
    id: 'briochem', company: 'BrioChem', segment: 'Clinics & longevity',
    oneLiner: 'At-home biomarker panels with physician review',
    stage: 'Diligence', founder: 'A. Marchetti', referrer: 'Dr. E. Rosen (co-investor)',
    mandateFit: 70, lastTouch: '2026-08-05', owner: 'Galia',
    scores: { Team: 3, Market: 4, Product: 3, Traction: 4, 'Mandate fit': 3 },
    openQuestions: ['Lab partner concentration (one CLIA lab).', 'CAC payback drifted from 7 to 11 months — why?'],
    docs: [
      { name: 'Data room index.pdf', kind: 'Data room', date: '2026-07-18' },
      { name: 'Lab services agreement.pdf', kind: 'Legal', date: '2026-07-30' },
    ],
    nextAction: { what: 'Founder call on CAC drift', when: '2026-08-12' },
  },
  {
    id: 'nimbuscare', company: 'NimbusCare', segment: 'Digital care',
    oneLiner: 'Remote monitoring for post-surgical recovery',
    stage: 'Investment committee', founder: 'Y. Stern & P. Duarte', referrer: 'Kinetic Mind chair (portfolio network)',
    mandateFit: 91, lastTouch: '2026-08-11', owner: 'Galia',
    scores: { Team: 5, Market: 5, Product: 4, Traction: 4, 'Mandate fit': 5 },
    openQuestions: ['Final terms: option-pool top-up pre- vs post-money.'],
    docs: [
      { name: 'Investment memorandum (v3).pdf', kind: 'Memo', date: '2026-08-09' },
      { name: 'Term sheet (draft).pdf', kind: 'Legal', date: '2026-08-10' },
      { name: 'Data room index.pdf', kind: 'Data room', date: '2026-07-12' },
    ],
    nextAction: { what: 'IC vote', when: '2026-08-19' },
    links: [
      { companyId: 'kinetic', kind: 'referred', note: 'Introduced through the Kinetic Mind chair (portfolio network).' },
      { companyId: 'stridewell', kind: 'adjacent', note: 'Post-surgical recovery touches Stridewell’s MSK rehab pathway — partner overlap, not head-on.' },
    ],
  },
  {
    id: 'plumeria', company: 'Plumeria Care', segment: 'Femtech & family',
    oneLiner: 'Menopause care clinics + telehealth',
    stage: 'Passed', founder: 'H. Lindqvist', referrer: 'Inbound — cold email',
    mandateFit: 58, lastTouch: '2026-06-30', owner: 'Sagi',
    scores: { Team: 3, Market: 4, Product: 2, Traction: 2, 'Mandate fit': 3 },
    openQuestions: [],
    docs: [{ name: 'Deck.pdf', kind: 'Deck', date: '2026-06-12' }],
    nextAction: { what: 'Passed — revisit at Series A', when: '2027-01-15' },
    passReason: 'Product undifferentiated vs. two funded competitors; keep relationship warm.',
  },
]

// --- Fund NAV history (illustrative, USD millions) ---------------------------
export const navSeries = [
  { q: 'Q4 20', invested: 4.7, value: 4.9 },
  { q: 'Q2 21', invested: 8.2, value: 9.4 },
  { q: 'Q4 21', invested: 12.4, value: 15.8 },
  { q: 'Q2 22', invested: 15.1, value: 21.5 },
  { q: 'Q4 22', invested: 18.0, value: 25.2 },
  { q: 'Q2 23', invested: 20.6, value: 30.9 },
  { q: 'Q4 23', invested: 22.4, value: 36.1 },
  { q: 'Q2 24', invested: 23.2, value: 41.7 },
  { q: 'Q4 24', invested: 26.8, value: 47.9 },
  { q: 'Q2 25', invested: 28.4, value: 53.6 },
  { q: 'Q4 25', invested: 29.8, value: 58.8 },
  { q: 'Q2 26', invested: 30.4, value: 63.2 },
]

// ---------------------------------------------------------------------------
// Derived math — rounds, ownership, cap tables, per-investor positions.
// ---------------------------------------------------------------------------

// Enrich a company's rounds with post-money and the syndicate's evolving stake.
export function enrichRounds(company) {
  let own = 0
  return company.rounds.map((r) => {
    const post = r.pre + r.raised
    const ownBefore = own
    own = own * (r.pre / post) + r.check / post
    return { ...r, post, ownBefore, ownAfter: own, newFromRound: r.check / post }
  })
}

export function companyMetrics(company) {
  const rounds = enrichRounds(company)
  const invested = rounds.reduce((s, r) => s + r.check, 0)
  const ownership = rounds.length ? rounds[rounds.length - 1].ownAfter : 0
  const currentValue = company.status === 'exited' ? 0 : ownership * (company.currentValuation ?? 0)
  const realized = company.status === 'exited' ? company.exit.proceeds : 0
  const moic = invested > 0 ? (currentValue + realized) / invested : 0
  return { rounds, invested, ownership, currentValue, realized, moic }
}

// Cap-table history: Founders / ESOP / Syndicate ("Meridian") / Other investors.
export function capTableHistory(company) {
  const rounds = enrichRounds(company)
  let founders = 0.78, esop = 0.12, others = 0.10, us = 0
  const snapshots = [{ label: 'At founding', founders, esop, others, us }]
  for (const r of rounds) {
    const d = r.pre / r.post
    founders *= d; esop *= d; others *= d; us *= d
    us += r.check / r.post
    others += (r.raised - r.check) / r.post
    snapshots.push({ label: `Post ${r.name} (${r.date})`, founders, esop, others, us })
  }
  return snapshots
}

// Per-investor position in one company.
export function investorPosition(company, investorId) {
  const rounds = enrichRounds(company)
  let invested = 0
  let ownership = 0
  rounds.forEach((r, i) => {
    const frac = r.mix[investorId] || 0
    if (!frac) return
    const amount = r.check * frac
    invested += amount
    let stake = amount / r.post
    for (let j = i + 1; j < rounds.length; j++) stake *= rounds[j].pre / rounds[j].post
    ownership += stake
  })
  if (invested === 0) return null
  const m = companyMetrics(company)
  const shareOfSyndicate = m.ownership > 0 ? ownership / m.ownership : 0
  const currentValue = company.status === 'exited' ? 0 : ownership * (company.currentValuation ?? 0)
  const realized = company.status === 'exited' ? company.exit.proceeds * shareOfSyndicate : 0
  return { company, invested, ownership, currentValue, realized }
}

export function investorSummary(investorId) {
  const positions = companies
    .map((c) => investorPosition(c, investorId))
    .filter(Boolean)
  const t = positions.reduce(
    (a, p) => ({
      invested: a.invested + p.invested,
      currentValue: a.currentValue + p.currentValue,
      realized: a.realized + p.realized,
    }),
    { invested: 0, currentValue: 0, realized: 0 }
  )
  return { positions, ...t }
}

export function fundTotals() {
  const per = companies.map((c) => ({ c, m: companyMetrics(c) }))
  const invested = per.reduce((s, x) => s + x.m.invested, 0)
  const currentValue = per.reduce((s, x) => s + x.m.currentValue, 0)
  const realized = per.reduce((s, x) => s + x.m.realized, 0)
  const active = per.filter((x) => x.c.status === 'active')
  const exited = per.filter((x) => x.c.status === 'exited')
  const dpi = realized / invested
  const tvpi = (realized + currentValue) / invested
  const activeDiligence = pipeline.filter((d) =>
    ['Diligence', 'Investment committee'].includes(d.stage)
  ).length
  // Allocation of invested capital by segment
  const bySegment = {}
  for (const { c, m } of per) {
    bySegment[c.segment] = (bySegment[c.segment] || 0) + m.invested
  }
  const allocation = Object.entries(bySegment)
    .map(([segment, amount]) => ({ segment, amount, share: amount / invested }))
    .sort((a, b) => b.amount - a.amount)
  return { per, invested, currentValue, realized, dpi, tvpi, active, exited, activeDiligence, allocation }
}

// Reference "today" for the mockup — keeps every derived age deterministic.
export const REF_DATE = '2026-08-12'

// Quarterly signals derived from the records already on file (update letters,
// board decks, round agreements) — used by the copilot's analysis workflows.
export function qSignals(company) {
  if (company.status === 'exited') return null
  const q = company.quarterly
  const runway = Number((/(\d+)\s*months/.exec(q.cash) || [])[1] || 0)
  const growth = /flat/i.test(q.revenueRun)
    ? 0
    : Number((/([+-]?\d+)% QoQ/.exec(q.revenueRun) || [])[1] || 0)
  const upd = company.docs.find((d) => d.kind === 'Update')
  const updateAgeDays = upd
    ? Math.round((new Date(REF_DATE) - new Date(upd.date)) / 86_400_000)
    : null
  const rounds = enrichRounds(company)
  const lastPost = rounds[rounds.length - 1].post
  const markTrend = (company.currentValuation ?? lastPost) / lastPost
  return {
    runway, growth, updateAgeDays, markTrend, lastPost,
    updateDoc: upd ? upd.name : null,
    watchouts: q.watchouts.length,
  }
}

// --- Formatting --------------------------------------------------------------
export const fmtM = (n) =>
  n >= 100 ? `$${n.toFixed(0)}M` : n >= 10 ? `$${n.toFixed(1)}M` : `$${n.toFixed(2).replace(/0$/, '')}M`
export const fmtPct = (x, d = 1) => `${(x * 100).toFixed(d)}%`
export const fmtX = (x) => `${x.toFixed(2)}×`

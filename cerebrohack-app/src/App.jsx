import { useState, useEffect, useRef } from 'react'

/* ── ASCII wordmark for CEREBRO ──────────────────────────── */
const CEREBRO_ASCII = `
 ██████╗███████╗██████╗ ███████╗██████╗ ██████╗  ██████╗
██╔════╝██╔════╝██╔══██╗██╔════╝██╔══██╗██╔══██╗██╔═══██╗
██║     █████╗  ██████╔╝█████╗  ██████╔╝██████╔╝██║   ██║
██║     ██╔══╝  ██╔══██╗██╔══╝  ██╔══██╗██╔══██╗██║   ██║
╚██████╗███████╗██║  ██║███████╗██████╔╝██║  ██║╚██████╔╝
 ╚═════╝╚══════╝╚═╝  ╚═╝╚══════╝╚═════╝ ╚═╝  ╚═╝ ╚═════╝
`.trim()

/* ── EEG-style ASCII waves ───────────────────────────────── */
const WAVES = {
  gamma:  { pattern: '·─╱‾╲─·─╱‾‾╲──╱‾╲─╱‾‾╲─·──╱‾╲─────╱‾‾╲──',  color: 'var(--neural-glow)',  val: '42Hz · joy', label: 'γ  GAMMA' },
  beta:   { pattern: '───╱╲──────╱╲────╱╲─────╱╲──────╱╲──────╱╲──', color: 'var(--synapse-glow)', val: '18Hz · focus', label: 'β  BETA'  },
  alpha:  { pattern: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',             color: 'var(--axon)',        val: '10Hz · calm', label: 'α  ALPHA' },
  theta:  { pattern: '─────╭╮──────────╭╮──────────╭╮──────────╭╮──',  color: 'var(--pulse)',       val: '6Hz · recall', label: 'θ  THETA' },
  delta:  { pattern: '━━━━━╱‾‾‾‾╲━━━━━━━━╱‾‾‾‾╲━━━━━━━━━╱‾‾‾‾╲━━━━━',  color: 'var(--ash)',        val: '1Hz · deep', label: 'δ  DELTA' },
}

/* ── FAQ data ────────────────────────────────────────────── */
const FAQS = [
  { q: 'Who can participate in CEREBRO?', a: 'Anyone with a curiosity for how machines understand emotion. Students, researchers, engineers, designers — all are welcome. Teams of 2–5, solo allowed with prior registration.' },
  { q: 'What technology stack is required?', a: 'None mandated. Bring your own model, framework, dataset, or hardware. We provide compute credits (A100 access), a curated multi-modal sentiment corpus, and a set of evaluation benchmarks. Python, Rust, JS — your call.' },
  { q: 'What is "neural sentiment"?', a: 'The intersection of affective computing and neural signal processing. Think: EEG-derived emotion tagging, voice-to-valence pipelines, multimodal fusion (text + biosignal + face), or large-model fine-tuning on sentiment corpora.' },
  { q: 'Are there restrictions on model size or APIs?', a: 'No black-box LLM wrapper submissions. Judges look for genuine systems work — novel training approaches, hardware-aware inference, interpretability, or dataset curation. Using open weights as a base is fine.' },
  { q: 'What happens with our IP?', a: 'You own everything you build. CEREBRO asks for a 48-hour demo license for judging only. No IP assignment, no equity stake.' },
  { q: 'Is there travel support?', a: 'We offer a limited travel grant pool ($200–$500 per team) for participants traveling 500+ km. Apply in the registration form.' },
]

/* ── Feature list ────────────────────────────────────────── */
const FEATURES = [
  { bullet: '[+]', title: 'Fully online',         desc: 'Participate from anywhere. No venue, no travel, no setup overhead — just you, your team, and the problem.' },
  { bullet: '[+]', title: 'Pure problem solving',  desc: 'No APIs, no compute credits, no starter kits handed out. You bring the stack. We bring the problem statement.' },
  { bullet: '[+]', title: '36-hour sprint',        desc: 'Nov 02, 21:00 IST → Nov 04, 09:00 IST. Short enough to be brutal, long enough to build something real.' },
  { bullet: '[+]', title: 'Mentor check-ins',      desc: 'Async Q&A threads with domain mentors during the sprint window. No hand-holding — just unblocking.' },
  { bullet: '[x]', title: 'No wrapper submissions',desc: 'Calling an LLM API and wrapping it in a UI is not a submission. Build the system, not the scaffold.' },
  { bullet: '[-]', title: 'Solo leaderboard',      desc: 'Teams of 2–4 are the default format. Solo participants get a separate prize tier — same problem, same bar.' },
]

/* ── Problem Statements ─────────────────────────────────── */
const TRACKS = [
  {
    glyph: '// PS_01  ·  CONFIRMED',
    title: 'Tone Intelligence in Conversations',
    prize: '₹5,000',
    tag: 'FIRST PRIZE',
    desc: 'Chat logs carry more than words — they carry tension, sarcasm, warmth, and collapse. Build a system that reads the emotional arc of a conversation: not just positive/negative, but tone shifts, passive aggression, escalation, and de-escalation patterns across multi-turn threads. Source your own data. Build your own model. Ship a working system.',
    items: [
      'Multi-turn chat sentiment & tone tracking',
      'Sarcasm, passive-aggression & irony detection',
      'Emotion arc visualisation over conversation time',
      'Works on WhatsApp, Slack, Discord or any chat export',
    ],
  },
  {
    glyph: '// PS_02  ·  DROPS NOV 01',
    title: 'Voice as a Mood Signal',
    prize: '₹3,000',
    tag: 'SECOND PRIZE',
    desc: 'The same sentence spoken happy and spoken angry sounds nothing alike. Build a pipeline that extracts emotional state from raw audio. Prosody, pitch variance, speech rate, and micro-pauses are your signals. Source your own audio corpus. Text transcription is optional — the emotion should come from the sound itself.',
    items: [
      'Audio-based emotion classification',
      'Valence + arousal output on a continuous scale',
      'Works on noisy, code-switched, or accented speech',
      'Self-sourced training data — no dataset is provided',
    ],
  },
  {
    glyph: '// PS_03  ·  DROPS NOV 01',
    title: 'Sentiment Drift in Social Threads',
    prize: '₹2,000',
    tag: 'THIRD PRIZE',
    desc: "Public threads start civil and can turn toxic in three replies. Build a model that processes a comment thread and identifies where the emotional tone breaks — flagging the exact turn where valence collapses. Source your own thread data from Reddit, X, or YouTube. The insight matters more than the accuracy number.",
    items: [
      'Sequential or graph-based thread modelling',
      'Sentiment drift & early-warning toxicity signal',
      'Self-sourced thread data — Reddit / X / YouTube',
      'Interpretable output: show which reply caused the shift',
    ],
  },
]

/* ── Judges ──────────────────────────────────────────────── */
const JUDGES = [
  { initials: 'AK', color: '#7c3aed', name: 'Dr. Anika Khanna',      role: 'Head of Affective AI · DeepMind India' },
  { initials: 'RV', color: '#06b6d4', name: 'Rajan Venugopal',       role: 'Principal Research Scientist · NIMHANS' },
  { initials: 'SL', color: '#10b981', name: 'Sara Lindqvist',         role: 'Neuro-ML Lead · Emotiv' },
  { initials: 'PM', color: '#f59e0b', name: 'Pablo Mena-Cortés',      role: 'Open-source ML · HuggingFace' },
]

/* ── Timeline ────────────────────────────────────────────── */
const TIMELINE = [
  { time: 'Oct 15, 2026',       event: 'Registration opens on Unstop',              tag: 'OPEN NOW' },
  { time: 'Nov 01, 2026',       event: 'Problem statements published',               tag: null },
  { time: 'Nov 02 · 21:00 IST', event: 'Hackathon begins — 36h clock starts',        tag: 'DAY 1' },
  { time: 'Nov 03 · 09:00 IST', event: 'Halfway mark — optional mentor Q&A opens',   tag: 'DAY 2' },
  { time: 'Nov 04 · 03:00 IST', event: '6h remaining — final stretch',               tag: null },
  { time: 'Nov 04 · 09:00 IST', event: 'Submissions close — 36h window ends',        tag: 'CLOSE' },
  { time: 'Nov 04 · 12:00 IST', event: 'Judging begins',                             tag: null },
  { time: 'Nov 05, 2026',       event: 'Winners announced',                          tag: 'RESULTS' },
]

/* ── Sentiment bar data (TUI mockup) ────────────────────── */
const SENTIMENTS = [
  { label: 'excitement', pct: 87, color: 'var(--neural-glow)' },
  { label: 'focus',      pct: 74, color: 'var(--synapse-glow)' },
  { label: 'calm',       pct: 52, color: 'var(--axon)' },
  { label: 'tension',    pct: 30, color: 'var(--pulse)' },
]

/* ══════════════════════════════════════════════════════════
   SUBCOMPONENTS
   ══════════════════════════════════════════════════════════ */

function Nav() {
  return (
    <nav className="primary-nav" role="navigation" aria-label="Primary navigation">
      <div className="container--wide primary-nav__inner">
        <div className="nav-wordmark" aria-label="CEREBRO">
          {'[ CEREBRO ]'}
        </div>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#tracks">Tracks</a></li>
          <li><a href="#schedule">Schedule</a></li>
          <li><a href="#judges">Judges</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
        <a href="#register" className="btn-primary" id="nav-register-btn">
          Register ↗
        </a>
      </div>
    </nav>
  )
}

/* ASCII sparkline for TUI panels */
function Sparkline({ color }) {
  const pts = [2, 5, 3, 8, 6, 9, 4, 7, 5, 8, 9, 6, 10, 7, 9, 8, 12, 10, 9, 11]
  const max = Math.max(...pts)
  const w = 200, h = 32
  const d = pts.map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i / (pts.length - 1)) * w} ${h - (v / max) * h}`).join(' ')
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} className="tui-sparkline">
      <polyline
        points={pts.map((v, i) => `${(i / (pts.length - 1)) * w},${h - (v / max) * h}`).join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.8"
      />
    </svg>
  )
}

function TuiMockup() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1500)
    return () => clearInterval(id)
  }, [])

  const dynamicVal = (87 + Math.sin(tick * 0.7) * 5).toFixed(1)

  return (
    <div className="tui-mockup" role="img" aria-label="CEREBRO neural terminal interface mockup">
      {/* window chrome */}
      <div className="tui-bar">
        <span className="tui-dot tui-dot--red" />
        <span className="tui-dot tui-dot--yellow" />
        <span className="tui-dot tui-dot--green" />
        <span className="tui-title-text">cerebro — neural-sentiment — inference</span>
      </div>

      {/* ASCII wordmark */}
      <div className="tui-ascii-wordmark">
        <pre aria-hidden="true">{CEREBRO_ASCII}</pre>
      </div>

      {/* dual metric panels */}
      <div className="tui-brainwave">
        <div className="tui-panel">
          <div className="tui-panel-label">// γ gamma · live</div>
          <div className="tui-panel-value tui-panel-value--neural">{dynamicVal}Hz</div>
          <Sparkline color="var(--neural-glow)" />
        </div>
        <div className="tui-panel">
          <div className="tui-panel-label">// sentiment · confidence</div>
          <div className="tui-panel-value tui-panel-value--synapse">0.9{tick % 9}2</div>
          <Sparkline color="var(--synapse-glow)" />
        </div>
      </div>

      {/* command prompt */}
      <div className="tui-prompt-row">
        <span className="tui-prompt-prefix">›</span>
        <span className="tui-prompt-cmd">
          infer --mode realtime --model cerebro-base --stream eeg.sock
        </span>
        <span className="tui-prompt-model">claude-3.5-sonnet</span>
        <span className="cursor-blink" style={{ color: 'var(--neural-glow)', marginLeft: 4 }}>█</span>
      </div>

      {/* sentiment bars */}
      {SENTIMENTS.map(s => (
        <div className="tui-sentiment-bar" key={s.label}>
          <span className="tui-sentiment-label">{s.label}</span>
          <div className="tui-sentiment-track">
            <div
              className="tui-sentiment-fill"
              style={{ width: `${s.pct}%`, backgroundColor: s.color }}
            />
          </div>
          <span className="tui-sentiment-val">{s.pct}%</span>
        </div>
      ))}

      {/* keybinding hints */}
      <div className="tui-keyhints" aria-hidden="true">
        <span className="tui-keyhint"><kbd>tab</kbd> switch channel</span>
        <span className="tui-keyhint"><kbd>ctrl-p</kbd> commands</span>
        <span className="tui-keyhint"><kbd>ctrl-r</kbd> reset stream</span>
        <span className="tui-keyhint"><kbd>q</kbd> quit</span>
      </div>
    </div>
  )
}

/* ASCII stat charts */
function ChartTile({ value, label, fig, ascii }) {
  return (
    <div className="chart-tile">
      <div className="chart-tile__value">{value}</div>
      <div className="chart-tile__label">{label}</div>
      <pre className="chart-ascii" aria-hidden="true">{ascii}</pre>
      <div style={{ fontSize: 11, color: 'var(--ash)', marginTop: 6 }}>Fig {fig}</div>
    </div>
  )
}

/* FAQ accordion */
function FaqRow({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <li
      className={`faq-row${open ? ' open' : ''}`}
      onClick={() => setOpen(o => !o)}
    >
      <div className="faq-row__q">
        <span className="faq-row__toggle">{open ? '−' : '+'}</span>
        {q}
      </div>
      <div className="faq-row__a">{a}</div>
    </li>
  )
}

/* EEG wave display */
function EegDisplay() {
  const [offset, setOffset] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setOffset(o => (o + 2) % 50), 80)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="eeg-display" aria-label="EEG waveform visualizer">
      {Object.entries(WAVES).map(([key, w]) => {
        const shifted = w.pattern.slice(offset) + w.pattern.slice(0, offset)
        return (
          <div className="eeg-channel" key={key}>
            <span className="eeg-channel-label" style={{ color: 'var(--on-dark-mute)' }}>{w.label}</span>
            <span className="eeg-wave-text" style={{ color: w.color }}>{shifted.repeat(3)}</span>
            <span className="eeg-val" style={{ color: 'var(--on-dark-mute)', fontSize: 11 }}>{w.val}</span>
          </div>
        )
      })}
    </div>
  )
}

/* Registration form */
function RegistrationForm() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', org: '', track: '', idea: '' })

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const submit = e => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div style={{ padding: 'var(--sp-xxl) 0' }}>
        <div style={{ color: 'var(--axon)', fontWeight: 700, marginBottom: 'var(--sp-md)' }}>
          [x] Expression of interest noted.
        </div>
        <div style={{ color: 'var(--body)', lineHeight: 1.7 }}>
          Head to Unstop to complete your official registration.<br />
          Problem statements go live Nov 01. Clock starts Nov 02, 21:00 IST. 🧠
        </div>
        <div style={{ marginTop: 'var(--sp-xl)' }}>
          <a href="https://unstop.com" target="_blank" rel="noopener noreferrer" className="btn-primary">
            Complete registration on Unstop ↗
          </a>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} id="register-form" aria-label="Registration form">
      <div className="form-group">
        <label className="form-label" htmlFor="reg-name">Full name</label>
        <input id="reg-name" name="name" type="text" className="text-input" placeholder="Ada Lovelace" value={form.name} onChange={handle} required />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="reg-email">Email address</label>
        <input id="reg-email" name="email" type="email" className="text-input" placeholder="ada@ml.lab" value={form.email} onChange={handle} required />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="reg-org">Organisation / University</label>
        <input id="reg-org" name="org" type="text" className="text-input" placeholder="IIT, IISc, DeepMind, independent…" value={form.org} onChange={handle} />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="reg-track">Problem statement</label>
        <select id="reg-track" name="track" className="text-input" value={form.track} onChange={handle} required style={{ cursor: 'pointer' }}>
          <option value="">-- select --</option>
          <option value="ps01">PS-01 · Tone Intelligence in Conversations</option>
          <option value="ps02">PS-02 · Voice as a Mood Signal</option>
          <option value="ps03">PS-03 · Sentiment Drift in Social Threads</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="reg-idea">Project idea (1–2 sentences)</label>
        <textarea id="reg-idea" name="idea" className="textarea" placeholder="Describe the problem you're attacking…" value={form.idea} onChange={handle} />
      </div>
      <button type="submit" className="btn-primary" id="register-submit-btn" style={{ width: '100%', justifyContent: 'center' }}>
        Submit registration →
      </button>
    </form>
  )
}

/* ══════════════════════════════════════════════════════════
   MAIN APP
   ══════════════════════════════════════════════════════════ */
export default function App() {
  return (
    <>
      <Nav />

      <main>
        {/* ── HERO ─────────────────────────────────────── */}
        <section className="hero" id="about" aria-labelledby="hero-headline">
          <div className="container">
            <div className="hero__announcement">
              <span className="badge-news">[ ONLINE · NOV 02–04, 2026 ]</span>
              <span className="hero__announcement-text">36-hour neural sentiment hackathon · hosted on Unstop</span>
            </div>

            <h1 className="hero__headline" id="hero-headline">
              Where minds decode<br />emotion at machine speed.
            </h1>

            <p className="hero__subheadline">
              CEREBRO is an online 36-hour hackathon. Starts Nov 02, 21:00 IST — ends Nov 04, 09:00 IST.
              Pick a problem statement, build a system that understands emotion in language, and ship it.
              No APIs handed out. No starter kits. Just the problem and your stack.
            </p>

            <div className="hero__cta-row">
              <a href="https://unstop.com" target="_blank" rel="noopener noreferrer" className="btn-primary" id="hero-register-btn">Register on Unstop ↗</a>
              <a href="#tracks" className="btn-secondary" id="hero-tracks-btn">View problem statements</a>
            </div>

            <TuiMockup />

            <div style={{ marginTop: 'var(--sp-xxl)', borderTop: '1px solid var(--hairline)', paddingTop: 'var(--sp-xl)' }}>
              <p style={{ fontSize: 13, color: 'var(--mute)', lineHeight: 1.8 }}>
                [+] Online · participate from anywhere<br />
                [+] Problem statements published Nov 01, 2026<br />
                [+] Submit via Unstop before Nov 04, 09:00 IST
              </p>
            </div>
          </div>
        </section>

        {/* ── STATS ────────────────────────────────────── */}
        <section className="section">
          <div className="container">
            <div className="section-label">// by the numbers</div>
            <div className="chart-grid">
              <ChartTile
                value="₹10K"
                label="Total prize pool across three problem statements"
                fig="1"
                ascii={
                  '▁▂▃▄▅▆▇█▇▆▅▆▇█\n' +
                  '________________\n' +
                  '  prize · pool  '
                }
              />
              <ChartTile
                value="36h"
                label="Nov 02, 21:00 IST → Nov 04, 09:00 IST"
                fig="2"
                ascii={
                  '╔════════════════╗\n' +
                  '║  21:00 → 09:00 ║\n' +
                  '╚════════════════╝'
                }
              />
              <ChartTile
                value="100%"
                label="Online — no venue, no travel, build from anywhere"
                fig="3"
                ascii={
                  '· ─ ─ ◉ ─ ─ ─ · \n' +
                  '─ ◉ ─ ─ ─ ◉ ─ ─ \n' +
                  '· ─ ─ ─ ◉ ─ ─ ·'
                }
              />
            </div>
          </div>
        </section>

        {/* ── NEURAL WAVE (dark section) ────────────────── */}
        <section className="neural-wave-section" aria-labelledby="neural-headline">
          <div className="container">
            <div style={{ fontSize: 13, color: 'var(--on-dark-mute)', marginBottom: 'var(--sp-lg)' }}>
              // what is neural sentiment?
            </div>
            <h2 className="neural-wave-headline" id="neural-headline">
              Machines that feel<br />the shape of a thought.
            </h2>
            <p className="neural-wave-sub">
              Neural sentiment sits at the crossroads of affective computing, signal
              processing, and large-model inference. CEREBRO challenges you to build
              systems that read emotion from every signal — brainwaves, voice, text,
              or all three at once.
            </p>

            <ul className="feature-list" style={{ borderColor: 'rgba(112,112,160,0.15)' }}>
              {FEATURES.map((f, i) => (
                <li
                  key={i}
                  className="feature-row"
                  style={{ borderColor: 'rgba(112,112,160,0.12)', color: 'var(--on-dark)' }}
                >
                  <span className="feature-row__bullet" style={{ color: 'var(--on-dark-mute)' }}>
                    {f.bullet}
                  </span>
                  <span>
                    <span className="feature-row__title" style={{ color: 'var(--on-dark)' }}>
                      {f.title}
                    </span>
                    <span className="feature-row__desc" style={{ color: 'var(--on-dark-mute)' }}>
                      {'  —  '}{f.desc}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <EegDisplay />
          </div>
        </section>

        {/* ── PROBLEM STATEMENTS ────────────────────────── */}
        <section className="section" id="tracks" aria-labelledby="tracks-heading">
          <div className="container">
            <h2 className="section-label" id="tracks-heading">// problem statements</h2>
            <p style={{ color: 'var(--body)', maxWidth: 600, marginBottom: 'var(--sp-xl)' }}>
              Three problem statements. Pick one. Build something real.
              PS-01 is confirmed — PS-02 and PS-03 drop on Nov 01 with the dataset bundle.
            </p>
            <div className="tracks-grid">
              {TRACKS.map((t, i) => (
                <div className="track-card" key={i} id={`track-card-${i}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--sp-sm)' }}>
                    <div className="track-card__glyph" style={{ marginBottom: 0 }}>{t.glyph}</div>
                    <span style={{ fontSize: 11, background: 'var(--surface-card)', color: 'var(--mute)', padding: '1px 7px', borderRadius: 'var(--r-sm)' }}>{t.tag}</span>
                  </div>
                  <div className="track-card__title">{t.title}</div>
                  <div className="track-card__prize">{t.prize}</div>
                  <p style={{ fontSize: 13, color: 'var(--body)', lineHeight: 1.65, marginBottom: 'var(--sp-md)' }}>{t.desc}</p>
                  <ul className="track-card__list">
                    {t.items.map((item, j) => (
                      <li className="track-card__item" key={j}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SCHEDULE ─────────────────────────────────── */}
        <section className="section" id="schedule" aria-labelledby="schedule-heading">
          <div className="container">
            <h2 className="section-label" id="schedule-heading">// schedule</h2>
            <ul className="timeline" aria-label="Event timeline">
              {TIMELINE.map((t, i) => (
                <li className="timeline-row" key={i}>
                  <span className="timeline-row__time">{t.time}</span>
                  <span className="timeline-row__event">
                    <strong>{t.event}</strong>
                    {t.tag && (
                      <span className="timeline-row__tag">{t.tag}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── JUDGES ───────────────────────────────────── */}
        <section className="section" id="judges" aria-labelledby="judges-heading">
          <div className="container">
            <h2 className="section-label" id="judges-heading">// panel of judges</h2>
            <ul className="judges-list" aria-label="Judges list">
              {JUDGES.map((j, i) => (
                <li className="judge-row" key={i}>
                  <div
                    className="judge-avatar"
                    style={{ backgroundColor: j.color }}
                    aria-hidden="true"
                  >
                    {j.initials}
                  </div>
                  <div className="judge-info">
                    <div className="judge-name">{j.name}</div>
                    <div className="judge-role">{j.role}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────── */}
        <section className="section" id="faq" aria-labelledby="faq-heading">
          <div className="container">
            <h2 className="section-label" id="faq-heading">// FAQ</h2>
            <ul className="faq-list" aria-label="Frequently asked questions">
              {FAQS.map((f, i) => (
                <FaqRow key={i} q={f.q} a={f.a} />
              ))}
            </ul>
          </div>
        </section>

        {/* ── REGISTER ─────────────────────────────────── */}
        <section className="section" id="register" aria-labelledby="register-heading">
          <div className="container">
            <div className="reg-grid">
              <div>
                <h2 className="section-label" id="register-heading">// register</h2>
                <p style={{ color: 'var(--body)', lineHeight: 1.7, marginBottom: 'var(--sp-xl)' }}>
                  Register on Unstop. It's free, it's online, and it takes
                  two minutes. Problem statements drop Nov 01.
                  Clock starts Nov 02, 21:00 IST — ends Nov 04, 09:00 IST.
                </p>
                <p style={{ color: 'var(--mute)', fontSize: 13, lineHeight: 1.7 }}>
                  [+] Free to enter — no registration fee.<br />
                  [+] Fully online — participate from anywhere.<br />
                  [+] Teams of 2–4, or solo (separate tier).<br />
                  [+] No APIs or resources provided — build your own stack.
                </p>
                <div style={{ marginTop: 'var(--sp-xl)' }}>
                  <a
                    href="https://unstop.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    id="register-unstop-btn"
                    style={{ display: 'inline-flex' }}
                  >
                    Register on Unstop ↗
                  </a>
                </div>
              </div>
              <div>
                <RegistrationForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer className="footer" aria-label="Site footer">
        <div className="container">
          <ul className="footer__links">
            {[
              { label: 'GitHub', href: '#' },
              { label: 'Discord', href: '#' },
              { label: 'Docs', href: '#' },
              { label: 'Devpost', href: '#' },
              { label: 'X / Twitter', href: '#' },
            ].map((l, i) => (
              <li className="footer__link-cell" key={i}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
          <div className="footer__bottom">
            <span>©2026 CEREBRO · Neural Sentiment Hackathon</span>
            <ul className="footer__bottom-links">
              <li><a href="#">Brand</a></li>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  )
}

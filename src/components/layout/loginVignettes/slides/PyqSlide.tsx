"use client"

import { useMotionValue, stagger as staggerDelay, type AnimationSequence } from "framer-motion"
import { Play, Search, Zap } from "lucide-react"
import { countTransition, exitTransition, spring, stagger } from "../motionTokens"
import { LiveText, Ripple, press } from "../primitives"
import { useSlideTimeline } from "../useSlideTimeline"
import styles from "../Vignettes.module.css"

// Story: a messy pile of PYQs sorts itself into a structured chapter, gets
// tagged and filtered, progress fills, and practice starts.
// Palette: the slide's orange plus neutrals.

const MAIN_ROWS = [
  { text: "An electric power line having a total resistance of 2 Ω…", year: "2024 · Shift 2", type: "Single Choice" },
  { text: "A wire of length 2 m carries a current of 4 A…", year: "2023 · Shift 1", type: "Integer" },
  { text: "In the circuit shown, the potential difference across…", year: "2025 · Shift 1", type: "Single Choice" },
]
// The rows start as a tilted pile on the middle slot (52px = row + gap).
const PILE = [
  { y: 52, rotate: -4 },
  { y: 0, rotate: 2.5 },
  { y: -52, rotate: -1.5 },
]

const ADV_ROWS = [
  { text: "A uniform wire of resistance 9 Ω is bent into a triangle…", year: "2023 · P2", type: "Numerical" },
  { text: "Two cells of emf E₁ and E₂ are connected in parallel…", year: "2022 · P1", type: "Multi Correct" },
  { text: "A potentiometer wire of length 10 m has a resistance…", year: "2021 · P2", type: "Single Choice" },
]

const QUERY = "current electricity"
const SOLVED = 163
const TOTAL = 238
const MAINS = { solved: 141, total: 191 }
const ADV = { solved: 22, total: 47 }
const RING_R = 26
const RING_C = 2 * Math.PI * RING_R

export function PyqSlide({ active }: { active: boolean }) {
  const typed = useMotionValue(0)
  const solved = useMotionValue(0)
  const mains = useMotionValue(0)
  const adv = useMotionValue(0)

  const scope = useSlideTimeline<HTMLDivElement>(active, (q) => {
    const rows = q("rowM")

    const seq: AnimationSequence = [
      // Ghost card fans out behind.
      [q("ghost"), { opacity: [0, 1], rotate: [0, -5], x: [0, -26], y: [0, -10] }, { ...spring.soft, at: 0.3 }],
    ]

    // 1. The chapter card assembles: background, then its parts.
    seq.push(
      [q("cardBg"), { opacity: [0, 1], scale: [0.94, 1], y: [24, 0] }, { ...spring.enter, at: 0.05 }],
      [q("part"), { opacity: [0, 1], y: [8, 0] }, { ...spring.enter, at: 0.17, delay: staggerDelay(stagger.base) }],
    )

    // 2. Chaos: questions drop in as a tilted pile on the middle slot.
    PILE.forEach((p, i) => {
      seq.push([
        rows[i],
        { opacity: [0, 1], y: [p.y - 18, p.y], rotate: [p.rotate * 1.6, p.rotate], scale: [0.94, 0.97] },
        { ...spring.enter, at: 0.45 + i * stagger.loose },
      ])
    })

    // 3. Order: the pile fans out into a clean list, then each row is tagged.
    PILE.forEach((_, i) => {
      seq.push([rows[i], { y: 0, rotate: 0, scale: 1 }, { ...spring.enter, at: 1.0 + i * stagger.loose }])
    })
    seq.push([
      q("chip"),
      { opacity: [0, 1], scale: [0.6, 1] },
      { ...spring.pop, at: 1.4, delay: staggerDelay(stagger.base) },
    ])

    // 4. Search types, toggle slides to Advanced, list re-filters.
    seq.push(
      [q("placeholder"), { opacity: 0 }, { duration: 0.12, at: 2.05 }],
      [q("caret"), { opacity: [0, 1] }, { duration: 0.1, at: 2.05 }],
      [typed, QUERY.length, { duration: 0.85, ease: "linear", at: 2.1 }],
      ...press(q, "toggle", 3.0),
      [q("thumb"), { x: 159 }, { ...spring.enter, at: 3.05 }],
      [q("rowM"), { opacity: 0, x: -14 }, { ...exitTransition, at: 3.15, delay: staggerDelay(stagger.tight) }],
      [q("rowA"), { opacity: [0, 1], x: [16, 0] }, { ...spring.enter, at: 3.4, delay: staggerDelay(stagger.base) }],
      [q("caret"), { opacity: 0 }, { duration: 0.1, at: 3.4 }],
    )

    // 5. Progress ring fills while the numbers count up.
    seq.push(
      [q("ring"), { strokeDashoffset: [RING_C, RING_C * (1 - SOLVED / TOTAL)] }, { ...countTransition, at: 3.85 }],
      [solved, SOLVED, { ...countTransition, at: 3.85 }],
      [mains, MAINS.solved, { ...countTransition, at: 3.9 }],
      [adv, ADV.solved, { ...countTransition, at: 3.95 }],
    )

    // 6. Payoff: press Practice, it starts.
    seq.push(
      ...press(q, "practice", 5.0),
      [q("practiceIdle"), { opacity: 0, y: -8 }, { ...exitTransition, at: 5.1 }],
      [q("practiceBusy"), { opacity: [0, 1], y: [10, 0] }, { ...spring.enter, at: 5.2 }],
    )

    return seq
  })

  return (
    <div ref={scope} className={styles.vignette} data-playing={active}>
      <div className={styles.ghostWrap}>
        <div data-k="ghost" className={`${styles.ghost} ${styles.pyqGhost}`}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 18 }}>Chapter Wise</div>
          {[70, 92, 84, 60, 88, 76].map((w, i) => (
            <div key={i} className={styles.ghostLine} style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>

      <div className={styles.drift}>
        <div data-k="cardBg" className={`${styles.pyqBg} ${styles.h}`} />

        <div className={styles.pyqCard}>
          <div data-k="part" className={`${styles.head} ${styles.h}`}>
            <div className={styles.chapterIcon}>
              <Zap size={20} strokeWidth={2.2} />
            </div>
            <div>
              <div className={styles.title}>Current Electricity</div>
              <div className={styles.sub}>Physics · {TOTAL} PYQs</div>
            </div>
          </div>

          <div data-k="part" className={`${styles.search} ${styles.h}`}>
            <Search size={14} className={styles.searchIcon} />
            <span style={{ position: "relative", flex: 1 }}>
              <span data-k="placeholder" className={styles.placeholder} style={{ position: "absolute" }}>
                Search questions…
              </span>
              <LiveText value={typed} format={(v) => QUERY.slice(0, Math.round(v))} />
              <span data-k="caret" className={styles.caret} style={{ opacity: 0 }} />
            </span>
          </div>

          <div data-k="part" className={styles.h}>
            <div data-k="toggle" className={styles.toggle}>
              <span data-k="thumb" className={styles.toggleThumb} />
              <span className={styles.toggleLabel}>JEE Main</span>
              <span className={styles.toggleLabel}>JEE Advanced</span>
              <span className={styles.toggleRipple}>
                <Ripple k="toggle-ripple" dark />
              </span>
            </div>
          </div>

          <div className={styles.rows}>
            <div className={styles.rowList}>
              {MAIN_ROWS.map((row, i) => (
                <div key={i} data-k="rowM" className={`${styles.row} ${styles.h}`} style={{ zIndex: 3 - i }}>
                  <span className={styles.rowBg} />
                  <span className={styles.rowText}>
                    <span className={styles.rowNum}>{i + 1}.</span>
                    {row.text}
                  </span>
                  <span className={styles.badges}>
                    <span data-k="chip" className={`${styles.chip} ${styles.chipYear} ${styles.h}`}>
                      {row.year}
                    </span>
                    <span data-k="chip" className={`${styles.chip} ${styles.chipType} ${styles.h}`}>
                      {row.type}
                    </span>
                  </span>
                </div>
              ))}
            </div>
            <div className={styles.rowList}>
              {ADV_ROWS.map((row, i) => (
                <div key={i} data-k="rowA" className={`${styles.row} ${styles.h}`}>
                  <span className={styles.rowBg} />
                  <span className={styles.rowText}>
                    <span className={styles.rowNum}>{i + 1}.</span>
                    {row.text}
                  </span>
                  <span className={styles.badges}>
                    <span className={`${styles.chip} ${styles.chipYear}`}>{row.year}</span>
                    <span className={`${styles.chip} ${styles.chipType}`}>
                      {row.type}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div data-k="part" className={`${styles.progress} ${styles.h}`}>
            <div className={styles.ring}>
              <svg width="60" height="60" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r={RING_R} fill="none" stroke="#eef1f5" strokeWidth="5" />
                <circle
                  data-k="ring"
                  cx="30"
                  cy="30"
                  r={RING_R}
                  fill="none"
                  stroke="#f94f39"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={RING_C}
                  strokeDashoffset={RING_C}
                />
              </svg>
              <div className={styles.ringLabel}>
                <LiveText value={solved} format={(v) => String(Math.round(v))} className={`${styles.ringValue} ${styles.num}`} />
                <span className={styles.ringTotal}>/ {TOTAL}</span>
              </div>
            </div>
            <div className={styles.progressText}>
              <div className={styles.progressTitle}>Questions solved</div>
              <div className={styles.miniStats}>
                <div className={styles.mini}>
                  Mains
                  <strong className={styles.num}>
                    <LiveText value={mains} format={(v) => String(Math.round(v))} />/{MAINS.total}
                  </strong>
                </div>
                <div className={styles.mini}>
                  Advanced
                  <strong className={styles.num}>
                    <LiveText value={adv} format={(v) => String(Math.round(v))} />/{ADV.total}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          <div data-k="part" className={styles.h}>
            <div data-k="practice" className={styles.practice}>
              <span data-k="practiceIdle" className={styles.practiceLabel}>
                <Play size={12} fill="currentColor" /> Practice
              </span>
              <span data-k="practiceBusy" className={`${styles.practiceLabel} ${styles.h}`}>
                <span className={styles.spinner} /> Starting practice…
              </span>
              <Ripple k="practice-ripple" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

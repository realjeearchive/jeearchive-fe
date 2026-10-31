"use client"

import "katex/dist/katex.min.css"
import { useMotionValue, stagger as staggerDelay, type AnimationSequence, type MotionValue } from "framer-motion"
import { ChevronLeft } from "lucide-react"
import { dur, ease, exitTransition, spring, stagger } from "../motionTokens"
import { ntaMath } from "../ntaMath"
import { flip, LegendIcon, PaletteButton, type PaletteState } from "../PaletteButton"
import { arcKeyframes, centerIn, Cursor, LiveText, Ripple, press } from "../primitives"
import { useSlideTimeline } from "../useSlideTimeline"
import styles from "../Vignettes.module.css"

// Story: exam-day feel, under control. A code-built NTA screen: answer,
// save, mark for review, and the palette fills in like a real attempt.

const PALETTE_SIZE = 12
// Buttons 3–10 flip in order to show a test in progress; 11–12 stay unvisited.
const LATER: [number, Exclude<PaletteState, "nv">][] = [
  [3, "a"], [4, "na"], [5, "a"], [6, "am"], [7, "a"], [8, "m"], [9, "a"], [10, "na"],
]
const START_SECONDS = 179 * 60 + 16

const formatTime = (v: number) => {
  const s = Math.floor(v)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}
const formatCount = (v: number) => String(Math.round(v))

function Html({ html }: { html: string }) {
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}

export function NtaSlide({ active }: { active: boolean }) {
  const seconds = useMotionValue(START_SECONDS)
  const counts: Record<PaletteState, MotionValue<number>> = {
    a: useMotionValue(0),
    na: useMotionValue(1),
    nv: useMotionValue(PALETTE_SIZE - 1),
    m: useMotionValue(0),
    am: useMotionValue(0),
  }

  const scope = useSlideTimeline<HTMLDivElement>(active, (q, root) => {
    const cursor = q("cursor")
    // Cursor targets come from layout (transform-independent), so they are
    // right at any --mock-scale. The cursor is hidden under 900px.
    const tip = (el: HTMLElement | undefined, dx = 0, dy = 0) => {
      const c = centerIn(root, el)
      return { x: c.x - 2 + dx, y: c.y - 2 + dy }
    }
    // Phones show the palette as a drawer that has to be opened first.
    const narrow = window.matchMedia("(max-width: 899px)").matches
    const fillAt = narrow ? 4.5 : 4.1
    const start = { x: root.offsetWidth * 0.9, y: root.offsetHeight * 0.88 }
    const optB = tip(q("q1dot")[0], 3, 3)
    const save = tip(q("save")[0])
    const mark = tip(q("mark")[0])
    const rest = tip(q("pb3")[0], 18, 20)
    const move = (from: typeof start, to: typeof start, at: number): AnimationSequence => {
      const k = arcKeyframes(from, to)
      return [[cursor, { x: k.x, y: k.y }, { duration: dur.cursorMove, ease: "linear", times: k.times, at }]]
    }
    const count = (state: PaletteState, to: number, at: number): AnimationSequence => [
      [counts[state], to, { duration: 0.35, ease: ease.out, at }],
    ]

    const seq: AnimationSequence = [
      [q("ghost"), { opacity: [0, 1], rotate: [0, -4], x: [0, -30], y: [0, -14] }, { ...spring.soft, at: 0.3 }],

      // 1. The exam screen assembles: frame, then strip, question, palette.
      [q("frame"), { opacity: [0, 1], y: [24, 0], scale: [0.97, 1] }, { ...spring.enter, at: 0.05 }],
      [q("strip"), { opacity: [0, 1], y: [-6, 0] }, { ...spring.enter, at: 0.15 }],
      [q("main"), { opacity: [0, 1] }, { duration: 0.35, ease: ease.out, at: 0.21 }],
      [q("side"), { opacity: [0, 1] }, { duration: 0.35, ease: ease.out, at: 0.27 }],
      [
        Array.from({ length: PALETTE_SIZE }, (_, i) => q(`pb${i + 1}`)[0]),
        { opacity: [0, 1], scale: [0.7, 1] },
        { ...spring.pop, at: 0.33, delay: staggerDelay(0.035) },
      ],
      [seconds, START_SECONDS - 7, { duration: 7, ease: "linear", at: 0.4 }],

      // 2. Pick option 2, Save & Next: palette 1 turns answered.
      [cursor, { opacity: [0, 1], x: [start.x, start.x], y: [start.y, start.y] }, { duration: 0.2, at: 0.8 }],
      ...move(start, optB, 0.95),
      ...press(q, "q1optB", 1.55),
      [q("q1hi"), { opacity: [0, 1] }, { duration: 0.2, at: 1.58 }],
      [q("q1dot"), { opacity: [0, 1], scale: [0, 1] }, { ...spring.pop, at: 1.6 }],
      ...move(optB, save, 1.8),
      ...press(q, "save", 2.4),
      ...flip(q, 1, "a", 2.5),
      ...count("a", 1, 2.5),
      ...count("na", 0, 2.5),
      [q("q1"), { opacity: 0, x: -14 }, { ...exitTransition, at: 2.48 }],
      [q("q2"), { opacity: [0, 1], x: [14, 0] }, { ...spring.enter, at: 2.62 }],
      [q("q2opt"), { opacity: [0, 1], y: [6, 0] }, { ...spring.enter, at: 2.72, delay: staggerDelay(stagger.base) }],
      ...flip(q, 2, "na", 2.7),
      ...count("na", 1, 2.7),
      ...count("nv", PALETTE_SIZE - 2, 2.7),

      // 3. Mark for Review & Next: palette 2 turns purple.
      ...move(save, mark, 3.05),
      ...press(q, "mark", 3.65),
      ...flip(q, 2, "m", 3.75),
      ...count("m", 1, 3.75),
      ...count("na", 0, 3.75),
      ...move(mark, rest, 3.95),
    ]

    if (narrow) {
      seq.push(
        ...press(q, "drawerTab", 3.95),
        [q("scrim"), { opacity: [0, 1] }, { duration: 0.3, ease: ease.out, at: 4.02 }],
        [q("side"), { x: ["100%", "0%"] }, { ...spring.enter, at: 4.02 }],
      )
    }

    // 4. The rest of the palette fills in, one button at a time.
    LATER.forEach(([n, state], i) => {
      seq.push(...flip(q, n, state, fillAt + i * stagger.loose))
    })
    seq.push(
      ...count("a", 5, fillAt),
      ...count("na", 2, fillAt),
      ...count("m", 2, fillAt),
      ...count("am", 1, fillAt),
      ...count("nv", 2, fillAt),
    )

    // 5. Live preview pill lands and pulses once.
    seq.push(
      [q("pill"), { opacity: [0, 1], scale: [0.6, 1], y: [10, 0] }, { ...spring.pop, at: fillAt + 0.9 }],
      [q("pulse"), { opacity: [0.9, 0], scale: [1, 1.35] }, { duration: 0.7, ease: ease.out, at: fillAt + 1.25 }],
    )

    return seq
  })

  return (
    <div ref={scope} className={styles.vignette} data-playing={active}>
      <div className={styles.ghostWrap}>
        <div data-k="ghost" className={`${styles.ghost} ${styles.examGhost}`}>
          {[64, 88, 76, 52, 80].map((w, i) => (
            <div key={i} className={styles.ghostLine} style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>

      <div className={styles.drift}>
        <div data-k="frame" className={`${styles.frame} ${styles.h}`}>
          <div data-k="strip" className={styles.strip}>
            <span>JEE MAIN 2026 · MOCK TEST 04</span>
            <span className={styles.stripRight}>Physics | Chemistry | Mathematics</span>
          </div>

          <div className={styles.examBody}>
            <div data-k="main" className={`${styles.examMain} ${styles.h}`}>
              <div className={styles.sectionRow}>
                <span className={styles.sectionTab}>Physics · Section A (MCQ)</span>
                <span className={styles.timeLeft}>
                  Time Left : <LiveText value={seconds} format={formatTime} className={styles.num} />
                </span>
              </div>

              <div className={styles.qArea}>
                <div data-k="q1" className={styles.question}>
                  <div className={styles.qNo}>Question No. 1</div>
                  <div className={styles.qText}>
                    A wire of resistance <Html html={ntaMath.q1R} /> is stretched uniformly to twice its
                    length. Its new resistance is:
                  </div>
                  <div className={styles.options}>
                    {ntaMath.q1opts.map((opt, i) => (
                      <div key={i} data-k={i === 1 ? "q1optB" : undefined} className={styles.option}>
                        {i === 1 && <span data-k="q1hi" className={styles.optionHi} />}
                        <span className={styles.radio}>
                          {i === 1 && <span data-k="q1dot" className={styles.radioDot} />}
                          {i === 1 && <Ripple k="q1optB-ripple" dark />}
                        </span>
                        <span className={styles.optionLabel}>
                          ({i + 1}) <Html html={opt} />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div data-k="q2" className={`${styles.question} ${styles.h}`}>
                  <div className={styles.qNo}>Question No. 2</div>
                  <div className={styles.qText}>
                    If <Html html={ntaMath.q2int} />, then the value of <Html html={ntaMath.q2k} /> is:
                  </div>
                  <div className={styles.options}>
                    {ntaMath.q2opts.map((opt, i) => (
                      <div key={i} data-k="q2opt" className={`${styles.option} ${styles.h}`}>
                        <span className={styles.radio} />
                        <span className={styles.optionLabel}>
                          ({i + 1}) <Html html={opt} />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.actions}>
                <span data-k="mark" className={styles.examBtn}>
                  Mark for Review &amp; Next
                  <Ripple k="mark-ripple" dark />
                </span>
                <span className={styles.examBtn}>Clear Response</span>
                <span data-k="save" className={`${styles.examBtn} ${styles.examBtnSave}`}>
                  Save &amp; Next
                  <Ripple k="save-ripple" />
                </span>
              </div>
            </div>

            <span data-k="drawerTab" className={styles.drawerTab}>
              <ChevronLeft size={12} strokeWidth={3} />
              <Ripple k="drawerTab-ripple" />
            </span>
            <span data-k="scrim" className={styles.scrim} />

            <div data-k="side" className={`${styles.examSide} ${styles.h}`}>
              <div className={styles.candidate}>
                <span className={styles.avatar} />
                Candidate
              </div>
              <div className={styles.legend}>
                {(
                  [
                    ["a", "Answered"],
                    ["na", "Not Answered"],
                    ["nv", "Not Visited"],
                    ["m", "Marked for Review"],
                  ] as const
                ).map(([state, label]) => (
                  <span key={state} className={styles.legendItem}>
                    <LegendIcon state={state}>
                      <LiveText value={counts[state]} format={formatCount} />
                    </LegendIcon>
                    {label}
                  </span>
                ))}
                <span className={`${styles.legendItem} ${styles.legendWide}`}>
                  <LegendIcon state="am">
                    <LiveText value={counts.am} format={formatCount} />
                  </LegendIcon>
                  Answered &amp; Marked for Review
                </span>
              </div>
              <div className={styles.paletteTitle}>Physics · Section A</div>
              <div className={styles.palette}>
                {Array.from({ length: PALETTE_SIZE }, (_, i) => (
                  <PaletteButton key={i} n={i + 1} initial={i === 0 ? "na" : "nv"} />
                ))}
              </div>
              <div className={styles.submit}>Submit</div>
            </div>
          </div>
        </div>

        <div data-k="pill" className={styles.livePill}>
          <span className={styles.liveDot} />
          LIVE PREVIEW
          <span data-k="pulse" className={styles.livePulse} />
        </div>
      </div>

      <Cursor />
    </div>
  )
}

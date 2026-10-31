"use client"

import { useMotionValue, stagger as staggerDelay, type AnimationSequence, type MotionValue } from "framer-motion"
import { ArrowUpRight, BarChart3, Target } from "lucide-react"
import { countTransition, ease, spring, stagger } from "../motionTokens"
import { LiveText } from "../primitives"
import { useSlideTimeline } from "../useSlideTimeline"
import styles from "../Vignettes.module.css"

// Story: blind practice becomes clarity. Numbers land, the score trend rises,
// chapters rank themselves, and the camera settles on the one to fix.
// Sample-student data only. Palette: blue, red for the weak chapter, neutrals.

const KPIS = [
  { label: "Tests", value: 12, decimals: 0, suffix: "", sub: "" },
  { label: "Avg score", value: 183, decimals: 0, suffix: "", sub: "/300" },
  { label: "Accuracy", value: 74, decimals: 0, suffix: "%", sub: "" },
  { label: "Consistency", value: 8.2, decimals: 1, suffix: "", sub: "/10" },
]

const SCORES = [142, 156, 151, 174, 189, 212]
const PLOT = { w: 300, top: 6, bottom: 70, min: 120, max: 220 }
const POINTS = SCORES.map((s, i) => ({
  x: 10 + i * 56,
  y: PLOT.bottom - ((s - PLOT.min) / (PLOT.max - PLOT.min)) * (PLOT.bottom - PLOT.top),
}))
const LINE = POINTS.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join(" ")
const AREA = `${LINE} L${POINTS[POINTS.length - 1].x} ${PLOT.bottom + 6} L${POINTS[0].x} ${PLOT.bottom + 6} Z`

const CHAPTERS = [
  { name: "Mechanics", value: 86 },
  { name: "Organic Chemistry", value: 78 },
  { name: "Calculus", value: 72 },
  { name: "Thermodynamics", value: 69 },
  { name: "Electrostatics", value: 41, weak: true },
]

const HEAT = ["#bfdcf6", "#8fc1ee", "#d9eafa", "#5fa5e6", "#bfdcf6", "#d9eafa"]

const LINE_START = 1.35
const LINE_DUR = 1.5
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
// When does the eased line reach fraction p of its length? (inverse ease)
const reachTime = (p: number) =>
  LINE_START + LINE_DUR * (p < 0.5 ? Math.cbrt(p / 4) : 1 - Math.cbrt(2 * (1 - p)) / 2)

function useKpiValues(): MotionValue<number>[] {
  const a = useMotionValue(0)
  const b = useMotionValue(0)
  const c = useMotionValue(0)
  const d = useMotionValue(0)
  return [a, b, c, d]
}

export function AnalyticsSlide({ active }: { active: boolean }) {
  const kpiValues = useKpiValues()

  const scope = useSlideTimeline<HTMLDivElement>(active, (q) => {
    const dots = q("dot")
    const fills = q("barFill")
    const values = q("barValue")
    const span = POINTS[POINTS.length - 1].x - POINTS[0].x

    const seq: AnimationSequence = [
      [q("ghost"), { opacity: [0, 1], rotate: [0, 5], x: [0, 26], y: [0, -10] }, { ...spring.soft, at: 0.3 }],
      [q("card"), { opacity: [0, 1], y: [40, 0], scale: [0.96, 1] }, { ...spring.enter, at: 0.05 }],
      [q("part"), { opacity: [0, 1], y: [8, 0] }, { ...spring.enter, at: 0.22, delay: staggerDelay(stagger.base) }],

      // 1. KPI tiles pop in and count up.
      [q("kpi"), { opacity: [0, 1], scale: [0.9, 1] }, { ...spring.enter, at: 0.35, delay: staggerDelay(stagger.base) }],
    ]
    KPIS.forEach((k, i) => {
      seq.push([kpiValues[i], k.value, { ...countTransition, at: 0.45 + i * stagger.base }])
    })

    // 2. Score trend draws itself; each dot pops as the line reaches it.
    seq.push([q("line"), { strokeDashoffset: [1, 0] }, { duration: LINE_DUR, ease: easeInOutCubic, at: LINE_START }])
    POINTS.forEach((p, i) => {
      seq.push([dots[i], { opacity: [0, 1], scale: [0, 1] }, { ...spring.pop, at: reachTime((p.x - POINTS[0].x) / span) }])
    })
    seq.push(
      [q("area"), { opacity: [0, 1] }, { duration: 0.6, ease: ease.out, at: 2.7 }],
      [q("gain"), { opacity: [0, 1], scale: [0.6, 1] }, { ...spring.pop, at: 2.85 }],
    )

    // 3. Chapter bars grow; one comes up short.
    CHAPTERS.forEach((c, i) => {
      const at = 3.0 + i * stagger.loose
      seq.push(
        [fills[i], { scaleX: [0, c.value / 100] }, { ...spring.soft, at }],
        [values[i], { opacity: [0, 1] }, { duration: 0.3, at: at + 0.25 }],
      )
    })

    // 4. Payoff: the whole card slowly pushes in toward the weak chapter
    //    (scaled from near its bottom edge), which glows once and gets tagged.
    seq.push(
      [q("card"), { scale: [1, 1.05] }, { duration: 1.6, ease: ease.out, at: 4.25 }],
      [q("glow"), { opacity: [0, 1] }, { duration: 0.6, ease: ease.out, at: 4.35 }],
      [q("tag"), { opacity: [0, 1], scale: [0.5, 1] }, { ...spring.pop, at: 4.6 }],
    )

    return seq
  })

  return (
    <div ref={scope} className={styles.vignette} data-playing={active}>
      <div className={styles.ghostWrap}>
        <div data-k="ghost" className={`${styles.ghost} ${styles.statsGhost}`}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Chapter heatmap</div>
          <div className={styles.heatGrid}>
            {Array.from({ length: 30 }, (_, i) => (
              <span key={i} className={styles.heatCell} style={{ background: HEAT[(i * 7) % HEAT.length] }} />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.drift}>
        <div data-k="card" className={`${styles.statsCard} ${styles.h}`}>
          <div className={styles.focus}>
            <div data-k="part" className={`${styles.statsHead} ${styles.h}`}>
              <div>
                <div className={styles.title}>Your progress</div>
                <div className={styles.sub}>Last 6 tests · All subjects</div>
              </div>
              <span className={styles.pill}>
                <BarChart3 size={12} /> Analytics
              </span>
            </div>

            <div className={styles.kpis}>
              {KPIS.map((k, i) => (
                <div key={k.label} data-k="kpi" className={`${styles.kpi} ${styles.h}`}>
                  <div className={styles.kpiLabel}>{k.label}</div>
                  <div className={`${styles.kpiValue} ${styles.num}`}>
                    <LiveText
                      value={kpiValues[i]}
                      format={(v) => v.toFixed(k.decimals) + k.suffix}
                    />
                    {k.sub && <span className={styles.kpiSub}>{k.sub}</span>}
                  </div>
                </div>
              ))}
            </div>

            <div data-k="part" className={`${styles.panel} ${styles.trend} ${styles.h}`}>
              <div className={styles.panelHead}>
                Score trend
                <span data-k="gain" className={`${styles.gainChip} ${styles.h}`}>
                  <ArrowUpRight size={12} strokeWidth={3} /> +70 pts
                </span>
              </div>
              <svg width={PLOT.w} height="90" viewBox={`0 0 ${PLOT.w} 90`}>
                <defs>
                  <linearGradient id="vgArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1e7cd3" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#1e7cd3" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[PLOT.top, (PLOT.top + PLOT.bottom) / 2, PLOT.bottom].map((y) => (
                  <line key={y} x1="0" x2={PLOT.w} y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="3 4" />
                ))}
                <path data-k="area" d={AREA} fill="url(#vgArea)" opacity="0" />
                <path
                  data-k="line"
                  d={LINE}
                  pathLength={1}
                  strokeDasharray="1 1"
                  strokeDashoffset={1}
                  fill="none"
                  stroke="#1e7cd3"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {POINTS.map((p, i) => (
                  <circle
                    key={i}
                    data-k="dot"
                    className={styles.dot}
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill="#fff"
                    stroke="#1e7cd3"
                    strokeWidth="2.2"
                    opacity="0"
                  />
                ))}
                {POINTS.map((p, i) => (
                  <text key={i} x={p.x} y="87" fontSize="9" fontWeight="600" fill="#94a3b8" textAnchor="middle">
                    T{i + 1}
                  </text>
                ))}
              </svg>
            </div>

            <div data-k="part" className={`${styles.panel} ${styles.h}`}>
              <div className={styles.panelHead} style={{ marginBottom: 12 }}>
                Chapter accuracy
                <Target size={13} color="#94a3b8" />
              </div>
              <div className={styles.bars}>
                {CHAPTERS.map((c) => (
                  <div key={c.name} className={`${styles.barRow} ${c.weak ? styles.barWeak : ""}`}>
                    {c.weak && <span data-k="glow" className={styles.glow} />}
                    <span className={styles.barLabel} style={{ position: "relative" }}>
                      {c.name}
                    </span>
                    <span className={styles.barTrack}>
                      <span data-k="barFill" className={styles.barFill} />
                    </span>
                    <span data-k="barValue" className={`${styles.barValue} ${styles.num} ${styles.h}`}>
                      {c.value}%
                    </span>
                    {c.weak && (
                      <span data-k="tag" className={styles.focusTag}>
                        Focus here
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

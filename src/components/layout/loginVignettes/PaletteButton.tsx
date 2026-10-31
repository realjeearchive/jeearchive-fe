import type { ReactNode } from "react"
import type { Segment } from "framer-motion"
import { Check } from "lucide-react"
import { dur } from "./motionTokens"
import type { Query } from "./useSlideTimeline"
import styles from "./Vignettes.module.css"

export type PaletteState = "nv" | "na" | "a" | "m" | "am"

const LAYERS: { state: Exclude<PaletteState, "nv">; className: string }[] = [
  { state: "na", className: styles.na },
  { state: "a", className: styles.ans },
  { state: "m", className: styles.mk },
  { state: "am", className: styles.amk },
]

/**
 * NTA question-palette button. Every state is its own pre-styled layer, so a
 * state change is just a layer fading in while the button pops.
 */
export function PaletteButton({
  n,
  initial = "nv",
  hidden = true,
}: {
  n: number
  initial?: PaletteState
  hidden?: boolean
}) {
  return (
    <span data-k={`pb${n}`} className={`${styles.pb} ${hidden ? styles.h : ""}`}>
      <span data-k={`pb${n}-nv`} className={`${styles.pbLayer} ${styles.nv}`}>
        {n}
      </span>
      {LAYERS.map(({ state, className }) => (
        <span
          key={state}
          data-k={`pb${n}-${state}`}
          className={`${styles.pbLayer} ${className} ${state === initial ? "" : styles.pbOverlay}`}
        >
          {n}
          {state === "am" && (
            <span className={styles.tick}>
              <Check size={7} strokeWidth={4} color="#fff" />
            </span>
          )}
        </span>
      ))}
    </span>
  )
}

const ALL_STATES: PaletteState[] = ["nv", "na", "a", "m", "am"]

/**
 * Flip button `n` to `state` with a small overshoot pop. The other layers
 * fade out, since the round "marked" shapes don't cover the square ones.
 */
export function flip(q: Query, n: number, state: Exclude<PaletteState, "nv">, at: number): Segment[] {
  return [
    [q(`pb${n}-${state}`), { opacity: [0, 1] }, { duration: 0.14, at }],
    ...ALL_STATES.filter((s) => s !== state).map(
      (s): Segment => [q(`pb${n}-${s}`), { opacity: 0 }, { duration: 0.14, at }]
    ),
    [
      q(`pb${n}`),
      { scale: [1, 0.82, 1.12, 1] },
      { duration: dur.flip, times: [0, 0.25, 0.65, 1], ease: "easeOut", at },
    ],
  ]
}

/** Static legend icon in a given state, with a live count inside. */
export function LegendIcon({ state, children }: { state: PaletteState; children: ReactNode }) {
  const className =
    state === "nv" ? styles.nv : state === "na" ? styles.na : state === "a" ? styles.ans : styles.mk
  return (
    <span className={styles.legendIcon}>
      <span className={`${styles.pbLayer} ${className}`}>
        {children}
        {state === "am" && (
          <span className={styles.tick} style={{ width: 8, height: 8, right: -3, bottom: -3 }} />
        )}
      </span>
    </span>
  )
}

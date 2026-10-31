"use client"

import * as React from "react"
import type { MotionValue, Segment } from "framer-motion"
import { dur, ease, pressTransition } from "./motionTokens"
import type { Query } from "./useSlideTimeline"
import styles from "./Vignettes.module.css"

type Point = { x: number; y: number }

/**
 * Text driven by a MotionValue (count-ups, typing, timers). Writes straight
 * to the DOM on change, so a ticking number never re-renders React.
 */
export function LiveText({
  value,
  format,
  className,
}: {
  value: MotionValue<number>
  format: (v: number) => string
  className?: string
}) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const formatRef = React.useRef(format)

  React.useEffect(() => {
    formatRef.current = format
  })

  React.useEffect(
    () =>
      value.on("change", (v) => {
        if (ref.current) ref.current.textContent = formatRef.current(v)
      }),
    [value]
  )

  return (
    <span ref={ref} className={className}>
      {format(value.get())}
    </span>
  )
}

/** Soft ring that expands from a pressed element; animated by `press()`. */
export function Ripple({ k, dark = false }: { k: string; dark?: boolean }) {
  return <span data-k={k} className={dark ? styles.rippleDark : styles.ripple} />
}

/** Press: scale 1 → 0.96 → 1 over ~130ms plus a ripple, both starting at `at`. */
export function press(q: Query, key: string, at: number): Segment[] {
  return [
    [q(key), { scale: [1, 0.96, 1] }, { ...pressTransition, at }],
    [
      q(`${key}-ripple`),
      { scale: [0.2, 2.6], opacity: [0.45, 0] },
      { duration: dur.ripple, ease: ease.out, at },
    ],
  ]
}

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

/**
 * Cursor keyframes along a quadratic bezier whose control point sits ~15% of
 * the distance off the straight line. Samples are spaced by an ease-in-out
 * curve, then a tiny overshoot past the target settles back onto it.
 */
export function arcKeyframes(from: Point, to: Point, bend = 0.15, samples = 16) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const dist = Math.hypot(dx, dy) || 1
  const ctrl = {
    x: (from.x + to.x) / 2 + (-dy / dist) * dist * bend,
    y: (from.y + to.y) / 2 + (dx / dist) * dist * bend,
  }
  const x: number[] = []
  const y: number[] = []
  for (let i = 0; i <= samples; i++) {
    const t = easeInOutCubic(i / samples)
    const u = 1 - t
    x.push(u * u * from.x + 2 * u * t * ctrl.x + t * t * to.x)
    y.push(u * u * from.y + 2 * u * t * ctrl.y + t * t * to.y)
  }
  // Settle: 3px past the target along the direction of travel, then back.
  x.push(to.x + (dx / dist) * 3, to.x)
  y.push(to.y + (dy / dist) * 3, to.y)
  const n = samples + 2
  const times = x.map((_, i) =>
    i <= samples ? (i / samples) * 0.86 : 0.86 + ((i - samples) / (n - samples)) * 0.14
  )
  return { x, y, times }
}

/**
 * Centre of `el` in `root`'s layout coordinates. Uses offsetLeft/Top, which
 * ignore transforms, so targets are right while --mock-scale, the camera
 * push-in or entrance animations are applied.
 */
export function centerIn(root: HTMLElement, el: HTMLElement | undefined): Point {
  if (!el) return { x: 0, y: 0 }
  let x = el.offsetWidth / 2
  let y = el.offsetHeight / 2
  let node: HTMLElement | null = el
  while (node && node !== root) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }
  return { x, y }
}

/** Arrow pointer, shown on desktop only (mobile relies on tap ripples). */
export function Cursor() {
  return (
    <span data-k="cursor" className={styles.cursor} aria-hidden="true">
      <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
        <path
          d="M1.5 1.5v16.2l4.3-4.1 2.9 6.6 3-1.3-2.9-6.5h6.1L1.5 1.5Z"
          fill="#111827"
          stroke="#fff"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

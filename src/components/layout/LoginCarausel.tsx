"use client"

import * as React from "react"
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion"
import dynamic from "next/dynamic"
import styles from "./LoginCarausel.module.css"

// The product scenes (and framer-motion with them) only mount once the page
// has loaded and gone idle, so their code stays off the initial download.
const Vignette = dynamic(() => import("./loginVignettes").then((mod) => mod.Vignette), {
  ssr: false,
})

// --- Slide Data ---
const STORY_MS = 8000
const MOCK_REVEAL_MS = 650

const onboardingSlides = [
  {
    heading: "Organize your prep with structured PYQ archives",
    accent: "PYQ archives",
    color: "#F94F39",
  },
  {
    heading: "Deep performance analytics across all subjects",
    accent: "analytics",
    color: "#1E7CD3",
  },
  {
    heading: "Experience the real NTA exam interface",
    accent: "NTA exam",
    color: "#6B66DA",
  },
] as const

// Superlist-style track: the active card sits in the left slot, the next one
// waits one slot to the right (behind the translucent auth panel, which blurs
// it into a coloured glow), and the previous one slides off left with a tilt.
// `step` only ever increases; each slide's `generation` bumps when it wraps
// from the far left back to the right, which remounts it there instead of
// animating it across the screen.
export function OnboardingCarousel() {
  const reducedMotion = usePrefersReducedMotion()
  const [step, setStep] = React.useState(0)
  const stageRef = React.useRef<HTMLDivElement>(null)

  const total = onboardingSlides.length
  const activeIndex = step % total
  const paused = reducedMotion

  const advance = React.useCallback(() => setStep((s) => s + 1), [])

  React.useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const desktop = window.matchMedia("(min-width: 900px)")
    const update = () => {
      const card = stage.querySelector<HTMLElement>(`.${styles.slide}`)
      if (!card) return
      const w = card.offsetWidth
      const h = card.offsetHeight
      // Sized off the 360×480 vignette; the exam vignette (600×380) shares
      // the scale and is laid out to fit the same box on desktop.
      const scale = desktop.matches
        ? Math.min(w / 1090, (h * 0.54) / 480) * 1.12
        : Math.min(1, ((w - 48) * 0.85) / 360, (h * 0.5) / 480)
      stage.style.setProperty("--mock-scale", scale.toFixed(3))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(stage)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={stageRef}
      className={styles.stage}
      // The first card is the page's largest text (LCP): on initial load it
      // shows instantly; entrance animations only run once the track moves.
      data-initial={step === 0}
      style={{ ["--story-ms" as string]: `${STORY_MS}ms` }}
    >
      <StoryProgressBar
        total={total}
        activeIndex={activeIndex}
        paused={paused}
        onSegmentComplete={advance}
      />

      {onboardingSlides.map((slide, i) => {
        const generation = Math.ceil((step - 1 - i) / total)
        const position = i + generation * total - step
        return (
          <SlideCard
            key={`${i}:${generation}`}
            index={i}
            heading={slide.heading}
            accent={slide.accent}
            color={slide.color}
            position={position}
            onAdvance={advance}
          />
        )
      })}
    </div>
  )
}

// Runs `cb` after `minDelay`, but never before the page has loaded and the
// main thread is idle, so the first vignette doesn't compete with hydration
// (keeps Total Blocking Time and input delay down on slow phones). Later
// slides start on time since the page has long settled by then.
function afterPageSettles(cb: () => void, minDelay: number) {
  let idleId: number | undefined
  let fallback: ReturnType<typeof setTimeout> | undefined
  const whenIdle = () => {
    if ("requestIdleCallback" in window) idleId = window.requestIdleCallback(cb, { timeout: 1500 })
    else fallback = setTimeout(cb, 0)
  }
  const timer = setTimeout(() => {
    if (document.readyState === "complete") whenIdle()
    else window.addEventListener("load", whenIdle, { once: true })
  }, minDelay)
  return () => {
    clearTimeout(timer)
    clearTimeout(fallback)
    window.removeEventListener("load", whenIdle)
    if (idleId !== undefined) window.cancelIdleCallback(idleId)
  }
}

// ─── One card on the track ─────────────────────────────────────────────────
function SlideCard({
  index,
  heading,
  accent,
  color,
  position,
  onAdvance,
}: {
  index: number
  heading: string
  accent: string
  color: string
  position: number
  onAdvance: () => void
}) {
  // The mock app only appears once the card has slid into place, and stays
  // while it slides out. Cards waiting behind the panel never mount it.
  const [showMock, setShowMock] = React.useState(false)

  React.useEffect(() => {
    if (position !== 0 || showMock) return
    return afterPageSettles(() => setShowMock(true), MOCK_REVEAL_MS)
  }, [position, showMock])

  return (
    <div
      className={styles.slide}
      aria-hidden={position !== 0}
      data-active={position === 0}
      onClick={position === 0 ? onAdvance : undefined}
      style={{
        backgroundColor: color,
        // Exited cards get an extra 64px so their tilted corners clear the edge.
        transform:
          position < 0
            ? `translate3d(calc(${position} * var(--slot) - 64px), 0, 0) rotate(-4deg)`
            : `translate3d(calc(${position} * var(--slot)), 0, 0) rotate(0deg)`,
      }}
    >
      {/* Cards that have been active (position <= 0) keep their heading
          shown, so it doesn't disappear while the card slides out. */}
      <AnimatedHeading text={heading} accent={accent} shown={position <= 0} />
      {showMock && (
        <div className={index === 2 ? styles.mockExam : styles.mock}>
          <Vignette index={index} active={position === 0} />
        </div>
      )}
    </div>
  )
}

// ─── Heading: words rise in, then the key phrase gets an underline ────────
// Pure CSS, keyed off data-shown; --i staggers the words.
function AnimatedHeading({ text, accent, shown }: { text: string; accent: string; shown: boolean }) {
  const start = text.indexOf(accent)
  const parts = [
    { words: text.slice(0, start).trim().split(" "), accent: false },
    { words: accent.split(" "), accent: true },
    { words: text.slice(start + accent.length).trim().split(" "), accent: false },
  ].filter((part) => part.words[0])

  let i = 0
  // Spaces between words are plain text outside the inline-block masks, so
  // they never collapse at the accent boundary.
  const renderWords = (words: string[]) =>
    words.map((word, w) => {
      const index = i++
      return (
        <React.Fragment key={index}>
          {w > 0 && " "}
          <span className={styles.word}>
            <span style={{ ["--i" as string]: index }}>{word}</span>
          </span>
        </React.Fragment>
      )
    })

  return (
    <h2 className={styles.heading} data-shown={shown} style={{ ["--words" as string]: text.split(" ").length }}>
      {parts.map((part, p) => (
        <React.Fragment key={p}>
          {p > 0 && " "}
          {part.accent ? (
            <span className={styles.accent}>
              {renderWords(part.words)}
              <span className={styles.underline} aria-hidden="true" />
            </span>
          ) : (
            renderWords(part.words)
          )}
        </React.Fragment>
      ))}
    </h2>
  )
}

// ─── Story-style progress bar (left slot only) ─────────────────────────────
// Ticking is a compositor-only CSS animation; React only hears about it once
// per slide via animationend. Segments resize via flex-grow.
function StoryProgressBar({
  total,
  activeIndex,
  paused,
  onSegmentComplete,
}: {
  total: number
  activeIndex: number
  paused: boolean
  onSegmentComplete: () => void
}) {
  return (
    <div className={styles.progressBar} aria-hidden="true">
      {Array.from({ length: total }).map((_, i) => {
        const active = i === activeIndex
        return (
          <div
            key={i}
            className={styles.segment}
            data-active={active}
            data-paused={paused}
          >
            <div
              className={styles.segmentFill}
              onAnimationEnd={active ? onSegmentComplete : undefined}
            />
          </div>
        )
      })}
    </div>
  )
}

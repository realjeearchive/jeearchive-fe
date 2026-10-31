"use client"

import { useEffect, useEffectEvent } from "react"
import { useAnimate, type AnimationSequence } from "framer-motion"
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion"

/** Finds the animated parts of a vignette by their `data-k` attribute. */
export type Query = (key: string) => NodeListOf<HTMLElement>

/**
 * One clock per slide: the whole vignette is a single framer-motion sequence
 * (think After Effects timeline) built when the card becomes active.
 *
 * - Restarts cleanly: the track remounts a card each time it wraps, so every
 *   visit builds a fresh timeline.
 * - Stops (keeping its current frame) when the card leaves the active slot.
 * - Pauses while the tab is hidden.
 * - With reduced motion the sequence is completed instantly, so the static
 *   final frame comes from the same code as the animation.
 */
export function useSlideTimeline<T extends HTMLElement>(
  active: boolean,
  build: (q: Query, root: T) => AnimationSequence
) {
  const [scope, animate] = useAnimate<T>()
  const reducedMotion = usePrefersReducedMotion()
  const buildSequence = useEffectEvent((root: T) =>
    build((key) => root.querySelectorAll<HTMLElement>(`[data-k="${key}"]`), root)
  )

  useEffect(() => {
    const root = scope.current
    if (!active || !root) return

    const controls = animate(buildSequence(root))
    if (reducedMotion) {
      controls.complete()
      return () => controls.stop()
    }

    const onVisibility = () => (document.hidden ? controls.pause() : controls.play())
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      document.removeEventListener("visibilitychange", onVisibility)
      controls.stop()
    }
  }, [active, reducedMotion, animate, scope])

  return scope
}

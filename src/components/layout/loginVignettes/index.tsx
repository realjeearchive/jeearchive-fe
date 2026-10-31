"use client"

import { useEffect } from "react"
import dynamic from "next/dynamic"
import { AnalyticsSlide } from "./slides/AnalyticsSlide"
import { PyqSlide } from "./slides/PyqSlide"

// The exam slide carries the KaTeX stylesheet, so it's split out and fetched
// in idle time while the first slides play, keeping it off the initial load.
const loadNtaSlide = () => import("./slides/NtaSlide").then((mod) => mod.NtaSlide)
const NtaSlide = dynamic(loadNtaSlide, { ssr: false })

const SLIDES = [PyqSlide, AnalyticsSlide, NtaSlide]

/** The animated product vignette for carousel slide `index`. Decorative. */
export function Vignette({ index, active }: { index: number; active: boolean }) {
  useEffect(() => {
    if (index === 2) return
    const preload = () => void loadNtaSlide()
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(preload, { timeout: 4000 })
      return () => window.cancelIdleCallback(id)
    }
    const t = setTimeout(preload, 2000)
    return () => clearTimeout(t)
  }, [index])

  const Slide = SLIDES[index]
  return (
    <div aria-hidden="true" inert>
      <Slide active={active} />
    </div>
  )
}

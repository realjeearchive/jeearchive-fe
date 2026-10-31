// Every timing used by the login vignettes lives here so the three slides
// share one motion language. Times are seconds on the slide's own clock,
// which starts when the mock mounts (~650ms after the card becomes active).

export const ease = {
  // Slight overshoot for entrances that aren't springs.
  overshoot: [0.34, 1.56, 0.64, 1] as const,
  out: [0.16, 1, 0.3, 1] as const,
  in: [0.4, 0, 1, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
}

export const spring = {
  enter: { type: "spring", stiffness: 260, damping: 22 } as const,
  soft: { type: "spring", stiffness: 180, damping: 24 } as const,
  pop: { type: "spring", stiffness: 420, damping: 18 } as const,
}

export const dur = {
  exit: 0.27, // ~60% of a 450ms entrance
  press: 0.13,
  ripple: 0.5,
  countUp: 1,
  flip: 0.42,
  cursorMove: 0.6,
}

export const stagger = {
  tight: 0.04,
  base: 0.06,
  loose: 0.07,
}

export const exitTransition = { duration: dur.exit, ease: ease.in }
export const countTransition = { duration: dur.countUp, ease: ease.out }
export const pressTransition = { duration: dur.press, ease: ease.inOut }

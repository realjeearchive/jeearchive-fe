"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(QUERY);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads matchMedia, unavailable at render/SSR time, and must stay in sync with live changes.
    setReduced(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return reduced;
}

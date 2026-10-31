"use client";

import { useEffect, useState } from "react";

interface UseTypewriterOptions {
  speed?: number;
  startDelay?: number;
  active?: boolean;
}

// When `active` is false, the full string is shown immediately (no animation) -
// used to respect prefers-reduced-motion and to skip the effect on unmounted slides.
export function useTypewriter(
  text: string,
  { speed = 26, startDelay = 0, active = true }: UseTypewriterOptions = {}
) {
  const [shown, setShown] = useState(active ? "" : text);
  const [done, setDone] = useState(!active);

  useEffect(() => {
    if (!active) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncs to an external prop change (active/reduced-motion toggling after mount), not derivable at render time.
      setShown(text);
      setDone(true);
      return;
    }

    setShown("");
    setDone(false);

    const timers: ReturnType<typeof setTimeout>[] = [];
    const start = setTimeout(() => {
      let i = 0;
      const step = () => {
        i += 1;
        setShown(text.slice(0, i));
        if (i < text.length) {
          timers.push(setTimeout(step, speed));
        } else {
          setDone(true);
        }
      };
      step();
    }, startDelay);
    timers.push(start);

    return () => timers.forEach(clearTimeout);
  }, [text, speed, startDelay, active]);

  return { shown, done };
}

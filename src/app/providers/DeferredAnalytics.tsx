'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[][] };
  }
}

const INTERACTIONS = ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const;
const FALLBACK_MS = 6000;

function addScript(src: string) {
  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

/**
 * Loads Google Analytics and Microsoft Clarity on the visitor's first
 * interaction, or after 6s, whichever comes first, so ~200 KB of analytics
 * never competes with the first render or the first tap. The gtag queue is
 * set up early in the root layout, so the page view is still recorded.
 */
export function DeferredAnalytics({ gaId, clarityId }: { gaId?: string; clarityId?: string }) {
  useEffect(() => {
    let loaded = false;

    const cleanup = () => {
      clearTimeout(timer);
      INTERACTIONS.forEach((type) => window.removeEventListener(type, load));
    };

    function load() {
      if (loaded) return;
      loaded = true;
      cleanup();

      if (gaId) addScript(`https://www.googletagmanager.com/gtag/js?id=${gaId}`);
      if (clarityId) {
        window.clarity =
          window.clarity ||
          Object.assign((...args: unknown[]) => (window.clarity!.q ||= []).push(args), {});
        addScript(`https://www.clarity.ms/tag/${clarityId}`);
      }
    }

    const timer = setTimeout(load, FALLBACK_MS);
    INTERACTIONS.forEach((type) => window.addEventListener(type, load, { once: true, passive: true }));
    return cleanup;
  }, [gaId, clarityId]);

  return null;
}

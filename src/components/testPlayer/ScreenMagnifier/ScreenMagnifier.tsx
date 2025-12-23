"use client";

import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import styles from "./ScreenMagnifier.module.css";
import { useScreenMagnifier } from "@/features/tests/useScreenMagnifier";

export default function ScreenMagnifier() {
  const { enabled, toggle } = useScreenMagnifier();

  const magnifierRef = useRef<HTMLDivElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);

  const [pos, setPos] = useState({ x: 200, y: 200 });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled || !mirrorRef.current) return;

    const source = document.getElementById("test-player-root");
    if (!source) return;

    mirrorRef.current.innerHTML = "";

    const clone = source.cloneNode(true) as HTMLElement;
    clone
      .querySelectorAll('[data-magnifier="true"]')
      .forEach((el) => el.remove());

    clone.style.pointerEvents = "none";
    mirrorRef.current.appendChild(clone);
  }, [enabled]);

  useEffect(() => {
  if (!enabled) return;

  const move = (e: PointerEvent) => {
    if (!dragging || !magnifierRef.current) return;

    const w = magnifierRef.current.offsetWidth;
    const h = magnifierRef.current.offsetHeight;

    const maxX = window.innerWidth - w;
    const maxY = window.innerHeight - h;

    const nextX = Math.min(
      Math.max(0, e.clientX - offset.current.x),
      maxX
    );
    const nextY = Math.min(
      Math.max(0, e.clientY - offset.current.y),
      maxY
    );

    setPos({ x: nextX, y: nextY });
  };

  const stop = () => setDragging(false);

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", stop);
  window.addEventListener("pointercancel", stop);

  return () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", stop);
    window.removeEventListener("pointercancel", stop);
  };
}, [dragging, enabled]);


  if (!enabled) return null;

  return (
    <div
      ref={magnifierRef}
      data-magnifier="true"
      className={styles.magnifier}
      style={{ left: pos.x, top: pos.y }}
      onPointerDown={(e) => {
        // prevent drag when clicking close
        if ((e.target as HTMLElement).dataset.close) return;

        setDragging(true);
        offset.current = {
          x: e.nativeEvent.offsetX,
          y: e.nativeEvent.offsetY,
        };
      }}
    >
      {/* Close Button */}
      <button
        data-close
        className={styles.closeBtn}
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
        aria-label="Close magnifier"
      >
        <IoClose size={16} />
      </button>

      <div
        ref={mirrorRef}
        className={styles.mirror}
        style={{
          transform: `scale(1.8) translate(${-pos.x}px, ${-pos.y}px)`,
        }}
      />
    </div>
  );
}

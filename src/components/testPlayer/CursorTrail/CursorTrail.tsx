"use client";

import { useEffect } from "react";
import styles from "./CursorTrail.module.css";

import { useTestPlayerAccessibility } from "@/features/tests/useTestPlayerAccessibility";

export default function CursorTrail() {
  const { cursorSize } = useTestPlayerAccessibility();

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const cursor = document.createElement("div");
      cursor.className = styles.cursorTrail;
      cursor.dataset.size = cursorSize;

      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;

      document.body.appendChild(cursor);
      setTimeout(() => cursor.remove(), 700);
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [cursorSize]);

  return null;
}

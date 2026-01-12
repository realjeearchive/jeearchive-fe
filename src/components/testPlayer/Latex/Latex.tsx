"use client";

import React from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface LatexProps {
  children: string;
}

export default function Latex({ children }: LatexProps) {
  if (!children) return null;

  // --- 1. SANITIZATION LAYER (The "Fixer") ---
  // We clean the string in a specific order to fix backend data issues.
  const processed = children
    // Fix 1: Replace escaped brackets \[ and \] with normal [ ]
    // (The backend sends these as text literals, confusing the renderer)
    .replace(/\\\[/g, "[")
    .replace(/\\\]/g, "]")
    
    // Fix 2: Fix previously identified \left\[ issues
    .replace(/\\left\\\[/g, "\\left[")
    .replace(/\\right\\\]/g, "\\right]")
    .replace(/\\left\\\(/g, "\\left(")
    .replace(/\\right\\\)/g, "\\right)")
    
    // Fix 3: Fix the broken integral syntax "\int_\limits" -> "\int\limits_"
    .replace(/_\\limits/g, "\\limits_")
    
    // Fix 4: Replace escaped underscores \_ with normal _ (for fill-in-the-blanks)
    .replace(/\\_/g, "_");

  // --- 2. SPLITTING LOGIC ---
  // Group 1: $$...$$ (Block Math)
  // Group 2: $...$ (Inline Math)
  // Group 3: \[...\] (Alternative Block Math syntax)
  const parts = processed.split(/(\$\$[\s\S]+?\$\$)|(\$[^\$]+\$)|(\\\[[\s\S]+?\\\])/g);

  return (
    <span>
      {parts.map((part, index) => {
        if (!part) return null;

        // CASE A: Block Math $$...$$
        if (part.startsWith("$$") && part.endsWith("$$")) {
          const math = part.slice(2, -2);
          return <RenderMath key={index} math={math} block={true} />;
        }

        // CASE B: Alternative Block Math \[...\]
        if (part.startsWith("\\[") && part.endsWith("\\]")) {
          const math = part.slice(2, -2);
          return <RenderMath key={index} math={math} block={true} />;
        }

        // CASE C: Inline Math $...$
        if (part.startsWith("$") && part.endsWith("$")) {
          const math = part.slice(1, -1);
          return <RenderMath key={index} math={math} block={false} />;
        }

        // CASE D: Text (with auto-detection for commands like \mathrm)
        return <SmartText key={index} text={part} />;
      })}
    </span>
  );
}

// --- SUB-COMPONENT: Render Math safely ---
function RenderMath({ math, block }: { math: string; block: boolean }) {
  let html: string | null = null;

  try {
    html = katex.renderToString(math, {
      throwOnError: false,
      displayMode: block,
      output: "html",
      strict: false, // Be lenient with warnings
    });
  } catch (e) {
    html = null;
  }

  if (!html) {
    // If render fails, show the code in red so you can debug it
    return <code style={{ color: "red", fontSize: "0.8em" }}>{math}</code>;
  }

  return (
    <span
      dangerouslySetInnerHTML={{ __html: html }}
      className={block ? "katex-block" : "katex-inline"}
    />
    
  );
}

// --- SUB-COMPONENT: Detect hidden math in text ---
function SmartText({ text }: { text: string }) {
  // Finds LaTeX commands that might be floating in text without $ wrappers
  // e.g. "The value of \alpha is..."
  const tokens = text.split(/(\\[a-zA-Z]+(?:\{[^}]*\})*)/g);

  return (
    <>
      {tokens.map((token, i) => {
        // Heuristic: If it starts with \ and isn't just a symbol, try to render it
        if (token.startsWith("\\") && token.length > 1 && !token.includes(" ")) {
           return <RenderMath key={i} math={token} block={false} />;
        }
        return <span key={i}>{token}</span>;
      })}
    </>
  );
}
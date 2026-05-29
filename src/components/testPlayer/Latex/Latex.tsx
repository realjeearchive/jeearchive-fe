"use client";

import React from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface LatexProps {
  children: string;
}

export default function Latex({ children }: LatexProps) {
  if (!children) return null;

  // --- 1. SANITIZATION LAYER FOR BACKEND FRAGMENTS ---
  const processed = children
    // Clean up carriage returns or extra newlines that break inline arrays
    .replace(/\r?\n|\r/g, " ")
    
    // Fix escaped bracket groups from backend strings
    .replace(/\\\[/g, "[")
    .replace(/\\\]/g, "]")
    .replace(/\\left\\\[/g, "\\left[")
    .replace(/\\right\\\]/g, "\\right]")
    .replace(/\\left\\\(/g, "\\left(")
    .replace(/\\right\\\)/g, "\\right)")
    
    // Fix integral limits spacing string bugs
    .replace(/_\\limits/g, "\\limits_")
    
    // Clean loose text formatting artifacts from string parsers
    .replace(/\\_/g, "_");

  // --- 2. REGEX TO FIND ALL COMBINATIONS OF MATH BLOCKS ---
  // Captures $$...$$, $...$, \[...\], and explicit MathJax container structures if passed
  const parts = processed.split(/(\$\$[\s\S]+?\$\$)|(\$[^\$]+\$)|(\\\[[\s\S]+?\\\])/g);

  return (
    <span>
      {parts.map((part, index) => {
        if (!part) return null;

        // CASE A: Double Dollar Block Math $$...$$
        if (part.startsWith("$$") && part.endsWith("$$")) {
          const math = part.slice(2, -2);
          return <RenderMath key={index} math={math} block={true} />;
        }

        // CASE B: Alternative Slash Bracket Block Math \[...\]
        if (part.startsWith("\\[") && part.endsWith("\\]")) {
          const math = part.slice(2, -2);
          return <RenderMath key={index} math={math} block={true} />;
        }

        // CASE C: Single Dollar Inline Math $...$
        if (part.startsWith("$") && part.endsWith("$")) {
          const math = part.slice(1, -1);
          return <RenderMath key={index} math={math} block={false} />;
        }

        // CASE D: Clean string token (With custom helper to handle nested single macros)
        return <SmartText key={index} text={part} />;
      })}
    </span>
  );
}

// --- SUB-COMPONENT: Safe KaTeX Compilation Engine ---
function RenderMath({ math, block }: { math: string; block: boolean }) {
  // Clean up any remaining <br> or element fragments left inside the math equation block
  const cleanedMath = math
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .trim();

  if (!cleanedMath) return null;

  let html: string | null = null;

  try {
    html = katex.renderToString(cleanedMath, {
      throwOnError: false,
      displayMode: block,
      output: "html",
      strict: false, // Prevents compilation termination errors on unrecognized symbols
    });
  } catch (e) {
    html = null;
  }

  if (!html) {
    return (
      <code
        role="alert"
        style={{
          color: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.08)",
          padding: "2px 6px",
          borderRadius: "4px",
          fontSize: "13px",
          fontFamily: "monospace",
        }}
      >
        {cleanedMath}
      </code>
    );
  }

  return (
    <span
      dangerouslySetInnerHTML={{ __html: html }}
      className={block ? "katex-block" : "katex-inline"}
      style={block ? { display: "block", width: "100%", overflowX: "auto", margin: "8px 0" } : {}}
    />
  );
}

// --- SUB-COMPONENT: Inline standalone Macro Helper ---
function SmartText({ text }: { text: string }) {
  // Isolates floating LaTeX escape macros that missed wrapping delimiters (e.g. \alpha)
  const tokens = text.split(/(\\[a-zA-Z]+(?:\{[^}]*\})*)/g);

  return (
    <>
      {tokens.map((token, i) => {
        // Strict boundary validation: Ensure macros have content and don't include plain spaces
        if (token.startsWith("\\") && token.length > 1 && !token.includes(" ")) {
          return <RenderMath key={i} math={token} block={false} />;
        }
        return <span key={i}>{token}</span>;
      })}
    </>
  );
}
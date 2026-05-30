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
    .replace(/\r?\n|\r/g, " ")
    .replace(/\\\[/g, "[")
    .replace(/\\\]/g, "]")
    .replace(/\\left\\\[/g, "\\left[")
    .replace(/\\right\\\]/g, "\\right]")
    .replace(/\\left\\\(/g, "\\left(")
    .replace(/\\right\\\)/g, "\\right)")
    .replace(/_\\limits/g, "\\limits_")
    .replace(/\\_/g, "_");

  // --- 2. REGEX TO FIND ALL COMBINATIONS OF MATH BLOCKS ---
  const parts = processed.split(/(\$\$[\s\S]+?\$\$)|(\$[^\$]+\$)|(\\\[[\s\S]+?\\\])/g);

  return (
    <span>
      {parts.map((part, index) => {
        if (!part) return null;

        if (part.startsWith("$$") && part.endsWith("$$")) {
          return <RenderMath key={index} math={part.slice(2, -2)} block={true} />;
        }
        if (part.startsWith("\\[") && part.endsWith("\\]")) {
          return <RenderMath key={index} math={part.slice(2, -2)} block={true} />;
        }
        if (part.startsWith("$") && part.endsWith("$")) {
          return <RenderMath key={index} math={part.slice(1, -1)} block={false} />;
        }

        return <SmartText key={index} text={part} />;
      })}
    </span>
  );
}

// --- SUB-COMPONENT: Safe KaTeX Compilation Engine ---
function RenderMath({ math, block }: { math: string; block: boolean }) {
  const cleanedMath = math
    .replace(/<br\s*\/?>/gi, " ")
    // 🔥 THE FIX: Strictly strip ONLY valid HTML tags (starting with letters).
    // The old regex ate "<0" thinking it was a broken HTML tag!
    .replace(/<\/?\s*[a-zA-Z][^>]*>/g, "")
    .trim();

  if (!cleanedMath) return null;

  // Demote fake block math to inline
  let isDisplayMode = block;
  if (isDisplayMode) {
    const requiresBlock = cleanedMath.includes("\\begin") || 
                          cleanedMath.includes("\\displaystyle") || 
                          cleanedMath.includes("\\\\");
    if (!requiresBlock) {
      isDisplayMode = false;
    }
  }

  let html: string | null = null;

  try {
    html = katex.renderToString(cleanedMath, {
      throwOnError: false,
      displayMode: isDisplayMode, // Uses our smart heuristic
      output: "html",
      strict: false,
    });
  } catch (e) {
    html = null;
  }

  if (!html) {
    return (
      <code role="alert" style={{ color: "#ef4444", padding: "2px 4px" }}>
        {cleanedMath}
      </code>
    );
  }

  return (
    <span
      dangerouslySetInnerHTML={{ __html: html }}
      className={isDisplayMode ? "katex-block" : "katex-inline"}
      style={
        isDisplayMode 
          ? { display: "block", width: "100%", overflowX: "auto", margin: "8px 0" } 
          : { display: "inline-block", verticalAlign: "middle", margin: "0 2px" }
      }
    />
  );
}

function SmartText({ text }: { text: string }) {
  const tokens = text.split(/(\\[a-zA-Z]+(?:\{[^}]*\})*)/g);
  return (
    <>
      {tokens.map((token, i) => {
        if (token.startsWith("\\") && token.length > 1 && !token.includes(" ")) {
          return <RenderMath key={i} math={token} block={false} />;
        }
        return <span key={i}>{token}</span>;
      })}
    </>
  );
}
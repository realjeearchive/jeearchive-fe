"use client";

import React from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface LatexProps {
  children: string;
}

const Latex = ({ children }: LatexProps) => {
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
    .replace(/\\_/g, "_")
    .replace(/_{2,}/g, (match) => "\\_".repeat(match.length));

  // --- 2. REGEX TO FIND ALL COMBINATIONS OF MATH BLOCKS ---
  const parts = processed.split(/(\$\$[\s\S]+?\$\$)|(\$[^\$]+\$)|(\\\[[\s\S]+?\\\])|(\\begin\{[a-zA-Z*]+\}[\s\S]+?\\end\{[a-zA-Z*]+\})/g);

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
        if (part.startsWith("\\begin{") && part.includes("\\end{")) {
          return <RenderMath key={index} math={part} block={true} />;
        }

        return <SmartText key={index} text={part} />;
      })}
    </span>
  );
}

// --- SUB-COMPONENT: Safe KaTeX Compilation Engine ---
const RenderMath = React.memo(function RenderMath({ math, block }: { math: string; block: boolean }) {
  let cleanedMath = math
    .replace(/<br\s*\/?>/gi, " ")
    // 🔥 THE FIX: Strictly strip ONLY valid HTML tags (starting with letters).
    // The old regex ate "<0" thinking it was a broken HTML tag!
    .replace(/<\/?\s*[a-zA-Z][^>]*>/g, "")
    .trim();

  // Fix \hline in aligned environments which KaTeX doesn't support natively
  cleanedMath = cleanedMath.replace(/\\begin\{aligned\}([\s\S]*?)\\end\{aligned\}/g, (match, inner) => {
    return '\\begin{aligned}' + inner.replace(/\\hline/g, '') + '\\end{aligned}';
  });

  // Fix \cr (MathJax newline) to \\ (KaTeX newline)
  cleanedMath = cleanedMath.replace(/\\cr/g, '\\\\');

  // Fix \matrix{ ... } to \begin{matrix} ... \end{matrix}
  let i = 0;
  while ((i = cleanedMath.indexOf('\\matrix{', i)) !== -1) {
    let braceCount = 1;
    let j = i + 8;
    while (j < cleanedMath.length && braceCount > 0) {
      if (cleanedMath[j] === '{') braceCount++;
      else if (cleanedMath[j] === '}') braceCount--;
      j++;
    }
    if (braceCount === 0) {
      cleanedMath = cleanedMath.substring(0, i) + '\\begin{matrix}' + cleanedMath.substring(i + 8, j - 1) + '\\end{matrix}' + cleanedMath.substring(j);
    } else {
      i += 8;
    }
  }

  // Fix \matrix without braces
  cleanedMath = cleanedMath.replace(/\\matrix\s*([^{][\s\S]*?)(?=\)|\]|\}|\\right|\$|$)/g, (match, inner) => {
    return '\\begin{matrix}' + inner + '\\end{matrix}';
  });

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
});

const SmartText = React.memo(function SmartText({ text }: { text: string }) {
  const tokens = text.split(/(\\[a-zA-Z]+(?:\{[^}]*\})*)/g);
  return (
    <>
      {tokens.map((token, i) => {
        if (token.startsWith("\\") && token.length > 1 && !token.includes(" ")) {
          return <RenderMath key={i} math={token} block={false} />;
        }
        
        // Clean up text artifacts before rendering to DOM:
        // 1. Unescape \_ back to _ (handles our global _{2,} replacement)
        // 2. Convert \  (backslash space) to _ (often used by backend for fill-in-the-blank)
        const displayText = token
          .replace(/\\_/g, "_")
          .replace(/\\\s/g, "_");
          
        return <span key={i}>{displayText}</span>;
      })}
    </>
  );
});

export default React.memo(Latex);
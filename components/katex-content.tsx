"use client"

import { useMemo } from "react"
import { marked } from "marked"
import katex from "katex"

/**
 * Ultra-robust multi-pass Math & Markdown Renderer.
 * Handles all legacy & modern format variations:
 * - Block math $$...$$ and \[...\]
 * - Inline math $...$ and \(...\)
 * - Unwrapped LaTeX commands in plain text (\vec{AB}, \frac{a}{b}, \sqrt{}, \lambda, \angle, \triangle, \perp, \parallel, etc.)
 * - Corrupted Unicode vector arrows (AB⃗, AD⃗)
 * - GFM Markdown headers, tables, lists, bold text, and line breaks
 */
export function MathText({ text, className }: { text: string; className?: string }) {
  const html = useMemo(() => renderMarkdownWithMath(text ?? ""), [text])

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function preprocessText(input: string): string {
  if (!input) return ""

  let text = input

  // 1. Clean vector arrow combining characters: AB⃗, AD⃗, a⃗, b⃗
  text = text.replace(/([A-Za-z0-9]{1,3})[\u20d7⃗]/g, "\\vec{$1}")
  text = text.replace(/\\\|([^\\|]+)\\\|/g, "|\\vec{$1}|")
  text = text.replace(/\\\|/g, "|")
  text = text.replace(/(\\vec\{[^}]+\})\\/g, "$1")

  // 2. Normalize block & inline delimiters: \[...\] -> $$...$$ and \(...\) -> $...$
  text = text.replace(/\\\[([\s\S]+?)\\\]/g, "$$$$1$$")
  text = text.replace(/\\\(([\s\S]+?)\\\)/g, "$$1$")

  // 3. Normalize common symbols
  text = text.replace(/·/g, " \\cdot ")
  text = text.replace(/≠/g, " \\ne ")
  text = text.replace(/∥/g, " \\parallel ")
  text = text.replace(/⟂/g, " \\perp ")
  text = text.replace(/≥/g, " \\ge ")
  text = text.replace(/≤/g, " \\le ")

  // 4. Protect existing delimited math ($$...$$ and $...$)
  const mathPlaceholders: string[] = []
  let protectedText = text.replace(/\$\$[\s\S]+?\$\$|\$[^$\n]+\$/g, (match) => {
    const idx = mathPlaceholders.length
    mathPlaceholders.push(match)
    return `XKHIDEMATH${idx}XK`
  })

  // 5. Auto-wrap unwrapped LaTeX commands in text (like \vec{AB}, \frac{1}{2}, \angle A_1PA_2, \triangle ABC, \lambda)
  protectedText = protectedText.replace(
    /(\\vec\{[A-Za-z0-9]+\}|\\frac\{[^}]+\}\{[^}]+\}|\\angle\s+[A-Za-z0-9_]+|\\triangle\s+[A-Za-z0-9_]+|\\[a-zA-Z]+(?:\{[^}]*\})*)/g,
    "$$1$"
  )

  // Restore protected math
  protectedText = protectedText.replace(/XKHIDEMATH(\d+)XK/g, (_, idx) => mathPlaceholders[Number(idx)] || "")

  return protectedText
}

function renderMarkdownWithMath(input: string): string {
  if (!input) return ""

  const preprocessed = preprocessText(input)
  const mathTokens: string[] = []

  // 1. Tokenize block math $$...$$
  let processed = preprocessed.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
    try {
      const rendered = katex.renderToString(math.trim(), {
        displayMode: true,
        throwOnError: false,
        strict: false,
      })
      const idx = mathTokens.length
      mathTokens.push(`<div class="katex-display-block my-4 overflow-x-auto text-center">${rendered}</div>`)
      return `XKMATHBLOCK${idx}XK`
    } catch {
      return `$$${math}$$`
    }
  })

  // 2. Tokenize inline math $...$
  processed = processed.replace(/\$([^$\n]+?)\$/g, (_, math) => {
    try {
      const rendered = katex.renderToString(math.trim(), {
        displayMode: false,
        throwOnError: false,
        strict: false,
      })
      const idx = mathTokens.length
      mathTokens.push(`<span class="katex-inline-span px-0.5">${rendered}</span>`)
      return `XKMATHINLINE${idx}XK`
    } catch {
      return `$${math}$`
    }
  })

  // 3. Parse Markdown using marked
  let html = ""
  try {
    html = marked.parse(processed, { gfm: true, breaks: true }) as string
  } catch {
    html = processed
  }

  // 4. Hydrate rendered KaTeX HTML back into tokens
  html = html.replace(/XKMATHBLOCK(\d+)XK/g, (_, idx) => mathTokens[Number(idx)] || "")
  html = html.replace(/XKMATHINLINE(\d+)XK/g, (_, idx) => mathTokens[Number(idx)] || "")

  return html
}

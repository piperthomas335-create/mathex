"use client"

import { useMemo } from "react"
import katex from "katex"

/**
 * Renders text that may contain inline ($...$) and block ($$...$$) LaTeX
 * mixed with plain markdown-ish text. Safe: KaTeX throwOnError=false.
 */
export function MathText({ text, className }: { text: string; className?: string }) {
  const html = useMemo(() => renderMixed(text ?? ""), [text])
  return (
    <div
      className={className}
      // KaTeX output is trusted (we generate it locally); text is escaped below.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function renderLatex(src: string, displayMode: boolean) {
  try {
    return katex.renderToString(src, { displayMode, throwOnError: false, strict: false })
  } catch {
    return escapeHtml(src)
  }
}

/** minimal inline markdown: **bold**, line breaks, bullet lines */
function renderInlineMarkdown(s: string) {
  let out = escapeHtml(s)
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
  return out
}

function renderMixed(input: string): string {
  const lines = input.split("\n")
  const blocks: string[] = []
  let listBuffer: string[] = []

  const flushList = () => {
    if (listBuffer.length) {
      blocks.push(`<ul class="katex-list">${listBuffer.map((l) => `<li>${l}</li>`).join("")}</ul>`)
      listBuffer = []
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd()
    const listMatch = line.match(/^\s*[-*]\s+(.*)$/)
    const content = listMatch ? listMatch[1] : line

    // split by $$...$$ (block) and $...$ (inline)
    const rendered = content
      .split(/(\$\$[^$]+\$\$|\$[^$]+\$)/g)
      .map((seg) => {
        if (seg.startsWith("$$") && seg.endsWith("$$")) return renderLatex(seg.slice(2, -2), false)
        if (seg.startsWith("$") && seg.endsWith("$")) return renderLatex(seg.slice(1, -1), false)
        return renderInlineMarkdown(seg)
      })
      .join("")

    if (listMatch) {
      listBuffer.push(rendered)
    } else {
      flushList()
      if (line === "") blocks.push('<div class="katex-gap"></div>')
      else blocks.push(`<p class="katex-p">${rendered}</p>`)
    }
  }
  flushList()
  return blocks.join("")
}

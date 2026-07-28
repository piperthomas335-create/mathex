import { generateText, Output } from "ai"
import { NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({ title: z.string(), methodTree: z.array(z.string()), pitfalls: z.array(z.string()), template: z.string() })

export const dynamic = "force-static"

export async function POST(request: Request) {
  if (!process.env.AI_GATEWAY_API_KEY) return NextResponse.json({ available: false, error: "AI 当前不可用，手工复习不受影响" }, { status: 503 })
  try {
    const { nodeName, errors } = await request.json()
    const { output } = await generateText({ model: "google/gemini-3.6-flash", output: Output.object({ schema }), prompt: `你是高中数学教研员。把“${String(nodeName).slice(0, 100)}”下的错题合成为方法树、易错清单与可迁移解题模板。只使用给定材料，不编造。材料：${JSON.stringify(errors).slice(0, 20000)}` })
    return NextResponse.json({ available: true, synthesis: output })
  } catch (error) {
    console.error("[v0] Knowledge synthesis failed:", error)
    return NextResponse.json({ error: "生成失败，请稍后重试" }, { status: 500 })
  }
}

import { put } from "@vercel/blob"
import { generateText, Output } from "ai"
import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { notes } from "@/lib/db/schema"

export const runtime = "nodejs"

const draftSchema = z.object({
  title: z.string(),
  statement: z.string(),
  wrong: z.string(),
  correct: z.string(),
  reflection: z.string(),
  causeCode: z.enum(["A", "B", "C", "D", "E"]),
  suggestedNodes: z.array(z.object({ name: z.string(), confidence: z.number().min(0).max(1) })).max(4),
})

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const file = form.get("file")
    const authorName = String(form.get("authorName") || "匿名同学").slice(0, 40)
    const authorNote = String(form.get("authorNote") || "").slice(0, 1000)
    const rawText = String(form.get("rawText") || "").slice(0, 12000)
    if (!(file instanceof File) && !rawText) return NextResponse.json({ error: "请上传图片或填写笔记内容" }, { status: 400 })
    if (file instanceof File && (!file.type.startsWith("image/") || file.size > 8 * 1024 * 1024)) return NextResponse.json({ error: "仅支持 8MB 内的图片" }, { status: 400 })

    const noteId = crypto.randomUUID()
    let pathname: string | undefined
    let bytes: Uint8Array | undefined
    if (file instanceof File) {
      bytes = new Uint8Array(await file.arrayBuffer())
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        const blob = await put(`notes/${noteId}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`, bytes, { access: "private", contentType: file.type })
        pathname = blob.pathname
      }
    }

    let draft: z.infer<typeof draftSchema> | null = null
    let aiAvailable = false
    if (process.env.AI_GATEWAY_API_KEY) {
      aiAvailable = true
      const content: Array<{ type: "text"; text: string } | { type: "file"; data: Uint8Array; mediaType: string }> = [
        { type: "text", text: `你是高中数学错题整理助手。将讲义或文字整理成题目/错解/正解/反思四段式。错因：A概念边界、B条件遗漏、C运算路径、D论证不严、E模型迁移。不要编造看不清的公式。补充文字：${rawText || "无"}` },
      ]
      if (bytes && file instanceof File) content.push({ type: "file", data: bytes, mediaType: file.type })
      const result = await generateText({
        model: "google/gemini-3.6-flash",
        output: Output.object({ schema: draftSchema }),
        messages: [{ role: "user", content }],
      })
      draft = result.output
    }

    if (process.env.DATABASE_URL) {
      await db.insert(notes).values({ id: noteId, authorName, authorNote, kind: file instanceof File ? "image" : "text", rawText, imageUrls: pathname ? [pathname] : [], aiDraft: draft, status: "pending" })
    }
    return NextResponse.json({ noteId, draft, aiAvailable, stored: Boolean(process.env.DATABASE_URL), message: aiAvailable ? "AI 草稿已生成，等待审核" : "已进入待审核队列；AI 当前不可用，可手工整理" })
  } catch (error) {
    console.error("[v0] Note extraction failed:", error)
    return NextResponse.json({ error: "处理失败，请稍后重试或改用手工录入" }, { status: 500 })
  }
}

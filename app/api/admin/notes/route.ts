import { and, desc, eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { z } from "zod"
import { isAdmin } from "@/lib/admin-auth"
import { db } from "@/lib/db"
import { errorNodes, errors, notes, reviews } from "@/lib/db/schema"

const decisionSchema = z.object({
  noteId: z.string().uuid(),
  action: z.enum(["approve", "reject"]),
  reviewerNote: z.string().max(1000).optional(),
  nodeId: z.string().min(2).max(80).optional(),
})

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "未授权" }, { status: 401 })
  const queue = await db.select().from(notes).where(eq(notes.status, "pending")).orderBy(desc(notes.createdAt))
  return NextResponse.json({ notes: queue })
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "未授权" }, { status: 401 })
  const parsed = decisionSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: "审核参数无效" }, { status: 400 })
  const { noteId, action, reviewerNote, nodeId } = parsed.data
  const [note] = await db.select().from(notes).where(and(eq(notes.id, noteId), eq(notes.status, "pending"))).limit(1)
  if (!note) return NextResponse.json({ error: "提交不存在或已处理" }, { status: 404 })

  if (action === "reject") {
    await db.update(notes).set({ status: "rejected", reviewerNote, reviewedAt: new Date() }).where(eq(notes.id, noteId))
    return NextResponse.json({ ok: true })
  }

  const draft = (note.aiDraft ?? {}) as Record<string, unknown>
  const errorId = `U-${noteId.slice(0, 8)}`
  const title = String(draft.title || note.authorNote || "访客笔记整理")
  await db.transaction(async (tx) => {
    await tx.insert(errors).values({
      id: errorId,
      title,
      causeCode: String(draft.causeCode || "E"),
      difficulty: 3,
      source: `访客提交 · ${note.authorName}`,
      statementMd: String(draft.statement || note.rawText || "待补充题目"),
      wrongMd: String(draft.wrong || "待补充错解"),
      correctMd: String(draft.correct || "待补充正解"),
      reflectionMd: String(draft.reflection || note.authorNote || "待补充反思"),
      tags: ["访客投稿", "AI 草稿"],
      images: note.imageUrls,
      origin: "visitor",
      noteId,
    })
    if (nodeId) await tx.insert(errorNodes).values({ errorId, nodeId, isPrimary: true, weight: 1 })
    await tx.insert(reviews).values({ errorId, stage: 1, dueDate: new Date().toISOString().slice(0, 10) })
    await tx.update(notes).set({ status: "approved", reviewerNote, reviewedAt: new Date() }).where(eq(notes.id, noteId))
  })
  return NextResponse.json({ ok: true, errorId })
}

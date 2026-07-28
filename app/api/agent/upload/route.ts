import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { errorNodes, errors, notes } from "@/lib/db/schema"
import { sampleErrors } from "@/lib/sample-data"

export const dynamic = "force-static"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      authorName = "External Agent",
      title,
      causeCode = "A",
      difficulty = 3,
      nodeId = "K03-01-01",
      statementMd,
      wrongMd = "",
      correctMd = "",
      reflectionMd = "",
      studentId,
    } = body

    if (!title || !statementMd) {
      return NextResponse.json(
        { error: "必填字段缺失：title 与 statementMd 不能为空" },
        { status: 400 }
      )
    }

    const noteId = `note_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    const errorId = `E-${Date.now().toString().slice(-4)}`

    // Add to in-memory fallback list so client immediately sees it if DB is not configured
    sampleErrors.unshift({
      id: errorId,
      title,
      cause: (["A", "B", "C", "D", "E"].includes(causeCode) ? causeCode : "A") as any,
      difficulty: Number(difficulty) || 3,
      node: nodeId,
      nodeId,
      source: `Agent 上传 (${authorName})`,
      statement: statementMd,
      wrong: wrongMd,
      correct: correctMd,
      reflection: reflectionMd,
      due: "今天",
    })

    // If database is available, persist to DB
    let dbSaved = false
    if (process.env.DATABASE_URL) {
      await db.insert(notes).values({
        id: noteId,
        authorName: String(authorName).slice(0, 40),
        authorNote: `Agent 自动拆解错题: ${title}`,
        kind: "text",
        rawText: statementMd,
        aiDraft: {
          title,
          statement: statementMd,
          wrong: wrongMd,
          correct: correctMd,
          reflection: reflectionMd,
          causeCode,
          suggestedNodes: [{ name: nodeId, confidence: 0.95 }],
        },
        status: "approved",
      })

      await db.insert(errors).values({
        id: errorId,
        title,
        causeCode,
        difficulty: Number(difficulty) || 3,
        source: `Agent 导入 (${authorName})`,
        statementMd,
        wrongMd,
        correctMd,
        reflectionMd,
        tags: [nodeId],
        status: "active",
        origin: "agent",
        noteId,
      })

      if (nodeId) {
        await db.insert(errorNodes).values({
          errorId,
          nodeId,
          isPrimary: true,
          weight: 1,
        })
      }
      dbSaved = true
    }

    return NextResponse.json(
      {
        success: true,
        errorId,
        noteId,
        nodeId,
        dbSaved,
        message: "错题已成功通过 Agent 协议上传并写入系统！",
      },
      { status: 201 }
    )
  } catch (err) {
    console.error("[Agent Upload Error]:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Agent 上传解析失败" },
      { status: 500 }
    )
  }
}

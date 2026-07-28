import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const LOG_FILE = path.join(process.cwd(), "lib", "db", "review-logs.json")

export async function GET(request: Request) {
  try {
    if (!fs.existsSync(LOG_FILE)) {
      return NextResponse.json({ logs: [] })
    }
    const content = fs.readFileSync(LOG_FILE, "utf-8")
    const logs = JSON.parse(content || "[]")
    return NextResponse.json({ logs })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { studentId, errorId, rating, score } = body

    if (!studentId || !errorId || !rating) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const dir = path.dirname(LOG_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    let logs: any[] = []
    if (fs.existsSync(LOG_FILE)) {
      const content = fs.readFileSync(LOG_FILE, "utf-8")
      logs = JSON.parse(content || "[]")
    }

    const newLog = {
      id: `rev_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      studentId,
      errorId,
      rating, // 'pass' (掌握) | 'fuzzy' (模糊) | 'fail' (未通过)
      score: score ?? (rating === "pass" ? 100 : rating === "fuzzy" ? 50 : 25),
      createdAt: new Date().toISOString(),
    }

    logs.push(newLog)
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2), "utf-8")

    // Count total reviews for this error & student
    const studentErrorReviews = logs.filter((l) => l.studentId === studentId && l.errorId === errorId)
    const reviewCount = studentErrorReviews.length

    return NextResponse.json({
      success: true,
      log: newLog,
      reviewCount,
      totalLogs: logs.length,
      message: `复习记录已成功保存到文件数据库 lib/db/review-logs.json，已累计复习 ${reviewCount} 次！`,
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

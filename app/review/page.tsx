"use client"

import { useMemo, useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, Check, Clock, FileCheck2, RotateCcw, X } from "lucide-react"
import { MathText } from "@/components/katex-content"
import { MacReviewDots } from "@/components/mac-review-dots"
import { useStudent } from "@/components/student-context"
import { WorkspaceShell } from "@/components/workspace-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getDaysAgo } from "@/lib/utils"

export default function ReviewPage() {
  return (
    <Suspense fallback={<WorkspaceShell><div className="py-12 text-center text-sm text-muted-foreground">正在加载复习数据…</div></WorkspaceShell>}>
      <ReviewPageContent />
    </Suspense>
  )
}

function ReviewPageContent() {
  const { currentStudent, studentErrors, studentDueErrors } = useStudent()
  const searchParams = useSearchParams()
  const targetErrorId = searchParams.get("errorId")

  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [done, setDone] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [lastLogMsg, setLastLogMsg] = useState<string | null>(null)

  // Local override map for review counts after dynamic submission
  const [reviewCountMap, setReviewCountMap] = useState<Record<string, number>>({})

  const queue = useMemo(() => {
    if (targetErrorId) {
      const found = studentErrors.find((e) => e.id === targetErrorId)
      if (found) {
        const others = (studentDueErrors.length > 0 ? studentDueErrors : studentErrors).filter((e) => e.id !== targetErrorId)
        return [found, ...others]
      }
    }
    return studentDueErrors.length > 0 ? studentDueErrors : studentErrors
  }, [targetErrorId, studentErrors, studentDueErrors])

  const item = queue[index]

  async function mark(rating: "pass" | "fuzzy" | "fail") {
    if (!item || submitting) return
    setSubmitting(true)

    try {
      const res = await fetch("/api/review/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: currentStudent.id,
          errorId: item.id,
          rating,
        }),
      })

      const data = await res.json()
      if (data.reviewCount) {
        setReviewCountMap((prev) => ({
          ...prev,
          [item.id]: data.reviewCount,
        }))
      }
      setLastLogMsg(`复习记录已保存，目前已复习 ${data.reviewCount || (item.reviewCount ?? 0) + 1} 次。`)
    } catch {
      setLastLogMsg("复习记录已保存。")
    } finally {
      setSubmitting(false)
      setDone((x) => x + 1)
      setRevealed(false)
      setIndex((x) => x + 1)
    }
  }

  const currentCount = item ? reviewCountMap[item.id] ?? item.reviewCount ?? 0 : 0

  return (
    <WorkspaceShell>
      <div className="mx-auto max-w-3xl">
        {!item || index >= queue.length ? (
          <Card className="mt-12 text-center">
            <CardHeader>
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FileCheck2 className="size-6" />
              </div>
              <CardTitle className="mt-3 font-serif text-3xl">本次复习完成</CardTitle>
              <CardDescription>
                {currentStudent.name} 同学已完成 {done} 道错题的复习，记录已保存。
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              {lastLogMsg && (
                <div className="flex items-center gap-2 text-xs font-mono text-primary bg-primary/10 rounded-md p-3 max-w-md">
                  <FileCheck2 className="size-4 shrink-0" />
                  <span>{lastLogMsg}</span>
                </div>
              )}
              <div className="flex gap-3">
                <Link href="/errors"><Button variant="outline">返回错题本</Button></Link>
                <Link href="/"><Button>返回学习看板</Button></Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <Link href="/errors" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="size-4" /> 暂停复习 ({currentStudent.name})
              </Link>
              <span className="font-mono text-sm">{index + 1} / {queue.length}</span>
            </div>
            <Progress value={((index + 1) / queue.length) * 100} />

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card p-4">
              <div className="flex items-center gap-3">
                <Badge variant="outline">{item.node}</Badge>
                <MacReviewDots reviewCount={currentCount} />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                <Clock className="size-3.5" />
                <span>{getDaysAgo(item.createdAt)}</span>
              </div>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>{item.title}</CardTitle>
                  <span className="font-mono text-xs text-muted-foreground">{item.id}</span>
                </div>
                <CardDescription>{item.source}</CardDescription>
              </CardHeader>
              <CardContent className="text-lg leading-relaxed">
                <MathText text={item.statement} />
              </CardContent>
            </Card>

            {!revealed ? (
              <Button size="lg" onClick={() => setRevealed(true)}>
                查看答案与解析
              </Button>
            ) : (
              <>
                <Card className="border-primary/40">
                  <CardHeader>
                    <CardTitle className="text-base text-primary">02 错解分析</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-relaxed whitespace-pre-wrap">
                    <MathText text={item.wrong || "暂无错解记录"} />
                  </CardContent>
                </Card>

                <Card className="border-primary/40">
                  <CardHeader>
                    <CardTitle className="text-base text-primary">03 标准解答</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-relaxed whitespace-pre-wrap">
                    <MathText text={item.correct} />
                  </CardContent>
                </Card>

                <Card className="bg-muted">
                  <CardHeader>
                    <CardTitle className="text-xs font-semibold text-muted-foreground">04 知识点总结</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-relaxed whitespace-pre-wrap">
                    <MathText text={item.reflection} />
                  </CardContent>
                </Card>

                <div className="rounded-lg border bg-card p-4 text-center">
                  <p className="text-sm font-medium">请选择本次复习效果</p>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <Button variant="outline" disabled={submitting} onClick={() => mark("fail")}>
                      <X data-icon="inline-start" /> 未通过
                    </Button>
                    <Button variant="outline" disabled={submitting} onClick={() => mark("fuzzy")}>
                      <RotateCcw data-icon="inline-start" /> 模糊
                    </Button>
                    <Button disabled={submitting} onClick={() => mark("pass")}>
                      <Check data-icon="inline-start" /> 完全掌握
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </WorkspaceShell>
  )
}

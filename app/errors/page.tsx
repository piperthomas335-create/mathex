"use client"

import { useState } from "react"
import Link from "next/link"
import { CalendarCheck, ChevronRight, Clock, Filter, RotateCcw, Search } from "lucide-react"
import { MacReviewDots } from "@/components/mac-review-dots"
import { useStudent } from "@/components/student-context"
import { WorkspaceShell } from "@/components/workspace-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { causeNames } from "@/lib/sample-data"
import { getDaysAgo } from "@/lib/utils"

export default function ErrorsPage() {
  const { currentStudent, studentErrors } = useStudent()
  const [search, setSearch] = useState("")

  const filteredErrors = studentErrors.filter((e) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      e.title.toLowerCase().includes(q) ||
      e.id.toLowerCase().includes(q) ||
      e.node.toLowerCase().includes(q) ||
      e.statement.toLowerCase().includes(q)
    )
  })

  return (
    <WorkspaceShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-primary">
              {currentStudent.name} 同学 · 共 {studentErrors.length} 道错题
            </p>
            <h1 className="mt-2 font-serif text-3xl font-semibold">错题本</h1>
            <p className="mt-2 text-muted-foreground">收录的全部错题列表及详细解析。</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/review">
              <Button><CalendarCheck data-icon="inline-start" /> 开始复习错题</Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`在 ${currentStudent.name} 的错题中搜索题目或知识点…`}
              />
            </div>
            <CardDescription>按录入时间排序</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {filteredErrors.map((e) => (
              <div
                key={e.id}
                className="group flex flex-col gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 md:flex-row md:items-center md:justify-between"
              >
                <Link href={`/errors/${e.id}`} className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                    <span className="font-bold text-foreground">{e.id}</span>
                    <span>· 难度 {"●".repeat(e.difficulty)}{"○".repeat(5 - e.difficulty)}</span>
                    <span className="inline-flex items-center gap-1 bg-muted px-2 py-0.5 rounded">
                      <Clock className="size-3" />
                      {getDaysAgo(e.createdAt)}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-base group-hover:text-primary transition-colors">{e.title}</h2>
                    <Badge variant="outline">{e.node}</Badge>
                    <Badge variant="secondary">{e.cause} · {(causeNames as Record<string, string>)[e.cause] || e.cause}</Badge>
                  </div>

                  <p className="mt-2 line-clamp-1 text-sm text-muted-foreground">{e.reflection || e.wrong}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{e.source}</p>
                </Link>

                <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 border-t pt-3 md:border-t-0 md:pt-0">
                  <MacReviewDots reviewCount={e.reviewCount ?? 0} />
                  <div className="flex items-center gap-2">
                    <Link href={`/review?errorId=${e.id}`}>
                      <Button size="sm" variant="outline">
                        <RotateCcw className="size-3.5" /> 复习此题
                      </Button>
                    </Link>
                    <Link href={`/errors/${e.id}`}>
                      <Button size="sm" variant="ghost">
                        详情 <ChevronRight className="size-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </WorkspaceShell>
  )
}

"use client"

import Image from "next/image"
import { BookOpen, CheckCircle2, CircleAlert, GraduationCap, Route } from "lucide-react"
import { MathText } from "@/components/katex-content"
import { useStudent } from "@/components/student-context"
import { WorkspaceShell } from "@/components/workspace-shell"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LessonsPage() {
  const { currentStudent, studentLessons } = useStudent()

  return (
    <WorkspaceShell>
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm font-medium text-primary">
            {currentStudent.name} 同学 · 共 {studentLessons.length} 篇课堂小结
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold">课堂整理与复盘</h1>
          <p className="mt-2 text-muted-foreground">把每一节课压缩成进展、薄弱点和下一步行动计划。</p>
        </div>

        {studentLessons.map((lesson) => (
          <Card key={lesson.id}>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{lesson.date}</Badge>
                <Badge variant="outline"><GraduationCap className="size-3" /> {currentStudent.name}</Badge>
              </div>
              <CardTitle className="mt-3 font-serif text-2xl">{lesson.title}</CardTitle>
              <CardDescription>系统复盘与课堂记录</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border bg-card p-6 text-sm leading-relaxed whitespace-pre-wrap">
                <MathText text={lesson.content} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </WorkspaceShell>
  )
}

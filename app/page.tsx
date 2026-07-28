"use client"

import Link from "next/link"
import { ArrowRight, CalendarCheck, ChevronRight, CircleAlert, GitBranch, NotebookPen, Sparkles, Upload } from "lucide-react"
import { useStudent } from "@/components/student-context"
import { WorkspaceShell } from "@/components/workspace-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { causeNames } from "@/lib/sample-data"

export default function DashboardPage() {
  const { currentStudent, studentErrors, studentDueErrors, studentModuleStats } = useStudent()

  return (
    <WorkspaceShell>
      <div className="flex flex-col gap-8">
        <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <Badge variant="outline">{currentStudent.name} 专属错题本</Badge>
            </div>
            <h1 className="mt-2 text-balance font-serif text-3xl font-semibold tracking-tight md:text-4xl">
              高中数学错题管理与复习
            </h1>
            <p className="mt-3 max-w-2xl text-pretty text-muted-foreground">
              {currentStudent.name} 同学的数据看板。按阶段安排复习与考点查漏补缺。
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/upload"><Button variant="outline"><Upload data-icon="inline-start" /> 上传讲义</Button></Link>
            <Link href="/review"><Button><CalendarCheck data-icon="inline-start" /> 开始复习</Button></Link>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="知识节点" value="469" note="11 个模块 · 5 层结构" icon={GitBranch} />
          <Stat label="已收录错题" value={`${studentErrors.length}`} note={`属于 ${currentStudent.name} 同学`} icon={NotebookPen} />
          <Stat label="今日待复习" value={`${studentDueErrors.length}`} note="按 1/3/7/14/30 阶梯排程" icon={CalendarCheck} accent />
          <Stat label="整体掌握度" value="76%" note="本周上升 5%" icon={Sparkles} />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <Card>
            <CardHeader className="flex-row items-start justify-between">
              <div>
                <CardTitle>知识版图</CardTitle>
                <CardDescription>按 11 大模块观察掌握度，函数与解几是当前重点</CardDescription>
              </div>
              <Link href="/tree"><Button variant="ghost" size="sm">打开知识树 <ArrowRight data-icon="inline-end" /></Button></Link>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {studentModuleStats.slice(0, 7).map((m) => (
                  <div key={m.id} className="grid grid-cols-[minmax(120px,1fr)_2fr_42px] items-center gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.errorCount || m.count} 考点项</p>
                    </div>
                    <Progress value={m.mastery} />
                    <span className="text-right font-mono text-sm">{m.mastery}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>今日待复习 ({studentDueErrors.length})</CardTitle>
              <CardDescription>根据 1 / 3 / 7 / 14 / 30 天阶梯自动排程</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {studentDueErrors.length > 0 ? (
                studentDueErrors.slice(0, 4).map((e, i) => (
                  <Link key={e.id} href={`/errors/${e.id}`} className="group flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 font-mono text-sm text-primary">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{e.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{e.node} · {causeNames[e.cause] || e.cause}</p>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  🎉 {currentStudent.name} 同学今天暂无到期待复习错题
                </div>
              )}
              <Link href="/review"><Button className="mt-2 w-full">开始复习队列</Button></Link>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>最近收录错题</CardTitle>
              <CardDescription>{currentStudent.name} 的错题成长档案</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {studentErrors.slice(0, 4).map((e) => (
                <Link href={`/errors/${e.id}`} key={e.id} className="rounded-lg border p-4 transition-colors hover:bg-muted">
                  <div className="flex items-center justify-between gap-3">
                    <Badge variant="outline">{e.node}</Badge>
                    <span className="font-mono text-xs text-muted-foreground">{e.id}</span>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold leading-snug line-clamp-1">{e.title}</h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{e.reflection}</p>
                </Link>
              ))}
            </CardContent>
          </Card>
          <Card className="border-accent/50">
            <CardHeader>
              <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground"><CircleAlert /></div>
              <CardTitle className="mt-3">当前薄弱点</CardTitle>
              <CardDescription>向量关系/双割线定点 · 掌握度 45%</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                你在“从向量条件判定几何图形（如等腰梯形）”与“解三角形爪型补角模型”上出现过方法选择失误。建议按三步流程化简。
              </p>
              <Link href="/tree" className="mt-4 block"><Button variant="outline" className="w-full">查看节点详情</Button></Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </WorkspaceShell>
  )
}

function Stat({ label, value, note, icon: Icon, accent = false }: { label: string; value: string; note: string; icon: React.ElementType; accent?: boolean }) {
  return (
    <Card className={accent ? "border-accent/60" : undefined}>
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 font-serif text-3xl font-semibold">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{note}</p>
        </div>
        <span className={accent ? "flex size-9 items-center justify-center rounded-md bg-accent text-accent-foreground" : "flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary"}>
          <Icon className="size-4" />
        </span>
      </CardContent>
    </Card>
  )
}

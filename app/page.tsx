import Link from "next/link"
import { ArrowRight, CalendarCheck, ChevronRight, CircleAlert, GitBranch, NotebookPen, Sparkles, Upload } from "lucide-react"
import { WorkspaceShell } from "@/components/workspace-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { causeNames, moduleStats, sampleErrors } from "@/lib/sample-data"

export default function DashboardPage() {
  const due = sampleErrors.filter((e) => e.due === "今天")
  return <WorkspaceShell>
    <div className="flex flex-col gap-8">
      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div><p className="text-sm font-medium text-primary">2026 年 7 月 27 日 · 学习快照</p><h1 className="mt-2 text-balance font-serif text-3xl font-semibold tracking-tight md:text-4xl">把每一次错误，变成下一次的直觉。</h1><p className="mt-3 max-w-2xl text-pretty text-muted-foreground">从课堂讲义到结构化错题，再回到知识树与阶梯复习。今天先处理 3 个薄弱环节。</p></div>
        <div className="flex gap-2"><Link href="/upload"><Button variant="outline"><Upload data-icon="inline-start" /> 上传讲义</Button></Link><Link href="/review"><Button><CalendarCheck data-icon="inline-start" /> 开始复习</Button></Link></div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="知识节点" value="469" note="9 个模块 · 5 层结构" icon={GitBranch} />
        <Stat label="已收录错题" value="8" note="源自 12 页课堂讲义" icon={NotebookPen} />
        <Stat label="今日待复习" value="3" note="预计 12 分钟" icon={CalendarCheck} accent />
        <Stat label="整体掌握度" value="72%" note="本周上升 4%" icon={Sparkles} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader className="flex-row items-start justify-between"><div><CardTitle>知识版图</CardTitle><CardDescription>按模块观察掌握度，函数与导数是当前主线</CardDescription></div><Link href="/tree"><Button variant="ghost" size="sm">打开知识树 <ArrowRight data-icon="inline-end" /></Button></Link></CardHeader>
          <CardContent><div className="flex flex-col gap-4">{moduleStats.map((m) => <div key={m.id} className="grid grid-cols-[minmax(120px,1fr)_2fr_42px] items-center gap-3"><div className="min-w-0"><p className="truncate text-sm font-medium">{m.name}</p><p className="text-xs text-muted-foreground">{m.count} 节点</p></div><Progress value={m.mastery} /><span className="text-right font-mono text-sm">{m.mastery}%</span></div>)}</div></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>今日复习</CardTitle><CardDescription>根据 1 / 3 / 7 / 14 / 30 天阶梯自动排程</CardDescription></CardHeader>
          <CardContent className="flex flex-col gap-3">{due.map((e, i) => <Link key={e.id} href={`/errors/${e.id}`} className="group flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted"><span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 font-mono text-sm text-primary">{i + 1}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{e.title}</p><p className="mt-1 text-xs text-muted-foreground">{e.node} · {causeNames[e.cause]}</p></div><ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" /></Link>)}<Link href="/review"><Button className="mt-2 w-full">开始 3 题复习</Button></Link></CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2"><CardHeader><CardTitle>最近错题</CardTitle><CardDescription>错误不是句号，而是知识结构暴露出的接口</CardDescription></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2">{sampleErrors.slice(0, 4).map((e) => <Link href={`/errors/${e.id}`} key={e.id} className="rounded-lg border p-4 transition-colors hover:bg-muted"><div className="flex items-center justify-between gap-3"><Badge variant="outline">{e.node}</Badge><span className="font-mono text-xs text-muted-foreground">{e.id}</span></div><h3 className="mt-3 text-sm font-semibold leading-snug">{e.title}</h3><p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{e.reflection}</p></Link>)}</CardContent></Card>
        <Card className="border-accent/50"><CardHeader><div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground"><CircleAlert /></div><CardTitle className="mt-3">当前薄弱点</CardTitle><CardDescription>周期性与对称性 · 掌握度 42%</CardDescription></CardHeader><CardContent><p className="text-sm leading-relaxed text-muted-foreground">你在“两条对称轴推出周期”这一模型上出现过迁移错误。建议先画图，再把两次轴对称理解为一次平移。</p><Link href="/tree" className="mt-4 block"><Button variant="outline" className="w-full">查看节点详情</Button></Link></CardContent></Card>
      </section>
    </div>
  </WorkspaceShell>
}

function Stat({ label, value, note, icon: Icon, accent = false }: { label: string; value: string; note: string; icon: React.ElementType; accent?: boolean }) {
  return <Card className={accent ? "border-accent/60" : undefined}><CardContent className="flex items-start justify-between p-5"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 font-serif text-3xl font-semibold">{value}</p><p className="mt-1 text-xs text-muted-foreground">{note}</p></div><span className={accent ? "flex size-9 items-center justify-center rounded-md bg-accent text-accent-foreground" : "flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary"}><Icon className="size-4" /></span></CardContent></Card>
}

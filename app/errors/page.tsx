import Link from "next/link"
import { ChevronRight, Filter, Search } from "lucide-react"
import { WorkspaceShell } from "@/components/workspace-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { causeNames, sampleErrors } from "@/lib/sample-data"

export default function ErrorsPage() {
  return <WorkspaceShell><div className="flex flex-col gap-6"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-sm font-medium text-primary">8 道已结构化</p><h1 className="mt-2 font-serif text-3xl font-semibold">错题本</h1><p className="mt-2 text-muted-foreground">题目、错解、正解与反思，缺一不可。</p></div><Button><Filter data-icon="inline-start" /> 筛选错因</Button></div>
  <Card><CardHeader><div className="relative max-w-xl"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" placeholder="搜索题目、知识点或反思…" /></div><CardDescription>按最近录入排序 · 点击查看四段式详情</CardDescription></CardHeader><CardContent className="flex flex-col gap-2">{sampleErrors.map((e) => <Link key={e.id} href={`/errors/${e.id}`} className="group grid gap-3 rounded-lg border p-4 transition-colors hover:bg-muted md:grid-cols-[90px_1fr_auto] md:items-center"><div className="font-mono text-xs text-muted-foreground">{e.id}<div className="mt-1">难度 {"●".repeat(e.difficulty)}{"○".repeat(5-e.difficulty)}</div></div><div><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold">{e.title}</h2><Badge variant="outline">{e.node}</Badge></div><p className="mt-2 line-clamp-1 text-sm text-muted-foreground">{e.reflection}</p><p className="mt-1 text-xs text-muted-foreground">{e.source}</p></div><div className="flex items-center gap-3"><Badge variant="secondary">{e.cause} · {causeNames[e.cause]}</Badge><ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" /></div></Link>)}</CardContent></Card></div></WorkspaceShell>
}

"use client"

import { useMemo, useState } from "react"
import { ChevronDown, ChevronRight, GitBranch, Search } from "lucide-react"
import { WorkspaceShell } from "@/components/workspace-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { functionNodes, moduleStats, sampleErrors } from "@/lib/sample-data"
import { cn } from "@/lib/utils"

export default function TreePage() {
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState(functionNodes[5])
  const [expanded, setExpanded] = useState(true)
  const nodes = useMemo(() => functionNodes.filter((n) => n.name.includes(query)), [query])
  const linked = sampleErrors.filter((e) => e.nodeId === selected.id || e.node === selected.name)
  return <WorkspaceShell><div className="flex flex-col gap-6">
    <div><p className="text-sm font-medium text-primary">469 个节点 · 最深 5 层</p><h1 className="mt-2 font-serif text-3xl font-semibold">知识树</h1><p className="mt-2 text-muted-foreground">不是目录，而是一张会被错误与复习结果持续改写的认知地图。</p></div>
    <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_340px]">
      <Card><CardHeader><CardTitle className="text-base">九大模块</CardTitle><CardDescription>按当前掌握度排序</CardDescription></CardHeader><CardContent className="flex flex-col gap-2">{moduleStats.map((m) => <button key={m.id} onClick={() => m.id === "K03" && setExpanded(true)} className={cn("rounded-lg p-3 text-left transition-colors hover:bg-muted", m.id === "K03" && "bg-primary text-primary-foreground")}><div className="flex justify-between gap-2 text-sm"><span className="truncate">{m.name}</span><span className="font-mono">{m.mastery}%</span></div><div className="mt-2 h-1 overflow-hidden rounded bg-current/15"><div className="h-full bg-current" style={{ width: `${m.mastery}%` }} /></div></button>)}</CardContent></Card>
      <Card><CardHeader><div className="flex items-center justify-between gap-4"><div><CardTitle>函数与导数</CardTitle><CardDescription>100 个节点 · 当前掌握度 62%</CardDescription></div><Badge variant="outline"><GitBranch /> K03</Badge></div><div className="relative mt-3"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="在本章中搜索…" className="pl-9" /></div></CardHeader><CardContent className="flex flex-col gap-1">
        <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-2 rounded-md px-3 py-3 text-left font-semibold hover:bg-muted">{expanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />} K03 函数与导数 <span className="ml-auto font-mono text-xs text-muted-foreground">62%</span></button>
        {expanded && nodes.map((node) => <button key={node.id} onClick={() => setSelected(node)} className={cn("flex items-center gap-3 rounded-md py-2.5 pr-3 text-left text-sm transition-colors hover:bg-muted", node.level === 1 ? "pl-8 font-medium" : "pl-14", selected.id === node.id && "bg-primary/10 text-primary")}><span className={cn("size-2 rounded-full", node.mastery < 55 ? "bg-destructive" : node.mastery < 70 ? "bg-accent" : "bg-primary")} /><span className="min-w-0 flex-1 truncate">{node.name}</span>{node.errors > 0 && <Badge variant="secondary">{node.errors} 题</Badge>}<span className="w-9 text-right font-mono text-xs">{node.mastery}%</span></button>)}
      </CardContent></Card>
      <Card className="h-fit xl:sticky xl:top-6"><CardHeader><Badge variant="outline" className="w-fit">{selected.id}</Badge><CardTitle className="font-serif text-xl">{selected.name}</CardTitle><CardDescription>{selected.level === 1 ? "知识专题" : "核心知识点"}</CardDescription></CardHeader><CardContent className="flex flex-col gap-5"><div><div className="mb-2 flex justify-between text-sm"><span>掌握度</span><span className="font-mono font-semibold">{selected.mastery}%</span></div><Progress value={selected.mastery} /></div><div className="grid grid-cols-2 gap-3"><Metric label="关联错题" value={`${linked.length || selected.errors} 道`} /><Metric label="复习阶段" value={selected.mastery < 60 ? "第 2 阶" : "第 3 阶"} /></div><div><p className="mb-2 text-sm font-medium">关联错题</p>{linked.length ? linked.map((e) => <a key={e.id} href={`/errors/${e.id}`} className="block rounded-md border p-3 text-sm hover:bg-muted">{e.title}</a>) : <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">这个节点目前没有错题，状态良好。</p>}</div><Button variant="outline" className="w-full">生成节点知识合成</Button></CardContent></Card>
    </div>
  </div></WorkspaceShell>
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-lg bg-muted p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-semibold">{value}</p></div> }

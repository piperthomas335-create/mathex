"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, RotateCcw, X } from "lucide-react"
import { MathText } from "@/components/katex-content"
import { WorkspaceShell } from "@/components/workspace-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { sampleErrors } from "@/lib/sample-data"

const queue = sampleErrors.filter((e) => e.due === "今天")
export default function ReviewPage() {
  const [index, setIndex] = useState(0), [revealed, setRevealed] = useState(false), [done, setDone] = useState(0)
  const item = queue[index]
  function mark() { setDone((x) => x + 1); setRevealed(false); setIndex((x) => x + 1) }
  return <WorkspaceShell><div className="mx-auto max-w-3xl">{index >= queue.length ? <Card className="mt-12 text-center"><CardHeader><CardTitle className="font-serif text-3xl">今日复习完成</CardTitle><CardDescription>3 道错题已回写掌握度，明天的队列会自动调整。</CardDescription></CardHeader><CardContent><Link href="/"><Button>返回学习看板</Button></Link></CardContent></Card> : <div className="flex flex-col gap-6"><div className="flex items-center justify-between"><Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="size-4" /> 暂停复习</Link><span className="font-mono text-sm">{index + 1} / {queue.length}</span></div><Progress value={(done / queue.length) * 100} /><div className="text-center"><Badge variant="outline">{item.node}</Badge><h1 className="mt-4 font-serif text-2xl font-semibold">先独立完成，再展开答案</h1></div><Card><CardHeader><CardTitle>{item.title}</CardTitle><CardDescription>{item.source}</CardDescription></CardHeader><CardContent className="text-lg"><MathText text={item.statement} /></CardContent></Card>{!revealed ? <Button size="lg" onClick={() => setRevealed(true)}>展开正确路径</Button> : <><Card className="border-primary/40"><CardHeader><CardTitle>正确路径</CardTitle></CardHeader><CardContent><MathText text={item.correct} /><div className="mt-5 rounded-lg bg-muted p-4 text-sm"><strong>上次反思：</strong> {item.reflection}</div></CardContent></Card><p className="text-center text-sm text-muted-foreground">这一次你掌握得怎么样？</p><div className="grid grid-cols-3 gap-3"><Button variant="outline" onClick={mark}><X data-icon="inline-start" /> 不会</Button><Button variant="outline" onClick={mark}><RotateCcw data-icon="inline-start" /> 模糊</Button><Button onClick={mark}><Check data-icon="inline-start" /> 掌握</Button></div></>}</div>}</div></WorkspaceShell>
}

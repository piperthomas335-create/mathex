import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, BookOpen, CalendarCheck, Lightbulb, Route, TriangleAlert } from "lucide-react"
import { notFound } from "next/navigation"
import { MathText } from "@/components/katex-content"
import { WorkspaceShell } from "@/components/workspace-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { causeNames, sampleErrors } from "@/lib/sample-data"

export default async function ErrorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = sampleErrors.find((e) => e.id === id)
  if (!item) notFound()
  return <WorkspaceShell><div className="mx-auto flex max-w-5xl flex-col gap-6"><Link href="/errors" className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> 返回错题本</Link><div className="flex flex-col justify-between gap-4 md:flex-row md:items-start"><div><div className="flex flex-wrap gap-2"><Badge>{item.node}</Badge><Badge variant="secondary">{item.cause} · {causeNames[item.cause]}</Badge><Badge variant="outline">难度 {item.difficulty}/5</Badge></div><h1 className="mt-4 text-balance font-serif text-3xl font-semibold">{item.title}</h1><p className="mt-2 text-sm text-muted-foreground">{item.source} · {item.id}</p></div><Link href="/review"><Button><CalendarCheck data-icon="inline-start" /> 加入今日复习</Button></Link></div><Separator />
  <div className="grid gap-6 lg:grid-cols-[1fr_280px]"><div className="flex flex-col gap-4"><Section icon={BookOpen} index="01" title="题目"><MathText text={item.statement} /></Section><Section icon={TriangleAlert} index="02" title="当时的错解"><MathText text={item.wrong} className="text-muted-foreground" /></Section><Section icon={Route} index="03" title="正确路径"><MathText text={item.correct} /></Section><Card className="border-accent/60"><CardHeader><CardTitle className="flex items-center gap-3 font-serif"><span className="flex size-8 items-center justify-center rounded-md bg-accent text-accent-foreground"><Lightbulb /></span>04 · 复盘反思</CardTitle></CardHeader><CardContent><MathText text={item.reflection} className="leading-relaxed" /></CardContent></Card></div><aside className="flex flex-col gap-4"><Card><CardHeader><CardTitle className="text-base">原始讲义</CardTitle></CardHeader><CardContent>{item.image && <div className="overflow-hidden rounded-lg border bg-muted"><Image src={item.image} alt={`${item.title}的原始课堂讲义`} width={600} height={800} className="h-auto w-full object-cover" /></div>}</CardContent></Card><Card><CardHeader><CardTitle className="text-base">知识路径</CardTitle></CardHeader><CardContent className="text-sm leading-relaxed text-muted-foreground">函数与导数<br />→ 函数的概念与性质<br /><span className="font-medium text-primary">→ {item.node}</span><Link href="/tree" className="mt-4 block"><Button variant="outline" className="w-full">在知识树中查看</Button></Link></CardContent></Card></aside></div></div></WorkspaceShell>
}

function Section({ icon: Icon, index, title, children }: { icon: React.ElementType; index: string; title: string; children: React.ReactNode }) { return <Card><CardHeader><CardTitle className="flex items-center gap-3 font-serif"><span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary"><Icon /></span>{index} · {title}</CardTitle></CardHeader><CardContent className="text-base leading-relaxed">{children}</CardContent></Card> }

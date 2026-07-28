import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, BookOpen, CalendarCheck, Clock, Lightbulb, Route, TriangleAlert } from "lucide-react"
import { notFound } from "next/navigation"
import { MathText } from "@/components/katex-content"
import { MacReviewDots } from "@/components/mac-review-dots"
import { WorkspaceShell } from "@/components/workspace-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { liShangdaErrors } from "@/lib/li-shangda-data"
import { liGuobinErrors } from "@/lib/li-guobin-data"
import { causeNames, sampleErrors } from "@/lib/sample-data"
import { wangErrors } from "@/lib/student-data-provider"
import { getDaysAgo } from "@/lib/utils"

export function generateStaticParams() {
  return [...liShangdaErrors, ...sampleErrors, ...wangErrors, ...liGuobinErrors].map((e) => ({ id: e.id }))
}

function getRelativeImageUrl(imgName: string) {
  if (!imgName) return ""
  if (imgName.startsWith("http://") || imgName.startsWith("https://")) return imgName
  const path = imgName.startsWith("/") ? imgName : `/notes/${imgName}`
  const prefix = process.env.NODE_ENV === "production" ? "/mathex" : ""
  return `${prefix}${path}`
}

export default async function ErrorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = [...liShangdaErrors, ...sampleErrors, ...wangErrors, ...liGuobinErrors].find((e) => e.id === id)
  if (!item) notFound()

  const rawImages = item.images && item.images.length > 0
    ? item.images
    : item.image
    ? [item.image]
    : []

  return (
    <WorkspaceShell>
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <Link href="/errors" className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> 返回错题本
        </Link>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{item.node}</Badge>
              <Badge variant="secondary">{item.cause} · {(causeNames as Record<string, string>)[item.cause] || item.cause}</Badge>
              <Badge variant="outline">难度 {item.difficulty}/5</Badge>
              <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                <Clock className="size-3" />
                {getDaysAgo(item.createdAt)}
              </span>
              <MacReviewDots reviewCount={item.reviewCount ?? 0} />
            </div>
            <h1 className="mt-4 text-balance font-serif text-3xl font-semibold">{item.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{item.source} · {item.id}</p>
          </div>
          <Link href="/review"><Button><CalendarCheck data-icon="inline-start" /> 加入今日复习</Button></Link>
        </div>
        <Separator />

        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="flex flex-col gap-4">
            <Section icon={BookOpen} index="01" title="题目描述">
              <MathText text={item.statement} />
            </Section>
            {item.wrong && (
              <Section icon={TriangleAlert} index="02" title="当时的错解与误区">
                <MathText text={item.wrong} className="text-muted-foreground" />
              </Section>
            )}
            {item.correct && (
              <Section icon={Route} index="03" title="正确路径与证明流程">
                <MathText text={item.correct} />
              </Section>
            )}
            {item.reflection && (
              <Card className="border-accent/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 font-serif">
                    <span className="flex size-8 items-center justify-center rounded-md bg-accent text-accent-foreground"><Lightbulb /></span>
                    04 · 迁移反思与通用指导
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MathText text={item.reflection} className="leading-relaxed" />
                </CardContent>
              </Card>
            )}
          </div>

          <aside className="flex flex-col gap-4">
            <Card>
              <CardHeader><CardTitle className="text-base">原始讲义与手写解答截图</CardTitle></CardHeader>
              <CardContent className="flex flex-col gap-3">
                {rawImages.length > 0 ? (
                  rawImages.map((imgSrc, idx) => (
                    <div key={idx} className="overflow-hidden rounded-lg border bg-muted p-1">
                      <img
                        src={getRelativeImageUrl(imgSrc)}
                        alt={`${item.title} 截图 ${idx + 1}`}
                        className="h-auto w-full object-contain max-h-96"
                      />
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-muted-foreground bg-muted rounded-md">
                    无讲义截图附件
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">关联知识路径</CardTitle></CardHeader>
              <CardContent className="text-sm leading-relaxed text-muted-foreground">
                全量 11 模块知识树<br />
                <span className="font-medium text-primary">→ {item.node} ({item.nodeId})</span>
                <Link href="/tree" className="mt-4 block">
                  <Button variant="outline" className="w-full">在知识树中导航</Button>
                </Link>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </WorkspaceShell>
  )
}

function Section({ icon: Icon, index, title, children }: { icon: React.ElementType; index: string; title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-serif">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary"><Icon /></span>
          {index} · {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-base leading-relaxed whitespace-pre-wrap">{children}</CardContent>
    </Card>
  )
}

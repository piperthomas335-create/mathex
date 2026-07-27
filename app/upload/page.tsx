"use client"

import { useState } from "react"
import { CheckCircle2, FileImage, Loader2, Sparkles, UploadCloud } from "lucide-react"
import { WorkspaceShell } from "@/components/workspace-shell"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Draft = { title: string; statement: string; wrong: string; correct: string; reflection: string; causeCode: string; suggestedNodes: { name: string; confidence: number }[] }

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ message: string; draft: Draft | null } | null>(null)
  const [error, setError] = useState("")
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError("")
    const form = new FormData(e.currentTarget)
    try { const res = await fetch("/api/ai/extract", { method: "POST", body: form }); const data = await res.json(); if (!res.ok) throw new Error(data.error); setResult(data) } catch (err) { setError(err instanceof Error ? err.message : "上传失败") } finally { setLoading(false) }
  }
  return <WorkspaceShell><div className="mx-auto flex max-w-5xl flex-col gap-6"><div><p className="text-sm font-medium text-primary">开放提交 · 人工审核后入库</p><h1 className="mt-2 font-serif text-3xl font-semibold">上传课堂笔记</h1><p className="mt-2 text-muted-foreground">把零散讲义交给 AI 先整理成草稿；没有 AI 额度时，手工审核流程仍然正常。</p></div>
  <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]"><Card><CardHeader><CardTitle>提交材料</CardTitle><CardDescription>支持讲义照片或纯文字，单张图片不超过 8MB</CardDescription></CardHeader><CardContent><form onSubmit={submit}><FieldGroup><Field><FieldLabel htmlFor="authorName">你的称呼</FieldLabel><Input id="authorName" name="authorName" placeholder="例如：高二 3 班小林" required maxLength={40} /></Field><Field><FieldLabel htmlFor="file">讲义照片</FieldLabel><label htmlFor="file" className="flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-muted/40 p-6 text-center hover:bg-muted"><span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">{file ? <FileImage /> : <UploadCloud />}</span><span className="font-medium">{file ? file.name : "点击选择一张讲义照片"}</span><span className="text-xs text-muted-foreground">JPG、PNG 或 WebP · 最大 8MB</span></label><Input id="file" name="file" type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /><FieldDescription>图片会存入私有 Blob，仅审核流程可读取。</FieldDescription></Field><Field><FieldLabel htmlFor="rawText">补充文字（可选）</FieldLabel><Textarea id="rawText" name="rawText" placeholder="写下老师的提示、你的疑问，或直接粘贴一道错题…" rows={6} /></Field><Field><FieldLabel htmlFor="authorNote">给审核者的话（可选）</FieldLabel><Input id="authorNote" name="authorNote" placeholder="例如：重点想整理第 3 题" /></Field><Button type="submit" size="lg" disabled={loading}>{loading ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <Sparkles data-icon="inline-start" />} {loading ? "正在识别与整理…" : "AI 整理并提交审核"}</Button>{error && <Alert variant="destructive"><AlertTitle>提交失败</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}</FieldGroup></form></CardContent></Card>
  <div className="flex flex-col gap-4">{result ? <ResultCard result={result} /> : <><Card><CardHeader><CardTitle className="text-base">AI 会整理什么？</CardTitle></CardHeader><CardContent className="flex flex-col gap-4">{["01 题目与条件", "02 当时的错解", "03 正确解题路径", "04 可迁移的反思"].map((x) => <div key={x} className="rounded-md bg-muted p-3 text-sm font-medium">{x}</div>)}</CardContent></Card><Alert><Sparkles /><AlertTitle>可降级设计</AlertTitle><AlertDescription>AI Gateway 未配置或额度用尽时，材料仍会进入待审核队列，由管理员手工结构化。</AlertDescription></Alert></>}</div></div></div></WorkspaceShell>
}

function ResultCard({ result }: { result: { message: string; draft: Draft | null } }) { return <Card className="border-primary/40"><CardHeader><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground"><CheckCircle2 /></span><div><CardTitle>提交成功</CardTitle><CardDescription>{result.message}</CardDescription></div></div></CardHeader><CardContent>{result.draft ? <div className="flex flex-col gap-4"><div><p className="text-xs text-muted-foreground">识别标题</p><p className="mt-1 font-semibold">{result.draft.title}</p></div><div className="flex flex-wrap gap-2"><Badge>{result.draft.causeCode} 类错因</Badge>{result.draft.suggestedNodes.map((n) => <Badge key={n.name} variant="outline">{n.name} {Math.round(n.confidence * 100)}%</Badge>)}</div><p className="text-sm leading-relaxed text-muted-foreground">{result.draft.reflection}</p></div> : <p className="text-sm leading-relaxed text-muted-foreground">材料已保存。AI 当前不可用，审核者会手工整理后入库。</p>}</CardContent></Card> }

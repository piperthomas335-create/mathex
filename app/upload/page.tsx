"use client"

import { useState } from "react"
import { Bot, CheckCircle2, Code2, FileImage, Loader2, Sparkles, UploadCloud } from "lucide-react"
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

  return (
    <WorkspaceShell>
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div>
          <p className="text-sm font-medium text-primary">开放提交与 Agent 协议接口</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold">上传错题讲义 / Agent 接入</h1>
          <p className="mt-2 text-muted-foreground">
            可通过 Web 表单提交讲义照片，也可以使用任意外部 AI Agent (根据 AGENTS.md 规范) 直接调用接口批量录入错题。
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle>人工 / Web 表单提交</CardTitle>
              <CardDescription>支持讲义照片或纯文字，单张图片不超过 8MB</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="authorName">你的称呼</FieldLabel>
                    <Input id="authorName" name="authorName" placeholder="例如：高二 3 班小林" required maxLength={40} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="file">讲义照片</FieldLabel>
                    <label htmlFor="file" className="flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-muted/40 p-6 text-center hover:bg-muted">
                      <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        {file ? <FileImage /> : <UploadCloud />}
                      </span>
                      <span className="font-medium">{file ? file.name : "点击选择一张讲义照片"}</span>
                      <span className="text-xs text-muted-foreground">JPG、PNG 或 WebP · 最大 8MB</span>
                    </label>
                    <Input id="file" name="file" type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                    <FieldDescription>图片存入数据库/私有存储，用于回溯原题。</FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="rawText">补充文字（可选）</FieldLabel>
                    <Textarea id="rawText" name="rawText" placeholder="写下老师的提示、你的疑问，或直接粘贴一道错题…" rows={5} />
                  </Field>
                  <Button type="submit" size="lg" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                    {loading ? "正在提交…" : "提交到复习队列"}
                  </Button>
                  {error && <Alert variant="destructive"><AlertTitle>提交失败</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
                </FieldGroup>
              </form>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4">
            {result ? (
              <ResultCard result={result} />
            ) : (
              <Card className="border-primary/40">
                <CardHeader>
                  <div className="flex items-center gap-2 text-primary font-medium text-sm">
                    <Bot className="size-4" /> Agent 协议接入 (AGENTS.md)
                  </div>
                  <CardTitle className="mt-1">任何 Agent 都能一键接入</CardTitle>
                  <CardDescription>
                    项目内提供标准的 `AGENTS.md` 规范，不强依赖服务器 AI Gateway Key。
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="rounded-lg bg-muted p-3 text-xs flex flex-col gap-2">
                    <div className="flex items-center justify-between font-mono font-semibold text-primary">
                      <span>POST /api/agent/upload</span>
                      <Badge variant="outline" className="text-[10px]">REST API</Badge>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Agent 可直接发送包含题目 (statementMd)、错解 (wrongMd)、正解 (correctMd)、反思 (reflectionMd) 与考点代号 (nodeId) 的 JSON 载荷提交新错题。
                    </p>
                  </div>

                  <div className="rounded-lg bg-muted p-3 text-xs flex flex-col gap-2">
                    <div className="flex items-center justify-between font-mono font-semibold text-primary">
                      <span>GET /api/agent/nodes?q=搜索词</span>
                      <Badge variant="outline" className="text-[10px]">GET API</Badge>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Agent 可以在分析图片前查询 11 大模块 469 个节点的精确 ID (例如 K03-01-01)。
                    </p>
                  </div>

                  <Alert>
                    <Code2 className="size-4" />
                    <AlertTitle>AGENTS.md 规范文件</AlertTitle>
                    <AlertDescription className="text-xs">
                      规范文件已保存在项目根目录 `AGENTS.md` 中，包含完整的 Python / cURL / Agent prompt 范例。
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </WorkspaceShell>
  )
}

function ResultCard({ result }: { result: { message: string; draft: Draft | null } }) {
  return (
    <Card className="border-primary/40">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <CheckCircle2 />
          </span>
          <div>
            <CardTitle>提交成功</CardTitle>
            <CardDescription>{result.message}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {result.draft ? (
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs text-muted-foreground">识别标题</p>
              <p className="mt-1 font-semibold">{result.draft.title}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>{result.draft.causeCode} 类错因</Badge>
              {result.draft.suggestedNodes.map((n) => (
                <Badge key={n.name} variant="outline">
                  {n.name} {Math.round(n.confidence * 100)}%
                </Badge>
              ))}
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{result.draft.reflection}</p>
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-muted-foreground">材料已保存。入库后可在“全量错题”与“阶梯复习”中查阅。</p>
        )}
      </CardContent>
    </Card>
  )
}

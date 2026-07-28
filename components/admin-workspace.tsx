"use client"

import { useCallback, useEffect, useState } from "react"
import { Check, Clock3, FileImage, Loader2, LogOut, Plus, ShieldCheck, UserCheck, Users, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useStudent } from "@/components/student-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Draft = { title?: string; statement?: string; wrong?: string; correct?: string; reflection?: string; causeCode?: string; suggestedNodes?: { name: string; confidence: number }[] }
type PendingNote = { id: string; authorName: string; authorNote: string | null; rawText: string | null; imageUrls: string[]; aiDraft: Draft | null; createdAt: string }

export function AdminLogin() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError("")
    const form = new FormData(event.currentTarget)
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ passcode: form.get("passcode") }) })
    const data = await response.json()
    setLoading(false)
    if (!response.ok) return setError(data.error || "登录失败")
    router.refresh()
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center">
      <Card className="w-full">
        <CardHeader>
          <div className="mb-2 flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck />
          </div>
          <CardTitle className="font-serif text-2xl">进入审核与多学生管理台</CardTitle>
          <CardDescription>输入管理员口令。会话将在 12 小时后自动失效。</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="passcode">管理员口令</FieldLabel>
                <Input id="passcode" name="passcode" type="password" autoComplete="current-password" required aria-invalid={Boolean(error)} />
                {error && <p className="text-sm text-destructive">{error}</p>}
              </Field>
              <Button disabled={loading}>
                {loading && <Loader2 data-icon="inline-start" className="animate-spin" />}进入管理工作区
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export function AdminWorkspace() {
  const router = useRouter()
  const [tab, setTab] = useState<"queue" | "students">("queue")
  const [items, setItems] = useState<PendingNote[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(false)

  const { students, addStudent, setCurrentStudentId, currentStudent } = useStudent()
  const [newStudentName, setNewStudentName] = useState("")
  const [newStudentGrade, setNewStudentGrade] = useState("高三理科")

  const load = useCallback(async () => {
    const response = await fetch("/api/admin/notes", { cache: "no-store" })
    if (response.status === 401) return router.refresh()
    const data = await response.json()
    setItems(data.notes || [])
    setActiveId((current) => current && data.notes.some((note: PendingNote) => note.id === current) ? current : data.notes[0]?.id ?? null)
    setLoading(false)
  }, [router])

  useEffect(() => { void load() }, [load])
  const active = items.find((item) => item.id === activeId)

  async function decide(action: "approve" | "reject", form?: HTMLFormElement) {
    if (!active) return
    setActing(true)
    const data = form ? new FormData(form) : null
    const response = await fetch("/api/admin/notes", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ noteId: active.id, action, nodeId: data?.get("nodeId") || undefined, reviewerNote: data?.get("reviewerNote") || undefined }) })
    setActing(false)
    if (response.ok) await load()
  }

  async function logout() { await fetch("/api/admin/login", { method: "DELETE" }); router.refresh() }

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStudentName.trim()) return
    addStudent({ name: newStudentName.trim() })
    setNewStudentName("")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <ShieldCheck className="size-4" />管理员工作区
          </div>
          <h1 className="mt-2 font-serif text-3xl font-semibold">审核与多学生管理</h1>
          <p className="mt-2 text-muted-foreground">审核 Agent / 访客提交的草稿，管理学生账号与独立错题档案。</p>
        </div>
        <Button variant="outline" onClick={logout}><LogOut data-icon="inline-start" />退出</Button>
      </div>

      <div className="flex gap-2 border-b pb-3">
        <Button variant={tab === "queue" ? "default" : "ghost"} size="sm" onClick={() => setTab("queue")}>
          <Clock3 className="size-3.5" /> 待审核队列 ({items.length})
        </Button>
        <Button variant={tab === "students" ? "default" : "ghost"} size="sm" onClick={() => setTab("students")}>
          <Users className="size-3.5" /> 多学生账号管理 ({students.length})
        </Button>
      </div>

      {tab === "queue" ? (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">提交列表</CardTitle>
              <CardDescription>{loading ? "正在读取…" : `${items.length} 条待审核`}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {items.map((item) => (
                <button key={item.id} onClick={() => setActiveId(item.id)} className={`w-full rounded-lg border p-4 text-left transition-colors ${item.id === activeId ? "bg-muted" : "hover:bg-muted/50"}`}>
                  <div className="flex items-center justify-between">
                    <Badge><Clock3 />待审核</Badge>
                    <span className="font-mono text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString("zh-CN")}</span>
                  </div>
                  <p className="mt-3 font-semibold">{item.aiDraft?.title || item.authorNote || "未命名投稿"}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.authorName} · {item.imageUrls.length ? "图片提交" : "文字提交"}</p>
                </button>
              ))}
              {!loading && !items.length && <p className="py-10 text-center text-sm text-muted-foreground">队列已清空</p>}
            </CardContent>
          </Card>
          {active ? <ReviewCard note={active} acting={acting} onDecide={decide} /> : <Card><CardContent className="flex min-h-80 items-center justify-center text-muted-foreground">选择一条提交查看结构化草稿</CardContent></Card>}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>已注册学生列表</CardTitle>
              <CardDescription>每个学生拥有独立的错题库、掌握度与阶梯复习日程</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {students.map((s) => {
                const active = s.id === currentStudent.id
                return (
                  <div key={s.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                        {s.name.slice(0, 1)}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{s.name}</p>
                          {active && <Badge variant="secondary" className="text-[10px]">当前选中</Badge>}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={active ? "outline" : "default"}
                      onClick={() => setCurrentStudentId(s.id)}
                    >
                      {active ? <UserCheck className="size-3.5" /> : "切换到该学生"}
                    </Button>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">新建学生档案</CardTitle>
              <CardDescription>为新学生创建独立错题账号</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateStudent} className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-medium">学生姓名</label>
                  <Input
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder="如：张同学"
                    className="mt-1"
                    required
                  />
                </div>
                <Button type="submit" className="mt-2">
                  <Plus className="size-4" /> 添加学生档案
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

function ReviewCard({ note, acting, onDecide }: { note: PendingNote; acting: boolean; onDecide: (action: "approve" | "reject", form?: HTMLFormElement) => Promise<void> }) {
  const draft = note.aiDraft || {}
  const sections = [["01 题目", draft.statement || note.rawText || "待补充"], ["02 错解", draft.wrong || "待补充"], ["03 正解", draft.correct || "待补充"], ["04 反思", draft.reflection || note.authorNote || "待补充"]]
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileImage className="size-4" />
          <CardTitle>{draft.title || "结构化草稿"}</CardTitle>
        </div>
        <CardDescription>
          {draft.suggestedNodes?.length ? `AI/Agent 建议：${draft.suggestedNodes.map((n) => `${n.name} ${Math.round(n.confidence * 100)}%`).join(" · ")}` : "AI 未给出知识点建议，请人工指定"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(event) => { event.preventDefault(); void onDecide("approve", event.currentTarget) }} className="flex flex-col gap-4">
          {note.imageUrls.map((pathname) => <img key={pathname} src={`/api/admin/file?pathname=${encodeURIComponent(pathname)}`} alt="数学讲义" className="max-h-96 w-full rounded-lg border object-contain" />)}
          {sections.map(([label, body]) => <div key={label} className="rounded-lg border p-4"><p className="text-xs font-medium text-primary">{label}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{body}</p></div>)}
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="nodeId">知识树节点 ID</FieldLabel>
              <Input id="nodeId" name="nodeId" defaultValue="K03-02-01" placeholder="例如 K03-02-01" />
            </Field>
            <Field>
              <FieldLabel htmlFor="reviewerNote">审核备注</FieldLabel>
              <Textarea id="reviewerNote" name="reviewerNote" rows={2} placeholder="可选" />
            </Field>
          </FieldGroup>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" disabled={acting} onClick={() => void onDecide("reject")}><X data-icon="inline-start" />退回</Button>
            <Button disabled={acting}>{acting ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <Check data-icon="inline-start" />}审核并入库</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

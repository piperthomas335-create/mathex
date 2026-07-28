"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, BrainCircuit, CalendarCheck, ChevronRight, GitBranch, GraduationCap, LayoutDashboard, NotebookPen, Search, ShieldCheck, Sparkles, Upload, X, Menu } from "lucide-react"
import { useState } from "react"
import { useStudent } from "@/components/student-context"
import { StudentSwitcher } from "@/components/student-switcher"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { studentErrors, studentDueErrors, studentLessons } = useStudent()

  const dynamicNavigation = [
    { href: "/", label: "学习看板", icon: LayoutDashboard },
    { href: "/tree", label: "知识树", icon: GitBranch },
    { href: "/errors", label: "错题本", icon: NotebookPen, badge: String(studentErrors.length) },
    { href: "/lessons", label: "课堂整理", icon: GraduationCap, badge: String(studentLessons.length) },
    { href: "/review", label: "阶梯复习", icon: CalendarCheck, badge: String(studentDueErrors.length) },
  ]

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="sticky top-0 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:hidden z-30">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} aria-label="切换导航">
            {open ? <X /> : <Menu />}
          </Button>
          <Link href="/" className="flex items-center gap-2 font-semibold text-sm">
            <BrainCircuit className="text-primary size-5" /> 数学错题本
          </Link>
        </div>
        <StudentSwitcher className="w-36" />
      </header>

      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className={cn("fixed inset-y-0 left-0 flex w-64 flex-col border-r bg-sidebar p-4 transition-transform z-40 md:sticky md:top-0 md:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
          <Link href="/" className="flex items-center gap-3 px-2 py-2" onClick={() => setOpen(false)}>
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"><BrainCircuit /></span>
            <span><span className="block font-semibold tracking-tight">数学错题本</span><span className="block text-xs text-muted-foreground">错题管理系统</span></span>
          </Link>

          <div className="mt-4 px-1">
            <StudentSwitcher />
          </div>

          <nav className="mt-5 flex flex-col gap-1" aria-label="主导航">
            {dynamicNavigation.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors font-medium",
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <item.icon className="size-4" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className={cn("rounded px-1.5 py-0.5 text-xs font-mono font-semibold", active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground")}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto flex flex-col gap-3">
            <div className="rounded-lg border bg-card p-3">
              <div className="flex items-center gap-2 text-xs font-medium"><Sparkles className="size-4 text-accent" /> Agent 接口</div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">支持 Agent API 或图片录入错题。</p>
            </div>
            <Link href="/upload"><Button className="w-full"><Upload data-icon="inline-start" /> 上传笔记 / Agent</Button></Link>
            <Link href="/admin" className="flex items-center gap-2 px-2 text-xs text-muted-foreground hover:text-foreground"><ShieldCheck className="size-4" /> 审核与管理台 <ChevronRight className="ml-auto size-3" /></Link>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="hidden h-16 items-center justify-between border-b px-8 md:flex">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="搜索知识点、错题或课堂笔记…" className="pl-9" aria-label="全站搜索" />
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><BookOpen className="size-4" /> 高中数学 · 11 模块 469 节点</span>
            </div>
          </header>
          <main className="p-4 md:p-8">{children}</main>
        </div>
      </div>
    </div>
  )
}

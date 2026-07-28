"use client"

import { useState } from "react"
import { Check, ChevronDown, Plus, Users } from "lucide-react"
import { useStudent } from "@/components/student-context"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function StudentSwitcher({ className }: { className?: string }) {
  const { students, currentStudent, setCurrentStudentId, addStudent } = useStudent()
  const [open, setOpen] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [name, setName] = useState("")

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    addStudent({ name: name.trim() })
    setName("")
    setShowAddModal(false)
    setOpen(false)
  }

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
        className="w-full justify-between bg-card text-left font-normal border-sidebar-border"
      >
        <span className="flex items-center gap-2 truncate">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {currentStudent.name.slice(0, 1)}
          </span>
          <span className="truncate text-sm font-semibold">{currentStudent.name}</span>
        </span>
        <ChevronDown className="size-3.5 text-muted-foreground shrink-0 ml-1" />
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setOpen(false)
              setShowAddModal(false)
            }}
          />
          <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-lg border bg-popover p-1.5 shadow-md">
            <div className="px-2 py-1.5 text-[11px] font-semibold text-muted-foreground">
              选择学生错题本
            </div>
            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
              {students.map((s) => {
                const active = s.id === currentStudent.id
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setCurrentStudentId(s.id)
                      setOpen(false)
                    }}
                    className={cn(
                      "flex items-center justify-between rounded-md px-3 py-2 text-sm text-left transition-colors font-medium",
                      active
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "hover:bg-accent"
                    )}
                  >
                    <span>{s.name}</span>
                    {active && <Check className="size-3.5" />}
                  </button>
                )
              })}
            </div>

            <div className="mt-1 border-t pt-1">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
              >
                <Plus className="size-3.5" />
                新增学生档案
              </button>
            </div>
          </div>
        </>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="size-4 text-primary" />
                创建新学生错题本档案
              </CardTitle>
              <CardDescription>
                为不同学生独立管理错题、知识树与复习日程。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="flex flex-col gap-3">
                <div>
                  <label className="text-xs font-medium">学生姓名</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="如：张同学"
                    className="mt-1"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddModal(false)}
                  >
                    取消
                  </Button>
                  <Button type="submit" size="sm">
                    创建并切换
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

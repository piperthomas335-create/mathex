import { fullModuleStats } from "@/lib/full-tree-data"
import { liShangdaErrors, liShangdaLessons } from "@/lib/li-shangda-data"
import { liGuobinErrors, liGuobinLessons } from "@/lib/li-guobin-data"
import { ErrorItem, sampleErrors } from "@/lib/sample-data"

export type LessonItem = {
  id: string
  title: string
  date: string
  content: string
}

export const xuLessons: LessonItem[] = [
  {
    id: "les-xu-01",
    title: "第二章 函数的概念、性质与基本模型",
    date: "2026-07-26",
    content: "# 函数的概念、性质与基本模型复盘\n\n## 本节课内容\n- 从定义域到指数方程的系统复盘\n- 复合函数与奇偶性证明",
  },
]

export const wangErrors: ErrorItem[] = [
  {
    id: "E-W01",
    title: "立体几何中线面平行的判定定理",
    cause: "A",
    difficulty: 2,
    node: "立体几何",
    nodeId: "K07-02-01",
    source: "高三月考第 15 题",
    statement: "证明线段 $EF \\parallel$ 平面 $ABCD$。",
    wrong: "遗漏了线在面外的必备条件。",
    correct: "需证明 $EF \\not\\subset \\text{平面}$, $GH \\subset \\text{平面}$, 且 $EF \\parallel GH$。",
    reflection: "判定定理三要素不可省。",
    due: "今天",
  },
]

export const wangLessons: LessonItem[] = [
  {
    id: "les-w-01",
    title: "第七章 立体几何线面平行与垂直",
    date: "2026-07-20",
    content: "# 立体几何专题训练\n\n- 空间直角坐标系建立\n- 线面角与二面角向量法求解",
  },
]

export function getStudentErrors(studentId: string): ErrorItem[] {
  if (studentId === "std-001") return liShangdaErrors as unknown as ErrorItem[]
  if (studentId === "std-003") return wangErrors as unknown as ErrorItem[]
  if (studentId === "std-004") return liGuobinErrors as unknown as ErrorItem[]
  return sampleErrors // std-002 徐同学
}

export function getStudentErrorById(studentId: string, id: string): ErrorItem | undefined {
  const list = getStudentErrors(studentId)
  const found = list.find((e) => e.id === id)
  if (found) return found
  // fallback search across all students
  return ([...liShangdaErrors, ...sampleErrors, ...wangErrors, ...liGuobinErrors] as unknown as ErrorItem[]).find((e) => e.id === id)
}

export function getStudentLessons(studentId: string): LessonItem[] {
  if (studentId === "std-001") return liShangdaLessons
  if (studentId === "std-003") return wangLessons
  if (studentId === "std-004") return liGuobinLessons as unknown as LessonItem[]
  return xuLessons
}

export function getStudentDueErrors(studentId: string): ErrorItem[] {
  const errors = getStudentErrors(studentId)
  return errors.filter((e) => e.due === "今天" || (e.due && e.due.includes("待复习")))
}

export function getStudentModuleStats(studentId: string) {
  const errors = getStudentErrors(studentId)
  const countMap: Record<string, number> = {}

  errors.forEach((e) => {
    const modName = e.source?.includes("模块")
      ? e.source
      : e.node || "函数与导数"
    countMap[modName] = (countMap[modName] || 0) + 1
  })

  return fullModuleStats.map((m) => {
    const count = countMap[m.name] || (m.id === "K03" ? errors.length : 0)
    return {
      ...m,
      errorCount: count,
    }
  })
}

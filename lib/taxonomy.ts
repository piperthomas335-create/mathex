export const MODULE_NAMES: Record<string, string> = {
  K01: "集合与常用逻辑用语",
  K02: "不等式",
  K03: "函数与导数",
  K04: "三角函数与解三角形",
  K05: "平面向量与复数",
  K06: "数列",
  K07: "立体几何",
  K08: "解析几何",
  K09: "计数原理",
  K10: "概率与统计",
  K11: "高等背景拓展",
}

/** 全站统一的错因分类枚举 */
export const CAUSES = [
  { code: "A", label: "概念性质不清", short: "概念", desc: "定义、定理、性质记错或理解偏差" },
  { code: "B", label: "运算失误", short: "运算", desc: "移项、通分、符号、代数变形出错" },
  { code: "C", label: "审题条件遗漏", short: "审题", desc: "漏看条件、定义域、取值范围、多选漏项" },
  { code: "D", label: "方法选择不当", short: "方法", desc: "思路可行但绕远，或未想到关键转化" },
  { code: "E", label: "分类讨论不全", short: "讨论", desc: "参数、区间、奇偶等情形缺失" },
  { code: "F", label: "表达与书写", short: "表达", desc: "区间写法、证明步骤、结论表述不规范" },
] as const

export type CauseCode = (typeof CAUSES)[number]["code"]

export const CAUSE_MAP = Object.fromEntries(CAUSES.map((c) => [c.code, c])) as Record<
  string,
  (typeof CAUSES)[number]
>

export function causeLabel(code: string) {
  return CAUSE_MAP[code]?.label ?? "未分类"
}

/** 错因色条：仅用于细窄色条与徽章 */
export const CAUSE_BAR: Record<string, string> = {
  A: "bg-chart-1",
  B: "bg-chart-2",
  C: "bg-chart-3",
  D: "bg-chart-4",
  E: "bg-chart-5",
  F: "bg-muted-foreground",
}

export const CAUSE_TEXT: Record<string, string> = {
  A: "text-chart-1",
  B: "text-chart-2",
  C: "text-chart-3",
  D: "text-chart-4",
  E: "text-chart-5",
  F: "text-muted-foreground",
}

/** 复习阶梯：1 / 3 / 7 / 14 / 30 天 */
export const REVIEW_STAGES = [1, 3, 7, 14, 30] as const
export const MAX_STAGE = REVIEW_STAGES.length

export function stageInterval(stage: number) {
  return REVIEW_STAGES[Math.min(Math.max(stage, 1), MAX_STAGE) - 1]
}

export function addDays(base: Date, days: number) {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  return d
}

export function toDateString(d: Date) {
  return d.toISOString().slice(0, 10)
}

export const DIFFICULTY_LABEL: Record<number, string> = {
  1: "基础",
  2: "较易",
  3: "中等",
  4: "较难",
  5: "压轴",
}

/** 掌握度分档，用于单色靛蓝深浅热力 */
export function masteryBand(score: number) {
  if (score >= 90) return { band: 0, label: "稳固", cls: "bg-primary/10" }
  if (score >= 75) return { band: 1, label: "良好", cls: "bg-primary/25" }
  if (score >= 60) return { band: 2, label: "一般", cls: "bg-primary/45" }
  if (score >= 40) return { band: 3, label: "薄弱", cls: "bg-primary/65" }
  return { band: 4, label: "危险", cls: "bg-primary/85" }
}

export function masteryTextOn(score: number) {
  return score >= 60 ? "text-foreground" : "text-primary-foreground"
}

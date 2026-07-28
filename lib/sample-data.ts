export interface ErrorItem {
  id: string
  title: string
  cause: "A" | "B" | "C" | "D" | "E" | "F"
  difficulty: number
  node: string
  nodeId?: string
  source: string
  statement: string
  wrong: string
  correct: string
  reflection: string
  due: string
  reviewCount?: number
  createdAt?: string
  image?: string
}

export interface LessonItem {
  id: string
  date: string
  title: string
  teacher: string
  topic: string
  keyTakeaways: string[]
  weakness: string
  actionItem: string
}

export const causeNames: Record<string, string> = {
  A: "概念混淆 / 定义域遗漏",
  B: "计算推导失误",
  C: "分类讨论遗漏边界",
  D: "复合法则应用颠倒",
  E: "代数形变盲目换元",
  F: "逻辑推导漏洞",
}

// 徐同学 (std-002) 的全新高品质高考数学错题本 (来源于 C:\Users\mirai\Downloads\temp 真实大一轮复习讲义分析)
export const sampleErrors: ErrorItem[] = [
  {
    id: "E-1001",
    title: "抽象复合函数定义域与分式/零次幂限制",
    cause: "A",
    difficulty: 4,
    node: "K03-01-01 函数的概念与定义域",
    nodeId: "K03-01-01",
    source: "2026·步步高大一轮复习讲义 P19 例1",
    statement: "已知函数 $y=f(x)$ 的定义域为 $[0, 4]$，求函数 $y = \\frac{f(x+1)}{\\sqrt{x}-1} + (x-2)^0$ 的定义域。",
    wrong: "错解分析：直接认为 $0 \\le x+1 \\le 4 \\Rightarrow -1 \\le x \\le 3$，忽略了分母 $\\sqrt{x}-1 \\neq 0$ 以及零次幂底数 $x-2 \\neq 0$ 的限制，导致定义域范围扩大。",
    correct: "【标准解析】\n1. 由分子 $f(x+1)$ 有意义，得 $0 \\le x+1 \\le 4 \\Rightarrow -1 \\le x \\le 3$；\n2. 由分母有意义，得 $x \\ge 0$ 且 $\\sqrt{x}-1 \\neq 0 \\Rightarrow x \\neq 1$；\n3. 由零次幂 $(x-2)^0$ 有意义，得 $x - 2 \\neq 0 \\Rightarrow x \\neq 2$。\n取交集可得 $x \\in [0, 1) \\cup (1, 2) \\cup (2, 3]$。",
    reflection: "求函数定义域必须‘全面列出不等式组’：解析式若含二次根式需满足被开方数 $\\ge 0$；分式需满足分母 $\\neq 0$；零次幂需满足底数 $\\neq 0$；抽象复合函数 $f(g(x))$ 需保证 $g(x)$ 的范围落在原函数 $f(u)$ 的定义域内。",
    due: "今天",
    reviewCount: 0,
    createdAt: "2026-07-27T17:08:53.000Z",
  },
  {
    id: "E-1002",
    title: "换元法求解析式未补全新变量定义域",
    cause: "E",
    difficulty: 3,
    node: "K03-01-02 函数解析式的求法",
    nodeId: "K03-01-02",
    source: "2026·步步高大一轮复习讲义 P20 跟踪训练2",
    statement: "已知 $f\\left(x - \\frac{1}{x}\\right) = x^2 + \\frac{1}{x^2}$ ($x \\neq 0$)，求 $f(x)$ 的解析式。",
    wrong: "错解分析：设 $t = x - \\frac{1}{x}$，由 $t^2 = x^2 - 2 + \\frac{1}{x^2}$ 得 $x^2 + \\frac{1}{x^2} = t^2 + 2$。直接得出 $f(x) = x^2 + 2$，但未检验换元后新自变量 $t$ 的取值范围，遗漏了定义域说明。",
    correct: "【标准解析】\n设 $t = x - \\frac{1}{x}$ ($x \\neq 0$)。\n对任意 $t \\in \\mathbb{R}$，方程 $x^2 - tx - 1 = 0$ 的判别式 $\\Delta = t^2 + 4 > 0$ 恒成立，说明 $t$ 的取值范围为 $(-\\infty, +\\infty)$。\n由 $t^2 = x^2 - 2 + \\frac{1}{x^2}$，得 $x^2 + \\frac{1}{x^2} = t^2 + 2$。\n故函数解析式为 $f(x) = x^2 + 2$ ($x \\in \\mathbb{R}$)。",
    reflection: "‘换元必换域’！利用换元法（或配凑法）求函数解析式时，必须严格确定新引入变量 $t$ 的取值范围，并将新范围作为最终解析式 $f(x)$ 的定义域限制。",
    due: "待计划",
    reviewCount: 1,
    createdAt: "2026-07-27T17:08:54.000Z",
  },
  {
    id: "E-1003",
    title: "复合函数‘同增异减’单调区间判定",
    cause: "D",
    difficulty: 4,
    node: "K03-02-01 函数的单调性与最值",
    nodeId: "K03-02-01",
    source: "2026·步步高大一轮复习讲义 P22 命题点1",
    statement: "多选题：下列命题中，正确的是（ ）\nA. 函数 $y = \\mathrm{e}^{-x} - \\frac{1}{x^2}$ 在 $(-\\infty, 0)$ 上单调递减；\nB. 函数 $y = 2|x+1|$ 的单调递减区间是 $(-\\infty, -1]$；\nC. 函数 $y = 2^{-x^2 + 2x + 3}$ 的单调递增区间为 $[1, +\\infty)$；\nD. 函数 $y = 2x + 2\\cos x$ 是增函数。",
    wrong: "错解分析：误选 C。在分析 $y = 2^{-x^2 + 2x + 3}$ 时，只注意到内层二次函数 $u = -x^2 + 2x + 3$ 的对称轴为 $x=1$，误以为内层递减会导致整体递增，忽略了底数 $a=2 > 1$ 时外层为增函数，复合结果应为‘异减’！",
    correct: "【标准解析】\n对于 A：在 $(-\\infty, 0)$ 上，$\\mathrm{e}^{-x}$ 递减，$-\\frac{1}{x^2}$ 递减，故整体递减，A 正确；\n对于 B：$y = 2|x+1|$ 在 $(-\\infty, -1]$ 上 $y = -2(x+1)$ 递减，B 正确；\n对于 C：设 $u = -x^2 + 2x + 3 = -(x-1)^2 + 4$。在 $[1, +\\infty)$ 上 $u$ 单调递减。外层 $y = 2^u$ 单调递增。由复合函数‘同增异减’法则，$y$ 在 $[1, +\\infty)$ 上单调递减，C 错误；\n对于 D：$y' = 2 - 2\\sin x \\ge 0$ 恒成立，故为增函数，D 正确。\n故正确选项为 A, B, D。",
    reflection: "判定复合函数 $y = f(g(x))$ 单调性必须遵循两步法则：第一步求出内层函数 $g(x)$ 的定义域与单调性；第二步结合外层函数 $f(u)$ 的单调性，使用‘同增异减’口诀准确判定。",
    due: "今天",
    reviewCount: 0,
    createdAt: "2026-07-27T17:09:00.000Z",
  },
  {
    id: "E-1004",
    title: "抽象函数赋值法与奇偶性综合",
    cause: "C",
    difficulty: 4,
    node: "K03-02-02 函数的奇偶性与对称性",
    nodeId: "K03-02-02",
    source: "2026·步步高大一轮复习讲义 P25 跟踪训练1",
    statement: "已知定义在 $\\mathbb{R}$ 上的奇函数 $f(x)$ 满足 $f(x_1 + x_2) = f(x_1) + f(x_2)$。若 $f(1) + g(-2) = -1$，且 $g(x) = 2^x + x^3$，求 $f(1)$ 的值。",
    wrong: "错解分析：在计算 $g(-2)$ 时出现计算粗心，将 $2^{-2}$ 误算为 $-4$，且未能灵活利用 $f(x_1 + x_2) = f(x_1) + f(x_2)$ 推导出正比例函数 $f(x) = cx$ 的性质。",
    correct: "【标准解析】\n1. 计算 $g(-2)$：$g(-2) = 2^{-2} + (-2)^3 = \\frac{1}{4} - 8 = -\\frac{31}{4}$；\n2. 代入已知等式 $f(1) + g(-2) = -1$：\n   $f(1) - \\frac{31}{4} = -1 \\Rightarrow f(1) = \\frac{27}{4}$。\n（注：由 $f(x_1+x_2)=f(x_1)+f(x_2)$ 可推得 $f(x) = f(1)x = \\frac{27}{4}x$）。",
    reflection: "抽象函数问题核心在于‘赋值法’（令 $x_1=x_2=0$ 或 $x_2=-x_1$）。计算已知具体函数值（如 $g(-2)$）时需特别警惕负指数幂与奇数次幂的正负号！",
    due: "待计划",
    reviewCount: 0,
    createdAt: "2026-07-27T17:09:05.000Z",
  },
  {
    id: "E-1005",
    title: "周期性与奇偶性结合的大数求值",
    cause: "B",
    difficulty: 4,
    node: "K03-02-03 函数的周期性与对称性",
    nodeId: "K03-02-03",
    source: "2026·步步高大一轮复习讲义 P27 跟踪训练1",
    statement: "已知定义在 $\\mathbb{R}$ 上的奇函数 $f(x)$ 满足 $f(x-3) = -f(x)$。当 $x \\in [0, 3]$ 时，$f(x) = x^2 - 3x$。求 $f(2023) + f(2025) - f(2024)$ 的值。",
    wrong: "错解分析：错把周期推导为 $T=3$。由 $f(x-3)=-f(x)$ 推出 $f(x-6)=f(x)$，周期应为 $T=6$。在用 6 取模缩减自变量时出现正负号化简失误。",
    correct: "【标准解析】\n1. 周期推导：由 $f(x-3) = -f(x)$，得 $f(x-6) = -f(x-3) = f(x)$，故最小正周期 $T = 6$；\n2. 2024 取模：$2024 = 6 \\times 337 + 2 \\Rightarrow f(2024) = f(2) = 2^2 - 3(2) = -2$；\n3. 2023 取模：$2023 = 6 \\times 337 + 1 \\Rightarrow f(2023) = f(1) = 1 - 3 = -2$；\n4. 2025 取模：$2025 = 6 \\times 337 + 3 \\Rightarrow f(2025) = f(3) = 3^2 - 3(3) = 0$；\n代入计算：$f(2023) + f(2025) - f(2024) = -2 + 0 - (-2) = 0$。",
    reflection: "周期性求大数函数值的标准流程：① 寻找递推公式推出周期 $T$；② 用 $x \\bmod T$ 将大数自变量化简至已知解析式的定义区间（如 $[0, 3]$）；③ 若落入负区间，利用奇偶性 $f(-x)=-f(x)$ 翻转回正区间求解。",
    due: "今天",
    reviewCount: 1,
    createdAt: "2026-07-27T17:09:10.000Z",
  },
  {
    id: "E-1006",
    title: "二次函数在动区间 $[0, m]$ 上的值域与边界",
    cause: "C",
    difficulty: 4,
    node: "K03-04-02 二次函数的性质与最值",
    nodeId: "K03-04-02",
    source: "2026·步步高大一轮复习讲义 P31 跟踪训练3",
    statement: "已知函数 $f(x) = x^2 - 2x + 3$ 在闭区间 $[0, m]$ 上的值域是 $[2, 3]$，求实数 $m$ 的取值范围。",
    wrong: "错解分析：错选为 $(0, 2]$。只考虑到 $x=2$ 时 $f(2)=3$，忽略了要取得最小值 $2$，右端点 $m$ 必须达到或跨过顶点 $x=1$（即 $m \\ge 1$）！",
    correct: "【标准解析】\n二次函数配方得 $f(x) = (x-1)^2 + 2$，对称轴为直线 $x = 1$，顶点最小值为 $f(1) = 2$。\n1. 为使最小值达到 $2$，区间 $[0, m]$ 必须包含顶点 $x = 1$，故 $m \\ge 1$；\n2. 端点处 $f(0) = 3$。由对称性，当 $x = 2$ 时，$f(2) = 3$。为使最大值不超过 $3$，右端点 $m$ 不能超过 $2$，即 $m \\le 2$。\n综上所述，实数 $m$ 的取值范围是 $[1, 2]$。",
    reflection: "二次函数在动区间 $[a, b]$ 上的值域问题，必须‘画图看两点’：一是对称轴与区间的相对位置关系（是否包含顶点最小值/最大值）；二是端点函数值的大小关系（比较 $f(a)$ 与 $f(b)$）。",
    due: "待计划",
    reviewCount: 0,
    createdAt: "2026-07-27T17:09:16.000Z",
  },
  {
    id: "E-1007",
    title: "对数复合函数定义域、奇偶性与单调性",
    cause: "A",
    difficulty: 4,
    node: "K03-05-02 对数函数的性质与综合应用",
    nodeId: "K03-05-02",
    source: "2026·步步高大一轮复习讲义 P37 跟踪训练3",
    statement: "多选题：已知函数 $f(x) = \\lg\\left(\\frac{2}{1-x} - 1\\right)$，下列说法中正确的有（ ）\nA. $f(x)$ 的定义域为 $(-1, 1)$；\nB. $f(x)$ 的图象关于 $y$ 轴对称；\nC. $f(x)$ 的图象关于原点对称；\nD. $f(x)$ 在 $(0, 1)$ 上单调递增。",
    wrong: "错解分析：错选了 B。化简真数时漏掉了真数必须大于 0 的基本条件，导致奇偶性判断把 $f(-x) = -f(x)$ 错记为偶函数。",
    correct: "【标准解析】\n1. 化简真数：$u(x) = \\frac{2}{1-x} - 1 = \\frac{1+x}{1-x}$；\n2. 真数需满足 $\\frac{1+x}{1-x} > 0 \\iff (1+x)(1-x) > 0 \\iff x \\in (-1, 1)$，故 A 正确；\n3. 奇偶性验证：$f(-x) = \\lg\\left(\\frac{1-x}{1+x}\\right) = \\lg\\left(\\frac{1+x}{1-x}\\right)^{-1} = -f(x)$，故 $f(x)$ 为奇函数，图象关于原点对称，C 正确，B 错误；\n4. 单调性验证：在 $(0, 1)$ 上，$u(x) = -1 + \\frac{2}{1-x}$ 递增，外层对数底数 $10 > 1$ 递增，故 $f(x)$ 在 $(0, 1)$ 上单调递增，D 正确。\n故正确选项为 A, C, D。",
    reflection: "对数函数综合题‘真数优先’！求解任何对数相关问题，第一步永远是解不等式 $u(x) > 0$ 确定定义域。化简分式对数 $\\lg\\left(\\frac{1+x}{1-x}\\right)$ 是经典奇函数模型，需熟记 $f(-x) = -f(x)$ 的对数变轨关系。",
    due: "今天",
    reviewCount: 1,
    createdAt: "2026-07-28T11:05:35.000Z",
  },
]

export const sampleLessons: LessonItem[] = [
  {
    id: "L-001",
    date: "2026-07-27",
    title: "函数概念与基本性质一轮复习",
    teacher: "张老师",
    topic: "函数的定义域、解析式与奇偶对称性",
    keyTakeaways: [
      "求抽象复合函数定义域需全面列出不等式组，包含分母、根号与零次幂",
      "换元法求解析式必换域，新变量范围作为解析式限制",
      "复合函数单调性严格遵守‘同增异减’法则",
    ],
    weakness: "复合函数单调区间分析时容易混淆内层自变量与整体定义域。",
    actionItem: "完成步步高讲义 P19-37 的错题二次重做与变式演练。",
  },
]

export type ErrorItem = {
  id: string
  title: string
  cause: "A" | "B" | "C" | "D" | "E"
  difficulty: number
  node: string
  nodeId: string
  source: string
  statement: string
  wrong: string
  correct: string
  reflection: string
  image?: string
  due?: string
}

export const sampleErrors: ErrorItem[] = [
  {
    id: "E-001", title: "函数定义域中的根式与分母约束", cause: "A", difficulty: 2,
    node: "函数的定义域", nodeId: "K03-01-01", source: "第二章 P19 · 例2",
    statement: "求函数 $f(x)=\\frac{\\sqrt{x+1}}{x-2}$ 的定义域。",
    wrong: "只考虑了根号：$x+1\\ge 0$，得到 $[-1,+\\infty)$。",
    correct: "需同时满足 $x+1\\ge 0$ 且 $x-2\\ne0$，所以定义域为 $[-1,2)\\cup(2,+\\infty)$。",
    reflection: "定义域约束要逐项列清单：偶次根式非负、分母不为零、对数真数为正。最后取交集。",
    image: "/notes/p19-concept-domain.jpg", due: "今天"
  },
  {
    id: "E-002", title: "复合函数定义域的对应关系", cause: "B", difficulty: 3,
    node: "复合函数", nodeId: "K03-01-03", source: "第二章 P19 · 例3",
    statement: "已知 $f(x)$ 的定义域为 $[0,4]$，求 $f(2x-1)$ 的定义域。",
    wrong: "直接把 $[0,4]$ 当作 $x$ 的范围。",
    correct: "自变量整体 $2x-1$ 必须落入 $[0,4]$：$0\\le2x-1\\le4$，解得 $\\frac12\\le x\\le\\frac52$。",
    reflection: "看到 $f(g(x))$ 时，定义域对应的是 $g(x)$ 的取值范围，而不是直接照抄 $f$ 的定义域。",
    image: "/notes/p19-concept-domain.jpg", due: "明天"
  },
  {
    id: "E-003", title: "分段函数代入边界点", cause: "C", difficulty: 2,
    node: "分段函数", nodeId: "K03-01-02", source: "第二章 P20 · 例6",
    statement: "已知 $f(x)=\\begin{cases}x^2+1,&x<1\\\\2x,&x\\ge1\\end{cases}$，求 $f(1)$。",
    wrong: "代入了第一段，得到 $2$，虽然数值碰巧相同但依据错误。",
    correct: "$x=1$ 满足 $x\\ge1$，必须使用第二段，$f(1)=2$。",
    reflection: "分段点先判断归属，再代公式；不要因为结果相同而忽略逻辑。",
    image: "/notes/p20-analytic-piecewise.jpg", due: "3 天后"
  },
  {
    id: "E-004", title: "单调性定义中的任意性", cause: "D", difficulty: 3,
    node: "函数的单调性", nodeId: "K03-02-01", source: "第二章 P22 · 例2",
    statement: "用定义证明 $f(x)=x^2$ 在 $[0,+\\infty)$ 上单调递增。",
    wrong: "仅取 $x_1=1,x_2=2$ 验证 $f(1)<f(2)$。",
    correct: "任取 $0\\le x_1<x_2$，有 $f(x_2)-f(x_1)=(x_2-x_1)(x_2+x_1)>0$，故递增。",
    reflection: "单调性证明必须从区间内“任意”两点出发。特殊点只能猜结论，不能完成证明。",
    image: "/notes/p22-monotonic-proof.jpg", due: "今天"
  },
  {
    id: "E-005", title: "奇偶函数定义域的对称性", cause: "B", difficulty: 2,
    node: "函数的奇偶性", nodeId: "K03-02-02", source: "第二章 P25 · 例1",
    statement: "判断 $f(x)=\\sqrt{x}$ 的奇偶性。",
    wrong: "计算 $f(-x)\\ne f(x)$，判为非偶函数，却没检查定义域。",
    correct: "定义域 $[0,+\\infty)$ 不关于原点对称，因此函数既非奇函数也非偶函数。",
    reflection: "判断奇偶性的第一步永远是检查定义域是否关于原点对称。",
    image: "/notes/p25-parity.jpg", due: "7 天后"
  },
  {
    id: "E-006", title: "周期与对称轴的转化", cause: "E", difficulty: 4,
    node: "周期性与对称性", nodeId: "K03-02-03", source: "第二章 P27 · 例4",
    statement: "若 $f(x)$ 的图像关于直线 $x=1$ 与 $x=3$ 对称，求其一个周期。",
    wrong: "认为两条对称轴距离 $2$ 就是周期。",
    correct: "两条平行对称轴的距离为 $2$，连续两次轴对称等价于平移距离的两倍，故 $T=4$。",
    reflection: "两条对称轴 $x=a,x=b$ 推出周期 $T=2|b-a|$；先画图再写公式。",
    image: "/notes/p27-period-symmetry.jpg", due: "今天"
  },
  {
    id: "E-007", title: "二次函数最值与定义域", cause: "A", difficulty: 3,
    node: "二次函数", nodeId: "K03-04-02", source: "第二章 P31 · 例5",
    statement: "求 $f(x)=x^2-4x+5$ 在 $[0,3]$ 上的值域。",
    wrong: "只算两端点，得到 $[2,5]$。",
    correct: "$f(x)=(x-2)^2+1$，顶点 $x=2$ 在区间内；最小值 $1$，端点最大值 $5$，值域 $[1,5]$。",
    reflection: "闭区间二次函数最值要比较：两个端点 + 区间内的顶点。",
    image: "/notes/p31-quadratic-graph.jpg", due: "14 天后"
  },
  {
    id: "E-008", title: "指数方程中的同底转化", cause: "C", difficulty: 3,
    node: "指数函数", nodeId: "K03-05-02", source: "第二章 P35 · 例3",
    statement: "解方程 $4^x-5\\cdot2^x+4=0$。",
    wrong: "直接尝试把每项取对数，无法继续。",
    correct: "令 $t=2^x>0$，得 $t^2-5t+4=0$，所以 $t=1$ 或 $4$，即 $x=0$ 或 $2$。",
    reflection: "看到 $a^{2x}$ 与 $a^x$ 共存，优先令 $t=a^x>0$，转成一元二次方程。",
    image: "/notes/p35-exp-equation.jpg", due: "3 天后"
  },
]

export const causeNames = { A: "概念边界", B: "条件遗漏", C: "运算路径", D: "论证不严", E: "模型迁移" }

export const moduleStats = [
  { id: "K01", name: "集合与常用逻辑用语", count: 31, mastery: 84 },
  { id: "K02", name: "一元二次函数与方程", count: 38, mastery: 76 },
  { id: "K03", name: "函数与导数", count: 100, mastery: 62 },
  { id: "K04", name: "三角函数", count: 62, mastery: 71 },
  { id: "K05", name: "平面向量", count: 37, mastery: 88 },
  { id: "K06", name: "数列", count: 42, mastery: 69 },
  { id: "K07", name: "立体几何", count: 50, mastery: 79 },
  { id: "K08", name: "解析几何", count: 55, mastery: 67 },
  { id: "K09", name: "概率与统计", count: 54, mastery: 82 },
]

export const functionNodes = [
  { id: "K03-01", name: "函数的概念与性质", level: 1, mastery: 64, errors: 3 },
  { id: "K03-01-01", name: "函数的定义域", level: 2, mastery: 58, errors: 2 },
  { id: "K03-01-02", name: "函数的解析式与分段函数", level: 2, mastery: 72, errors: 1 },
  { id: "K03-01-03", name: "复合函数", level: 2, mastery: 55, errors: 1 },
  { id: "K03-02", name: "函数的基本性质", level: 1, mastery: 51, errors: 3 },
  { id: "K03-02-01", name: "函数的单调性", level: 2, mastery: 45, errors: 1 },
  { id: "K03-02-02", name: "函数的奇偶性", level: 2, mastery: 64, errors: 1 },
  { id: "K03-02-03", name: "周期性与对称性", level: 2, mastery: 42, errors: 1 },
  { id: "K03-03", name: "幂函数", level: 1, mastery: 76, errors: 0 },
  { id: "K03-04", name: "二次函数", level: 1, mastery: 68, errors: 1 },
  { id: "K03-05", name: "指数函数与对数函数", level: 1, mastery: 73, errors: 1 },
  { id: "K03-05-02", name: "指数方程与不等式", level: 2, mastery: 61, errors: 1 },
  { id: "K03-06", name: "导数及其应用", level: 1, mastery: 80, errors: 0 },
]

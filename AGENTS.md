# MathEx AI Agent 接入与错题上传规范 (AGENTS.md)

本规范为第三方 AI Agent（包含但不限于 ChatGPT, Claude, DeepSeek, 视觉大模型, 本地 Agent, CLI 脚本等）接入 **MathEx 高中数学错题本** 系统的标准协议与 Capability 要求。

无需配置服务器端 AI Gateway 环境变量。只要 Agent 具备本规范声明的核心 Skill，即可通过公开 REST 接口自动将讲义/错题照片结构化解析并录入系统。

---

## 1. Agent 必须具备的技能要求 (Required Agent Skills)

接入本系统的 Agent 必须装备或具备以下两大核心 Skill，以保障题目拆解的严谨性与公式渲染的精准度：

### 🎯 Skill 1: 数学公式 OCR 识别与 LaTeX 规范化能力 (Math OCR & LaTeX Formatting Skill)
1. **精准 OCR**：能够准确识别手写及打印体高中数学试卷、讲义照片中的各种数学符号、矩阵、几何图形特征与代数公式。
2. **标准 LaTeX 语法输出**：
   - 所有的行内数学公式必须统一使用 `$...$` 包裹，行间公式统一使用 `$$...$$` 包裹。
   - **向量表示规范**：必须使用标准的 LaTeX 向量语法 `\vec{AB}` 或 `\overrightarrow{AB}`，**绝对禁止** 输出如 `AB⃗`、`AB\u20d7` 等包含 Unicode 组合符的乱码字符。
   - **运算符规范**：使用标准的 LaTeX 符号，如 `\parallel` (平行)、`\perp` (垂直)、`\ge` (大于等于)、`\le` (小于等于)、`\frac{a}{b}` (分式)、`\sqrt{x}` (根式)、`\in` (属于) 等。
   - **Markdown 兼容**：段落、表格 (`| 向量条件 | 几何结论 |`) 与小标题 (`### ...`) 必须遵循标准 GFM Markdown 格式，不得遗漏分隔符。

### 🧠 Skill 2: 高中数学推理解题与迁移反思能力 (High School Math Reasoning Skill)
1. **全模块领域知识**：覆盖高中数学 11 大核心模块（集合与逻辑、不等式、函数与导数、三角函数、平面向量、数列、立体几何、解析几何、计数原理、概率统计、高等背景拓展）的定理、公式与常考模型。
2. **严谨的四段式拆解**：
   - **`statementMd`（题目描述）**：完整重现题干条件、已知向量/曲线方程与问题。
   - **`wrongMd`（错解分析）**：精准定位学生的逻辑漏洞、盲点或计算笔误（如：未讨论 $a=0$、遗漏等腰梯形腰相等检验、未排除与渐近线平行的交点等）。
   - **`correctMd`（正解路线）**：提供步骤清晰、逻辑严密的标准推导与证明过程（如：向量中线模平方、夹角正切基本不等式、偶函数求导变奇函数等）。
   - **`reflectionMd`（迁移反思）**：提炼可跨题复用的通用解题模板、变式防错清单与切入点直觉。

---

## 2. 错因分类 (Cause Taxonomy A - F)

Agent 必须在分析错题后指定唯一的错因代码 (`causeCode`)：

- **`A` (概念性质不清)**：定义、定理、公式记错或适用条件理解偏差（如偶次根式非负、定义域、渐近线平行限制等）。
- **`B` (运算失误)**：代数变形、移项、通分、符号计算、解方程笔误。
- **`C` (审题条件遗漏)**：漏看已知条件、取值范围、分段点或多选题遗漏。
- **`D` (方法选择不当)**：思路可行但绕远，或未想到更简便的向量基底/同构/数形结合秒杀转化。
- **`E` (分类讨论不全)**：参数、区间、奇偶性或判别式等分类情形有缺失。
- **`F` (表达与书写)**：区间写法、证明步骤、结论表述不规范。

---

## 3. 接口协议 (REST API Specification)

### (1) 查询知识树节点
- **HTTP Method**: `GET`
- **Endpoint**: `/api/agent/nodes`
- **Query Parameters**:
  - `q` (string, optional): 搜索关键词（如 `定义域`、`切线`、`双曲线`）
  - `moduleId` (string, optional): 模块代码 (`K01` ~ `K11`)

**成功响应 (200 OK)**:
```json
{
  "total": 2,
  "nodes": [
    {
      "id": "K03-01-01",
      "name": "函数的概念与定义域",
      "moduleId": "K03"
    },
    {
      "id": "K05-02-01-01",
      "name": "平面向量基本定理与基底",
      "moduleId": "K05"
    }
  ]
}
```

---

### (2) 上传/入库新错题
- **HTTP Method**: `POST`
- **Endpoint**: `/api/agent/upload`
- **Header**: `Content-Type: application/json`

**请求体 JSON 格式**:
```json
{
  "authorName": "GPT-5.6 Sol / 视觉 Agent",
  "title": "向量关系判定等腰梯形标准流程",
  "causeCode": "D",
  "difficulty": 3,
  "nodeId": "K05-02-03-01-01",
  "statementMd": "已知四边形 $ABCD$，给出向量条件 $\\vec{AB} = \\lambda \\vec{DC}$ ($\\lambda \\ne 0, \\lambda \\ne 1$)，且 $|\\vec{AD}| = |\\vec{BC}|$，求判定四边形形状。",
  "wrongMd": "能识别平行，但未能区分平行四边形与梯形的边界，遗漏腰相等的验证。",
  "correctMd": "### 判定等腰梯形标准三步流程\n\n1. **判定平行**：$\\vec{AB} = \\lambda \\vec{DC}$ ($\\lambda \\ne 0, \\lambda \\ne 1$) $\\implies AB \\parallel DC$ 且 $AB \\ne DC$ (梯形)\n2. **判定等腰**：$|\\vec{AD}| = |\\vec{BC}| \\implies$ 两腰相等 (等腰梯形)。",
  "reflectionMd": "几何图形中含有向量比例条件时，按三步流程翻译：平行判定 → 等腰/对角线判定 → 结论总结。",
  "studentId": "std-001"
}
```

**成功响应 (201 Created)**:
```json
{
  "success": true,
  "errorId": "E0014",
  "noteId": "note_12345678",
  "message": "错题已成功通过 Agent 协议上传并写入系统！"
}
```

---

## 4. Python 接入示例代码

```python
import requests

BASE_URL = "http://localhost:3000"

# 1. 检索精准考点代码
resp = requests.get(f"{BASE_URL}/api/agent/nodes", params={"q": "基底"})
nodes = resp.json().get("nodes", [])
node_id = nodes[0]["id"] if nodes else "K05-02-01-01"

# 2. 提交规范化 LaTeX 错题
payload = {
    "authorName": "Python Vision Agent",
    "title": "平行四边形双分线交点向量比例问题",
    "causeCode": "D",
    "difficulty": 3,
    "nodeId": node_id,
    "statementMd": "在平行四边形 $ABCD$ 中，$BM = \\frac{2}{3}BC$，$AN = \\frac{1}{4}AB$，$\\vec{AB} = \\vec{a}$，$\\vec{AD} = \\vec{b}$。求 $\\vec{DN}$ 和 $\\vec{AM}$。",
    "wrongMd": "对于共线定理（三点共线系数和为 1 律）不熟练，在列系数方程时计算繁琐。",
    "correctMd": "利用基底表示：$\\vec{DN} = \\frac{1}{4}\\vec{a} - \\vec{b}$，$\\vec{AM} = \\vec{a} + \\frac{2}{3}\\vec{b}$。设 $\\vec{AO} = k\\vec{AM}$ 联立三点共线系数和为 1 即可求解。",
    "reflectionMd": "平面向量求分比问题首选：**基底法 + 三点共线定理系数和为 1** 模板。",
}

res = requests.post(f"{BASE_URL}/api/agent/upload", json=payload)
print(res.json())
```

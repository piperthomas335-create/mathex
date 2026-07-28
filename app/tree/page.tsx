"use client"

import { useMemo, useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, ChevronDown, ChevronRight, CircleAlert, Filter, Info, Search, Sparkles } from "lucide-react"
import { useStudent } from "@/components/student-context"
import { WorkspaceShell } from "@/components/workspace-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { fullModuleStats, fullTreeData, TreeNode } from "@/lib/full-tree-data"
import { causeNames, ErrorItem } from "@/lib/sample-data"
import { cn, getDaysAgo } from "@/lib/utils"
import { MacReviewDots } from "@/components/mac-review-dots"

export default function TreePage() {
  const { currentStudent, studentErrors } = useStudent()
  const [selectedModuleId, setSelectedModuleId] = useState("K04")
  const [query, setQuery] = useState("")
  const [onlyErrors, setOnlyErrors] = useState(false)
  const [selectedNodeId, setSelectedNodeId] = useState<string>("K04-05-05")

  // Auto-switch default module to the student's first weak module on student change
  useEffect(() => {
    const firstWeakError = studentErrors[0]
    if (firstWeakError) {
      const modId = firstWeakError.nodeId?.slice(0, 3) || "K03"
      if (fullTreeData.some((m) => m.id === modId)) {
        setSelectedModuleId(modId)
        setSelectedNodeId(firstWeakError.nodeId || `${modId}-01-01`)
      }
    }
  }, [currentStudent.id, studentErrors])

  // Expanded nodes map
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    K04: true,
    "K04-05": true,
    K03: true,
    "K03-01": true,
    "K05": true,
    "K05-02": true,
    "K08": true,
    "K08-02": true,
  })

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const currentModule = useMemo(() => {
    return fullTreeData.find((m) => m.id === selectedModuleId) || fullTreeData[0]
  }, [selectedModuleId])

  // Compute dynamic module stats based on active student errors
  const moduleStatsWithStudentData = useMemo(() => {
    return fullModuleStats.map((m) => {
      const modErrors = studentErrors.filter(
        (e) => e.nodeId?.startsWith(m.id) || (e.node && e.node.includes(m.name))
      )

      if (modErrors.length === 0) {
        return { ...m, mastery: 100, errorCount: 0 }
      }

      let scoreSum = 0
      modErrors.forEach((e) => {
        if (e.due === "今天") scoreSum += 30
        else if (e.due === "待计划") scoreSum += 60
        else scoreSum += 85
      })

      const calculatedMastery = Math.max(45, Math.min(95, Math.round(scoreSum / modErrors.length)))
      return {
        ...m,
        mastery: calculatedMastery,
        errorCount: modErrors.length,
      }
    })
  }, [studentErrors])

  const currentStat = useMemo(() => {
    return moduleStatsWithStudentData.find((m) => m.id === selectedModuleId) || moduleStatsWithStudentData[0]
  }, [moduleStatsWithStudentData, selectedModuleId])

  // Dynamically decorate tree nodes with student-specific weak point status
  const dynamicTreeNodes = useMemo(() => {
    function decorateNode(node: TreeNode): TreeNode {
      const matchingErrors = studentErrors.filter((e) => {
        const eNodeId = e.nodeId || ""
        const eNodeName = e.node || ""
        if (eNodeId && (node.id.startsWith(eNodeId) || eNodeId.startsWith(node.id))) return true
        if (eNodeName && (eNodeName.includes(node.name) || node.name.includes(eNodeName))) return true
        return false
      })

      const childNodes = node.children ? node.children.map(decorateNode) : []
      const childHasError = childNodes.some((c) => c.hasError)
      const selfHasError = matchingErrors.length > 0

      return {
        ...node,
        hasError: selfHasError || childHasError,
        children: childNodes.length > 0 ? childNodes : node.children,
      }
    }

    const children = currentModule.children || []
    return children.map(decorateNode)
  }, [currentModule, studentErrors])

  // Filter decorated tree nodes recursively
  const filteredTreeData = useMemo(() => {
    if (!query && !onlyErrors) return dynamicTreeNodes

    function filterNodes(nodes: TreeNode[]): TreeNode[] {
      const result: TreeNode[] = []
      for (const node of nodes) {
        const matchesQuery =
          !query ||
          node.name.toLowerCase().includes(query.toLowerCase()) ||
          node.id.toLowerCase().includes(query.toLowerCase())
        const matchesError = !onlyErrors || Boolean(node.hasError)

        const childMatches = node.children ? filterNodes(node.children) : []

        if ((matchesQuery && matchesError) || childMatches.length > 0) {
          result.push({
            ...node,
            children: childMatches.length > 0 ? childMatches : node.children,
          })
        }
      }
      return result
    }

    return filterNodes(dynamicTreeNodes)
  }, [dynamicTreeNodes, query, onlyErrors])

  // Selected node info lookup
  const selectedNodeInfo = useMemo(() => {
    let found: TreeNode | null = null
    function walk(node: TreeNode) {
      if (node.id === selectedNodeId) {
        found = node
        return
      }
      if (node.children) {
        for (const child of node.children) walk(child)
      }
    }
    dynamicTreeNodes.forEach(walk)
    return (found as unknown as TreeNode) || ({ id: selectedNodeId, name: currentModule.name, hasError: false, children: [] } as TreeNode)
  }, [dynamicTreeNodes, selectedNodeId, currentModule])

  // Robust error matching logic for the selected node
  const linkedErrors = useMemo(() => {
    return studentErrors.filter((e) => {
      const eNodeId = e.nodeId || ""
      const eNodeName = e.node || ""
      const eTitle = e.title || ""

      if (eNodeId && selectedNodeInfo.id && (selectedNodeInfo.id.startsWith(eNodeId) || eNodeId.startsWith(selectedNodeInfo.id))) {
        return true
      }

      if (eNodeName && selectedNodeInfo.name && (eNodeName.includes(selectedNodeInfo.name) || selectedNodeInfo.name.includes(eNodeName))) {
        return true
      }

      const keywords = selectedNodeInfo.name.replace(/\[.*?\]/g, "").split(/[ /,-]/).filter((k) => k.length >= 2)
      for (const kw of keywords) {
        if (eNodeName.includes(kw) || eTitle.includes(kw)) {
          return true
        }
      }

      return false
    })
  }, [studentErrors, selectedNodeInfo])

  // Compute exact calculation basis for node mastery
  const nodeMasteryAnalysis = useMemo(() => {
    if (linkedErrors.length === 0) {
      return {
        score: 100,
        rationale: "该考点无错题记录，掌握度 100%。",
        statusText: "认知良好",
        variant: "outline" as const,
      }
    }

    let mastered = 0
    let fuzzy = 0
    let due = 0

    linkedErrors.forEach((e) => {
      if (e.due === "今天") due++
      else if (e.due === "待计划") fuzzy++
      else mastered++
    })

    const score = Math.round((mastered * 100 + fuzzy * 50 + due * 25) / linkedErrors.length)
    const rationale = `关联 ${linkedErrors.length} 道错题（已掌握 ${mastered} 道，待计划 ${fuzzy} 道，到期 ${due} 道）。掌握度 = (${mastered}×100% + ${fuzzy}×50% + ${due}×25%) / ${linkedErrors.length} = ${score}%`

    return {
      score,
      rationale,
      statusText: score < 60 ? "薄弱考点" : "复习提升",
      variant: score < 60 ? ("destructive" as const) : ("secondary" as const),
    }
  }, [linkedErrors])

  return (
    <WorkspaceShell>
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm font-medium text-primary">
            {currentStudent.name} 同学 · 专属薄弱点地图 (11 模块 · 469 考点)
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold">高考数学知识树</h1>
          <p className="mt-2 text-muted-foreground">
            根据 {currentStudent.name} 的实际错题分布动态生成考点薄弱项。
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_360px]">
          {/* Module Selector Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">11 大模块</CardTitle>
              <CardDescription>按学生错题动态统计</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 max-h-[700px] overflow-y-auto pr-1">
              {moduleStatsWithStudentData.map((m) => {
                const active = m.id === selectedModuleId
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedModuleId(m.id)
                      setExpandedIds((prev) => ({ ...prev, [m.id]: true }))
                    }}
                    className={cn(
                      "rounded-lg p-3 text-left transition-all border",
                      active
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "hover:bg-muted border-transparent"
                    )}
                  >
                    <div className="flex justify-between gap-2 text-sm font-medium">
                      <span className="truncate">{m.name}</span>
                      <span className="font-mono text-xs">{m.mastery}%</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{m.count} 节点 · {m.errorCount} 错题</span>
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-current/20">
                        <div
                          className="h-full bg-current rounded-full"
                          style={{ width: `${m.mastery}%` }}
                        />
                      </div>
                    </div>
                  </button>
                )
              })}
            </CardContent>
          </Card>

          {/* Dynamic Interactive Tree Panel */}
          <Card className="flex flex-col">
            <CardHeader className="border-b">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">{currentModule.id}</Badge>
                    {currentModule.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {currentStat.count} 个考点节点 · {currentStudent.name} 动态掌握度 {currentStat.mastery}%
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={onlyErrors ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => setOnlyErrors(!onlyErrors)}
                  >
                    <Filter className="size-3.5" />
                    {onlyErrors ? "正在筛选薄弱点" : "仅看薄弱点"}
                  </Button>
                </div>
              </div>

              <div className="relative mt-3">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`在 ${currentModule.name} 中搜索考点...`}
                  className="pl-9"
                />
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-4 max-h-[640px] overflow-y-auto">
              {filteredTreeData.length === 0 ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center text-center text-muted-foreground">
                  <p className="text-base font-medium">未找到匹配的知识节点</p>
                  <p className="mt-1 text-xs">请尝试更换搜索词或取消“仅看薄弱点”筛选</p>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {filteredTreeData.map((node) => (
                    <TreeNodeRow
                      key={node.id}
                      node={node}
                      depth={0}
                      selectedId={selectedNodeId}
                      onSelect={(n) => setSelectedNodeId(n.id)}
                      expandedIds={expandedIds}
                      onToggle={toggleExpand}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Node Detail Card */}
          <Card className="h-fit xl:sticky xl:top-6 border-primary/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">{selectedNodeInfo.id}</Badge>
                  {linkedErrors.length > 0 && (
                    <Badge variant="destructive" className="text-[10px]">
                      {linkedErrors.length} 道薄弱错题
                    </Badge>
                  )}
                </div>
                <Badge variant={nodeMasteryAnalysis.variant} className="text-xs">
                  {nodeMasteryAnalysis.statusText}
                </Badge>
              </div>
              <CardTitle className="font-serif text-xl mt-3">{selectedNodeInfo.name}</CardTitle>
              <CardDescription>
                {selectedNodeInfo.children && selectedNodeInfo.children.length > 0
                  ? `包含 ${selectedNodeInfo.children.length} 个子节点`
                  : "具体考点节点"}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-5 text-sm">
              <div className="rounded-lg border bg-muted/40 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-muted-foreground">掌握度估计</span>
                  <span className="font-mono text-lg font-bold text-primary">
                    {nodeMasteryAnalysis.score}%
                  </span>
                </div>
                <Progress value={nodeMasteryAnalysis.score} className="mt-2 h-2" />
                
                <div className="mt-3 flex items-start gap-1.5 text-xs text-muted-foreground leading-relaxed">
                  <Info className="size-3.5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-foreground">计算依据：</span>
                    {nodeMasteryAnalysis.rationale}
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-semibold text-foreground">
                    关联错题项 ({linkedErrors.length})
                  </span>
                </div>

                {linkedErrors.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {linkedErrors.map((e) => (
                      <Link
                        key={e.id}
                        href={`/errors/${e.id}`}
                        className="group flex flex-col gap-2 rounded-lg border bg-card p-3 transition-colors hover:bg-muted hover:border-primary/50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-primary">{e.id}</span>
                            <Badge variant="secondary" className="text-[10px]">
                              {e.cause} · {(causeNames as Record<string, string>)[e.cause] || e.cause}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                              {getDaysAgo(e.createdAt)}
                            </span>
                          </div>
                          <MacReviewDots reviewCount={e.reviewCount ?? 0} showLabel={false} />
                        </div>

                        <p className="font-medium text-xs leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                          {e.title}
                        </p>

                        <p className="line-clamp-1 text-[11px] text-muted-foreground">
                          反思：{e.reflection || e.wrong}
                        </p>

                        <div className="flex items-center justify-end text-[11px] text-primary font-medium mt-1">
                          查看错题详情 <ArrowRight className="ml-1 size-3 transition-transform group-hover:translate-x-1" />
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
                    <CircleAlert className="mx-auto size-5 text-muted-foreground/60 mb-2" />
                    {currentStudent.name} 该考点暂无错题。
                  </div>
                )}
              </div>

              <Button variant="outline" className="w-full">
                <Sparkles className="size-4" />
                生成考点练习题
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </WorkspaceShell>
  )
}

function TreeNodeRow({
  node,
  depth,
  selectedId,
  onSelect,
  expandedIds,
  onToggle,
}: {
  node: TreeNode
  depth: number
  selectedId: string
  onSelect: (node: TreeNode) => void
  expandedIds: Record<string, boolean>
  onToggle: (id: string) => void
}) {
  const hasChildren = node.children && node.children.length > 0
  const isExpanded = Boolean(expandedIds[node.id])
  const isSelected = selectedId === node.id

  return (
    <div className="flex flex-col">
      <div
        className={cn(
          "group flex items-center gap-2 rounded-md py-2 pr-3 text-sm transition-colors cursor-pointer hover:bg-muted/70",
          isSelected && "bg-primary/10 text-primary font-medium"
        )}
        style={{ paddingLeft: `${Math.max(8, depth * 20 + 8)}px` }}
        onClick={() => onSelect(node)}
      >
        {hasChildren ? (
          <button
            type="button"
            className="flex size-5 items-center justify-center rounded hover:bg-background/80"
            onClick={(e) => {
              e.stopPropagation()
              onToggle(node.id)
            }}
          >
            {isExpanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
          </button>
        ) : (
          <span className="size-5 flex items-center justify-center">
            <span
              className={cn(
                "size-2 rounded-full",
                node.hasError ? "bg-destructive" : "bg-primary/50"
              )}
            />
          </span>
        )}

        <span className="font-mono text-xs text-muted-foreground shrink-0">{node.id}</span>
        <span className="min-w-0 flex-1 truncate">{node.name}</span>

        {node.hasError && (
          <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
            薄弱
          </Badge>
        )}
      </div>

      {hasChildren && isExpanded && (
        <div className="flex flex-col">
          {node.children!.map((child) => (
            <TreeNodeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              expandedIds={expandedIds}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}

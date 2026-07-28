import { NextResponse } from "next/server"
import { fullTreeData, getFlattenedNodes, searchTreeNodes } from "@/lib/full-tree-data"

export const dynamic = "force-static"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") || ""
  const moduleId = searchParams.get("moduleId") || ""

  if (query) {
    const matched = searchTreeNodes(query)
    return NextResponse.json({
      total: matched.length,
      query,
      nodes: matched.map((n) => ({
        id: n.id,
        name: n.name,
        hasError: Boolean(n.hasError),
        level: n.level,
      })),
    })
  }

  if (moduleId) {
    const nodes = getFlattenedNodes(moduleId)
    return NextResponse.json({
      total: nodes.length,
      moduleId,
      nodes,
    })
  }

  // If no params, return top 11 module summaries
  return NextResponse.json({
    total: fullTreeData.length,
    modules: fullTreeData.map((m) => ({
      id: m.id,
      name: m.name,
      childCount: m.children?.length || 0,
    })),
  })
}

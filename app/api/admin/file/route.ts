import { get } from "@vercel/blob"
import { NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin-auth"

export async function GET(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "未授权" }, { status: 401 })
  const pathname = new URL(request.url).searchParams.get("pathname")
  if (!pathname || !pathname.startsWith("notes/")) return NextResponse.json({ error: "文件路径无效" }, { status: 400 })
  const result = await get(pathname, { access: "private" })
  if (!result || result.statusCode !== 200) return new NextResponse("Not found", { status: 404 })
  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType,
      ETag: result.blob.etag,
      "Cache-Control": "private, no-cache",
    },
  })
}

import { NextResponse } from "next/server"
import { ADMIN_COOKIE, adminCookieValue, verifyPasscode } from "@/lib/admin-auth"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const passcode = typeof body?.passcode === "string" ? body.passcode : ""
  if (!verifyPasscode(passcode)) {
    return NextResponse.json({ error: "口令不正确" }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_COOKIE, adminCookieValue()!, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 12,
    path: "/",
  })
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, maxAge: 0, path: "/" })
  return response
}

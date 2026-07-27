import { createHash, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"

export const ADMIN_COOKIE = "mathbook_admin"

function digest(value: string) {
  return createHash("sha256").update(value).digest("hex")
}

export function adminCookieValue() {
  const passcode = process.env.ADMIN_PASSCODE
  return passcode ? digest(passcode) : null
}

export function verifyPasscode(candidate: string) {
  const passcode = process.env.ADMIN_PASSCODE
  if (!passcode) return false
  const expected = Buffer.from(digest(passcode))
  const actual = Buffer.from(digest(candidate))
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

export async function isAdmin() {
  const expected = adminCookieValue()
  if (!expected) return false
  const store = await cookies()
  const actual = store.get(ADMIN_COOKIE)?.value
  if (!actual) return false
  const a = Buffer.from(actual)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

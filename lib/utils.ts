import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDaysAgo(createdAtStr?: string): string {
  if (!createdAtStr) return "最近发布"
  const created = new Date(createdAtStr)
  if (isNaN(created.getTime())) return "最近发布"

  // Base reference date 2026-07-28
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - created.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "今天发布"
  return `已发布 ${diffDays} 天`
}

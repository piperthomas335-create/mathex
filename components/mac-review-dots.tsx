"use client"

import React from "react"
import { cn } from "@/lib/utils"

export function MacReviewDots({
  reviewCount = 0,
  className,
  showLabel = true,
}: {
  reviewCount?: number
  className?: string
  showLabel?: boolean
}) {
  // Count: 0 = none, 1 = red lit, 2 = red+yellow lit, 3+ = red+yellow+blue lit
  const count = Math.max(0, reviewCount)

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <div className="flex items-center gap-1.5" title={`已完成 ${count} 次阶梯复习`}>
        {/* Red Dot (1st review) */}
        <span
          className={cn(
            "size-2.5 rounded-full transition-all border border-black/10 shadow-xs",
            count >= 1
              ? "bg-red-500 shadow-red-500/50 scale-105 ring-2 ring-red-500/20"
              : "bg-muted-foreground/20 border-transparent"
          )}
        />
        {/* Yellow Dot (2nd review) */}
        <span
          className={cn(
            "size-2.5 rounded-full transition-all border border-black/10 shadow-xs",
            count >= 2
              ? "bg-amber-400 shadow-amber-400/50 scale-105 ring-2 ring-amber-400/20"
              : "bg-muted-foreground/20 border-transparent"
          )}
        />
        {/* Blue/Green Dot (3rd+ review) */}
        <span
          className={cn(
            "size-2.5 rounded-full transition-all border border-black/10 shadow-xs",
            count >= 3
              ? "bg-blue-500 shadow-blue-500/50 scale-105 ring-2 ring-blue-500/20"
              : "bg-muted-foreground/20 border-transparent"
          )}
        />
      </div>

      {showLabel && (
        <span className="font-mono text-[11px] text-muted-foreground">
          {count === 0
            ? "未复习"
            : count === 1
            ? "复习1次"
            : count === 2
            ? "复习2次"
            : `复习${count}次`}
        </span>
      )}
    </div>
  )
}

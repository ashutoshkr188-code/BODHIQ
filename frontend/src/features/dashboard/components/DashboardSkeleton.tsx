"use client";

import { motion } from "framer-motion";

export function DashboardSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {/* Header row */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 rounded-lg bg-white/[0.04] animate-pulse" />
        ))}
      </div>
      {/* Data rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              className="h-10 rounded-xl bg-white/[0.03] animate-pulse"
              style={{ animationDelay: `${(r * cols + c) * 50}ms` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse">
      <div className="h-3 w-20 rounded bg-white/[0.06] mb-4" />
      <div className="h-8 w-28 rounded bg-white/[0.06]" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl bg-white/[0.02] border border-white/5 p-6 space-y-4 animate-pulse"
    >
      <div className="h-4 w-32 rounded bg-white/[0.06]" />
      <div className="h-3 w-full rounded bg-white/[0.04]" />
      <div className="h-3 w-3/4 rounded bg-white/[0.04]" />
      <div className="h-10 w-full rounded-xl bg-white/[0.04] mt-4" />
    </motion.div>
  );
}

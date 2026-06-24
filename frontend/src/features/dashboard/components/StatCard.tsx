"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { ReactNode, useEffect, useRef } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  delay?: number;
  trend?: string;
  trendUp?: boolean;
}

function AnimatedNumber({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.5, ease: "easeOut" });
    return controls.stop;
  }, [count, value]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export function StatCard({ title, value, icon, delay = 0, trend, trendUp }: StatCardProps) {
  const numericValue = typeof value === "string" ? parseFloat(value.replace(/[^0-9.-]/g, "")) : value;
  const prefix = typeof value === "string" && value.startsWith("$") ? "$" : typeof value === "string" && value.startsWith("₹") ? "₹" : "";
  const isNumeric = !isNaN(numericValue);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
      className="relative p-6 rounded-2xl overflow-hidden group cursor-default"
      style={{
        background: "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 0%, rgba(212,168,83,0.06) 0%, transparent 70%)" }}
      />

      {/* Icon */}
      <div className="absolute -top-2 -right-2 p-6 text-[#d4a853]/[0.07] group-hover:text-[#d4a853]/[0.15] transition-all duration-500 group-hover:scale-110">
        {icon}
      </div>

      {/* Content */}
      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-3 font-medium">{title}</p>
      <p className="text-3xl font-serif text-white">
        {isNumeric ? (
          <>
            {prefix}
            <AnimatedNumber value={numericValue} />
          </>
        ) : (
          value
        )}
      </p>

      {/* Trend */}
      {trend && (
        <div className={`mt-3 flex items-center gap-1.5 text-[11px] font-medium ${trendUp ? "text-emerald-400" : "text-rose-400"}`}>
          <span>{trendUp ? "↑" : "↓"}</span>
          <span>{trend}</span>
        </div>
      )}

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a853]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}

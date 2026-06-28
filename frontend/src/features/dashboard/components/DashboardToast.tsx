"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, X, Info } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

const icons = {
  success: CheckCircle,
  error: AlertTriangle,
  info: Info,
};

const colors = {
  success: { bg: "rgba(22, 101, 52, 0.9)", border: "rgba(34, 197, 94, 0.3)", icon: "#4ade80" },
  error:   { bg: "rgba(127, 29, 29, 0.9)", border: "rgba(239, 68, 68, 0.3)", icon: "#f87171" },
  info:    { bg: "rgba(30, 58, 138, 0.9)", border: "rgba(59, 130, 246, 0.3)", icon: "#60a5fa" },
};

export function DashboardToast({ message, type = "success", visible, onClose, duration = 4000 }: ToastProps) {
  const Icon = icons[type];
  const color = colors[type];

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose, duration]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed bottom-8 right-8 z-[100] max-w-sm"
        >
          <div
            className="flex items-center gap-3 px-5 py-4 rounded-2xl backdrop-blur-xl shadow-2xl shadow-black/40"
            style={{ background: color.bg, border: `1px solid ${color.border}` }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: `${color.icon}15` }}
            >
              <Icon size={16} style={{ color: color.icon }} />
            </div>
            <p className="text-sm text-white font-medium flex-1">{message}</p>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white/80 transition shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for easy toast management
export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType; visible: boolean }>({
    message: "",
    type: "success",
    visible: false,
  });

  const show = useCallback((message: string, type: ToastType = "success") => {
    setToast({ message, type, visible: true });
  }, []);

  const hide = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  return { toast, show, hide };
}

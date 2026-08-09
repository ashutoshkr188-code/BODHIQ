"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AdminSidebar } from "@/features/dashboard/components/AdminSidebar";
import { Sparkles } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.replace("/");
      return;
    }

    const role = user.publicMetadata?.role as string | undefined;
    if (role === "admin") {
      setAuthorized(true);
    } else {
      router.replace("/");
    }
  }, [user, isLoaded, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d4a853] to-[#b08d3e] flex items-center justify-center">
            <Sparkles size={20} className="text-black animate-pulse" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-[#d4a853]/30 border-t-[#d4a853] rounded-full animate-spin" />
            <p className="text-xs text-gray-600 uppercase tracking-[0.2em]">Loading</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-rose-500/[0.08] flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h1 className="text-xl font-serif text-white mb-2">Access Denied</h1>
          <p className="text-sm text-gray-500">You do not have admin privileges.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}


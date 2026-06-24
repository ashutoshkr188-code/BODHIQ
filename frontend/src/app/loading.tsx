"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center space-y-6"
      >
        <div className="relative w-16 h-16">
          <motion.div
            className="absolute inset-0 rounded-full border border-[#d4a853]/20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border border-[#d4a853]/50"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2,
            }}
          />
          <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#d4a853] to-[#e8c97a] shadow-[0_0_15px_rgba(212,168,83,0.3)] flex items-center justify-center">
            {/* Inner dot */}
            <div className="w-2 h-2 rounded-full bg-black/50" />
          </div>
        </div>
        
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#d4a853]/80 animate-pulse">
          Loading
        </p>
      </motion.div>
    </main>
  );
}

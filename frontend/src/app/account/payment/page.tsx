"use client";

import { motion } from "framer-motion";
import { CreditCard, Plus, Shield } from "lucide-react";
import Link from "next/link";

export default function PaymentPage() {
  return (
    <main className="min-h-screen bg-black text-white pt-32 px-6 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <Link
            href="/account"
            className="text-xs uppercase tracking-[0.3em] text-gray-500 hover:text-[#d4a853] transition-colors mb-6 inline-block"
          >
            ← Account
          </Link>
          <p className="text-xs uppercase tracking-[0.35em] text-[#d4a853] mb-3">
            Payments
          </p>
          <h1 className="text-3xl md:text-5xl font-serif">Payment Methods</h1>
          <p className="text-gray-400 mt-3 max-w-xl">
            Manage your saved payment methods for a faster checkout experience.
          </p>
        </motion.div>

        {/* Empty State */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="glass-card rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#d4a853]/3 via-transparent to-transparent" />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl border border-[#d4a853]/15 bg-[#d4a853]/5 flex items-center justify-center text-[#d4a853] mx-auto mb-6">
                <CreditCard size={28} />
              </div>

              <h2 className="text-2xl font-serif mb-3">
                No Payment Methods Saved
              </h2>
              <p className="text-gray-500 text-sm leading-7 max-w-md mx-auto mb-8">
                Your payment details are securely handled by Razorpay during
                checkout. You can add a new payment method at the time of purchase.
              </p>

              <Link
                href="/collection"
                className="inline-block px-8 py-3 border border-[#d4a853] text-[#d4a853] rounded-full text-xs uppercase tracking-widest hover:bg-[#d4a853] hover:text-black transition duration-300"
              >
                Browse Collection
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12 grid sm:grid-cols-3 gap-4"
        >
          {[
            { icon: Shield, text: "PCI-DSS Level 1 Compliant" },
            { icon: CreditCard, text: "All Major Cards Accepted" },
            { icon: Shield, text: "256-bit SSL Encryption" },
          ].map((badge, i) => {
            const Icon = badge.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.02]"
              >
                <Icon size={16} className="text-[#d4a853]/60 shrink-0" />
                <span className="text-xs text-gray-500">{badge.text}</span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </main>
  );
}

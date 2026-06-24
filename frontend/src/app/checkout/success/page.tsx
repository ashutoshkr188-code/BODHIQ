"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("orderId");

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        {/* Animated Checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-20 h-20 rounded-full border-2 border-green-500/30 bg-green-500/10 flex items-center justify-center text-green-400 mx-auto mb-8"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <CheckCircle size={36} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <p className="text-xs uppercase tracking-[0.4em] text-[#d4a853] mb-4">
            Payment Successful
          </p>

          <h1 className="text-3xl md:text-5xl font-serif mb-4">
            Order Confirmed
          </h1>

          <p className="text-gray-400 text-sm leading-7 mb-3">
            Thank you for your purchase. Your BODHIQ timepiece is being prepared
            with the care and precision it deserves.
          </p>

          {orderId && (
            <p className="text-xs text-gray-600 font-mono mb-8">
              Order ID: {orderId}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <button
            onClick={() => router.push(orderId ? `/account/orders/${orderId}` : "/account/orders")}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#d4a853] text-black rounded-full text-xs uppercase tracking-widest font-medium hover:bg-[#e8c97a] transition duration-300 flex items-center justify-center gap-2"
          >
            <Package size={14} />
            {orderId ? "View Invoice & Order" : "View Your Orders"}
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full sm:w-auto px-8 py-3.5 border border-white/10 text-gray-400 rounded-full text-xs uppercase tracking-widest hover:border-white/20 hover:text-white transition duration-300 flex items-center justify-center gap-2"
          >
            Continue Shopping
            <ArrowRight size={14} />
          </button>
        </motion.div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black text-white flex items-center justify-center">
          <p className="text-gray-400 animate-pulse">
            Processing your order...
          </p>
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
"use client";

import PageHeader from "@/components/ui/PageHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Truck, CheckCircle, Search } from "lucide-react";
import Link from "next/link";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      setSearched(true);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <PageHeader
        eyebrow="Orders"
        title="Track Your Order"
        subtitle="Enter your order number to check the current status of your BODHIQ shipment."
      />

      <section className="px-6 pb-24">
        <div className="max-w-xl mx-auto">
          {/* Search Form */}
          <AnimatedSection>
            <form onSubmit={handleSearch} className="mb-12">
              <div className="relative">
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => {
                    setOrderNumber(e.target.value);
                    setSearched(false);
                  }}
                  placeholder="Enter your order number"
                  className="w-full bg-transparent border border-white/10 rounded-full px-6 py-4 pr-14 text-sm outline-none focus:border-[#d4a853]/40 transition placeholder:text-gray-600"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#d4a853] text-black hover:bg-[#e8c97a] transition-colors"
                  aria-label="Search order"
                >
                  <Search size={16} />
                </button>
              </div>
            </form>
          </AnimatedSection>

          {/* Result */}
          {searched && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="glass-card rounded-2xl p-8 text-center mb-10">
                <div className="w-12 h-12 rounded-full border border-[#d4a853]/20 flex items-center justify-center text-[#d4a853] mx-auto mb-4">
                  <Package size={20} />
                </div>
                <p className="text-gray-400 text-sm mb-2">
                  Order #{orderNumber}
                </p>
                <p className="text-white font-serif text-lg">
                  No order found with this number.
                </p>
                <p className="text-gray-500 text-sm mt-3">
                  Please check the number and try again, or sign in to view your
                  orders.
                </p>
                <Link
                  href="/account/orders"
                  className="inline-block mt-6 px-6 py-2.5 border border-[#d4a853] text-[#d4a853] rounded-full text-xs uppercase tracking-widest hover:bg-[#d4a853] hover:text-black transition duration-300"
                >
                  View My Orders
                </Link>
              </div>
            </motion.div>
          )}

          {/* How It Works */}
          {!searched && (
            <AnimatedSection delay={0.2}>
              <div className="space-y-6">
                <p className="text-xs uppercase tracking-[0.35em] text-[#d4a853] text-center mb-8">
                  Order Journey
                </p>
                {[
                  {
                    icon: Package,
                    title: "Order Confirmed",
                    desc: "Your order is confirmed and being processed",
                  },
                  {
                    icon: Truck,
                    title: "Shipped",
                    desc: "Your package is on its way to you",
                  },
                  {
                    icon: CheckCircle,
                    title: "Delivered",
                    desc: "Your BODHIQ timepiece has arrived",
                  },
                ].map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.title}
                      className="flex items-start gap-4 py-4 border-b border-white/5 last:border-0"
                    >
                      <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-500 shrink-0">
                        <Icon size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">{step.title}</h3>
                        <p className="text-gray-500 text-xs mt-1">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>
    </main>
  );
}

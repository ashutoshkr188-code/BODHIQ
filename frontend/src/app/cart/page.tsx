"use client";

import Image from "next/image";
import { useCartStore } from "@/hooks/cartStore";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, Shield, Truck, RotateCcw } from "lucide-react";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const totalPrice = useCartStore((state) => state.getTotalPrice());
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <main className="min-h-screen bg-black text-white pt-32 px-6 pb-32">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-[#d4a853] mb-3">
            Shopping
          </p>
          <h1 className="text-3xl md:text-5xl font-serif">Your Cart</h1>
          {items.length > 0 && (
            <p className="text-gray-500 text-sm mt-2">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          )}
        </motion.div>

        {items.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card rounded-3xl p-10 md:p-14 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#d4a853]/3 via-transparent to-transparent" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl border border-[#d4a853]/15 bg-[#d4a853]/5 flex items-center justify-center text-[#d4a853] mx-auto mb-6">
                <ShoppingBag size={28} />
              </div>
              <h2 className="text-2xl font-serif mb-3">
                Your Cart is Empty
              </h2>
              <p className="text-gray-500 text-sm leading-7 max-w-md mx-auto mb-8">
                Discover our collection of handcrafted timepieces — each one
                waiting to become part of your story.
              </p>
              <Link
                href="/collection"
                className="inline-block px-8 py-3 border border-[#d4a853] text-[#d4a853] rounded-full text-xs uppercase tracking-widest hover:bg-[#d4a853] hover:text-black transition duration-300"
              >
                Explore Collection
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="popLayout">
                {items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="group flex items-center gap-4 md:gap-5 p-4 md:p-5 mb-3 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                  >
                    {/* Image */}
                    <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border border-white/5 shrink-0 bg-white/[0.02]">
                      <Image
                        src={item.image || "/placeholder.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-[15px] font-medium truncate">
                        {item.name}
                      </h2>
                      <p className="text-[#d4a853] text-sm mt-1">
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-0 mt-3">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-8 h-8 rounded-l-lg border border-white/10 bg-white/[0.03] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.06] transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <div className="w-10 h-8 border-y border-white/10 bg-white/[0.02] flex items-center justify-center text-xs text-white">
                          {item.quantity}
                        </div>
                        <button
                          onClick={() =>
                            addItem({
                              id: item.id,
                              name: item.name,
                              price: item.price,
                              image: item.image,
                              slug: item.slug,
                            })
                          }
                          className="w-8 h-8 rounded-r-lg border border-white/10 bg-white/[0.03] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.06] transition"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Subtotal + Remove */}
                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium text-white">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                      <button
                        onClick={() => {
                          for (let q = 0; q < item.quantity; q++) {
                            removeItem(item.id);
                          }
                        }}
                        className="text-gray-600 hover:text-red-400 transition-colors mt-2 p-1 opacity-0 group-hover:opacity-100"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary - Sticky */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <h3 className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-6">
                    Order Summary
                  </h3>

                  <div className="space-y-3 text-sm mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="text-gray-300">
                        ₹{totalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Shipping</span>
                      <span className="text-green-400/80 text-xs">Free</span>
                    </div>
                    <div className="border-t border-white/5 pt-3 flex justify-between">
                      <span className="text-white font-medium">Total</span>
                      <span className="text-white font-medium text-lg">
                        ₹{totalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <Link href="/checkout/address" className="block">
                    <button className="w-full py-3.5 bg-[#d4a853] text-black rounded-full text-xs uppercase tracking-widest font-medium hover:bg-[#e8c97a] transition duration-300">
                      Proceed to Checkout
                    </button>
                  </Link>

                  <Link
                    href="/collection"
                    className="block text-center text-xs text-gray-500 hover:text-[#d4a853] mt-4 transition-colors"
                  >
                    Continue Shopping →
                  </Link>
                </motion.div>

                {/* Trust Signals */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="mt-4 space-y-2"
                >
                  {[
                    { icon: Shield, text: "Secure Checkout via Razorpay" },
                    { icon: Truck, text: "Free Shipping on All Orders" },
                    { icon: RotateCcw, text: "7-Day Easy Returns" },
                  ].map((trust, i) => {
                    const Icon = trust.icon;
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.03] bg-white/[0.01]"
                      >
                        <Icon
                          size={14}
                          className="text-[#d4a853]/40 shrink-0"
                        />
                        <span className="text-[11px] text-gray-600">
                          {trust.text}
                        </span>
                      </div>
                    );
                  })}
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

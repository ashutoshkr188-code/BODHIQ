"use client";

import { motion } from "framer-motion";
import { MapPin, Trash2 } from "lucide-react";
import AddressForm from "@/features/users/components/AddressForm";
import { useAddressStore } from "@/hooks/addressStore";
import Link from "next/link";

export default function AddressPageClient() {
  const addresses = useAddressStore((state) => state.addresses);
  const removeAddress = useAddressStore((state) => state.removeAddress);

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
            Addresses
          </p>
          <h1 className="text-3xl md:text-5xl font-serif">
            Shipping Addresses
          </h1>
          <p className="text-gray-400 mt-3">
            Add and manage your saved shipping addresses.
          </p>
        </motion.div>

        {addresses.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="grid md:grid-cols-2 gap-4 mb-12"
          >
            {addresses.map((address, i) => (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="group glass-card rounded-2xl p-6 relative overflow-hidden hover:border-[#d4a853]/20 transition-colors duration-500"
              >
                {/* Default badge glow */}
                {address.isDefault && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#d4a853]/5 rounded-full blur-[30px]" />
                )}

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-[#d4a853]/50" />
                      <h2 className="text-[15px] font-medium">
                        {address.fullName}
                      </h2>
                    </div>

                    <div className="flex items-center gap-3">
                      {address.isDefault && (
                        <span className="text-[9px] uppercase tracking-[0.25em] text-[#d4a853] px-2 py-0.5 rounded-full border border-[#d4a853]/20 bg-[#d4a853]/5">
                          Default
                        </span>
                      )}

                      <button
                        onClick={() => removeAddress(address.id)}
                        className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/5 transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Remove address"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm leading-7">
                    {address.street}
                    <br />
                    {address.city}, {address.state}
                    <br />
                    {address.postalCode}, {address.country}
                  </p>

                  <p className="text-gray-600 text-xs mt-3">{address.phone}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card rounded-3xl p-10 text-center mb-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#d4a853]/3 via-transparent to-transparent" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl border border-[#d4a853]/15 bg-[#d4a853]/5 flex items-center justify-center text-[#d4a853] mx-auto mb-5">
                <MapPin size={24} />
              </div>
              <h2 className="text-xl font-serif mb-2">No Addresses Saved</h2>
              <p className="text-gray-500 text-sm">
                Add your first shipping address below to get started.
              </p>
            </div>
          </motion.div>
        )}

        <AddressForm />
      </div>
    </main>
  );
}

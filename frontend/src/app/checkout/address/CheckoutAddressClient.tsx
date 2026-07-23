"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAddressStore } from "@/hooks/addressStore";
import { MapPin, Check, Shield, Truck, RotateCcw } from "lucide-react";

const steps = [
  { number: 1, label: "Address", active: true },
  { number: 2, label: "Payment", active: false },
  { number: 3, label: "Confirmation", active: false },
];

export default function CheckoutAddressClient() {
  const router = useRouter();

  const addresses = useAddressStore((state) => state.addresses);
  const selectedAddressId = useAddressStore(
    (state) => state.selectedAddressId
  );
  const setSelectedAddress = useAddressStore(
    (state) => state.setSelectedAddress
  );

  const effectiveSelectedAddressId =
    selectedAddressId ||
    addresses.find((address) => address.isDefault)?.id ||
    addresses[0]?.id ||
    null;

  const selectedAddress =
    addresses.find((a) => a.id === effectiveSelectedAddressId) || null;

  const handleContinueToPayment = () => {
    if (!selectedAddress) {
      alert("Please select an address first");
      return;
    }

    console.log("Selected Address:", selectedAddress);

    // 👉 move to payment page
    router.push("/checkout/payment");
  };

  return (
    <main className="min-h-screen bg-black text-white pt-32 px-6 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-0 mb-12"
        >
          {steps.map((step, i) => (
            <div key={step.number} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border transition-all ${
                    step.active
                      ? "bg-[#d4a853] border-[#d4a853] text-black"
                      : "border-white/10 text-gray-600"
                  }`}
                >
                  {step.number}
                </div>
                <span
                  className={`text-xs uppercase tracking-[0.15em] ${
                    step.active ? "text-[#d4a853]" : "text-gray-600"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-10 md:w-16 h-px bg-white/5 mx-3" />
              )}
            </div>
          ))}
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-10"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-[#d4a853] mb-3">
            Step 1 of 3
          </p>
          <h1 className="text-3xl md:text-4xl font-serif">
            Select Shipping Address
          </h1>
          <p className="text-gray-500 text-sm mt-3">
            Choose where you&apos;d like your BODHIQ timepiece delivered.
          </p>
        </motion.div>

        {addresses.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 gap-4 mb-10">
              {addresses.map((address, i) => {
                const isSelected = effectiveSelectedAddressId === address.id;

                return (
                  <motion.button
                    key={address.id}
                    type="button"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.06 }}
                    onClick={() => setSelectedAddress(address.id)}
                    className={`text-left rounded-2xl border p-5 transition-all duration-300 relative overflow-hidden ${
                      isSelected
                        ? "border-[#d4a853]/40 bg-[#d4a853]/[0.03]"
                        : "border-white/5 bg-white/[0.02] hover:border-[#d4a853]/15"
                    }`}
                  >
                    {/* Selected Indicator */}
                    {isSelected && (
                      <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#d4a853] flex items-center justify-center">
                        <Check size={14} className="text-black" />
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-3">
                      <MapPin
                        size={14}
                        className={
                          isSelected
                            ? "text-[#d4a853]"
                            : "text-gray-600"
                        }
                      />
                      <h2 className="text-[15px] font-medium text-white">
                        {address.fullName}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      {address.isDefault && (
                        <span className="text-[9px] uppercase tracking-[0.25em] text-[#d4a853] px-2 py-0.5 rounded-full border border-[#d4a853]/20 bg-[#d4a853]/5">
                          Default
                        </span>
                      )}
                    </div>

                    <p className="text-gray-400 text-sm leading-7">
                      {address.street}
                      <br />
                      {address.city}, {address.state}
                      <br />
                      {address.postalCode}, {address.country}
                      <br />
                      <span className="text-gray-600">{address.phone}</span>
                    </p>
                  </motion.button>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <Link
                href="/account/address"
                className="text-xs text-gray-500 hover:text-[#d4a853] transition-colors"
              >
                + Add a new address
              </Link>
              <button
                type="button"
                onClick={handleContinueToPayment}
                className="px-8 py-3.5 bg-[#d4a853] text-black rounded-full text-xs uppercase tracking-widest font-medium hover:bg-[#e8c97a] transition duration-300"
              >
                Continue to Payment →
              </button>
            </motion.div>

            {/* Trust Signals */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-6 mt-12 pt-8 border-t border-white/5"
            >
              {[
                { icon: Shield, text: "Secure Checkout" },
                { icon: Truck, text: "Free Shipping" },
                { icon: RotateCcw, text: "7-Day Returns" },
              ].map((trust, i) => {
                const Icon = trust.icon;
                return (
                  <div key={i} className="flex items-center gap-2">
                    <Icon size={14} className="text-[#d4a853]/40" />
                    <span className="text-[11px] text-gray-600">
                      {trust.text}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card rounded-3xl p-10 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#d4a853]/3 via-transparent to-transparent" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl border border-[#d4a853]/15 bg-[#d4a853]/5 flex items-center justify-center text-[#d4a853] mx-auto mb-5">
                <MapPin size={24} />
              </div>
              <h2 className="text-xl font-serif mb-2">No Addresses Found</h2>
              <p className="text-gray-500 text-sm mb-6">
                Add a shipping address to continue with checkout.
              </p>
              <Link
                href="/account/address"
                className="inline-block px-6 py-3 border border-[#d4a853] text-[#d4a853] rounded-full text-xs uppercase tracking-widest hover:bg-[#d4a853] hover:text-black transition duration-300"
              >
                Add Address
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}

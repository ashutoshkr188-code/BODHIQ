"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useUser } from "@clerk/nextjs";
import { useCartStore, CartItem } from "@/hooks/cartStore";
import { useAddressStore } from "@/hooks/addressStore";
import { createRazorpayOrder, verifyRazorpayOrder } from "@/features/checkout/api";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

export default function RazorpayButton() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const addresses = useAddressStore((state) => state.addresses);
  const selectedAddressId = useAddressStore((state) => state.selectedAddressId);

  const selectedAddress =
    addresses.find((address) => address.id === selectedAddressId) ||
    addresses.find((address) => address.isDefault) ||
    addresses[0] ||
    null;

  const formattedCartItems = items.map((item: CartItem) => ({
    product_id: item.id,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
  }));

  const totalAmount = items.reduce(
    (total: number, item: CartItem) => total + item.price * item.quantity,
    0
  );

  const handlePayment = async () => {
    if (!user) {
      alert("Please sign in first");
      return;
    }

    if (!selectedAddress) {
      alert("Please select an address first");
      return;
    }

    if (!items.length) {
      alert("Your cart is empty");
      return;
    }

    setLoading(true);
    setError(null);

    if (!isRazorpayLoaded || !window.Razorpay) {
      setError("Payment service failed to load. Please try again or refresh.");
      setLoading(false);
      return;
    }

    const data = await createRazorpayOrder(formattedCartItems);

    if (!data.success) {
      setError("Failed to create order. Please try again.");
      setLoading(false);
      return;
    }

    const order = data.order;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "BODHIQ",
      description: "Luxury Timepiece Purchase",
      order_id: order.id,

      handler: async function (response: Record<string, string>) {
        const verifyData = await verifyRazorpayOrder({
          ...response,
          amount: order.amount / 100,
          currency: order.currency,
          clerkUserId: user.id,
          customerName:
            selectedAddress.fullName || user.fullName || "Guest User",
          customerEmail:
            user.primaryEmailAddress?.emailAddress || "noemail@example.com",
          cartItems: formattedCartItems,
          shippingAddress: {
            fullName: selectedAddress.fullName,
            street: selectedAddress.street,
            city: selectedAddress.city,
            state: selectedAddress.state,
            postalCode: selectedAddress.postalCode,
            country: selectedAddress.country,
            phone: selectedAddress.phone,
          },
        });

        if (verifyData.success) {
          clearCart();
          router.push(`/checkout/success?orderId=${verifyData.orderId}`);
        } else {
          setError("Payment verification failed. Please contact support.");
          setLoading(false);
        }
      },

      modal: {
        ondismiss: function () {
          setLoading(false);
        },
      },

      theme: {
        color: "#d4a853",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="space-y-4">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onReady={() => setIsRazorpayLoaded(true)}
      />
      <button
        onClick={handlePayment}
        disabled={loading}
        className="relative w-full sm:w-auto px-10 py-4 bg-[#d4a853] text-black rounded-full text-xs uppercase tracking-widest font-medium hover:bg-[#e8c97a] transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2"
            >
              <Loader2 size={16} className="animate-spin" />
              Processing...
            </motion.span>
          ) : (
            <motion.span
              key="ready"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Pay ₹{totalAmount.toLocaleString("en-IN")} Securely
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-start gap-3 p-4 rounded-xl border border-red-500/15 bg-red-500/5"
          >
            <span className="text-red-400 text-sm">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import Image from "next/image";
import { notifyMe } from "@/features/products/api";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useCartStore } from "@/hooks/cartStore";
import { useRouter } from "next/navigation";
import { Shield, Truck, RotateCcw, CheckCircle } from "lucide-react";
import { resolveMediaUrl } from "@/lib/apiClient";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock?: number;
  inStock?: boolean;
  allowNotify?: boolean;
  slug: string;
  caseSize?: string | null;
  dialColor?: string | null;
  strapMaterial?: string | null;
  caseMaterial?: string | null;
  movement?: string | null;
  waterResistance?: string | null;
  glassType?: string | null;
  category?: string | null;
  mainImage?: string | null;
  images?: string[] | null;
  productVideo?: string | null;
};

function FeatureRow({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  if (!value) return null;

  return (
    <div className="flex items-center justify-between border-b border-white/10 py-3">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm text-white">{value}</span>
    </div>
  );
}

export default function ProductPageClient({ product }: { product: Product }) {
  const [showFeatures, setShowFeatures] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadingNotify, setLoadingNotify] = useState(false);
  const [notifySuccess, setNotifySuccess] = useState(false);
  const [notifyError, setNotifyError] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const router = useRouter();

  const isShunya = product.name.toLowerCase().includes("shunya");

  const { user, isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const addItem = useCartStore((state) => state.addItem);

  const mediaItems = useMemo(() => {
    const items: { type: "image" | "video"; url: string }[] = [];

    if (product.mainImage) {
      items.push({ type: "image", url: product.mainImage });
    }

    product.images?.forEach((url) => {
      if (url) {
        items.push({ type: "image", url });
      }
    });

    if (product.productVideo) {
      items.push({ type: "video", url: product.productVideo });
    }

    return items;
  }, [product]);

  const activeMedia = mediaItems[activeIndex];

  const handleNotifyMe = async () => {
    setNotifyError("");
    setNotifySuccess(false);

    if (!isSignedIn || !user) {
      openSignIn({
        fallbackRedirectUrl: `/product/${product.slug}`,
        forceRedirectUrl: `/product/${product.slug}`,
      });
      return;
    }

    const email = user.primaryEmailAddress?.emailAddress;

    if (!email) {
      setNotifyError("No email found in your account.");
      return;
    }

    try {
      setLoadingNotify(true);

      const data = await notifyMe(email, product.id);

      if (!data.success) {
        throw new Error(data?.error || "Something went wrong.");
      }

      setNotifySuccess(true);
    } catch (error) {
      setNotifyError(
        error instanceof Error ? error.message : "Failed to save notification request."
      );
    } finally {
      setLoadingNotify(false);
    }
  };

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.mainImage || undefined,
      slug: product.slug,
    });
    setToastMessage("Added to your cart");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  return (
    <main className="min-h-screen bg-black text-white pt-32 px-6 pb-20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative w-full h-140 rounded-3xl overflow-hidden border border-[#d4a853]/15 bg-[#0b0b0b]">
            {activeMedia?.type === "video" ? (
              <video
                src={resolveMediaUrl(activeMedia.url)}
                controls
                playsInline
                className="h-full w-full object-cover"
              />
            ) : activeMedia?.url ? (
              <Image
                src={resolveMediaUrl(activeMedia.url)}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : null}
          </div>

          {mediaItems.length > 1 && (
            <div className="mt-5 flex gap-4 overflow-x-auto no-scrollbar scroll-smooth">
              {mediaItems.map((item, index) => (
                <button
                  key={`${item.type}-${index}`}
                  onClick={() => setActiveIndex(index)}
                  className={`relative h-28 min-w-24 overflow-hidden rounded-2xl border transition ${
                    activeIndex === index
                      ? "border-[#d4a853]"
                      : "border-white/10"
                  }`}
                >
                  {item.type === "video" ? (
                    <div className="relative h-full w-full bg-black">
                      <video
                        src={resolveMediaUrl(item.url)}
                        muted
                        playsInline
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white text-xs uppercase tracking-[0.2em]">
                        Video
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={resolveMediaUrl(item.url)}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:sticky lg:top-28"
        >
          {/* Launch Edition Badge - conditionally rendered */}
          {isShunya ? (
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="inline-block px-4 py-1.5 rounded-full border border-[#d4a853]/30 bg-[#d4a853]/5 text-[10px] uppercase tracking-[0.25em] text-[#d4a853]">
                Launch Edition
              </span>
              <span className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.02] text-[10px] uppercase tracking-[0.25em] text-gray-400">
                Limited First Drop
              </span>
            </div>
          ) : (
            <div className="mb-5">
              <span className="inline-block px-4 py-1.5 rounded-full border border-[#d4a853]/30 bg-[#d4a853]/5 text-[10px] uppercase tracking-[0.25em] text-[#d4a853]">
                The Collection
              </span>
            </div>
          )}

          <p className="text-xs uppercase tracking-[0.35em] text-[#d4a853] mb-4">
            {product.category}
          </p>

          <h1 className="text-4xl md:text-6xl font-serif leading-tight">
            {product.name}
          </h1>

          {isShunya && (
            <p className="text-lg md:text-xl font-serif text-[#d4a853]/70 italic mt-1">
              Imperfect. Almost.
            </p>
          )}

          <div className="mt-5 flex gap-3 items-center flex-wrap">
            {product.originalPrice ? (
              <span className="line-through text-gray-500 text-lg">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            ) : null}
            <span className="text-2xl text-white font-medium">
              ₹{product.price.toLocaleString()}
            </span>
          </div>

          <p className="text-gray-400 mt-6 leading-7">{product.description}</p>

          <div className="mt-8">
            {product.inStock ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 px-8 py-3.5 bg-[#d4a853] text-black rounded-full font-medium hover:bg-[#e8c97a] transition text-xs uppercase tracking-widest text-center"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 px-8 py-3.5 border border-[#d4a853] text-[#d4a853] rounded-full hover:bg-[#d4a853]/10 transition text-xs uppercase tracking-widest text-center"
                >
                  Buy Now
                </button>
              </div>
            ) : product.allowNotify ? (
              <div className="flex flex-col items-start gap-3">
                <button
                  onClick={handleNotifyMe}
                  disabled={loadingNotify}
                  className="px-6 py-3 border border-[#d4a853] text-[#d4a853] rounded-full hover:bg-[#d4a853] hover:text-black transition text-xs uppercase tracking-widest disabled:opacity-60"
                >
                  {loadingNotify ? "Submitting..." : "Notify Me"}
                </button>

                {notifySuccess && (
                  <p className="text-sm text-green-400">
                    You’ll be notified on your logged-in email when this product is back.
                  </p>
                )}

                {notifyError && (
                  <p className="text-sm text-red-400">{notifyError}</p>
                )}
              </div>
            ) : (
              <span className="text-red-400 text-sm uppercase tracking-[0.25em]">
                Out of Stock
              </span>
            )}
          </div>

          <div className="mt-12 border border-white/10 rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowFeatures((prev) => !prev)}
              className="w-full flex items-center justify-between px-6 py-5 bg-white/3 hover:bg-white/5 transition"
            >
              <span className="text-xl font-serif text-white">
                Product Features
              </span>
              <span className="text-[#d4a853] text-2xl leading-none">
                {showFeatures ? "−" : "+"}
              </span>
            </button>

            {showFeatures && (
              <div className="px-6 pb-5">
                <FeatureRow label="Case Size" value={product.caseSize} />
                <FeatureRow label="Dial Color" value={product.dialColor} />
                <FeatureRow label="Strap Material" value={product.strapMaterial} />
                <FeatureRow label="Case Material" value={product.caseMaterial} />
                <FeatureRow label="Movement" value={product.movement} />
                <FeatureRow label="Water Resistance" value={product.waterResistance} />
                <FeatureRow label="Glass Type" value={product.glassType} />
              </div>
            )}
          </div>

          {/* Trust Signals */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/5 pt-8">
            {[
              { icon: Shield, text: "Secure Payment" },
              { icon: Truck, text: "Global Shipping" },
              { icon: RotateCcw, text: "7-Day Returns" },
            ].map((trust, i) => {
              const Icon = trust.icon;
              return (
                <div key={i} className="flex flex-col items-center justify-center text-center p-4 rounded-xl border border-white/[0.03] bg-white/[0.01]">
                  <Icon size={20} className="text-[#d4a853]/50 mb-2" />
                  <span className="text-[11px] uppercase tracking-wider text-gray-400">{trust.text}</span>
                </div>
              );
            })}
          </div>

          {/* Emotional Story Block */}
          <div className="mt-6 p-6 glass-card rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#d4a853]/5 to-transparent z-0" />
            <div className="relative z-10">
              <h3 className="text-xl font-serif text-white mb-2">The Philosophy</h3>
              {isShunya ? (
                <>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    The {product.name} embodies the beauty of zero — the void from which all creation emerges. Its dial tells a story in two halves: ancient spiral motifs representing eternal cycles, meeting the clean simplicity of silence, traced by the imperfect gold line of Kintsugi.
                  </p>
                  <div className="border-t border-white/10 pt-4 mt-2">
                    <p className="text-sm text-[#d4a853]/90 italic font-serif text-center">
                      "Be among the first to own {product.name}"
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500 leading-relaxed">
                  Every BODHIQ timepiece is a testament to mindful craftsmanship. Forged from premium materials and designed to transcend passing trends, it serves as a daily anchor to the present moment.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Global Toast for Cart */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 glass-card rounded-full border border-[#d4a853]/30 shadow-2xl shadow-black/50"
          >
            <div className="w-6 h-6 rounded-full bg-[#d4a853]/20 flex items-center justify-center text-[#d4a853]">
              <CheckCircle size={14} />
            </div>
            <span className="text-sm font-medium text-white whitespace-nowrap">{toastMessage}</span>
            <button 
              onClick={() => router.push("/cart")}
              className="ml-4 text-[10px] uppercase tracking-widest text-[#d4a853] hover:text-white transition whitespace-nowrap"
            >
              View Cart →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

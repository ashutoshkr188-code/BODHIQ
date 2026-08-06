"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { resolveMediaUrl } from "@/lib/apiClient";
import type { FeaturedProduct } from "./FeaturedCollection";

function ProductCard({
  name,
  price,
  originalPrice,
  image,
  inStock = true,
  slug,
}: {
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock?: boolean;
  slug?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="group relative rounded-2xl border border-[#d4a853]/20 overflow-hidden hover:border-[#d4a853]/50 hover:shadow-[0_20px_40px_rgba(212,168,83,0.12)] transition-all duration-500"
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {name.toLowerCase().includes("shunya") && (
          <span className="rounded-full border border-[#d4a853]/40 bg-black/80 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[#d4a853]">
            Launch Edition
          </span>
        )}
        {!inStock && (
          <span className="rounded-full border border-red-500/40 bg-black/80 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-red-400">
            Out of Stock
          </span>
        )}
      </div>

      <div className="relative h-80 w-full">
        <Image
          src={resolveMediaUrl(image)}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-110 transition duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 w-full p-5">
        <h3 className="text-base font-medium text-white tracking-wide">{name}</h3>

        <div className="mt-1.5 flex items-center gap-2 flex-wrap">
          {originalPrice ? (
            <span className="text-gray-500 text-xs line-through">
              ₹{originalPrice.toLocaleString()}
            </span>
          ) : null}
          <span className="text-[#d4a853] text-sm font-medium">₹{price.toLocaleString()}</span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <Link
            href={slug ? `/product/${slug}` : "#"}
            className="text-[10px] uppercase tracking-[0.25em] text-[#d4a853] hover:text-[#e8c97a] transition"
          >
            Discover →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* Coming Soon placeholder cards */
function ComingSoonCard({
  title,
  subtitle,
  delay = 0,
}: {
  title: string;
  subtitle: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className="relative rounded-2xl border border-white/[0.04] overflow-hidden h-80 flex flex-col items-center justify-center text-center p-6"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-[#d4a853]/[0.02]" />
      
      {/* Blurred decorative element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-[#d4a853]/[0.04] blur-3xl" />

      <div className="relative z-10">
        <div className="w-10 h-[1px] bg-[#d4a853]/20 mx-auto mb-6" />
        <h3 className="text-sm font-serif text-white/60 mb-2">{title}</h3>
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-600">
          {subtitle}
        </p>
        <div className="w-10 h-[1px] bg-[#d4a853]/20 mx-auto mt-6" />
      </div>
    </motion.div>
  );
}

export default function FeaturedCollectionClient({
  products,
}: {
  products: FeaturedProduct[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Featured products from FastAPI */}
      {products.map((product) => (
        <ProductCard
          key={product.id}
          name={product.name}
          price={product.price}
          originalPrice={product.originalPrice}
          image={product.mainImage || "/watches/shunya-1/hero.jpg"}
          inStock={product.inStock}
          slug={product.slug}
        />
      ))}

      {/* Luxury "Coming Soon" placeholders only to fill gaps up to 4 */}
      {Array.from({ length: Math.max(0, 4 - products.length) }).map((_, i) => (
        <ComingSoonCard
          key={`coming-soon-${i}`}
          title={i === 0 ? "Coming Soon" : i === 1 ? "Next Drop" : "In Craft"}
          subtitle={
            i === 0
              ? "Next chapter unfolding"
              : i === 1
              ? "Craft in Progress"
              : "Patience is precision"
          }
          delay={0.1 + i * 0.1}
        />
      ))}
    </div>
  );
}
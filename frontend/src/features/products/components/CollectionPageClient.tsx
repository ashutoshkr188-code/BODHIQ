"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { resolveMediaUrl } from "@/lib/apiClient";

type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  inStock?: boolean;
  allowNotify?: boolean;
  slug?: string;
  mainImage?: string;
};

type Category = {
  id: string;
  title: string;
  description: string;
  slug: string;
  featureTitle: string;
  reverse?: boolean;
  featureImage?: string;
  featureVideo?: string;
  products: Product[];
};

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
      className={`group relative rounded-2xl border border-[#d4a853]/15 overflow-hidden hover:border-[#d4a853]/40 hover:shadow-[0_20px_40px_rgba(212,168,83,0.1)] transition-all duration-500 ${
        !inStock ? "opacity-60" : ""
      }`}
    >
      {/* Launch Edition Badge */}
      {name.toLowerCase().includes("shunya") && (
        <div className="absolute top-4 left-4 z-20">
          <span className="rounded-full border border-[#d4a853]/40 bg-black/80 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[#d4a853]">
            Launch Edition
          </span>
        </div>
      )}

      <div className="relative h-80 w-full">
        <Image
          src={resolveMediaUrl(image)}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent" />

        {!inStock && (
          <div className="absolute top-4 right-4 z-20">
            <span className="rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-white">
              Out of Stock
            </span>
          </div>
        )}
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
            Explore →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* Coming Soon placeholder */
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
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-[#d4a853]/[0.02]" />
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

function CollectionSection({
  category,
}: {
  category: Category;
}) {
  const { title, description, products, featureImage, featureVideo, featureTitle, slug, reverse } = category;

  return (
    <section className="mb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mb-10"
      >
        <p className="text-xs uppercase tracking-[0.35em] text-[#d4a853] mb-3">
          Curated
        </p>
        <h2 className="text-3xl md:text-5xl font-serif">{title}</h2>
        <p className="text-gray-400 mt-4 max-w-2xl text-sm leading-relaxed">
          {description}
        </p>
      </motion.div>

      <div className={`grid grid-cols-1 lg:grid-cols-4 gap-6 ${reverse ? "lg:flex-row-reverse" : ""}`}>
        {/* Feature Slot */}
        {(featureImage || featureVideo) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`lg:col-span-2 relative h-[500px] lg:h-auto rounded-3xl overflow-hidden border border-[#d4a853]/15 group ${reverse && "lg:order-last"}`}
          >
            {featureVideo ? (
              <video
                src={resolveMediaUrl(featureVideo)}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : featureImage ? (
              <Image
                src={resolveMediaUrl(featureImage)}
                alt={featureTitle || title}
                fill
                className="object-cover group-hover:scale-105 transition duration-1000"
              />
            ) : null}

            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
              {featureTitle && (
                <h3 className="text-2xl font-serif text-white mb-4">
                  {featureTitle}
                </h3>
              )}
              {slug && (
                <Link
                  href={`/collection/${slug}`}
                  className="inline-flex items-center text-xs uppercase tracking-[0.3em] text-[#d4a853] hover:text-[#e8c97a] transition"
                >
                  Explore Chapter →
                </Link>
              )}
            </div>
          </motion.div>
        )}

        {/* Product Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${(featureImage || featureVideo) ? "lg:col-span-2" : "lg:col-span-4 lg:grid-cols-4"}`}>
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
          
          {products.length === 0 && (
            <div className="col-span-full">
               <ComingSoonCard title="Next Drop" subtitle="Craft in Progress" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function CollectionPageClient({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <main className="min-h-screen bg-black text-white pt-32 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16 border-b border-white/10 pb-16"
        >
          <div className="mb-6">
            <span className="inline-block px-5 py-1.5 rounded-full border border-[#d4a853]/30 bg-[#d4a853]/5 text-[10px] uppercase tracking-[0.3em] text-[#d4a853]">
              The Collection
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif">
            Timeless Pieces, Curated for Presence
          </h1>
          <p className="text-gray-400 mt-5 max-w-3xl">
            Explore our signature range of watches and limited edition pieces designed with vintage character and modern precision.
          </p>
        </motion.div>

        {/* Categories / Products */}
        {categories.map((category) => (
          <CollectionSection key={category.id} category={category} />
        ))}
      </div>
    </main>
  );
}
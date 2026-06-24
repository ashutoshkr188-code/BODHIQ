"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { resolveMediaUrl } from "@/lib/apiClient";

type Product = {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  inStock?: boolean;
  allowNotify?: boolean;
  slug?: string;
  mainImage?: string;
};

type CategoryData = {
  _id: string;
  title: string;
  description: string;
  slug: string;
  featureTitle?: string;
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
      <div className="relative h-72 w-full">
        <Image
          src={resolveMediaUrl(image)}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent" />

        {!inStock && (
          <div className="absolute top-4 left-4 z-20">
            <span className="rounded-full border border-[#d4a853]/30 bg-black/70 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[#d4a853]">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full p-4">
        <h3 className="text-sm font-medium text-white tracking-wide">{name}</h3>

        <div className="mt-1 flex items-center gap-2 flex-wrap">
          {originalPrice ? (
            <span className="text-gray-500 text-xs line-through">
              ${originalPrice}
            </span>
          ) : null}
          <span className="text-gray-300 text-xs">${price}</span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <Link
            href={slug ? `/product/${slug}` : "#"}
            className="text-[10px] uppercase tracking-[0.25em] text-[#d4a853]"
          >
            Explore
          </Link>

          <span className="text-[#d4a853] group-hover:translate-x-1 transition-transform duration-300">
            →
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function CategoryPageClient({
  categoryData,
}: {
  categoryData: CategoryData;
}) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen bg-black text-white pt-32 px-6 pb-20"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-20"
        >
          <p className="text-xs uppercase tracking-[0.45em] text-[#d4a853] mb-4">
            Collection
          </p>

          <h1 className="text-4xl md:text-7xl font-serif leading-tight">
            {categoryData.title}
          </h1>

          <p className="text-gray-400 mt-6 max-w-2xl text-lg">
            {categoryData.description}
          </p>
        </motion.div>

        {(categoryData.featureImage ||
          categoryData.featureVideo) && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="relative h-105 rounded-3xl overflow-hidden border border-[#d4a853]/15 mb-16"
          >
            {categoryData.featureVideo ? (
              <video
                src={resolveMediaUrl(categoryData.featureVideo)}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : categoryData.featureImage ? (
              <Image
                src={resolveMediaUrl(categoryData.featureImage)}
                alt={categoryData.featureTitle || categoryData.title}
                fill
                className="object-cover"
              />
            ) : null}

            <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent" />

            {categoryData.featureTitle ? (
              <div className="absolute bottom-0 left-0 p-8 md:p-10">
                <p className="text-xs uppercase tracking-[0.35em] text-[#d4a853] mb-3">
                  Featured
                </p>
                <h2 className="text-3xl md:text-4xl font-serif text-white max-w-2xl">
                  {categoryData.featureTitle}
                </h2>
              </div>
            ) : null}
          </motion.div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {categoryData.products.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.08,
                duration: 0.7,
                ease: "easeOut",
              }}
            >
              <ProductCard
                name={item.name}
                price={item.price}
                originalPrice={item.originalPrice}
                image={item.mainImage || "/placeholder.jpg"}
                inStock={item.inStock}
                slug={item.slug}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.main>
  );
}
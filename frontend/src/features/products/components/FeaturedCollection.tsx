import Link from "next/link";
import { serverFetch } from "@/lib/apiClient";
import FeaturedCollectionClient from "./FeaturedCollectionClient";
import type { ProductListItem } from "@/types/api";

export type FeaturedProduct = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  inStock?: boolean;
  allowNotify?: boolean;
  slug?: string;
  mainImage?: string;
};

export default async function FeaturedCollection() {
  let products: FeaturedProduct[] = [];
  try {
    const data = await serverFetch<ProductListItem[]>("/products/featured", { cache: "no-store" });
    products = (data || []).map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      originalPrice: p.original_price ?? undefined,
      inStock: p.in_stock,
      allowNotify: p.allow_notify,
      slug: p.slug,
      mainImage: p.main_image_url || undefined,
    }));
  } catch (error) {
    console.error("Failed to fetch featured products", error);
  }

  return (
    <section className="bg-black text-white px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#d4a853] mb-3">
              The Collection
            </p>
            <h2 className="text-3xl md:text-5xl font-serif">
              Timeless Presence
            </h2>
            <p className="text-gray-400 mt-4 max-w-2xl">
              Explore our curation of minimalist luxury timepieces, designed to
              bring ancient wisdom and modern precision to every moment.
            </p>
          </div>

          <Link
            href="/collection"
            className="inline-flex items-center text-sm uppercase tracking-[0.25em] text-[#d4a853] hover:text-[#e8c97a] transition"
          >
            View Details →
          </Link>
        </div>

        <FeaturedCollectionClient products={products} />
      </div>
    </section>
  );
}
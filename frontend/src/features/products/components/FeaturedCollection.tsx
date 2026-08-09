import Link from "next/link";
import { serverFetch } from "@/lib/apiClient";
import FeaturedCollectionClient from "./FeaturedCollectionClient";
import type { ProductListItem } from "@/types/api";

export type FeaturedProduct = {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  inStock?: boolean;
  allowNotify?: boolean;
  slug?: string;
  mainImage?: string;
};

interface FeaturedCollectionCMS {
  section_enabled: boolean;
  eyebrow: string | null;
  title: string | null;
  description: string | null;
  cta_text: string | null;
  cta_link: string | null;
}

export default async function FeaturedCollection() {
  let products: FeaturedProduct[] = [];
  let cms: FeaturedCollectionCMS | null = null;

  try {
    const [data, cmsData] = await Promise.allSettled([
      serverFetch<ProductListItem[]>("/products/featured", { cache: "no-store" }),
      serverFetch<FeaturedCollectionCMS>("/content/featured-collection", { cache: "no-store" }),
    ]);

    if (data.status === "fulfilled" && data.value) {
      products = data.value.map((p) => ({
        _id: p.id,
        name: p.name,
        price: p.price,
        originalPrice: p.original_price ?? undefined,
        inStock: p.in_stock,
        allowNotify: p.allow_notify,
        slug: p.slug,
        mainImage: p.main_image_url || undefined,
      }));
    }

    if (cmsData.status === "fulfilled") {
      cms = cmsData.value;
    }
  } catch (error) {
    console.error("Failed to fetch featured collection data", error);
  }

  // Hide section if disabled
  if (cms?.section_enabled === false) return null;

  // Hide if no products and no CMS content
  if (products.length === 0 && !cms?.title) return null;

  const eyebrow = cms?.eyebrow ?? null;
  const title = cms?.title ?? null;
  const description = cms?.description ?? null;
  const ctaText = cms?.cta_text ?? null;
  const ctaLink = cms?.cta_link ?? "/collection";

  return (
    <section className="bg-black text-white px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            {eyebrow && (
              <p className="text-xs uppercase tracking-[0.35em] text-[#d4a853] mb-3">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-3xl md:text-5xl font-serif">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-gray-400 mt-4 max-w-2xl">
                {description}
              </p>
            )}
          </div>

          {ctaText && (
            <Link
              href={ctaLink}
              className="inline-flex items-center text-sm uppercase tracking-[0.25em] text-[#d4a853] hover:text-[#e8c97a] transition"
            >
              {ctaText} →
            </Link>
          )}
        </div>

        <FeaturedCollectionClient products={products} />
      </div>
    </section>
  );
}
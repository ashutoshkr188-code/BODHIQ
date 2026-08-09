import { notFound } from "next/navigation";
import { serverFetch } from "@/lib/apiClient";
import ProductPageClient from "@/features/products/components/ProductPageClient";
import { Metadata } from "next";
import type { Product } from "@/types/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await serverFetch<Product>(`/products/${slug}`, { cache: "no-store" });

  if (!product) {
    return { title: "Product Not Found | BODHIQ" };
  }

  const seoTitle = product.seo_meta_title ?? `${product.name} | BODHIQ`;
  const seoDescription =
    product.seo_meta_description ??
    product.description?.slice(0, 150) ??
    "Minimalist luxury from BODHIQ.";
  const seoKeywords = product.seo_keywords ?? ["BODHIQ", product.name, "luxury watch"];
  const seoImage = product.main_image_url ?? "/watches/shunya-1/hero.jpg";
  const canonicalUrl = `https://bodhiq.in/product/${product.slug}`;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      images: [{ url: seoImage, width: 1200, height: 630, alt: seoTitle }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // GET /api/v1/products/{slug}
  const product = await serverFetch<Product>(`/products/${slug}`, { cache: "no-store" });

  if (!product) return notFound();

  // Adapt FastAPI product shape → shape expected by ProductPageClient
  // FastAPI uses snake_case; map to camelCase for the client component
  const adaptedProduct = {
    _id: product.id,
    name: product.name,
    description: product.description || "",
    price: product.price,
    slug: product.slug,
    // Direct URLs from FastAPI
    mainImage: product.main_image_url || null,
    images: product.images || [],
    productVideo: product.product_video_url || null,
    // Stock / notify
    inStock: product.in_stock,
    allowNotify: product.allow_notify,
    originalPrice: product.original_price ?? undefined,
    // Watch specs
    caseSize: product.case_size,
    dialColor: product.dial_color,
    strapMaterial: product.strap_material,
    caseMaterial: product.case_material,
    movement: product.movement,
    waterResistance: product.water_resistance,
    glassType: product.glass_type,
    category: product.category,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.main_image_url,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability: product.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `https://bodhiq.in/product/${product.slug}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Collection",
        item: "https://bodhiq.in/collection",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.name,
        item: `https://bodhiq.in/product/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductPageClient product={adaptedProduct} />
    </>
  );
}

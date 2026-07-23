import { serverFetch } from "@/lib/apiClient";
import CollectionPageClient from "@/features/products/components/CollectionPageClient";
import type { Category, CategoryProduct } from "@/types/api";

export default async function CollectionPage() {
  // Fetch all categories with their featured products from FastAPI
  const categories = await serverFetch<Category[]>("/categories", { cache: "no-store" });

  const mappedCategories = (categories ?? []).map((cat) => ({
    id: cat.id,
    title: cat.title,
    description: cat.description || "",
    slug: cat.slug,
    featureTitle: cat.feature_title || "",
    reverse: cat.reverse,
    featureImage: cat.feature_image_url || undefined,
    featureVideo: cat.feature_video_url || undefined,
    products: cat.products?.map((p: CategoryProduct) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice ?? undefined,
      inStock: p.inStock,
      allowNotify: p.allowNotify,
      slug: p.slug,
      mainImage: p.mainImage || undefined,
    })) || [],
  }));

  return <CollectionPageClient categories={mappedCategories} />;
}

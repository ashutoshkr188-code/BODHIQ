import { serverFetch } from "@/lib/apiClient";
import CollectionPageClient from "@/features/products/components/CollectionPageClient";
import type { Category, CategoryProduct } from "@/types/api";

export default async function CollectionPage() {
  // Fetch all categories with their featured products from FastAPI
  const categories = await serverFetch<Category[]>("/categories", { cache: "no-store" });

  const mappedCategories = (categories ?? []).map((cat) => ({
    _id: cat.id,
    title: cat.title,
    description: cat.description || "",
    slug: cat.slug,
    featureTitle: cat.featureTitle || "",
    reverse: cat.reverse,
    featureImage: cat.featureImage || undefined,
    featureVideo: cat.featureVideo || undefined,
    products: cat.products?.map((p: CategoryProduct) => ({
      _id: p.id,
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

import { notFound } from "next/navigation";
import { serverFetch } from "@/lib/apiClient";
import CategoryPageClient from "@/features/products/components/CategoryPageClient";
import type { Category, CategoryProduct } from "@/types/api";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  // GET /api/v1/categories/{slug} — returns category + all its products
  const categoryData = await serverFetch<Category>(`/categories/${category}`, { cache: "no-store" });

  if (!categoryData) {
    notFound();
  }

  return <CategoryPageClient categoryData={{ 
    id: categoryData.id,
    title: categoryData.title,
    slug: categoryData.slug,
    description: categoryData.description || "",
    featureTitle: categoryData.feature_title || "",
    reverse: categoryData.reverse,
    featureImage: categoryData.feature_image_url || undefined,
    featureVideo: categoryData.feature_video_url || undefined,
    products: categoryData.products?.map((p: CategoryProduct) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice ?? undefined,
      inStock: p.inStock,
      allowNotify: p.allowNotify,
      slug: p.slug,
      mainImage: p.mainImage || undefined,
    })) || [],
  }} />;
}

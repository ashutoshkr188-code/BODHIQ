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
    _id: categoryData.id,
    title: categoryData.title,
    slug: categoryData.slug,
    description: categoryData.description || "",
    featureTitle: categoryData.featureTitle || "",
    reverse: categoryData.reverse,
    featureImage: categoryData.featureImage || undefined,
    featureVideo: categoryData.featureVideo || undefined,
    products: categoryData.products?.map((p: CategoryProduct) => ({
      _id: p.id,
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

import { MetadataRoute } from "next";
import { serverFetch } from "@/lib/apiClient";
import type { PaginatedResponse, ProductListItem, Category } from "@/types/api";

const BASE_URL = "https://bodhiq.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages = [
    "",
    "/collection",
    "/about",
    "/values",
    "/privacy",
    "/terms",
    "/disclaimer",
    "/corporate",
    "/media",
    "/distributor",
    "/grievance",
    "/knowledge",
    "/faqs",
    "/shipping-policy",
    "/return-policy",
    "/payment-policy",
    "/track-order",
    "/download-app",
    "/craftsmanship",
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
    priority: route === "" ? 1 : route === "/collection" ? 0.9 : 0.7,
  }));

  // Dynamic product pages
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const productsRes = await serverFetch<PaginatedResponse<ProductListItem>>("/products?per_page=100");
    if (productsRes && productsRes.items) {
      productPages = productsRes.items
        .filter((p) => p.slug)
        .map((product) => ({
          url: `${BASE_URL}/product/${product.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }));
    }
  } catch {
    // Silently handle errors during build
  }

  // Dynamic category pages
  let categoryPages: MetadataRoute.Sitemap = [];
  try {
    const categories = await serverFetch<Category[]>("/categories");
    if (categories) {
      categoryPages = categories
        .filter((c) => c.slug)
        .map((category) => ({
          url: `${BASE_URL}/collection/${category.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }));
    }
  } catch {
    // Silently handle errors during build
  }

  return [...staticPages, ...productPages, ...categoryPages];
}

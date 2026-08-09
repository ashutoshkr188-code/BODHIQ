import { routeFetch, apiUrl } from "@/lib/apiClient";
import type { DashboardStats, Product, PaginatedResponse, Order } from "@/types/api";

// ─── Dashboard ─────────────────────────────────────────────────────────────────

export async function getDashboardStats(token: string): Promise<DashboardStats> {
  return routeFetch<DashboardStats>("/dashboard/stats", token);
}

// ─── CMS Content ───────────────────────────────────────────────────────────────

export interface BackgroundMediaItem {
  type: "image" | "video";
  url: string;
  order: number;
}

interface HeaderContent {
  logo_text: string;
  nav_links: { title: string; href: string }[];
  background_media?: BackgroundMediaItem[];
}

interface HomepageContent {
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  hero_cta: string;
  background_media?: BackgroundMediaItem[];
}

interface PhilosophyContent {
  title: string;
  description: string;
  image_url: string | null;
}

export interface PromoContent {
  title: string;
  description: string;
  bg_type: string;
  bg_url: string | null;
  button_text: string;
  button_link: string;
}

export async function getContentHeader(token: string): Promise<HeaderContent> {
  return routeFetch<HeaderContent>("/content/header", token);
}

export async function updateContentHeader(token: string, payload: HeaderContent): Promise<HeaderContent> {
  return routeFetch<HeaderContent>("/content/header", token, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function getContentPhilosophy(token: string): Promise<PhilosophyContent> {
  return routeFetch<PhilosophyContent>("/content/philosophy", token);
}

export async function updateContentPhilosophy(token: string, payload: PhilosophyContent): Promise<PhilosophyContent> {
  return routeFetch<PhilosophyContent>("/content/philosophy", token, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function getContentPromo(token: string): Promise<PromoContent> {
  return routeFetch<PromoContent>("/content/promo", token);
}

export async function updateContentPromo(token: string, payload: PromoContent): Promise<PromoContent> {
  return routeFetch<PromoContent>("/content/promo", token, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function getContentHomepage(token: string): Promise<HomepageContent> {
  return routeFetch<HomepageContent>("/content/homepage", token);
}

export async function updateContentHomepage(token: string, payload: HomepageContent): Promise<HomepageContent> {
  return routeFetch<HomepageContent>("/content/homepage", token, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// ─── File Uploads ──────────────────────────────────────────────────────────────

export interface UploadedFile {
  url: string;
  filename: string;
  type: "image" | "video";
  created_at?: number;
}

export async function uploadMultipleFiles(
  token: string,
  files: File[]
): Promise<{ success: boolean; files: UploadedFile[] }> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const res = await fetch(apiUrl("/upload/multiple"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Upload failed: ${text}`);
  }

  return res.json();
}

export async function adminGetUploadedFiles(token: string): Promise<{ files: UploadedFile[] }> {
  return routeFetch<{ files: UploadedFile[] }>("/upload/all", token);
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function adminGetCategories(token: string): Promise<any[]> {
  return routeFetch<any[]>("/categories", token);
}

// ─── Products ──────────────────────────────────────────────────────────────────

export async function adminGetProducts(token: string): Promise<PaginatedResponse<Product>> {
  return routeFetch<PaginatedResponse<Product>>("/products", token);
}

export interface ProductPayload {
  name: string;
  slug: string;
  description?: string;
  price: number;
  original_price?: number | null;
  stock: number;
  allow_notify?: boolean;
  category_id: string;
  main_image_url?: string | null;
  images?: string[] | null;
  product_video_url?: string | null;
  case_size?: string | null;
  dial_color?: string | null;
  strap_material?: string | null;
  case_material?: string | null;
  movement?: string | null;
  water_resistance?: string | null;
  glass_type?: string | null;
  seo_meta_title?: string | null;
  seo_meta_description?: string | null;
  seo_keywords?: string[] | null;
}

export async function adminCreateProduct(token: string, payload: ProductPayload): Promise<Product> {
  return routeFetch<Product>("/products", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function adminUpdateProduct(token: string, id: string, payload: Partial<ProductPayload>): Promise<Product> {
  return routeFetch<Product>(`/products/${id}`, token, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function adminDeleteProduct(token: string, id: string): Promise<void> {
  await routeFetch<void>(`/products/${id}`, token, { method: "DELETE" });
}

// ─── Users ─────────────────────────────────────────────────────────────────────

export async function adminGetUsers(token: string, page = 1): Promise<any> {
  return routeFetch<any>(`/users/admin/all?page=${page}&per_page=20`, token);
}

export async function adminUpdateUserRole(token: string, userId: string, role: string): Promise<any> {
  return routeFetch<any>(`/users/admin/${userId}/role`, token, {
    method: "PUT",
    body: JSON.stringify({ role }),
  });
}

// ─── Settings ──────────────────────────────────────────────────────────────────

export async function getSettings(token: string): Promise<any> {
  return routeFetch<any>("/settings", token);
}

export async function updateSettings(token: string, payload: any): Promise<any> {
  return routeFetch<any>("/settings", token, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// ─── Footer Settings ────────────────────────────────────────────────────────────

export async function getFooterSettings(token: string): Promise<any> {
  return routeFetch<any>("/footer", token);
}

export async function updateFooterSettings(token: string, payload: any): Promise<any> {
  return routeFetch<any>("/footer", token, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// ─── Notifications ─────────────────────────────────────────────────────────────

export async function adminGetNotifyRequests(token: string, page = 1): Promise<any> {
  return routeFetch<any>(`/notify/admin/all?page=${page}&per_page=20`, token);
}

// ─── Orders ────────────────────────────────────────────────────────────────────

export async function adminGetOrders(token: string, page = 1): Promise<PaginatedResponse<Order>> {
  return routeFetch<PaginatedResponse<Order>>(`/orders/admin/all?page=${page}&per_page=50`, token);
}

export async function adminUpdateOrderStatus(token: string, id: string, status: string): Promise<Order> {
  return routeFetch<Order>(`/orders/${id}/status`, token, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

// ─── New CMS API functions ──────────────────────────────────────────────────────

export async function getContentFeaturedCollection(token: string): Promise<any> {
  return routeFetch<any>("/content/featured-collection", token);
}

export async function updateContentFeaturedCollection(token: string, payload: any): Promise<any> {
  return routeFetch<any>("/content/featured-collection", token, { method: "PUT", body: JSON.stringify(payload) });
}

export async function getContentAbout(token: string): Promise<any> {
  return routeFetch<any>("/content/about", token);
}

export async function updateContentAbout(token: string, payload: any): Promise<any> {
  return routeFetch<any>("/content/about", token, { method: "PUT", body: JSON.stringify(payload) });
}

export async function getContentCraftsmanship(token: string): Promise<any> {
  return routeFetch<any>("/content/craftsmanship", token);
}

export async function updateContentCraftsmanship(token: string, payload: any): Promise<any> {
  return routeFetch<any>("/content/craftsmanship", token, { method: "PUT", body: JSON.stringify(payload) });
}

export async function getAllFaqs(token: string): Promise<any[]> {
  return routeFetch<any[]>("/content/faqs/all", token);
}

export async function bulkReplaceFaqs(token: string, items: any[]): Promise<any[]> {
  return routeFetch<any[]>("/content/faqs/bulk", token, { method: "PUT", body: JSON.stringify({ items }) });
}

export async function createFaqItem(token: string, payload: any): Promise<any> {
  return routeFetch<any>("/content/faqs", token, { method: "POST", body: JSON.stringify(payload) });
}

export async function deleteFaqItem(token: string, id: number): Promise<void> {
  await routeFetch<void>(`/content/faqs/${id}`, token, { method: "DELETE" });
}

export async function getCMSPage(token: string, slug: string): Promise<any> {
  return routeFetch<any>(`/content/page/${slug}`, token);
}

export async function updateCMSPage(token: string, slug: string, payload: any): Promise<any> {
  return routeFetch<any>(`/content/page/${slug}`, token, { method: "PUT", body: JSON.stringify(payload) });
}

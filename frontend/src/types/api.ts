/**
 * TypeScript interfaces mirroring FastAPI Pydantic response schemas.
 * Keep in sync with /backend/app/schemas/*.py
 */

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  clerk_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  role: "user" | "admin";
  created_at: string;
}

// ─── Category ─────────────────────────────────────────────────────────────────

export interface CategoryProduct {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  inStock: boolean;
  allowNotify: boolean;
  mainImage: string | null;
}

export interface Category {
  id: string;
  _id?: string;
  title: string;
  slug: string;
  description: string | null;
  featureTitle: string | null;
  reverse: boolean;
  featureImage: string | null;
  featureVideo: string | null;
  products: CategoryProduct[];
}

// ─── Product ──────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  original_price: number | null;
  stock: number;
  in_stock: boolean;
  allow_notify: boolean;
  main_image_url: string | null;
  images: string[] | null;
  product_video_url: string | null;
  category_id: string;
  category: string | null;
  // Watch specs
  case_size: string | null;
  dial_color: string | null;
  strap_material: string | null;
  case_material: string | null;
  movement: string | null;
  water_resistance: string | null;
  glass_type: string | null;
  // SEO
  seo_meta_title: string | null;
  seo_meta_description: string | null;
  seo_keywords: string[] | null;
  created_at: string;
}

export interface ProductListItem {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  in_stock: boolean;
  allow_notify: boolean;
  main_image_url: string | null;
}

// ─── Order ────────────────────────────────────────────────────────────────────

export interface CartItem {
  name: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface Order {
  id: string;
  _id?: string;
  order_number: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  customer_name: string;
  customer_email: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  cart_items: CartItem[] | null;
  shipping_address: ShippingAddress | null;
  created_at: string;
}

// ─── Address ──────────────────────────────────────────────────────────────────

export interface Address {
  id: string;
  _id?: string;
  user_id: string;
  full_name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface RecentOrder {
  id: string;
  order_number: string;
  customer_name: string;
  amount: number;
  status: string;
  created_at: string;
}

export interface DashboardStats {
  total_users: number;
  total_products: number;
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  recent_orders: RecentOrder[];
}

// ─── Background Media ─────────────────────────────────────────────────────────

export interface BackgroundMediaItem {
  type: "image" | "video";
  url: string;
  order: number;
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export interface HeroSection {
  title: string | null;
  tagline: string | null;
  backgroundType: string | null;
  backgroundImage: string | null;
  backgroundVideoFile: string | null;
  backgroundVideoUrl: string | null;
  backgroundMedia?: BackgroundMediaItem[];
  ctaText: string | null;
  ctaLink: string | null;
}

export interface SiteSettings {
  logoText: string | null;
  navLinks: Record<string, unknown>[] | null;
  contactEmail: string | null;
  footerText: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string[] | null;
}

export interface FooterSettings {
  newsletterText: string | null;
  newsletterPlaceholder: string | null;
  newsletterButtonText: string | null;
  companyLinks: Record<string, unknown>[] | null;
  quickLinks: Record<string, unknown>[] | null;
  contactEmailPrimary: string | null;
  contactEmailSecondary: string | null;
  socialLinks: Record<string, unknown>[] | null;
  copyrightText: string | null;
  bottomTagline: string | null;
}

export interface HomePage {
  hero: Record<string, unknown> | null;
  philosophy: Record<string, unknown> | null;
}

// ─── Invoice (camelCase adapter for InvoiceGenerator) ─────────────────────────

export interface InvoiceOrder {
  _id: string;
  orderNumber: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  cartItems: CartItem[];
  shippingAddress?: ShippingAddress;
}

// ─── API Error ────────────────────────────────────────────────────────────────

export interface ApiError {
  detail: string;
}

// ─── Request Payloads ─────────────────────────────────────────────────────────

export interface CreateOrderPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;   // added for server-side verification (AUD-07)
  customer_name: string;
  customer_email: string;
  amount: number;
  currency: string;
  cart_items: CartItem[];
  shipping_address: ShippingAddress;
}


export interface CreateAddressPayload {
  full_name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

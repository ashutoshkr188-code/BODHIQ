/**
 * Server-side API client for Next.js Server Components and Route Handlers.
 *
 * SSR calls use INTERNAL_API_URL (direct container-to-container, no Nginx loop).
 * Client-side calls use NEXT_PUBLIC_API_URL (goes through Nginx/public URL).
 */

// Client-side public URL (baked in at build time)
const PUBLIC_API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// Server-side internal URL — bypasses Nginx for SSR calls (avoids 301 redirect loop)
// Set INTERNAL_API_URL=http://backend:8000 in production .env
const SERVER_API_BASE =
  typeof window === "undefined"
    ? (process.env.INTERNAL_API_URL ?? PUBLIC_API_BASE)
    : PUBLIC_API_BASE;

/**
 * Build a full API URL from a path like "/products/my-watch"
 * Uses internal URL for SSR, public URL for client.
 */
export function apiUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  const base =
    typeof window === "undefined" ? SERVER_API_BASE : PUBLIC_API_BASE;
  return `${base}/api/v1${clean}`;
}

/**
 * Build a public-facing API URL (always uses NEXT_PUBLIC_API_URL).
 * Use for client components and browser-side requests.
 */
export function publicApiUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${PUBLIC_API_BASE}/api/v1${clean}`;
}

/**
 * Perform an unauthenticated fetch to the FastAPI backend.
 * Used in public Server Components (collection, product pages, home page).
 * Returns the parsed JSON body, or null on 404.
 * Throws on other HTTP errors.
 */
export async function serverFetch<T = unknown>(
  path: string,
  options?: RequestInit
): Promise<T | null> {
  const url = apiUrl(path);

  const fetchOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers as Record<string, string>),
    },
    ...options,
  };

  // Only apply default 60s revalidation if no custom caching options are provided
  if (!options?.cache && !options?.next) {
    fetchOptions.next = { revalidate: 60 };
  }

  const res = await fetch(url, fetchOptions);

  if (res.status === 404) return null;

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`API ${res.status} — ${url}: ${text}`);
  }

  if (res.status === 204) {
    return {} as T;
  }

  return res.json() as Promise<T>;
}

/**
 * Perform an authenticated server-to-server fetch using a Clerk JWT.
 * Used in Next.js Route Handlers that proxy requests to the FastAPI backend.
 *
 * @param path    API path, e.g. "/orders"
 * @param token   Clerk Bearer token obtained via `await auth().getToken()`
 * @param options Additional fetch options (method, body, etc.)
 */
export async function routeFetch<T = unknown>(
  path: string,
  token: string,
  options?: RequestInit
): Promise<T> {
  const url = publicApiUrl(path);

  const res = await fetch(url, {
    cache: "no-store", // Route handlers should never cache
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options?.headers as Record<string, string>),
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`API ${res.status} — ${url}: ${text}`);
  }

  if (res.status === 204) {
    return {} as T;
  }

  return res.json() as Promise<T>;
}

/**
 * Fetch authenticated data in a Server Component using the Clerk server-side
 * token. Uses `@clerk/nextjs/server`'s `auth()` internally.
 *
 * @param path    API path, e.g. "/orders"
 * @param options Additional fetch options
 */
export async function authedServerFetch<T = unknown>(
  path: string,
  token: string,
  options?: RequestInit
): Promise<T | null> {
  const url = apiUrl(path);

  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options?.headers as Record<string, string>),
    },
    ...options,
  });

  if (res.status === 404) return null;

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`API ${res.status} — ${url}: ${text}`);
  }

  if (res.status === 204) {
    return {} as T;
  }

  return res.json() as Promise<T>;
}

/**
 * Resolve a media URL. If it's a local backend upload (starts with /uploads),
 * prepends the PUBLIC backend API base URL. Otherwise returns it as-is.
 */
export function resolveMediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  if (url.startsWith("/uploads")) {
    return `${PUBLIC_API_BASE}${url}`;
  }
  return url;
}

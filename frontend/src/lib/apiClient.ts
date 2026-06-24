/**
 * Server-side API client for Next.js Server Components and Route Handlers.
 *
 * Usage in a Server Component:
 *   import { serverFetch } from "@/lib/apiClient";
 *   const data = await serverFetch("/products/my-watch");
 *
 * Usage in a Route Handler (with Clerk token forwarding):
 *   import { routeFetch } from "@/lib/apiClient";
 *   const res = await routeFetch("/orders", token, { method: "POST", body: JSON.stringify(payload) });
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/**
 * Build a full API URL from a path like "/products/my-watch"
 */
export function apiUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}/api/v1${clean}`;
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
  const url = apiUrl(path);

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
 * prepends the backend API base URL. Otherwise returns it as-is.
 */
export function resolveMediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  if (url.startsWith("/uploads")) {
    return `${API_BASE}${url}`;
  }
  return url;
}

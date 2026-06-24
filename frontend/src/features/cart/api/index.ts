import { authedServerFetch } from "@/lib/apiClient";
import type { CartItem } from "@/hooks/cartStore";

export async function fetchCart(token: string) {
  return authedServerFetch("/cart", token);
}

export async function syncCart(token: string, items: CartItem[]) {
  return authedServerFetch("/cart/sync", token, {
    method: "PUT",
    body: JSON.stringify({ items }),
  });
}

export async function clearBackendCart(token: string) {
  return authedServerFetch("/cart", token, {
    method: "DELETE",
  });
}

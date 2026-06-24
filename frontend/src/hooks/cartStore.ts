import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  _id: string;
  name: string;
  price: number;
  image?: string;
  slug: string;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  lastAddedAt: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (_id: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalPrice: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      lastAddedAt: 0,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i._id === item._id);

          if (existing) {
            return {
              items: state.items.map((i) =>
                i._id === item._id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
              lastAddedAt: Date.now(),
            };
          }

          return {
            items: [...state.items, { ...item, quantity: 1 }],
            lastAddedAt: Date.now(),
          };
        }),

      removeItem: (_id) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item._id === _id
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0),
        })),

      clearCart: () => set({ items: [] }),

      getItemCount: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
    }),
    {
      name: "cart-storage",
    }
  )
);
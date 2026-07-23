import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Address = {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
};

type AddressStore = {
  addresses: Address[];
  selectedAddressId: string | null;

  addAddress: (address: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  setSelectedAddress: (id: string) => void;
};

export const useAddressStore = create<AddressStore>()(
  persist(
    (set) => ({
      addresses: [],
      selectedAddressId: null,

      addAddress: (address) =>
        set((state) => {
          const newAddress: Address = {
            ...address,
            id: crypto.randomUUID(),
          };

          return {
            addresses: [newAddress, ...state.addresses],
            selectedAddressId: newAddress.id,
          };
        }),

      removeAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.filter((a) => a.id !== id),
        })),

      setDefaultAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.map((a) => ({
            ...a,
            isDefault: a.id === id,
          })),
        })),

      setSelectedAddress: (id) =>
        set(() => ({
          selectedAddressId: id,
        })),
    }),
    {
      name: "address-storage",
    }
  )
);
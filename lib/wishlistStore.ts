"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "./types";

type WishlistStore = {
    items: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (id: string) => void;
    isInWishlist: (id: string) => boolean;
};

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],
            addToWishlist: (product) => {
                if (!get().isInWishlist(product.id)) {
                    set((state) => ({ items: [...state.items, product] }));
                }
            },
            removeFromWishlist: (id) => {
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                }));
            },
            isInWishlist: (id) => get().items.some((item) => item.id === id),
        }),
        { name: "urbanluxe-wishlist" },
    ),
);

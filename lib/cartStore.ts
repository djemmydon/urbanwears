"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, CartItem } from "./types";

type CartStore = {
    items: CartItem[];
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    addToCart: (product: Product, size: string, color: string) => void;
    removeFromCart: (id: string, size: string, color: string) => void;
    updateQuantity: (
        id: string,
        size: string,
        color: string,
        quantity: number,
    ) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
};

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isCartOpen: false,
            openCart: () => set({ isCartOpen: true }),
            closeCart: () => set({ isCartOpen: false }),

            addToCart: (product, size, color) => {
                set((state) => {
                    const existingItem = state.items.find(
                        (item) =>
                            item.id === product.id &&
                            item.selectedSize === size &&
                            item.selectedColor === color,
                    );

                    if (existingItem) {
                        // Increase quantity
                        return {
                            items: state.items.map((item) =>
                                item.id === product.id &&
                                item.selectedSize === size &&
                                item.selectedColor === color
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item,
                            ),
                        };
                    } else {
                        // Add new item
                        return {
                            items: [
                                ...state.items,
                                {
                                    ...product,
                                    selectedSize: size,
                                    selectedColor: color,
                                    quantity: 1,
                                },
                            ],
                        };
                    }
                });
            },

            removeFromCart: (id, size, color) => {
                set((state) => ({
                    items: state.items.filter(
                        (item) =>
                            !(
                                item.id === id &&
                                item.selectedSize === size &&
                                item.selectedColor === color
                            ),
                    ),
                }));
            },

            updateQuantity: (id, size, color, quantity) => {
                if (quantity < 1) return;
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id &&
                        item.selectedSize === size &&
                        item.selectedColor === color
                            ? { ...item, quantity }
                            : item,
                    ),
                }));
            },

            clearCart: () => set({ items: [] }),

            getTotalItems: () => {
                return get().items.reduce(
                    (sum, item) => sum + item.quantity,
                    0,
                );
            },

            getTotalPrice: () => {
                return get().items.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0,
                );
            },
        }),
        { name: "urbanblaq-cart" },
    ),
);

"use client";
import { create } from "zustand";

// Lightweight client-side store — orders are persisted in Supabase.
// This only tracks the last placed order ID for UI purposes.
type OrderStore = {
    lastOrderId: string;
    setLastOrderId: (id: string) => void;
};

export const useOrderStore = create<OrderStore>()((set) => ({
    lastOrderId: "",
    setLastOrderId: (id) => set({ lastOrderId: id }),
}));

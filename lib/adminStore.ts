"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AdminStore = {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
};

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: (password) => {
        if (password === "Melvinblaq1@") {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false }),
    }),
    { name: "admin-auth" },
  ),
);

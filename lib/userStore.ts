"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserStore = {
    email: string;
    fullName: string;
    phone: string;
    address: string;
    setUserInfo: (info: {
        email: string;
        fullName: string;
        phone: string;
        address: string;
    }) => void;
    clearUser: () => void;
};

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            email: "",
            fullName: "",
            phone: "",
            address: "",
            setUserInfo: (info) => set(info),
            clearUser: () =>
                set({ email: "", fullName: "", phone: "", address: "" }),
        }),
        { name: "urbanluxe-user" },
    ),
);

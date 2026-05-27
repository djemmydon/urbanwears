"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeStore = {
    accentColor: string;
    isDark: boolean;
    setAccentColor: (color: string) => void;
    toggleDark: () => void;
};

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set) => ({
            accentColor: "#FF8C00",
            isDark: false,
            setAccentColor: (color) => {
                document.documentElement.style.setProperty(
                    "--accent-hex",
                    color,
                );
                set({ accentColor: color });
            },
            toggleDark: () => {
                const newDark = !useThemeStore.getState().isDark;
                document.documentElement.classList.toggle("dark", newDark);
                set({ isDark: newDark });
            },
        }),
        { name: "theme-storage" },
    ),
);

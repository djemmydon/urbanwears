"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Palette, Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/lib/store";

const presetColors = [
    "#FF8C00",
    "#000000",
    "#FFFFFF",
    "#1E3A8A",
    "#EF4444",
    "#22C55E",
    "#8B5CF6",
    "#F59E0B",
    "#EC4899",
    "#06B6D4",
];

export default function RotatingColorPicker() {
    const [isOpen, setIsOpen] = useState(false);
    const { accentColor, setAccentColor, isDark, toggleDark } = useThemeStore();

    return (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end gap-4">
            {/* Main Rotating Button */}
            <motion.button
                animate={{ rotate: isOpen ? 90 : 360 }}
                transition={{ duration: 0.6 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl flex items-center justify-center border-2 border-[var(--accent-hex)] hover:scale-110 transition-transform group"
            >
                <Palette className="w-8 h-8 text-(--accent-hex)" />
            </motion.button>

            {/* Expanded Panel */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: 40 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: 40 }}
                    className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-2xl w-72 border border-gray-100 dark:border-zinc-700"
                >
                    <p className="text-sm font-medium mb-4 text-gray-500">
                        Theme Colors
                    </p>

                    <div className="grid grid-cols-5 gap-3 mb-6">
                        {presetColors.map((color) => (
                            <button
                                key={color}
                                className="w-11 h-11 rounded-2xl border-2 border-white dark:border-zinc-800 shadow-md hover:scale-110 active:scale-95 transition-all"
                                style={{ backgroundColor: color }}
                                onClick={() => setAccentColor(color)}
                            />
                        ))}
                    </div>

                    <div className="border-t border-gray-200 dark:border-zinc-700 pt-4">
                        <button
                            onClick={toggleDark}
                            className="
                                       w-full
                                       flex
                                       items-center
                                       justify-center
                                       gap-3
                                       py-3
                                       rounded-2xl
                                       text-(--text)
                                       hover:bg-(--text)/5
                                       transition
                                   "
                        >
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                            <span>
                                {isDark
                                    ? "Switch to Light Mode"
                                    : "Switch to Dark Mode"}
                            </span>
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

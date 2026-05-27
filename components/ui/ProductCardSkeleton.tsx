"use client";
import { motion } from "framer-motion";

export default function ProductCardSkeleton() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-sm animate-pulse"
        >
            <div className="aspect-[4/4.5] bg-gray-200 dark:bg-zinc-800 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded-xl w-4/5" />
                <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded-xl w-1/2" />

                <div className="flex justify-between items-center">
                    <div className="h-7 bg-gray-200 dark:bg-zinc-800 rounded-xl w-20" />
                    <div className="h-10 w-10 bg-gray-200 dark:bg-zinc-800 rounded-2xl" />
                </div>
            </div>
        </motion.div>
    );
}

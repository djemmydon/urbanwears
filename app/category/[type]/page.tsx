"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/lib/types";
import ProductCard from "@/components/products/ProductCard";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";

const CATEGORY_META: Record<string, { label: string; description: string; hero: string }> = {
    polo: {
        label: "Polos",
        description: "Premium cotton polos crafted for modern style",
        hero: "/images/e1.png",
    },
    tshirt: {
        label: "T-Shirts",
        description: "Heavyweight essentials for everyday wear",
        hero: "/images/e3.png",
    },
    hoodie: {
        label: "Hoodies",
        description: "Ultra-soft fleece hoodies designed for comfort",
        hero: "/images/e2.png",
    },
};

const SORT_OPTIONS = [
    { value: "default", label: "Featured" },
    { value: "price-asc", label: "Price: Low → High" },
    { value: "price-desc", label: "Price: High → Low" },
    { value: "rating", label: "Top Rated" },
] as const;

export default function CategoryPage() {
    const { type } = useParams<{ type: string }>();
    const meta = CATEGORY_META[type] ?? {
        label: type,
        description: "Browse our collection",
        hero: "/images/e1.png",
    };

    const [products, setProducts] = useState<Product[]>([]);
    const [sorted, setSorted] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<string>("default");
    const [showSort, setShowSort] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetchProducts({ type })
            .then((data) => {
                setProducts(data);
                setSorted(data);
            })
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    }, [type]);

    useEffect(() => {
        let result = [...products];
        if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
        else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
        else if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
        setSorted(result);
    }, [sortBy, products]);

    return (
        <div>
            {/* Category Hero Banner */}
            <div
                className="relative h-56 md:h-72 bg-black flex items-end overflow-hidden"
                style={{
                    backgroundImage: `url(${meta.hero})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center top",
                }}
            >
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/10" />
                <div className="relative z-10 max-w-7xl mx-auto px-6 pb-10 w-full">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4 transition-colors"
                    >
                        <ArrowLeft size={16} /> Back to Shop
                    </Link>
                    <h1 className="font-display text-5xl md:text-6xl font-semibold text-white tracking-tight">
                        {meta.label}
                    </h1>
                    <p className="text-white/70 mt-1">{meta.description}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Toolbar */}
                <div className="flex justify-between items-center mb-8">
                    <p className="text-gray-500 text-sm">
                        {loading
                            ? "Loading..."
                            : `${sorted.length} product${sorted.length !== 1 ? "s" : ""}`}
                    </p>

                    <div className="relative">
                        <button
                            onClick={() => setShowSort((v) => !v)}
                            className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            {SORT_OPTIONS.find((o) => o.value === sortBy)
                                ?.label ?? "Sort"}
                        </button>
                        {showSort && (
                            <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-700 py-2 z-10">
                                {SORT_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => {
                                            setSortBy(opt.value);
                                            setShowSort(false);
                                        }}
                                        className={`w-full text-left px-5 py-3 text-sm hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors ${sortBy === opt.value ? "font-semibold text-(--accent-hex)" : ""}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {loading
                        ? Array.from({ length: 4 }).map((_, i) => (
                              <ProductCardSkeleton key={i} />
                          ))
                        : sorted.map((product, i) => (
                              <motion.div
                                  key={product.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.06 }}
                              >
                                  <ProductCard product={product} />
                              </motion.div>
                          ))}
                </div>

                {!loading && sorted.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-2xl text-gray-500 mb-4">
                            No {meta.label} available right now
                        </p>
                        <Link
                            href="/"
                            className="inline-block bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-semibold hover:bg-(--accent-hex) hover:text-black transition-all"
                        >
                            Browse All
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

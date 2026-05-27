"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/lib/types";
import { Star, ShoppingCart, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import { toast } from "sonner";

function TrendingCard({ product, rank }: { product: Product; rank: number }) {
    const addToCart = useCartStore((s) => s.addToCart);
    const originalPrice = product.originalPrice ?? product.original_price;

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        const size = product.sizes.find((s) => s.inStock);
        if (!size) { toast.error("Out of stock"); return; }
        addToCart(product, size.size, product.colors[0]?.name ?? "");
        toast.success(`${product.name} added!`);
    };

    return (
        <Link href={`/products/${product.id}`} className="group flex gap-4 items-center">
            {/* Rank */}
            <span className="text-5xl font-black text-gray-100 dark:text-zinc-800 leading-none w-10 flex-shrink-0 select-none">
                {rank}
            </span>

            {/* Image */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-zinc-800">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="96px"
                />
                {originalPrice && (
                    <div className="absolute top-1 left-1 bg-[var(--accent-hex)] text-white text-[8px] font-black px-1.5 py-0.5 uppercase">
                        Sale
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-[3px] text-gray-400 mb-0.5">
                    {product.category}
                </p>
                <p className="font-black text-sm sm:text-base uppercase leading-tight truncate">
                    {product.name}
                </p>
                <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 fill-[var(--accent-hex)] text-[var(--accent-hex)]" />
                    <span className="text-xs text-gray-400">{product.rating}</span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-black text-base">₦{product.price}</span>
                    {originalPrice && (
                        <span className="text-xs text-gray-400 line-through">₦{originalPrice}</span>
                    )}
                </div>
            </div>

            {/* Quick add */}
            <button
                onClick={handleAdd}
                className="flex-shrink-0 w-9 h-9 bg-black dark:bg-white text-white dark:text-black hover:bg-[var(--accent-hex)] dark:hover:bg-[var(--accent-hex)] hover:text-white transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
            >
                <ShoppingCart className="w-4 h-4" />
            </button>
        </Link>
    );
}

export default function TrendingProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts({ trending: true })
            .then((data) => {
                if (data.length === 0) {
                    return fetchProducts().then((all) =>
                        all.sort((a, b) => b.rating - a.rating).slice(0, 6),
                    );
                }
                return data.slice(0, 6);
            })
            .then(setProducts)
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="py-16 md:py-20 bg-gray-50 dark:bg-zinc-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
                    {/* Left — heading + CTA */}
                    <div className="flex flex-col justify-between h-full">
                        <div>
                            <p className="text-[10px] tracking-[5px] uppercase text-(--accent-hex) font-semibold mb-3">
                                Right Now
                            </p>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight mb-4">
                                Trending
                                <br />
                                This Week
                            </h2>
                            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                                The pieces everyone&apos;s talking about. Handpicked by our team every week.
                            </p>
                        </div>
                        <Link
                            href="/category/polo"
                            className="mt-8 inline-flex items-center gap-3 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-[3px] text-xs px-8 py-4 hover:bg-[var(--accent-hex)] hover:text-white dark:hover:bg-[var(--accent-hex)] dark:hover:text-white transition-all duration-200 self-start"
                        >
                            Shop All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Right — ranked list */}
                    <div className="space-y-4 divide-y divide-gray-200 dark:divide-zinc-800">
                        {loading
                            ? Array.from({ length: 4 }).map((_, i) => (
                                  <div
                                      key={i}
                                      className="flex gap-4 items-center py-4 first:pt-0"
                                  >
                                      <div className="w-10 h-8 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse" />
                                      <div className="w-20 h-20 bg-gray-200 dark:bg-zinc-700 animate-pulse flex-shrink-0" />
                                      <div className="flex-1 space-y-2">
                                          <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-3/4 animate-pulse" />
                                          <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-1/2 animate-pulse" />
                                      </div>
                                  </div>
                              ))
                            : products.map((product, i) => (
                                  <div key={product.id} className="pt-4 first:pt-0">
                                      <TrendingCard product={product} rank={i + 1} />
                                  </div>
                              ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/lib/types";

export default function TodaysOffers() {
    const [offers, setOffers] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts({ onSale: true })
            .then((data) => setOffers(data.slice(0, 2)))
            .catch(() => setOffers([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <section className="py-16 bg-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="h-8 bg-zinc-800 rounded w-40 mb-10 animate-pulse" />
                    <div className="grid md:grid-cols-2 gap-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-72 bg-zinc-800 animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (offers.length === 0) return null;

    return (
        <section className="bg-black py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <p className="text-[10px] tracking-[5px] uppercase text-[var(--accent-hex)] font-semibold mb-2">
                            Limited Time Only
                        </p>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
                            Today&apos;s Deals
                        </h2>
                    </div>
                    <Link
                        href="/#shop"
                        className="hidden sm:inline-block text-xs font-bold uppercase tracking-[3px] text-white/60 hover:text-white underline underline-offset-4 transition-colors"
                    >
                        Shop All Sale
                    </Link>
                </div>

                {/* Offer cards */}
                <div className="grid md:grid-cols-2 gap-4">
                    {offers.map((product, i) => {
                        const originalPrice =
                            product.originalPrice ?? product.original_price;
                        const discount = originalPrice
                            ? Math.round(
                                  ((originalPrice - product.price) /
                                      originalPrice) *
                                      100,
                              )
                            : 0;

                        return (
                            <Link
                                key={product.id}
                                href={`/products/${product.id}`}
                                className="group relative overflow-hidden flex bg-zinc-900 hover:bg-zinc-800 transition-colors"
                            >
                                {/* Image */}
                                <div className="relative w-44 sm:w-52 flex-shrink-0">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        sizes="200px"
                                    />
                                    {/* Discount badge */}
                                    <div className="absolute top-3 left-3 bg-[var(--accent-hex)] text-white text-xs font-black px-2.5 py-1 uppercase tracking-widest">
                                        {discount}% OFF
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex flex-col justify-center p-6 sm:p-8 flex-1">
                                    <p className="text-white/50 text-[10px] uppercase tracking-[4px] mb-2">
                                        {product.category}
                                    </p>
                                    <h3 className="text-white font-black text-xl sm:text-2xl uppercase leading-tight mb-3">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-baseline gap-3 mb-5">
                                        <span className="text-2xl font-black text-white">
                                            ₦{product.price}
                                        </span>
                                        {originalPrice && (
                                            <span className="line-through text-white/40 text-sm">
                                                ₦{originalPrice}
                                            </span>
                                        )}
                                    </div>
                                    <span className="inline-block bg-white text-black text-[10px] font-black uppercase tracking-[3px] px-5 py-2.5 self-start group-hover:bg-[var(--accent-hex)] group-hover:text-white transition-all duration-200">
                                        Grab Deal →
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

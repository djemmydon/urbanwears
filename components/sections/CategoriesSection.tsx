"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const categories = [
    {
        name: "Polos",
        type: "polo",
        image: "/images/e1.png",
        desc: "Polished, refined",
        tag: "Best Seller",
    },
    {
        name: "T-Shirts",
        type: "tshirt",
        image: "/images/e3.png",
        desc: "Clean everyday wear",
        tag: "New In",
    },
    {
        name: "Hoodies",
        type: "hoodie",
        image: "/images/e2.png",
        desc: "Relaxed & cosy",
        tag: "Trending",
    },
];

export default function CategoriesSection() {
    return (
        <section className="bg-(--bg)" id="shop">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
                {/* Section header */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <p className="text-[10px] tracking-[5px] uppercase text-(--accent-hex) font-semibold mb-2">
                            Browse
                        </p>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight">
                            Shop by Style
                        </h2>
                    </div>
                    <Link
                        href="/#shop"
                        className="hidden sm:inline-block text-xs font-bold uppercase tracking-[3px] underline underline-offset-4 hover:text-(--accent-hex) transition-colors"
                    >
                        View All
                    </Link>
                </div>

                {/* Category tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.type}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group relative overflow-hidden"
                            style={{ aspectRatio: "3/4" }}
                        >
                            <Image
                                src={cat.image}
                                alt={cat.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                sizes="(max-width: 640px) 100vw, 33vw"
                            />
                            {/* Dark overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                            {/* Tag pill */}
                            <div className="absolute top-4 left-4 bg-white text-black text-[10px] font-black uppercase tracking-widest px-3 py-1">
                                {cat.tag}
                            </div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <p className="text-white/60 text-[10px] uppercase tracking-[4px] mb-1 font-medium">
                                    {cat.desc}
                                </p>
                                <h3 className="text-white text-3xl md:text-4xl font-black uppercase tracking-tight mb-5">
                                    {cat.name}
                                </h3>
                                <Link
                                    href={`/category/${cat.type}`}
                                    className="inline-block bg-white text-black text-[10px] font-black uppercase tracking-[3px] px-7 py-3 hover:bg-[var(--accent-hex)] hover:text-white transition-all duration-200"
                                >
                                    Shop Now
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

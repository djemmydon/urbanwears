"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
    return (
        <section className="bg-black overflow-hidden">
            {/* Split hero */}
            <div className="grid md:grid-cols-2 min-h-[88vh]">
                {/* Left — text */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col justify-center px-8 sm:px-12 md:px-16 lg:px-20 py-20 order-2 md:order-1"
                >
                    <span className="text-[10px] tracking-[6px] text-[var(--accent-hex)] uppercase mb-6 font-semibold">
                        New Season · 2025
                    </span>

                    <h1 className="text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-tight text-white mb-6">
                        THE
                        <br />
                        ESSENTIAL
                        <br />
                        <span className="text-[var(--accent-hex)]">EDIT.</span>
                    </h1>

                    <p className="text-gray-400 text-sm sm:text-base mb-10 max-w-xs leading-relaxed">
                        Premium polos, tees & hoodies crafted for the modern wardrobe. New drops every week.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                            href="#shop"
                            className="bg-white text-black font-bold uppercase tracking-[3px] text-xs px-10 py-4 hover:bg-[var(--accent-hex)] hover:text-white transition-all duration-300 text-center"
                        >
                            Shop Now
                        </Link>
                        <Link
                            href="/category/polo"
                            className="border border-white/30 text-white font-bold uppercase tracking-[3px] text-xs px-10 py-4 hover:border-white/80 transition-all duration-300 text-center"
                        >
                            New Arrivals
                        </Link>
                    </div>

                    {/* Trust strip */}
                    <div className="flex gap-6 mt-12 flex-wrap">
                        {["Free Delivery $50+", "Easy Returns", "New Drops Weekly"].map((t) => (
                            <div key={t} className="flex items-center gap-2">
                                <span className="w-1 h-1 bg-[var(--accent-hex)] rounded-full" />
                                <span className="text-gray-500 text-xs uppercase tracking-widest">
                                    {t}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Right — image */}
                <motion.div
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="relative min-h-[55vw] md:min-h-full order-1 md:order-2 overflow-hidden"
                >
                    <Image
                        src="/images/e1.png"
                        alt="New Season Collection"
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20 md:to-black/30" />

                    {/* Floating badge */}
                    <div className="absolute top-5 right-5 w-20 h-20 bg-[var(--accent-hex)] rounded-full flex flex-col items-center justify-center shadow-xl">
                        <span className="text-white font-black text-xl leading-none">NEW</span>
                        <span className="text-white/80 text-[9px] tracking-[3px] uppercase">Season</span>
                    </div>

                    {/* Bottom label */}
                    <div className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2">
                        <p className="text-white text-xs tracking-widest uppercase font-semibold">
                            Premium Essentials
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Bottom bar */}
            <div className="bg-[var(--accent-hex)] grid grid-cols-3 divide-x divide-orange-400/50">
                {[
                    { label: "Free Delivery", sub: "Orders over $50" },
                    { label: "New Drops", sub: "Every week" },
                    { label: "Easy Returns", sub: "30-day policy" },
                ].map((item) => (
                    <div key={item.label} className="py-3.5 text-center text-white">
                        <p className="font-black text-xs uppercase tracking-widest">{item.label}</p>
                        <p className="text-[10px] text-white/75 mt-0.5 tracking-wide">{item.sub}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

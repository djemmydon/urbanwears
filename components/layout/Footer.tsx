"use client";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Globe, Rss, Share2 } from "lucide-react";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [joining, setJoining] = useState(false);

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes("@")) {
            toast.error("Please enter a valid email");
            return;
        }
        setJoining(true);
        await new Promise((r) => setTimeout(r, 800));
        toast.success("You're on the list!", {
            description: `${email} will receive our next drop notification.`,
        });
        setEmail("");
        setJoining(false);
    };

    return (
        <footer className="bg-black text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 md:grid-cols-4 gap-10">
                {/* Brand */}
                <div>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
                            <span className="text-black font-black text-lg">
                                U
                            </span>
                        </div>
                        <h2 className="text-xl font-black tracking-tight">
                            URBANLUXE
                        </h2>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                        Premium essentials for the modern individual. Quality
                        that speaks for itself.
                    </p>
                    <div className="flex gap-3">
                        {[Globe, Share2, Rss].map((Icon, i) => (
                            <a
                                key={i}
                                href="#"
                                className="w-9 h-9 bg-zinc-800 hover:bg-(--accent-hex) hover:text-black rounded-xl flex items-center justify-center transition-all"
                            >
                                <Icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Shop */}
                <div>
                    <h3 className="font-semibold mb-4 text-sm tracking-wider uppercase">
                        Shop
                    </h3>
                    <ul className="space-y-3 text-gray-400 text-sm">
                        <li>
                            <Link
                                href="/category/polo"
                                className="hover:text-white transition-colors"
                            >
                                Polos
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/category/tshirt"
                                className="hover:text-white transition-colors"
                            >
                                T-Shirts
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/category/hoodie"
                                className="hover:text-white transition-colors"
                            >
                                Hoodies
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/wishlist"
                                className="hover:text-white transition-colors"
                            >
                                Wishlist
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/orders"
                                className="hover:text-white transition-colors"
                            >
                                Track Order
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h3 className="font-semibold mb-4 text-sm tracking-wider uppercase">
                        Support
                    </h3>
                    <ul className="space-y-3 text-gray-400 text-sm">
                        <li>
                            <a
                                href="mailto:support@urbanluxe.com"
                                className="hover:text-white transition-colors"
                            >
                                Contact Us
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="hover:text-white transition-colors"
                            >
                                Shipping Policy
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="hover:text-white transition-colors"
                            >
                                Returns & Exchanges
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="hover:text-white transition-colors"
                            >
                                Size Guide
                            </a>
                        </li>
                        <li>
                            <Link
                                href="/admin/dashboard"
                                className="hover:text-white transition-colors"
                            >
                                Admin
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h3 className="font-semibold mb-4 text-sm tracking-wider uppercase">
                        Newsletter
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                        Be the first to know about new drops and exclusive
                        offers.
                    </p>
                    <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="bg-zinc-900 border border-zinc-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-(--accent-hex) transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={joining}
                            className="bg-white text-black py-3 rounded-xl text-sm font-semibold hover:bg-(--accent-hex) transition-all disabled:opacity-60"
                        >
                            {joining ? "Joining..." : "Join the List"}
                        </button>
                    </form>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-14 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
                <p>© 2026 URBANLUXE. All Rights Reserved.</p>
                <div className="flex gap-4">
                    <a href="#" className="hover:text-gray-300 transition-colors">
                        Privacy Policy
                    </a>
                    <a href="#" className="hover:text-gray-300 transition-colors">
                        Terms of Service
                    </a>
                </div>
            </div>
        </footer>
    );
}

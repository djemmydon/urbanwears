"use client";
import Link from "next/link";
import { ShoppingCart, Search, Heart, Package, X, Menu } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useCartStore } from "@/lib/cartStore";
import { useWishlistStore } from "@/lib/wishlistStore";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/lib/types";
import { useRouter } from "next/navigation";
import Image from "next/image";

const NAV_LINKS = [
    { label: "New In", href: "/#shop" },
    { label: "Polos", href: "/category/polo" },
    { label: "T-Shirts", href: "/category/tshirt" },
    { label: "Hoodies", href: "/category/hoodie" },
    { label: "Orders", href: "/orders" },
];

export default function Header() {
    const { getTotalItems, openCart } = useCartStore();
    const { items: wishlistItems } = useWishlistStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        fetchProducts().then(setAllProducts).catch(() => {});
    }, []);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowResults(false);
                setShowSearch(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const filtered = allProducts
        .filter(
            (p) =>
                searchQuery &&
                (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.category.toLowerCase().includes(searchQuery.toLowerCase())),
        )
        .slice(0, 6);

    const handleSelect = (id: string) => {
        setSearchQuery("");
        setShowResults(false);
        setShowSearch(false);
        setMobileMenuOpen(false);
        router.push(`/products/${id}`);
    };

    return (
        <header className="sticky top-0 z-50 bg-(--bg) border-b border-black/10 dark:border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-14 sm:h-16 gap-4">

                    {/* Mobile menu toggle */}
                    <button
                        onClick={() => setMobileMenuOpen((v) => !v)}
                        className="md:hidden p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
                        aria-label="Menu"
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    {/* Logo */}
                    <Link
                        href="/"
                        className="font-black text-lg sm:text-xl uppercase tracking-[4px] shrink-0 leading-none"
                    >
                        URBANLUXE
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-[11px] font-bold uppercase tracking-[2px] hover:text-(--accent-hex) transition-colors relative group flex items-center gap-1.5"
                            >
                                {link.label === "Orders" && (
                                    <Package className="w-3.5 h-3.5" />
                                )}
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-(--accent-hex) group-hover:w-full transition-all duration-200" />
                            </Link>
                        ))}
                    </nav>

                    {/* Right icons */}
                    <div className="flex items-center gap-1">
                        {/* Search */}
                        <div ref={searchRef} className="relative">
                            {showSearch ? (
                                <div className="flex items-center">
                                    <input
                                        autoFocus
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setShowResults(true);
                                        }}
                                        placeholder="Search..."
                                        className="w-36 sm:w-52 bg-gray-100 dark:bg-zinc-800 pl-3 pr-8 py-2 text-xs focus:outline-none rounded-none border-b-2 border-black dark:border-white"
                                    />
                                    <button
                                        onClick={() => {
                                            setShowSearch(false);
                                            setSearchQuery("");
                                        }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2"
                                    >
                                        <X className="w-3.5 h-3.5 text-gray-400" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowSearch(true)}
                                    className="p-2.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
                                    aria-label="Search"
                                >
                                    <Search className="w-4.5 h-4.5" />
                                </button>
                            )}

                            {/* Search dropdown */}
                            {showResults && searchQuery && (
                                <div className="absolute top-full right-0 mt-1 w-72 bg-white dark:bg-zinc-900 shadow-2xl border border-gray-100 dark:border-zinc-700 py-2 z-50 max-h-80 overflow-auto">
                                    {filtered.length > 0 ? (
                                        filtered.map((p) => (
                                            <button
                                                key={p.id}
                                                onClick={() => handleSelect(p.id)}
                                                className="w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800 flex gap-3 items-center text-left"
                                            >
                                                <div className="relative w-10 h-10 overflow-hidden bg-gray-100 dark:bg-zinc-800 flex-shrink-0">
                                                    <Image src={p.image} alt="" fill className="object-cover" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-xs uppercase tracking-wide truncate">{p.name}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">₦{p.price}</p>
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <p className="px-4 py-6 text-center text-xs text-gray-400 uppercase tracking-widest">
                                            No results for &ldquo;{searchQuery}&rdquo;
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Wishlist */}
                        <Link
                            href="/wishlist"
                            className="relative p-2.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
                            aria-label="Wishlist"
                        >
                            <Heart className="w-4.5 h-4.5" />
                            {wishlistItems.length > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                    {wishlistItems.length}
                                </span>
                            )}
                        </Link>

                        {/* Cart */}
                        <button
                            onClick={openCart}
                            className="relative p-2.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
                            aria-label="Cart"
                        >
                            <ShoppingCart className="w-4.5 h-4.5" />
                            {getTotalItems() > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-[var(--accent-hex)] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                    {getTotalItems()}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-(--bg) border-t border-black/10 dark:border-white/10 px-4 py-4 space-y-1">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2 py-3 text-xs font-black uppercase tracking-[3px] border-b border-gray-100 dark:border-zinc-800 hover:text-(--accent-hex) transition-colors"
                        >
                            {link.label === "Orders" && <Package className="w-3.5 h-3.5" />}
                            {link.label}
                        </Link>
                    ))}
                    {/* Mobile search */}
                    <div className="pt-2 relative" ref={searchRef}>
                        <div className="flex items-center border-b-2 border-black dark:border-white">
                            <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowResults(true);
                                }}
                                placeholder="Search products..."
                                className="flex-1 bg-transparent py-2 text-xs focus:outline-none"
                            />
                        </div>
                        {showResults && searchQuery && filtered.length > 0 && (
                            <div className="absolute top-full left-0 right-0 bg-white dark:bg-zinc-900 shadow-xl border border-gray-100 dark:border-zinc-700 py-2 z-50">
                                {filtered.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => handleSelect(p.id)}
                                        className="w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800 flex gap-3 items-center text-left"
                                    >
                                        <div className="relative w-9 h-9 overflow-hidden flex-shrink-0 bg-gray-100">
                                            <Image src={p.image} alt="" fill className="object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-xs uppercase">{p.name}</p>
                                            <p className="text-xs text-gray-500">₦{p.price}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}

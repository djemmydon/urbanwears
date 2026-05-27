"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "../products/ProductCard";
import ProductCardSkeleton from "../ui/ProductCardSkeleton";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/lib/types";

const TABS = ["All", "Polo", "T-Shirt", "Hoodie"] as const;
type Tab = (typeof TABS)[number];

export default function TopProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filtered, setFiltered] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<Tab>("All");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        fetchProducts()
            .then((data) => {
                setProducts(data);
                setFiltered(data);
            })
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    }, []);

    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
        if (tab === "All") {
            setFiltered(products);
        } else {
            setFiltered(
                products.filter(
                    (p) =>
                        p.category.toLowerCase() === tab.toLowerCase() ||
                        p.type.toLowerCase() === tab.toLowerCase().replace("-", ""),
                ),
            );
        }
    };

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const currentProducts = filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    return (
        <section className="py-16 md:py-20 bg-(--bg)" id="shop">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5 mb-10">
                    <div>
                        <p className="text-[10px] tracking-[5px] uppercase text-(--accent-hex) font-semibold mb-2">
                            Favourites
                        </p>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight">
                            Top Products
                        </h2>
                    </div>

                    {/* Filter tabs — text-underline Boohoo style */}
                    <div className="flex gap-5 flex-wrap">
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => handleTabChange(tab)}
                                className={`text-xs font-bold uppercase tracking-[2px] pb-1 transition-all ${
                                    activeTab === tab
                                        ? "border-b-2 border-black dark:border-white text-(--text)"
                                        : "text-gray-400 dark:text-zinc-500 hover:text-(--text) border-b-2 border-transparent"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                    {loading
                        ? Array.from({ length: 8 }).map((_, i) => (
                              <ProductCardSkeleton key={i} />
                          ))
                        : currentProducts.map((product) => (
                              <ProductCard key={product.id} product={product} />
                          ))}
                </div>

                {!loading && filtered.length === 0 && (
                    <div className="text-center py-16 text-gray-400 uppercase tracking-widest text-xs">
                        No products in this category
                    </div>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="flex justify-center mt-12 gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                            (page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-10 h-10 font-bold text-sm uppercase tracking-widest transition-all ${
                                        currentPage === page
                                            ? "bg-black dark:bg-white text-white dark:text-black"
                                            : "hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
                                    }`}
                                >
                                    {page}
                                </button>
                            ),
                        )}
                    </div>
                )}

                {/* View all CTA */}
                {!loading && filtered.length > 0 && (
                    <div className="text-center mt-10">
                        <Link
                            href={`/category/${activeTab === "All" ? "polo" : activeTab.toLowerCase().replace("-", "")}`}
                            className="inline-block border-2 border-black dark:border-white text-(--text) font-black uppercase tracking-[3px] text-xs px-12 py-4 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-200"
                        >
                            View All {activeTab !== "All" ? activeTab : "Products"}
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}


"use client";
import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search, Star, Pencil, Package } from "lucide-react";

const TYPE_LABELS: Record<string, string> = {
    polo: "Polo",
    tshirt: "T-Shirt",
    hoodie: "Hoodie",
};

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filtered, setFiltered] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");

    useEffect(() => {
        fetchProducts()
            .then((data) => {
                setProducts(data);
                setFiltered(data);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        let result = products;
        if (typeFilter !== "all")
            result = result.filter((p) => p.type === typeFilter);
        if (search)
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(search.toLowerCase()) ||
                    p.category.toLowerCase().includes(search.toLowerCase()),
            );
        setFiltered(result);
    }, [search, typeFilter, products]);

    return (
        <div className="p-4 sm:p-8">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Products
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {products.length} total products
                    </p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-2xl font-semibold text-sm hover:bg-orange-500 hover:text-white transition-all"
                >
                    <Plus className="w-4 h-4" />
                    Add Product
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
                <div className="relative flex-1 min-w-48">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-2xl text-sm focus:outline-none focus:border-orange-400"
                    />
                </div>
                <div className="flex gap-2 bg-gray-100 dark:bg-zinc-800 p-1.5 rounded-2xl">
                    {["all", "polo", "tshirt", "hoodie"].map((t) => (
                        <button
                            key={t}
                            onClick={() => setTypeFilter(t)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${typeFilter === t ? "bg-white dark:bg-zinc-900 shadow-sm" : "text-gray-500 hover:text-black dark:hover:text-white"}`}
                        >
                            {t === "all" ? "All" : TYPE_LABELS[t]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-64 bg-gray-100 dark:bg-zinc-800 rounded-3xl animate-pulse"
                        />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-24">
                    <Package className="w-14 h-14 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No products found</p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filtered.map((product) => {
                        const totalStock = (product.sizes || []).reduce(
                            (s: number, sz: any) => s + (sz.stockCount || 0),
                            0,
                        );
                        const originalPrice =
                            product.originalPrice ?? product.original_price;
                        const reviewCount =
                            product.reviewCount ?? product.review_count ?? 0;

                        return (
                            <Link
                                key={product.id}
                                href={`/admin/products/${product.id}`}
                                className="group bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 overflow-hidden hover:border-orange-200 dark:hover:border-orange-800 hover:shadow-lg transition-all"
                            >
                                {/* Image */}
                                <div className="relative aspect-square bg-gray-50 dark:bg-zinc-800 overflow-hidden">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        sizes="25vw"
                                    />
                                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                                        <span className="bg-black/70 text-white text-xs px-2.5 py-1 rounded-full capitalize">
                                            {TYPE_LABELS[product.type] ||
                                                product.type}
                                        </span>
                                        {originalPrice && (
                                            <span className="bg-red-500 text-white text-xs px-2.5 py-1 rounded-full">
                                                SALE
                                            </span>
                                        )}
                                        {product.trending && (
                                            <span className="bg-orange-500 text-white text-xs px-2.5 py-1 rounded-full">
                                                Trending
                                            </span>
                                        )}
                                    </div>
                                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-zinc-900/90 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Pencil className="w-3.5 h-3.5 text-gray-600" />
                                    </div>
                                </div>

                                <div className="p-4">
                                    <p className="font-semibold text-sm leading-tight line-clamp-1 mb-1">
                                        {product.name}
                                    </p>

                                    <div className="flex items-center gap-1 mb-3">
                                        <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                                        <span className="text-xs text-gray-500">
                                            {product.rating} ({reviewCount})
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="font-bold">
                                                ₦{product.price}
                                            </span>
                                            {originalPrice && (
                                                <span className="line-through text-gray-400 text-xs ml-1.5">
                                                    ₦{originalPrice}
                                                </span>
                                            )}
                                        </div>
                                        <span
                                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${totalStock > 5 ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" : totalStock > 0 ? "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400" : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"}`}
                                        >
                                            {totalStock > 0
                                                ? `${totalStock} in stock`
                                                : "Out of stock"}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

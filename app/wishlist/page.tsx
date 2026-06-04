"use client";
import { useWishlistStore } from "@/lib/wishlistStore";
import { useCartStore } from "@/lib/cartStore";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function WishlistPage() {
    const { items, removeFromWishlist } = useWishlistStore();
    const addToCart = useCartStore((s) => s.addToCart);

    const handleMoveToCart = (product: (typeof items)[0]) => {
        const available = product.sizes.find((s) => s.inStock);
        if (!available) {
            toast.error("This product is out of stock");
            return;
        }
        addToCart(product, available.size, product.colors[0]?.name ?? "");
        removeFromWishlist(product.id);
        toast.success("Moved to cart!", {
            description: `${product.name} • ${available.size}`,
        });
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-4xl font-bold flex items-center gap-3">
                        <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                        Wishlist
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {items.length} saved{" "}
                        {items.length === 1 ? "item" : "items"}
                    </p>
                </div>
                {items.length > 0 && (
                    <Link
                        href="/"
                        className="text-sm text-(--accent-hex) font-medium hover:underline"
                    >
                        Continue shopping →
                    </Link>
                )}
            </div>

            {items.length === 0 ? (
                <div className="text-center py-28">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Heart className="w-12 h-12 text-gray-300 dark:text-zinc-600" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-3">
                        Your wishlist is empty
                    </h2>
                    <p className="text-gray-500 mb-8">
                        Save items you love and come back to them later.
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-black dark:bg-white text-white dark:text-black px-10 py-4 rounded-2xl font-semibold hover:bg-orange-500 hover:text-white transition-all"
                    >
                        Explore Collection
                    </Link>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {items.map((product) => {
                            const originalPrice =
                                product.originalPrice ?? product.original_price;
                            const reviewCount =
                                product.reviewCount ?? product.review_count ?? 0;

                            return (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                    className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 overflow-hidden group"
                                >
                                    <Link href={`/products/${product.id}`}>
                                        <div className="relative aspect-square overflow-hidden">
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                sizes="(max-width: 640px) 100vw, 33vw"
                                            />
                                            {originalPrice && (
                                                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                    SALE
                                                </span>
                                            )}
                                        </div>
                                    </Link>

                                    <div className="p-5">
                                        <Link href={`/products/${product.id}`}>
                                            <p className="text-xs text-gray-400 mb-1">
                                                {product.category}
                                            </p>
                                            <h3 className="font-semibold mb-2 hover:text-(--accent-hex) transition-colors">
                                                {product.name}
                                            </h3>
                                        </Link>

                                        <div className="flex items-baseline gap-2 mb-5">
                                            <span className="text-xl font-bold">
                                                ₦{product.price}
                                            </span>
                                            {originalPrice && (
                                                <span className="line-through text-gray-400 text-sm">
                                                    ₦{originalPrice}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    handleMoveToCart(product)
                                                }
                                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-medium text-sm hover:bg-orange-500 hover:text-white transition-all"
                                            >
                                                <ShoppingCart className="w-4 h-4" />
                                                Add to Cart
                                            </button>
                                            <button
                                                onClick={() => {
                                                    removeFromWishlist(
                                                        product.id,
                                                    );
                                                    toast.info("Removed from wishlist");
                                                }}
                                                className="p-3 border border-gray-200 dark:border-zinc-700 rounded-xl hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}

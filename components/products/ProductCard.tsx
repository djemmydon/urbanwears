"use client";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Product } from "@/lib/types";
import { useCartStore } from "@/lib/cartStore";
import { useWishlistStore } from "@/lib/wishlistStore";
import { toast } from "sonner";

export default function ProductCard({ product }: { product: Product }) {
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
    const addToCart = useCartStore((s) => s.addToCart);

    const originalPrice = product.originalPrice ?? product.original_price;
    const reviewCount = product.reviewCount ?? product.review_count ?? 0;
    const inWishlist = isInWishlist(product.id);
    const totalStock = product.sizes.reduce((s, sz) => s + (sz.stockCount ?? 0), 0);

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        const available = product.sizes.find((s) => s.inStock);
        if (!available) { toast.error("Out of stock"); return; }
        addToCart(product, available.size, product.colors[0]?.name ?? "");
        toast.success(`${product.name} added!`, { description: `Size: ${available.size}` });
    };

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        if (inWishlist) {
            removeFromWishlist(product.id);
            toast.info("Removed from wishlist");
        } else {
            addToWishlist(product);
            toast.success("Added to wishlist");
        }
    };

    return (
        <Link href={`/products/${product.id}`} className="group block">
            {/* Image container */}
            <div className="relative overflow-hidden bg-gray-100 dark:bg-zinc-800" style={{ aspectRatio: "3/4" }}>
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />

                {/* Top badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                    {originalPrice && (
                        <span className="bg-(--accent-hex) text-white text-[9px] font-black px-2 py-1 uppercase tracking-widest">
                            Sale
                        </span>
                    )}
                    {product.trending && (
                        <span className="bg-black text-white text-[9px] font-black px-2 py-1 uppercase tracking-widest">
                            Hot
                        </span>
                    )}
                    {totalStock > 0 && totalStock <= 5 && (
                        <span className="bg-white text-black text-[9px] font-black px-2 py-1 uppercase tracking-widest">
                            Low stock
                        </span>
                    )}
                </div>

                {/* Wishlist */}
                <button
                    onClick={handleWishlist}
                    className={`absolute top-2 right-2 w-8 h-8 flex items-center justify-center transition-all duration-200 ${
                        inWishlist
                            ? "bg-red-500 text-white"
                            : "bg-white/90 dark:bg-zinc-800/90 text-gray-600 dark:text-gray-300 opacity-0 group-hover:opacity-100"
                    }`}
                >
                    <Heart className={`w-3.5 h-3.5 ${inWishlist ? "fill-white" : ""}`} />
                </button>

                {/* Quick add — slides up on hover */}
                <button
                    onClick={handleQuickAdd}
                    className="absolute bottom-0 left-0 right-0 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-[3px] py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hover:bg-orange-500 dark:hover:bg-orange-500 hover:text-white flex items-center justify-center gap-2"
                >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Quick Add
                </button>
            </div>

            {/* Info */}
            <div className="pt-3 pb-1">
                <p className="text-[9px] uppercase tracking-[3px] text-gray-400 dark:text-zinc-500 mb-1">
                    {product.category}
                </p>
                <h3 className="font-bold text-sm uppercase leading-tight line-clamp-1 mb-1.5">
                    {product.name}
                </h3>

                <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                            key={i}
                            className={`w-3 h-3 ${
                                i <= Math.floor(product.rating)
                                    ? "fill-(--accent-hex) text-(--accent-hex)"
                                    : "text-gray-200 dark:text-zinc-700"
                            }`}
                        />
                    ))}
                    <span className="text-[10px] text-gray-400 ml-1">({reviewCount})</span>
                </div>

                <div className="flex items-baseline gap-2">
                    <span className="font-black text-base">₦{product.price}</span>
                    {originalPrice && (
                        <span className="line-through text-gray-400 text-sm">₦{originalPrice}</span>
                    )}
                </div>
            </div>
        </Link>
    );
}

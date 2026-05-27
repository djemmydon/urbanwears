"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Star, Share2 } from "lucide-react";
import SizeSelector from "@/components/products/SizeSelector";
import ProductViewer3D from "@/components/products/ProductViewer3D";
import ImageCarousel from "@/components/products/ImageCarousel";
import { useCartStore } from "@/lib/cartStore";
import { useWishlistStore } from "@/lib/wishlistStore";
import { toast } from "sonner";
import ReviewsSection from "@/components/products/ReviewsSection";
import RatingForm from "@/components/products/RatingForm";
import { fetchProduct } from "@/lib/api";
import { Product } from "@/lib/types";
import { Heart } from "lucide-react";

export default function ProductDetail() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [refreshReviews, setRefreshReviews] = useState(0);

    const addToCart = useCartStore((s) => s.addToCart);
    const { addToWishlist, removeFromWishlist, isInWishlist } =
        useWishlistStore();

    useEffect(() => {
        fetchProduct(params.id as string)
            .then((p) => {
                setProduct(p);
                setSelectedColor(p.colors?.[0]?.hex ?? "");
            })
            .catch(() => setProduct(null))
            .finally(() => setLoading(false));
    }, [params.id]);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-2 gap-12 animate-pulse">
                    <div className="aspect-[4/4.2] bg-gray-200 dark:bg-zinc-800 rounded-3xl" />
                    <div className="space-y-6">
                        <div className="h-10 bg-gray-200 dark:bg-zinc-800 rounded-2xl w-3/4" />
                        <div className="h-5 bg-gray-200 dark:bg-zinc-800 rounded-xl w-1/2" />
                        <div className="h-8 bg-gray-200 dark:bg-zinc-800 rounded-xl w-1/4" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-32">
                <p className="text-2xl text-gray-500 mb-6">
                    Product not found
                </p>
                <Link
                    href="/"
                    className="bg-black text-white px-8 py-4 rounded-2xl"
                >
                    Back to Shop
                </Link>
            </div>
        );
    }

    const reviewCount = product.reviewCount ?? product.review_count ?? 0;
    const originalPrice = product.originalPrice ?? product.original_price;
    const inWishlist = isInWishlist(product.id);

    const handleAddToCart = () => {
        if (!selectedSize) {
            toast.error("Please select a size");
            return;
        }
        const colorName =
            product.colors.find((c) => c.hex === selectedColor)?.name ||
            "Default";
        addToCart(product, selectedSize, colorName);
        toast.success("Added to cart!", {
            description: `${product.name} • ${selectedSize} • ${colorName}`,
        });
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm mb-10 hover:text-(--accent-hex) transition-colors"
            >
                <ArrowLeft size={18} /> Back to Shop
            </Link>

            <div className="grid lg:grid-cols-2 gap-14">
                {/* Images — real photos when available, 3D viewer as fallback */}
                {product.images && product.images.length > 0 ? (
                    <ImageCarousel
                        images={product.images}
                        alt={product.name}
                    />
                ) : (
                    <ProductViewer3D
                        type={product.type}
                        color={selectedColor}
                    />
                )}

                <div className="space-y-8">
                    {/* Title + Actions */}
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-1">
                                {product.category}
                            </p>
                            <h1 className="font-display text-4xl lg:text-5xl font-semibold tracking-tight leading-tight">
                                {product.name}
                            </h1>
                        </div>
                        <div className="flex gap-2 mt-1">
                            <button
                                onClick={() =>
                                    inWishlist
                                        ? removeFromWishlist(product.id)
                                        : addToWishlist(product)
                                }
                                className={`p-3 rounded-2xl border transition-all ${inWishlist ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800" : "border-gray-200 dark:border-zinc-700 hover:border-red-300"}`}
                            >
                                <Heart
                                    className={`w-5 h-5 ${inWishlist ? "fill-red-500 text-red-500" : "text-gray-500"}`}
                                />
                            </button>
                            <button
                                onClick={handleShare}
                                className="p-3 rounded-2xl border border-gray-200 dark:border-zinc-700 hover:border-gray-400 transition-all"
                            >
                                <Share2 className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-3">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-5 h-5 ${i < Math.round(product.rating) ? "fill-(--accent-hex) text-(--accent-hex)" : "text-gray-300 dark:text-zinc-600"}`}
                                />
                            ))}
                        </div>
                        <span className="font-semibold">
                            {product.rating.toFixed(1)}
                        </span>
                        <span className="text-gray-500">
                            ({reviewCount} reviews)
                        </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-4">
                        <span className="text-4xl font-bold">
                            ₦{product.price}
                        </span>
                        {originalPrice && (
                            <>
                                <span className="line-through text-gray-400 text-xl">
                                    ₦{originalPrice}
                                </span>
                                <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-semibold px-3 py-1 rounded-full">
                                    Save ₦
                                    {(originalPrice - product.price).toFixed(0)}
                                </span>
                            </>
                        )}
                    </div>

                    {/* Description */}
                    <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400">
                        {product.description}
                    </p>

                    {/* Color Selector */}
                    <div>
                        <p className="font-semibold mb-3">
                            Color:{" "}
                            <span className="font-normal text-gray-500">
                                {product.colors.find(
                                    (c) => c.hex === selectedColor,
                                )?.name}
                            </span>
                        </p>
                        <div className="flex gap-3">
                            {product.colors.map((c) => (
                                <button
                                    key={c.hex}
                                    onClick={() => setSelectedColor(c.hex)}
                                    title={c.name}
                                    className={`w-11 h-11 rounded-2xl border-4 transition-all hover:scale-110 ${selectedColor === c.hex ? "border-black dark:border-white scale-110" : "border-white dark:border-zinc-700 shadow-md"}`}
                                    style={{ backgroundColor: c.hex }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Size Selector */}
                    <SizeSelector
                        sizes={product.sizes}
                        onSizeSelect={setSelectedSize}
                    />

                    {/* Add to Cart */}
                    <button
                        onClick={handleAddToCart}
                        className="w-full py-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold text-lg hover:bg-(--accent-hex) hover:text-black active:scale-[0.98] transition-all"
                    >
                        Add to Cart
                    </button>

                    {/* Reviews */}
                    <ReviewsSection
                        productId={product.id}
                        refreshTrigger={refreshReviews}
                    />
                    <RatingForm
                        productId={product.id}
                        onReviewSubmitted={() =>
                            setRefreshReviews((n) => n + 1)
                        }
                    />
                </div>
            </div>
        </div>
    );
}

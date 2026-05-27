"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Trash2, Star, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ProductForm, { ProductFormData } from "@/components/admin/ProductForm";
import { Product } from "@/lib/types";

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        fetch(`/api/products/${id}`)
            .then((r) => r.json())
            .then((data) => setProduct(data))
            .catch(() => setError("Failed to load product"))
            .finally(() => setLoading(false));
    }, [id]);

    const handleSubmit = async (data: ProductFormData) => {
        setSubmitting(true);
        setError("");
        setSuccess("");
        try {
            const body = {
                name: data.name,
                type: data.type,
                category: data.category,
                price: parseFloat(data.price),
                original_price: data.original_price ? parseFloat(data.original_price) : null,
                description: data.description,
                image: data.images[0] || data.image,
                images: data.images,
                trending: data.trending,
                sizes: data.sizes,
                colors: data.colors,
            };
            const res = await fetch(`/api/products/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to update product");
            }
            const updated = await res.json();
            setProduct(updated);
            setSuccess("Product updated successfully!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete product");
            router.push("/admin/products");
        } catch (e: any) {
            setError(e.message);
            setDeleting(false);
            setConfirmDelete(false);
        }
    };

    if (loading) {
        return (
            <div className="p-4 sm:p-8 max-w-3xl mx-auto">
                <div className="h-8 w-48 bg-gray-200 dark:bg-zinc-700 rounded-xl animate-pulse mb-8" />
                <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-100 dark:bg-zinc-800 rounded-3xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="p-8 text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Product not found</p>
                <Link href="/admin/products" className="text-orange-500 text-sm mt-2 inline-block">
                    Back to products
                </Link>
            </div>
        );
    }

    const totalStock = (product.sizes || []).reduce(
        (s: number, sz: any) => s + (sz.stockCount || 0),
        0,
    );
    const reviewCount = product.reviewCount ?? product.review_count ?? 0;

    return (
        <div className="p-4 sm:p-8 max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/products"
                        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white line-clamp-1">
                            {product.name}
                        </h1>
                        <p className="text-gray-500 text-sm mt-0.5">Edit product details</p>
                    </div>
                </div>
                <button
                    onClick={() => setConfirmDelete(true)}
                    className="flex items-center gap-2 px-4 py-2.5 text-red-600 border border-red-200 dark:border-red-800 rounded-xl text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete
                </button>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-4 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                        <span className="font-bold text-gray-900 dark:text-white">
                            {product.rating ?? 0}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500">Rating</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-4 text-center">
                    <p className="font-bold text-gray-900 dark:text-white mb-1">{reviewCount}</p>
                    <p className="text-xs text-gray-500">Reviews</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-4 text-center">
                    <p className={`font-bold mb-1 ${totalStock === 0 ? "text-red-500" : totalStock < 10 ? "text-orange-500" : "text-green-600"}`}>
                        {totalStock}
                    </p>
                    <p className="text-xs text-gray-500">Total Stock</p>
                </div>
            </div>

            {/* Product preview thumbnail */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 p-4 flex items-center gap-4 mb-8">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 dark:bg-zinc-800 flex-shrink-0">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                    />
                </div>
                <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{product.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 capitalize">{product.type} · {product.category}</p>
                    <p className="text-sm font-bold text-orange-500 mt-1">₦{product.price}</p>
                </div>
            </div>

            {/* Messages */}
            {error && (
                <div className="mb-6 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-sm text-red-700 dark:text-red-400">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-6 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl text-sm text-green-700 dark:text-green-400">
                    {success}
                </div>
            )}

            <ProductForm
                initial={product}
                onSubmit={handleSubmit}
                submitting={submitting}
                submitLabel="Save Changes"
            />

            {/* Delete confirm modal */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mb-4">
                            <Trash2 className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                            Delete Product?
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            This will permanently delete <strong>{product.name}</strong>. This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmDelete(false)}
                                className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-zinc-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex-1 py-3 rounded-2xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-60"
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

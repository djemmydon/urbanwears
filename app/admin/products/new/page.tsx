"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProductForm, { ProductFormData } from "@/components/admin/ProductForm";

export default function NewProductPage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (data: ProductFormData) => {
        setSubmitting(true);
        setError("");
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
                rating: 0,
                review_count: 0,
            };
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to create product");
            }
            router.push("/admin/products");
        } catch (e: any) {
            setError(e.message);
            setSubmitting(false);
        }
    };

    return (
        <div className="p-4 sm:p-8 max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/products"
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Add New Product
                    </h1>
                    <p className="text-gray-500 text-sm mt-0.5">
                        Fill in the details below to add a product
                    </p>
                </div>
            </div>

            {error && (
                <div className="mb-6 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-sm text-red-700 dark:text-red-400">
                    {error}
                </div>
            )}

            <ProductForm
                onSubmit={handleSubmit}
                submitting={submitting}
                submitLabel="Create Product"
            />
        </div>
    );
}

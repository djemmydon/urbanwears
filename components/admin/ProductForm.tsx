"use client";
import { useRef, useState } from "react";
import { Plus, Trash2, X, Upload, ImageIcon } from "lucide-react";
import Image from "next/image";
import { Product } from "@/lib/types";

type SizeEntry = { size: string; inStock: boolean; stockCount: number };
type ColorEntry = { name: string; hex: string };

export type ProductFormData = {
    name: string;
    type: Product["type"];
    category: string;
    price: string;
    original_price: string;
    description: string;
    image: string;
    images: string[];
    trending: boolean;
    sizes: SizeEntry[];
    colors: ColorEntry[];
};

const CATEGORIES: Record<string, string[]> = {
    polo: ["Polo", "Classic Polo", "Performance Polo", "Slim Fit Polo", "Premium Polo"],
    tshirt: ["T-Shirt", "Essential Tee", "Graphic Tee", "Oversized Tee", "Vintage Tee"],
    hoodie: ["Hoodie", "Pullover Hoodie", "Zip-Up Hoodie", "Premium Hoodie", "Fleece Hoodie"],
    "Tan top": ["Tank Top", "Basic Tank", "Muscle Tank", "Crop Tank", "Ribbed Tank"],
    socks: ["Socks", "Crew Socks", "Ankle Socks", "Athletic Socks", "No-Show Socks"],
    joggers: ["Joggers", "Slim Joggers", "Relaxed Joggers", "Fleece Joggers", "Cargo Joggers"],
    "2 piece set": ["2 Piece Set", "Matching Set", "Coordinated Set", "Tracksuit Set"],
    "beanie Hat": ["Beanie", "Classic Beanie", "Slouch Beanie", "Cuffed Beanie", "Ribbed Beanie"],
};

const DEFAULT_SIZES: SizeEntry[] = [
    { size: "M", inStock: true, stockCount: 10 },
    { size: "L", inStock: true, stockCount: 10 },
    { size: "XL", inStock: true, stockCount: 10 },
    { size: "XXL", inStock: true, stockCount: 10 },
];

function buildInitial(product?: Product): ProductFormData {
    if (!product) {
        return {
            name: "",
            type: "tshirt",
            category: "",
            price: "",
            original_price: "",
            description: "",
            image: "",
            images: [],
            trending: false,
            sizes: DEFAULT_SIZES,
            colors: [{ name: "Black", hex: "#000000" }],
        };
    }
    const op = product.originalPrice ?? product.original_price;
    const imgs =
        product.images && product.images.length > 0
            ? product.images
            : product.image
            ? [product.image]
            : [];
    return {
        name: product.name,
        type: product.type,
        category: product.category,
        price: String(product.price),
        original_price: op ? String(op) : "",
        description: product.description,
        image: imgs[0] || product.image,
        images: imgs,
        trending: product.trending ?? false,
        sizes: (product.sizes || []).map((s) => ({
            size: s.size,
            inStock: s.inStock,
            stockCount: s.stockCount ?? 0,
        })),
        colors: product.colors || [],
    };
}

export default function ProductForm({
    initial,
    onSubmit,
    submitting,
    submitLabel,
}: {
    initial?: Product;
    onSubmit: (data: ProductFormData) => void;
    submitting: boolean;
    submitLabel: string;
}) {
    const [form, setForm] = useState<ProductFormData>(() => buildInitial(initial));
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const set = (field: keyof ProductFormData, val: any) =>
        setForm((f) => ({ ...f, [field]: val }));

    // ── Images ─────────────────────────────────────────────────
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadError("");
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || "Upload failed");
            const newImages = [...form.images, json.url];
            setForm((f) => ({
                ...f,
                images: newImages,
                image: newImages[0],
            }));
        } catch (err: any) {
            setUploadError(err.message);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const removeImage = (i: number) => {
        const newImages = form.images.filter((_, idx) => idx !== i);
        setForm((f) => ({
            ...f,
            images: newImages,
            image: newImages[0] || "",
        }));
    };

    // ── Sizes ──────────────────────────────────────────────────
    const updateSize = (i: number, field: keyof SizeEntry, val: any) => {
        const sizes = [...form.sizes];
        sizes[i] = { ...sizes[i], [field]: val };
        if (field === "stockCount") sizes[i].inStock = Number(val) > 0;
        set("sizes", sizes);
    };

    const addSize = () => {
        const used = new Set(form.sizes.map((s) => s.size));
        const next = ["M", "L", "XL", "XXL", "XXXL", "XS"].find((s) => !used.has(s));
        if (next)
            set("sizes", [
                ...form.sizes,
                { size: next, inStock: true, stockCount: 10 },
            ]);
    };

    const removeSize = (i: number) =>
        set("sizes", form.sizes.filter((_, idx) => idx !== i));

    // ── Colors ─────────────────────────────────────────────────
    const updateColor = (i: number, field: keyof ColorEntry, val: string) => {
        const colors = [...form.colors];
        colors[i] = { ...colors[i], [field]: val };
        set("colors", colors);
    };

    const addColor = () =>
        set("colors", [...form.colors, { name: "New Color", hex: "#cccccc" }]);

    const removeColor = (i: number) =>
        set("colors", form.colors.filter((_, idx) => idx !== i));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    const inputClass =
        "w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl text-sm focus:outline-none focus:border-orange-400 transition-colors";
    const labelClass =
        "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2";

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 p-6">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-5">
                    Basic Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                        <label className={labelClass}>Product Name *</label>
                        <input
                            required
                            type="text"
                            value={form.name}
                            onChange={(e) => set("name", e.target.value)}
                            placeholder="e.g. Essential Black Polo"
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Type *</label>
                        <select
                            value={form.type}
                            onChange={(e) => {
                                const t = e.target.value as typeof form.type;
                                set("type", t);
                                if (!CATEGORIES[t]?.includes(form.category)) {
                                    set("category", CATEGORIES[t][0]);
                                }
                            }}
                            className={inputClass}
                        >
                            <option value="polo">Polo</option>
                            <option value="tshirt">T-Shirt</option>
                            <option value="hoodie">Hoodie</option>
                            <option value="Tan top">Tank Top</option>
                            <option value="socks">Socks</option>
                            <option value="joggers">Joggers</option>
                            <option value="2 piece set">2 Piece Set</option>
                            <option value="beanie Hat">Beanie Hat</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Category *</label>
                        <select
                            required
                            value={form.category}
                            onChange={(e) => set("category", e.target.value)}
                            className={inputClass}
                        >
                            <option value="">Select category</option>
                            {(CATEGORIES[form.type] ?? []).map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Price (₦) *</label>
                        <input
                            required
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.price}
                            onChange={(e) => set("price", e.target.value)}
                            placeholder="85.00"
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>
                            Original Price (₦){" "}
                            <span className="text-gray-400 font-normal">
                                (optional, for discount)
                            </span>
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.original_price}
                            onChange={(e) => set("original_price", e.target.value)}
                            placeholder="110.00"
                            className={inputClass}
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className={labelClass}>Description *</label>
                        <textarea
                            required
                            rows={3}
                            value={form.description}
                            onChange={(e) => set("description", e.target.value)}
                            placeholder="Describe the product..."
                            className={`${inputClass} resize-none`}
                        />
                    </div>
                    <div className="sm:col-span-2 flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="trending"
                            checked={form.trending}
                            onChange={(e) => set("trending", e.target.checked)}
                            className="w-4 h-4 accent-orange-500"
                        />
                        <label
                            htmlFor="trending"
                            className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                        >
                            Mark as Trending (shows in Editor's Picks section)
                        </label>
                    </div>
                </div>
            </div>

            {/* Images */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 p-6">
                <div className="mb-5">
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                        Product Images
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                        Upload up to 4 images (JPEG, PNG, WebP · max 5 MB each). The
                        first image is the primary thumbnail.
                    </p>
                </div>

                {uploadError && (
                    <p className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-xl">
                        {uploadError}
                    </p>
                )}

                <div className="grid grid-cols-4 gap-3">
                    {form.images.map((url, i) => (
                        <div key={i} className="aspect-square relative group">
                            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-700">
                                <Image
                                    src={url}
                                    alt={`Product image ${i + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="150px"
                                />
                                {i === 0 && (
                                    <div className="absolute top-1.5 left-1.5 bg-orange-500 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                                        Primary
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => removeImage(i)}
                                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                >
                                    <X className="w-3 h-3 text-white" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {form.images.length < 4 && (
                        <label
                            className={`aspect-square flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-700 cursor-pointer hover:border-orange-400 hover:bg-orange-50/50 dark:hover:bg-orange-900/10 transition-colors ${
                                uploading ? "opacity-50 pointer-events-none" : ""
                            }`}
                        >
                            {uploading ? (
                                <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Upload className="w-5 h-5 text-gray-400 mb-1.5" />
                                    <span className="text-xs text-gray-400 text-center leading-tight">
                                        {form.images.length === 0
                                            ? "Add primary image"
                                            : "Add image"}
                                    </span>
                                </>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                className="hidden"
                                onChange={handleImageUpload}
                                disabled={uploading}
                            />
                        </label>
                    )}

                    {/* Empty placeholder slots (visual only) */}
                    {Array.from({
                        length: Math.max(
                            0,
                            3 - form.images.length - (form.images.length < 4 ? 1 : 0),
                        ),
                    }).map((_, i) => (
                        <div
                            key={`empty-${i}`}
                            className="aspect-square rounded-2xl border-2 border-dashed border-gray-100 dark:border-zinc-800 flex items-center justify-center"
                        >
                            <ImageIcon className="w-5 h-5 text-gray-200 dark:text-zinc-700" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Sizes */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 p-6">
                <div className="flex justify-between items-center mb-5">
                    <div>
                        <h2 className="font-semibold text-gray-900 dark:text-white">
                            Sizes & Stock
                        </h2>
                        {form.sizes.length > 0 && (
                            <p className="text-xs text-gray-400 mt-0.5">
                                Total:{" "}
                                <span className={`font-semibold ${
                                    form.sizes.reduce((s, x) => s + x.stockCount, 0) === 0
                                        ? "text-red-500"
                                        : form.sizes.reduce((s, x) => s + x.stockCount, 0) < 10
                                        ? "text-orange-500"
                                        : "text-green-600"
                                }`}>
                                    {form.sizes.reduce((s, x) => s + x.stockCount, 0)} units in stock
                                </span>
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={addSize}
                        className="flex items-center gap-1.5 text-sm text-orange-500 hover:text-orange-600 font-medium"
                    >
                        <Plus className="w-4 h-4" /> Add Size
                    </button>
                </div>
                <div className="space-y-3">
                    <div className="grid grid-cols-12 gap-3 text-xs font-medium text-gray-400 px-2">
                        <span className="col-span-3">Size</span>
                        <span className="col-span-5">Stock Count</span>
                        <span className="col-span-3">In Stock</span>
                    </div>
                    {/* Per-size stock summary pills */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {form.sizes.map((s) => (
                            <span
                                key={s.size}
                                className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
                                    s.stockCount === 0
                                        ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                                        : s.stockCount < 5
                                        ? "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
                                        : "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                                }`}
                            >
                                <span className="font-bold">{s.size}</span>
                                <span className="opacity-70">·</span>
                                {s.stockCount === 0 ? "Out" : `${s.stockCount} left`}
                            </span>
                        ))}
                    </div>

                    {form.sizes.map((s, i) => (
                        <div key={i} className="grid grid-cols-12 gap-3 items-center">
                            <input
                                type="text"
                                value={s.size}
                                onChange={(e) =>
                                    updateSize(i, "size", e.target.value)
                                }
                                className="col-span-3 px-3 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:border-orange-400"
                            />
                            <input
                                type="number"
                                min="0"
                                value={s.stockCount}
                                onChange={(e) =>
                                    updateSize(i, "stockCount", Number(e.target.value))
                                }
                                className="col-span-5 px-3 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:border-orange-400"
                            />
                            <div className="col-span-3 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={s.inStock}
                                    onChange={(e) =>
                                        updateSize(i, "inStock", e.target.checked)
                                    }
                                    className="w-4 h-4 accent-orange-500"
                                />
                                <span className="text-xs text-gray-500">
                                    {s.inStock ? "Available" : "Sold out"}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeSize(i)}
                                className="col-span-1 flex justify-end text-gray-300 hover:text-red-500 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Colors */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 p-6">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                        Colors
                    </h2>
                    <button
                        type="button"
                        onClick={addColor}
                        className="flex items-center gap-1.5 text-sm text-orange-500 hover:text-orange-600 font-medium"
                    >
                        <Plus className="w-4 h-4" /> Add Color
                    </button>
                </div>
                <div className="space-y-3">
                    {form.colors.map((c, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="relative">
                                <input
                                    type="color"
                                    value={c.hex}
                                    onChange={(e) =>
                                        updateColor(i, "hex", e.target.value)
                                    }
                                    className="w-11 h-11 rounded-xl border border-gray-200 dark:border-zinc-700 cursor-pointer p-1 bg-transparent"
                                />
                            </div>
                            <input
                                type="text"
                                value={c.name}
                                onChange={(e) =>
                                    updateColor(i, "name", e.target.value)
                                }
                                placeholder="Color name"
                                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl text-sm focus:outline-none focus:border-orange-400"
                            />
                            <input
                                type="text"
                                value={c.hex}
                                onChange={(e) =>
                                    updateColor(i, "hex", e.target.value)
                                }
                                placeholder="#000000"
                                className="w-28 px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl text-sm font-mono focus:outline-none focus:border-orange-400"
                            />
                            <button
                                type="button"
                                onClick={() => removeColor(i)}
                                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={submitting || uploading}
                className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold text-base hover:bg-orange-500 hover:text-white transition-all disabled:opacity-60 active:scale-[0.99]"
            >
                {submitting ? "Saving..." : submitLabel}
            </button>
        </form>
    );
}

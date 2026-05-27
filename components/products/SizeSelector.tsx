"use client";
import { useState } from "react";

interface Size {
    size: "M" | "L" | "XL" | "XXL";
    inStock: boolean;
    stockCount?: number;
}

interface SizeSelectorProps {
    sizes: Size[];
    onSizeSelect?: (size: string) => void;
}

export default function SizeSelector({
    sizes,
    onSizeSelect,
}: SizeSelectorProps) {
    const [selectedSize, setSelectedSize] = useState<string>("");

    const handleSelect = (size: string, inStock: boolean) => {
        if (!inStock) return;
        setSelectedSize(size);
        onSizeSelect?.(size);
    };

    const totalStock = sizes.reduce((sum, s) => sum + (s.stockCount ?? 0), 0);

    return (
        <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
                <p className="font-medium">Select Size</p>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    totalStock === 0
                        ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                        : totalStock < 10
                        ? "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
                        : "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                }`}>
                    {totalStock === 0 ? "Out of stock" : `${totalStock} in stock`}
                </span>
            </div>
            <div className="flex gap-3 flex-wrap">
                {sizes.map(({ size, inStock, stockCount }) => (
                    <button
                        key={size}
                        onClick={() => handleSelect(size, inStock)}
                        disabled={!inStock}
                        className={`w-16 h-16 rounded-2xl font-semibold text-lg transition-all border flex flex-col items-center justify-center
                            ${
                                selectedSize === size
                                    ? "bg-black dark:bg-white text-white dark:text-black border-black"
                                    : inStock
                                      ? "border-gray-300 dark:border-zinc-700 hover:border-black dark:hover:border-white"
                                      : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-60 line-through"
                            }`}
                    >
                        <span>{size}</span>
                        {inStock && stockCount !== undefined && stockCount > 0 && (
                            <span className={`text-[10px] font-normal ${
                                stockCount <= 5 ? "text-orange-500" : "text-gray-400 dark:text-zinc-500"
                            }`}>
                                {stockCount <= 5 ? `${stockCount} left` : `${stockCount}`}
                            </span>
                        )}
                        {!inStock && (
                            <span className="text-[10px] font-normal text-gray-400">
                                Out
                            </span>
                        )}
                    </button>
                ))}
            </div>
            {!selectedSize && (
                <p className="text-sm text-gray-500 mt-3">
                    Choose your size to continue
                </p>
            )}
        </div>
    );
}

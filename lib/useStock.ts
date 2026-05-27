"use client";
import { useState } from "react";
import { products as initialProducts } from "./mockData";
import { Product } from "./types";

export function useStock() {
    const [stock, setStock] = useState<Record<string, Product>>(() => {
        const stockMap: Record<string, Product> = {};
        initialProducts.forEach((product) => {
            stockMap[product.id] = { ...product };
        });
        return stockMap;
    });

    const deductStock = (
        productId: string,
        size: string,
        quantity: number = 1,
    ) => {
        setStock((prev) => {
            const product = prev[productId];
            if (!product) return prev;

            const updatedSizes = product.sizes.map((s) => {
                if (s.size === size) {
                    const newCount = Math.max(
                        0,
                        (s.stockCount || 0) - quantity,
                    );
                    return {
                        ...s,
                        stockCount: newCount,
                        inStock: newCount > 0,
                    };
                }
                return s;
            });

            return {
                ...prev,
                [productId]: { ...product, sizes: updatedSizes },
            };
        });
    };

    const getProductWithStock = (id: string) => stock[id] || null;

    return { deductStock, getProductWithStock, stock };
}

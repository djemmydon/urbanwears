"use client";
import { useCartStore } from "@/lib/cartStore";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight, Tag } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 10;

export default function CartModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } =
        useCartStore();

    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [isOpen, onClose]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    const subtotal = getTotalPrice();
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || items.length === 0 ? 0 : SHIPPING_COST;
    const total = subtotal + shipping;
    const itemCount = items.reduce((s, i) => s + i.quantity, 0);
    const toFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

    const handleCheckout = () => {
        onClose();
        window.location.href = "/checkout";
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-98 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                ref={panelRef}
                className={`fixed right-0 top-0 h-full z-99 w-full max-w-105 bg-white dark:bg-zinc-950 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-zinc-800 shrink-0">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-5 h-5 text-orange-500" />
                        <h2 className="font-bold text-lg text-gray-900 dark:text-white">
                            Your Cart
                        </h2>
                        {itemCount > 0 && (
                            <span className="bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                {itemCount}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                        aria-label="Close cart"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Free shipping progress */}
                {items.length > 0 && toFreeShipping > 0 && (
                    <div className="px-6 py-3 bg-orange-50 dark:bg-orange-900/20 border-b border-orange-100 dark:border-orange-900/30 shrink-0">
                        <div className="flex items-center gap-2 text-sm text-orange-700 dark:text-orange-400 mb-2">
                            <Tag className="w-3.5 h-3.5" />
                            <span>Add <strong>₦{toFreeShipping.toFixed(2)}</strong> more for free shipping!</span>
                        </div>
                        <div className="h-1.5 bg-orange-200 dark:bg-orange-900 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-orange-500 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                            />
                        </div>
                    </div>
                )}
                {items.length > 0 && toFreeShipping === 0 && (
                    <div className="px-6 py-2.5 bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-900/30 shrink-0">
                        <p className="text-sm text-green-700 dark:text-green-400 font-medium flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5" />
                            You've got free shipping!
                        </p>
                    </div>
                )}

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-16">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-800 rounded-3xl flex items-center justify-center mb-4">
                                <ShoppingBag className="w-9 h-9 text-gray-300 dark:text-zinc-600" />
                            </div>
                            <p className="font-semibold text-gray-900 dark:text-white mb-1">
                                Your cart is empty
                            </p>
                            <p className="text-sm text-gray-500 mb-6">
                                Add items to get started
                            </p>
                            <button
                                onClick={onClose}
                                className="flex items-center gap-2 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                            >
                                Continue Shopping
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        items.map((item) => {
                            const colorHex =
                                item.colors?.find((c) => c.name === item.selectedColor)?.hex;
                            const lineTotal = item.price * item.quantity;

                            return (
                                <div
                                    key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                                    className="flex gap-4 bg-gray-50 dark:bg-zinc-900 rounded-2xl p-3"
                                >
                                    {/* Image */}
                                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-white dark:bg-zinc-800">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                            sizes="80px"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="font-semibold text-sm leading-tight line-clamp-2 text-gray-900 dark:text-white">
                                                {item.name}
                                            </p>
                                            <button
                                                onClick={() => {
                                                    removeFromCart(
                                                        item.id,
                                                        item.selectedSize,
                                                        item.selectedColor,
                                                    );
                                                    toast.info("Item removed from cart");
                                                }}
                                                className="shrink-0 p-1 text-gray-300 hover:text-red-500 transition-colors"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        {/* Variant */}
                                        <div className="flex items-center gap-2 mt-1 mb-3">
                                            <span className="text-xs text-gray-500 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 px-2 py-0.5 rounded-full">
                                                {item.selectedSize}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs text-gray-500">
                                                {colorHex && (
                                                    <span
                                                        className="w-3 h-3 rounded-full border border-gray-200"
                                                        style={{ backgroundColor: colorHex }}
                                                    />
                                                )}
                                                {item.selectedColor}
                                            </span>
                                        </div>

                                        {/* Quantity + price */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-1">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            item.selectedSize,
                                                            item.selectedColor,
                                                            item.quantity - 1,
                                                        )
                                                    }
                                                    disabled={item.quantity <= 1}
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="w-7 text-center text-sm font-semibold">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            item.selectedSize,
                                                            item.selectedColor,
                                                            item.quantity + 1,
                                                        )
                                                    }
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <p className="font-bold text-sm text-gray-900 dark:text-white">
                                                ₦{lineTotal.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer / Order Summary */}
                {items.length > 0 && (
                    <div className="px-6 py-5 border-t border-gray-100 dark:border-zinc-800 shrink-0 space-y-4">
                        {/* Summary rows */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    ₦{subtotal.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Shipping</span>
                                <span className={`font-medium ${shipping === 0 ? "text-green-600" : "text-gray-900 dark:text-white"}`}>
                                    {shipping === 0 ? "Free" : `₦${shipping.toFixed(2)}`}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-zinc-800">
                                <span className="font-bold text-gray-900 dark:text-white">Total</span>
                                <span className="font-bold text-xl text-gray-900 dark:text-white">
                                    ₦{total.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* CTA buttons */}
                        <button
                            onClick={handleCheckout}
                            className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold text-sm hover:bg-orange-500 hover:text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            Checkout
                            <ArrowRight className="w-4 h-4" />
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full py-3 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

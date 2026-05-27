"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchOrders } from "@/lib/api";
import { useUserStore } from "@/lib/userStore";
import { Package, ChevronRight, Mail } from "lucide-react";

const statusColors: Record<string, string> = {
    paid: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    shipped: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    pending: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
};

export default function OrdersPage() {
    const { email } = useUserStore();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchEmail, setSearchEmail] = useState(email || "");
    const [queried, setQueried] = useState(false);

    const loadOrders = async (e?: string) => {
        const target = e ?? searchEmail;
        setLoading(true);
        try {
            const data = await fetchOrders(target || undefined);
            setOrders(data);
        } catch {
            setOrders([]);
        } finally {
            setLoading(false);
            setQueried(true);
        }
    };

    useEffect(() => {
        if (email) loadOrders(email);
        else setLoading(false);
    }, [email]);

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="mb-10">
                <h1 className="text-4xl font-bold">Order History</h1>
                <p className="text-gray-500 mt-2">
                    Track your URBANLUXE orders
                </p>
            </div>

            {/* Email lookup */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 mb-8">
                <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Look up orders by email
                </label>
                <div className="flex gap-3">
                    <input
                        type="email"
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                        placeholder="your@email.com"
                        onKeyDown={(e) =>
                            e.key === "Enter" && loadOrders(searchEmail)
                        }
                        className="flex-1 p-4 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-transparent focus:border-[var(--accent-hex)] focus:outline-none"
                    />
                    <button
                        onClick={() => loadOrders(searchEmail)}
                        className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-semibold hover:bg-[var(--accent-hex)] hover:text-black transition-all"
                    >
                        Search
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <div
                            key={i}
                            className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-gray-100 dark:border-zinc-800 animate-pulse"
                        >
                            <div className="h-5 bg-gray-200 dark:bg-zinc-700 rounded-xl w-1/3 mb-4" />
                            <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded-xl w-1/2" />
                        </div>
                    ))}
                </div>
            ) : !queried ? (
                <div className="text-center py-20">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-500">
                        Enter your email to view orders
                    </p>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-500 mb-2">No orders found</p>
                    <p className="text-gray-400 mb-8">
                        for {searchEmail}
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-semibold hover:bg-[var(--accent-hex)] hover:text-black transition-all"
                    >
                        Start Shopping →
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 overflow-hidden"
                        >
                            {/* Order Header */}
                            <div className="flex flex-wrap justify-between items-center gap-4 p-6 border-b border-gray-100 dark:border-zinc-800">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">
                                        Order ID
                                    </p>
                                    <p className="font-mono font-semibold">
                                        {order.id}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 mb-1">
                                        Date
                                    </p>
                                    <p className="text-sm">
                                        {new Date(
                                            order.created_at,
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                                <span
                                    className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize ${statusColors[order.status] || statusColors.pending}`}
                                >
                                    {order.status}
                                </span>
                            </div>

                            {/* Order Items */}
                            <div className="p-6 space-y-4">
                                {(order.order_items || []).map((item: any) => (
                                    <div
                                        key={item.id}
                                        className="flex gap-4 items-center"
                                    >
                                        {item.image && (
                                            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-zinc-800">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">
                                                {item.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {item.size} • {item.color} ×{" "}
                                                {item.quantity}
                                            </p>
                                        </div>
                                        <p className="font-semibold flex-shrink-0">
                                            $
                                            {(
                                                item.price * item.quantity
                                            ).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-5 bg-gray-50 dark:bg-zinc-800/50 flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Total Paid
                                    </p>
                                    <p className="text-2xl font-bold">
                                        ₦{Number(order.total).toFixed(2)}
                                    </p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

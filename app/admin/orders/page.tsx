"use client";
import { useEffect, useState } from "react";
import { ShoppingBag, Search, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Order } from "@/lib/types";

const STATUS_STYLES: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
    paid: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
    processing: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
    shipped: "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
    delivered: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400",
    cancelled: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
};

const ALL_STATUSES = ["all", "pending", "paid", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filtered, setFiltered] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        fetch("/api/orders")
            .then((r) => r.json())
            .then((data) => {
                const list = Array.isArray(data) ? data : [];
                setOrders(list);
                setFiltered(list);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        let result = orders;
        if (statusFilter !== "all") result = result.filter((o) => o.status === statusFilter);
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(
                (o) =>
                    o.id.toLowerCase().includes(q) ||
                    (o.email || "").toLowerCase().includes(q) ||
                    (o.fullName || (o as any).full_name || "").toLowerCase().includes(q),
            );
        }
        setFiltered(result);
    }, [search, statusFilter, orders]);

    const totalRevenue = orders
        .filter((o) => o.status !== "cancelled")
        .reduce((s, o) => s + (o.total || 0), 0);

    return (
        <div className="p-4 sm:p-8">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Orders</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {orders.length} total · ₦{totalRevenue.toFixed(2)} revenue
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
                <div className="relative flex-1 min-w-48">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by order ID, name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-2xl text-sm focus:outline-none focus:border-orange-400"
                    />
                </div>
                <div className="flex gap-1.5 bg-gray-100 dark:bg-zinc-800 p-1.5 rounded-2xl flex-wrap">
                    {ALL_STATUSES.map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all capitalize ${statusFilter === s ? "bg-white dark:bg-zinc-900 shadow-sm" : "text-gray-500 hover:text-black dark:hover:text-white"}`}
                        >
                            {s === "all" ? "All" : s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-16 bg-gray-100 dark:bg-zinc-800 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-24">
                    <ShoppingBag className="w-14 h-14 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No orders found</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
                    {/* Table header */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-100 dark:border-zinc-800 text-xs font-medium text-gray-400 uppercase tracking-wide">
                        <span className="col-span-3">Order ID</span>
                        <span className="col-span-3">Customer</span>
                        <span className="col-span-2">Date</span>
                        <span className="col-span-2 text-right">Total</span>
                        <span className="col-span-1 text-center">Status</span>
                        <span className="col-span-1" />
                    </div>

                    {filtered.map((order, idx) => {
                        const date = new Date((order as any).created_at || Date.now());
                        const itemCount = (order.items || (order as any).order_items || []).length;
                        const customerName = order.fullName || (order as any).full_name || "—";

                        return (
                            <Link
                                key={order.id}
                                href={`/admin/orders/${order.id}`}
                                className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors group ${idx !== filtered.length - 1 ? "border-b border-gray-100 dark:border-zinc-800" : ""}`}
                            >
                                <div className="col-span-3">
                                    <p className="text-sm font-mono font-medium text-gray-900 dark:text-white truncate">
                                        {order.id}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {itemCount} item{itemCount !== 1 ? "s" : ""}
                                    </p>
                                </div>
                                <div className="col-span-3 min-w-0">
                                    <p className="text-sm font-medium truncate">{customerName}</p>
                                    <p className="text-xs text-gray-400 truncate">{order.email || "—"}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {date.toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {date.toLocaleTimeString("en-US", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                                <div className="col-span-2 text-right">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                                        ₦{(order.total || 0).toFixed(2)}
                                    </p>
                                </div>
                                <div className="col-span-1 flex justify-center">
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[order.status] || STATUS_STYLES.pending}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="col-span-1 flex justify-end">
                                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500 transition-colors" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

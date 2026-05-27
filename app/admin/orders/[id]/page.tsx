"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin, Phone, Mail, Package, CreditCard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Order } from "@/lib/types";

const ORDER_STATUSES = [
    "pending",
    "paid",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
] as const;

const STATUS_STYLES: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
    paid: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    processing: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    shipped: "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    delivered: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800",
    cancelled: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800",
};

const STATUS_STEPS = ["pending", "paid", "processing", "shipped", "delivered"];

export default function OrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`/api/orders/${id}`)
            .then((r) => r.json())
            .then(setOrder)
            .catch(() => setError("Failed to load order"))
            .finally(() => setLoading(false));
    }, [id]);

    const handleStatusChange = async (newStatus: string) => {
        setUpdating(true);
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!res.ok) throw new Error("Failed to update");
            const updated = await res.json();
            setOrder((prev: any) => ({ ...prev, status: updated.status || newStatus }));
        } catch {
            setError("Failed to update order status");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="p-4 sm:p-8 max-w-4xl mx-auto">
                <div className="h-8 w-48 bg-gray-200 dark:bg-zinc-700 rounded-xl animate-pulse mb-8" />
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-100 dark:bg-zinc-800 rounded-3xl animate-pulse" />
                        ))}
                    </div>
                    <div className="space-y-4">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="h-40 bg-gray-100 dark:bg-zinc-800 rounded-3xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!order || error) {
        return (
            <div className="p-8 text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">{error || "Order not found"}</p>
                <Link href="/admin/orders" className="text-orange-500 text-sm mt-2 inline-block">
                    Back to orders
                </Link>
            </div>
        );
    }

    const items = order.order_items || order.items || [];
    const customerName = order.full_name || order.fullName || "—";
    const date = new Date(order.created_at || Date.now());
    const currentStatusIdx = STATUS_STEPS.indexOf(order.status);

    return (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/orders"
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-xl font-bold font-mono text-gray-900 dark:text-white truncate">
                            {order.id}
                        </h1>
                        <span className={`text-xs font-medium px-3 py-1 rounded-full border capitalize ${STATUS_STYLES[order.status] || STATUS_STYLES.pending}`}>
                            {order.status}
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-0.5">
                        Placed on {date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} at {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                </div>
            </div>

            {error && (
                <div className="mb-6 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-sm text-red-700 dark:text-red-400">
                    {error}
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Progress tracker */}
                    {order.status !== "cancelled" && (
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 p-6">
                            <h2 className="font-semibold text-gray-900 dark:text-white mb-5">
                                Order Progress
                            </h2>
                            <div className="flex items-center gap-0">
                                {STATUS_STEPS.map((step, idx) => {
                                    const done = idx <= currentStatusIdx;
                                    const active = idx === currentStatusIdx;
                                    return (
                                        <div key={step} className="flex items-center flex-1 last:flex-none">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${done ? "bg-orange-500 text-white" : "bg-gray-100 dark:bg-zinc-800 text-gray-400"} ${active ? "ring-4 ring-orange-500/20" : ""}`}>
                                                    {idx + 1}
                                                </div>
                                                <span className={`text-xs mt-2 capitalize ${active ? "text-orange-500 font-semibold" : done ? "text-gray-600 dark:text-gray-400" : "text-gray-300"}`}>
                                                    {step}
                                                </span>
                                            </div>
                                            {idx < STATUS_STEPS.length - 1 && (
                                                <div className={`flex-1 h-0.5 -mt-5 mx-1 ${idx < currentStatusIdx ? "bg-orange-500" : "bg-gray-100 dark:bg-zinc-800"}`} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Order items */}
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 p-6">
                        <h2 className="font-semibold text-gray-900 dark:text-white mb-5">
                            Items ({items.length})
                        </h2>
                        <div className="space-y-4">
                            {items.map((item: any, idx: number) => (
                                <div
                                    key={item.id || idx}
                                    className={`flex gap-4 ${idx !== items.length - 1 ? "pb-4 border-b border-gray-100 dark:border-zinc-800" : ""}`}
                                >
                                    {item.image && (
                                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-gray-50 dark:bg-zinc-800">
                                            <Image
                                                src={item.image}
                                                alt={item.name || "Product"}
                                                fill
                                                className="object-cover"
                                                sizes="64px"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm truncate">
                                            {item.name || "Product"}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Size: <span className="font-medium">{item.size}</span>
                                            {item.color && (
                                                <> · Color: <span className="font-medium">{item.color}</span></>
                                            )}
                                            {" "}· Qty: <span className="font-medium">{item.quantity}</span>
                                        </p>
                                        <p className="text-sm font-bold text-orange-500 mt-1">
                                            ₦{(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400">₦{item.price} each</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Total */}
                        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-zinc-800 flex justify-between items-center">
                            <span className="text-sm text-gray-500">Order Total</span>
                            <span className="text-xl font-bold">₦{(order.total || 0).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Right column */}
                <div className="space-y-6">
                    {/* Manage status */}
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 p-6">
                        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
                            Manage Status
                        </h2>
                        <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            disabled={updating}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl text-sm font-medium focus:outline-none focus:border-orange-400 capitalize disabled:opacity-60"
                        >
                            {ORDER_STATUSES.map((s) => (
                                <option key={s} value={s} className="capitalize">
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                </option>
                            ))}
                        </select>
                        {updating && (
                            <p className="text-xs text-gray-400 mt-2 text-center">Updating...</p>
                        )}
                    </div>

                    {/* Customer info */}
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 p-6">
                        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
                            Customer
                        </h2>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                                    <Mail className="w-3.5 h-3.5 text-gray-500" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-400">Name</p>
                                    <p className="text-sm font-medium truncate">{customerName}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                                    <Mail className="w-3.5 h-3.5 text-gray-500" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-400">Email</p>
                                    <p className="text-sm font-medium truncate">{order.email || "—"}</p>
                                </div>
                            </div>
                            {(order.phone) && (
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                                        <Phone className="w-3.5 h-3.5 text-gray-500" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-gray-400">Phone</p>
                                        <p className="text-sm font-medium">{order.phone}</p>
                                    </div>
                                </div>
                            )}
                            {(order.address) && (
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                                        <MapPin className="w-3.5 h-3.5 text-gray-500" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-gray-400">Address</p>
                                        <p className="text-sm font-medium">{order.address}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment */}
                    {order.payment_reference && (
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 p-6">
                            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
                                Payment
                            </h2>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center shrink-0">
                                    <CreditCard className="w-3.5 h-3.5 text-green-600" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-400">Reference</p>
                                    <p className="text-sm font-mono font-medium truncate">
                                        {order.payment_reference}
                                    </p>
                                    <p className="text-xs text-green-600 mt-0.5 font-medium">Paid via Paystack</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

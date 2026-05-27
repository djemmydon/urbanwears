"use client";
import { useEffect, useState } from "react";
import { fetchOrders, fetchProducts } from "@/lib/api";
import {
    TrendingUp,
    Package,
    ShoppingCart,
    DollarSign,
    AlertTriangle,
    ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
    pending: "#f97316",
    paid: "#3b82f6",
    shipped: "#8b5cf6",
    delivered: "#22c55e",
    cancelled: "#ef4444",
};

const CATEGORY_COLORS = ["#ff8c00", "#000000", "#6b7280", "#1e3a8a", "#ef4444"];

export default function AdminDashboard() {
    const [orders, setOrders] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([fetchOrders(), fetchProducts()])
            .then(([o, p]) => {
                setOrders(o);
                setProducts(p);
            })
            .finally(() => setLoading(false));
    }, []);

    const totalRevenue = orders.reduce((s, o) => s + Number(o.total), 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const lowStockCount = products.filter((p) =>
        (p.sizes || []).some(
            (s: any) => s.inStock && s.stockCount !== undefined && s.stockCount <= 5,
        ),
    ).length;

    // Revenue over last 7 days
    const revenueByDay = (() => {
        const days: Record<string, number> = {};
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });
            days[key] = 0;
        }
        orders.forEach((o) => {
            const d = new Date(o.created_at);
            const key = d.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });
            if (key in days) days[key] += Number(o.total);
        });
        return Object.entries(days).map(([date, revenue]) => ({
            date,
            revenue: Math.round(revenue * 100) / 100,
        }));
    })();

    // Orders by status
    const ordersByStatus = Object.entries(
        orders.reduce((acc: Record<string, number>, o) => {
            acc[o.status] = (acc[o.status] || 0) + 1;
            return acc;
        }, {}),
    ).map(([name, value]) => ({ name, value }));

    // Products by category
    const productsByCategory = Object.entries(
        products.reduce((acc: Record<string, number>, p) => {
            acc[p.category] = (acc[p.category] || 0) + 1;
            return acc;
        }, {}),
    ).map(([category, count]) => ({ category, count }));

    const stats = [
        {
            label: "Total Revenue",
            value: `₦${totalRevenue.toFixed(2)}`,
            icon: DollarSign,
            color: "text-green-600 dark:text-green-400",
            bg: "bg-green-50 dark:bg-green-900/20",
            change: "+12%",
            link: null,
        },
        {
            label: "Total Orders",
            value: totalOrders,
            icon: ShoppingCart,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-900/20",
            change: `${orders.filter((o) => o.status === "pending").length} pending`,
            link: "/admin/orders",
        },
        {
            label: "Products",
            value: totalProducts,
            icon: Package,
            color: "text-orange-600 dark:text-orange-400",
            bg: "bg-orange-50 dark:bg-orange-900/20",
            change: `${lowStockCount} low stock`,
            link: "/admin/products",
        },
        {
            label: "Avg. Order Value",
            value:
                totalOrders > 0
                    ? `₦${(totalRevenue / totalOrders).toFixed(2)}`
                    : "₦0",
            icon: TrendingUp,
            color: "text-purple-600 dark:text-purple-400",
            bg: "bg-purple-50 dark:bg-purple-900/20",
            change: "All time",
            link: null,
        },
    ];

    if (loading) {
        return (
            <div className="p-4 sm:p-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="h-32 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 animate-pulse"
                        />
                    ))}
                </div>
                <div className="grid lg:grid-cols-3 gap-5">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-72 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Dashboard
                </h1>
                <p className="text-gray-500 mt-1 text-sm">
                    {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {stats.map(
                    ({ label, value, icon: Icon, color, bg, change, link }) => {
                        const content = (
                            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 hover:border-gray-200 dark:hover:border-zinc-700 transition-all h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <div
                                        className={`w-10 h-10 ${bg} rounded-2xl flex items-center justify-center`}
                                    >
                                        <Icon className={`w-5 h-5 ${color}`} />
                                    </div>
                                    {link && (
                                        <ArrowUpRight className="w-4 h-4 text-gray-400" />
                                    )}
                                </div>
                                <p className="text-gray-500 text-sm mb-1">
                                    {label}
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {value}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                    {change}
                                </p>
                            </div>
                        );
                        return link ? (
                            <Link key={label} href={link}>
                                {content}
                            </Link>
                        ) : (
                            <div key={label}>{content}</div>
                        );
                    },
                )}
            </div>

            {/* Charts Row 1 */}
            <div className="grid lg:grid-cols-3 gap-5 mb-5">
                {/* Revenue Area Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="font-semibold text-gray-900 dark:text-white">
                                Revenue (Last 7 Days)
                            </h2>
                            <p className="text-sm text-gray-500">
                                Total: ₦{totalRevenue.toFixed(2)}
                            </p>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={revenueByDay}>
                            <defs>
                                <linearGradient
                                    id="revenueGrad"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="#ff8c00"
                                        stopOpacity={0.2}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="#ff8c00"
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#f0f0f0"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 11, fill: "#9ca3af" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 11, fill: "#9ca3af" }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v) => `₦${v}`}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: "16px",
                                    border: "1px solid #f0f0f0",
                                    boxShadow:
                                        "0 4px 24px rgba(0,0,0,0.08)",
                                }}
                                formatter={(v) => [
                                    `₦${Number(v ?? 0).toFixed(2)}`,
                                    "Revenue",
                                ]}
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#ff8c00"
                                strokeWidth={2.5}
                                fill="url(#revenueGrad)"
                                dot={{
                                    fill: "#ff8c00",
                                    strokeWidth: 0,
                                    r: 4,
                                }}
                                activeDot={{ r: 6 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Orders by Status Pie */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 p-6">
                    <h2 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Orders by Status
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">
                        {totalOrders} total
                    </p>
                    {ordersByStatus.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height={160}>
                                <PieChart>
                                    <Pie
                                        data={ordersByStatus}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={75}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {ordersByStatus.map(
                                            (entry, index) => (
                                                <Cell
                                                    key={index}
                                                    fill={
                                                        STATUS_COLORS[
                                                            entry.name
                                                        ] || "#6b7280"
                                                    }
                                                />
                                            ),
                                        )}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: "12px",
                                            fontSize: "12px",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="space-y-2 mt-2">
                                {ordersByStatus.map((s) => (
                                    <div
                                        key={s.name}
                                        className="flex items-center justify-between text-sm"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-2.5 h-2.5 rounded-full"
                                                style={{
                                                    background:
                                                        STATUS_COLORS[
                                                            s.name
                                                        ] || "#6b7280",
                                                }}
                                            />
                                            <span className="capitalize text-gray-600 dark:text-gray-400">
                                                {s.name}
                                            </span>
                                        </div>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {s.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                            No orders yet
                        </div>
                    )}
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid lg:grid-cols-3 gap-5">
                {/* Products by Category Bar Chart */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 p-6">
                    <h2 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Products by Category
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">
                        {totalProducts} total
                    </p>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart
                            data={productsByCategory}
                            layout="vertical"
                            barSize={18}
                        >
                            <CartesianGrid
                                horizontal={false}
                                strokeDasharray="3 3"
                                stroke="#f0f0f0"
                            />
                            <XAxis
                                type="number"
                                tick={{ fontSize: 11, fill: "#9ca3af" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                dataKey="category"
                                type="category"
                                tick={{ fontSize: 11, fill: "#9ca3af" }}
                                axisLine={false}
                                tickLine={false}
                                width={60}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: "12px",
                                    fontSize: "12px",
                                }}
                            />
                            <Bar
                                dataKey="count"
                                radius={[0, 8, 8, 0]}
                            >
                                {productsByCategory.map((_, i) => (
                                    <Cell
                                        key={i}
                                        fill={
                                            CATEGORY_COLORS[
                                                i % CATEGORY_COLORS.length
                                            ]
                                        }
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Low Stock Table */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 p-6">
                    <div className="flex justify-between items-center mb-5">
                        <div>
                            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-orange-500" />
                                Low Stock Alert
                            </h2>
                            <p className="text-sm text-gray-500">
                                Sizes with ≤ 5 units remaining
                            </p>
                        </div>
                        <Link
                            href="/admin/products"
                            className="text-xs text-orange-500 hover:underline font-medium"
                        >
                            Manage →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {products
                            .filter((p) =>
                                (p.sizes || []).some(
                                    (s: any) =>
                                        s.inStock &&
                                        s.stockCount !== undefined &&
                                        s.stockCount <= 5,
                                ),
                            )
                            .slice(0, 5)
                            .map((p) => (
                                <div
                                    key={p.id}
                                    className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-zinc-800 last:border-none"
                                >
                                    <div>
                                        <p className="font-medium text-sm text-gray-900 dark:text-white">
                                            {p.name}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {(p.sizes || [])
                                                .filter(
                                                    (s: any) =>
                                                        s.inStock &&
                                                        s.stockCount !==
                                                            undefined &&
                                                        s.stockCount <= 5,
                                                )
                                                .map(
                                                    (s: any) =>
                                                        `${s.size}: ${s.stockCount}`,
                                                )
                                                .join(" • ")}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/admin/products/${p.id}`}
                                        className="text-xs border border-orange-200 text-orange-600 px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors"
                                    >
                                        Edit
                                    </Link>
                                </div>
                            ))}
                        {lowStockCount === 0 && (
                            <div className="text-center py-8 text-gray-400 text-sm">
                                All products are well-stocked
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

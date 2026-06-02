"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/authStore";
import { fetchOrders } from "@/lib/api";
import { ChevronDown, ChevronUp, LogOut, ShoppingBag, Package } from "lucide-react";

const TRACK_STEPS = [
    { key: "pending",    label: "Order Placed",    icon: "01" },
    { key: "paid",       label: "Payment Confirmed", icon: "02" },
    { key: "processing", label: "Processing",       icon: "03" },
    { key: "shipped",    label: "Shipped",          icon: "04" },
    { key: "delivered",  label: "Delivered",        icon: "05" },
];

function statusIndex(status: string) {
    return TRACK_STEPS.findIndex((s) => s.key === status);
}

function OrderCard({ order }: { order: any }) {
    const [open, setOpen] = useState(false);
    const items = order.order_items || order.items || [];
    const date = new Date(order.created_at || Date.now());
    const idx = statusIndex(order.status);
    const isCancelled = order.status === "cancelled";

    return (
        <div className="pwk-order-card">
            {/* Header row */}
            <button
                className="pwk-order-head"
                onClick={() => setOpen((v) => !v)}
            >
                <div className="pwk-order-meta">
                    <span className="pwk-order-id">{order.id}</span>
                    <span className="pwk-order-date">
                        {date.toLocaleDateString("en-NG", {
                            day: "numeric", month: "short", year: "numeric",
                        })}
                        {" · "}
                        {items.length} item{items.length !== 1 ? "s" : ""}
                    </span>
                </div>

                <div className="pwk-order-right">
                    <span className={`pwk-status-badge ${order.status}`}>
                        {order.status}
                    </span>
                    <span className="pwk-order-total">
                        ₦{Number(order.total || 0).toLocaleString()}
                    </span>
                    {open
                        ? <ChevronUp size={16} style={{ opacity: 0.35, flexShrink: 0 }} />
                        : <ChevronDown size={16} style={{ opacity: 0.35, flexShrink: 0 }} />
                    }
                </div>
            </button>

            {/* Expanded content */}
            {open && (
                <div className="pwk-order-body">
                    {/* Tracking timeline */}
                    {!isCancelled && (
                        <div className="pwk-track">
                            <p className="pwk-track-title">Delivery Status</p>
                            <div className="pwk-track-steps">
                                {TRACK_STEPS.map((step, i) => {
                                    const done = i <= idx;
                                    const active = i === idx;
                                    return (
                                        <div key={step.key} className="pwk-track-step">
                                            <div className={`pwk-track-dot ${done ? "done" : ""} ${active ? "active" : ""}`}>
                                                {done && i < idx ? (
                                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                                        <polyline points="1 4 4 7 9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                ) : (
                                                    <span>{step.icon}</span>
                                                )}
                                            </div>
                                            {i < TRACK_STEPS.length - 1 && (
                                                <div className={`pwk-track-line ${i < idx ? "done" : ""}`} />
                                            )}
                                            <p className={`pwk-track-label ${active ? "active" : done ? "done" : ""}`}>
                                                {step.label}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {isCancelled && (
                        <div className="pwk-cancelled-banner">
                            This order was cancelled
                        </div>
                    )}

                    {/* Items */}
                    <div className="pwk-items">
                        {items.map((item: any, i: number) => (
                            <div key={item.id || i} className="pwk-item">
                                {item.image && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={item.image} alt={item.name} className="pwk-item-img" />
                                )}
                                <div className="pwk-item-info">
                                    <p className="pwk-item-name">{item.name}</p>
                                    <p className="pwk-item-meta">
                                        {item.size}{item.color ? ` · ${item.color}` : ""} · Qty {item.quantity}
                                    </p>
                                </div>
                                <p className="pwk-item-price">
                                    ₦{(item.price * item.quantity).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="pwk-order-footer">
                        <div>
                            <p className="pwk-footer-label">Total Paid</p>
                            <p className="pwk-footer-total">₦{Number(order.total || 0).toLocaleString()}</p>
                        </div>
                        {order.payment_reference && (
                            <p className="pwk-footer-ref">Ref: {order.payment_reference}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function DashboardPage() {
    const { user, checkSession, logout, loading: authLoading } = useAuthStore();
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(true);

    useEffect(() => { checkSession(); }, []);

    useEffect(() => {
        if (!authLoading && !user) {
            router.replace("/login?redirect=/dashboard");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user?.email) {
            fetchOrders(user.email)
                .then(setOrders)
                .catch(() => setOrders([]))
                .finally(() => setOrdersLoading(false));
        }
    }, [user]);

    const totalSpent = orders
        .filter((o) => o.status !== "cancelled")
        .reduce((s, o) => s + Number(o.total || 0), 0);

    if (authLoading || !user) {
        return (
            <div style={{ minHeight: "100vh", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 36, height: 36, border: "1.5px solid rgba(0,0,0,0.08)", borderTopColor: "#000", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
        );
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600&display=swap');

                .pwk-dash * { box-sizing: border-box; font-family: 'Barlow', sans-serif; }
                .pwk-dash { background: #f9f9f9; min-height: 100vh; color: #000; }

                /* Top bar */
                .pwk-dash-top {
                    background: #000; color: #fff;
                    padding: 40px 24px 36px;
                }
                .pwk-dash-inner { max-width: 860px; margin: 0 auto; }

                .pwk-greeting-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 32px; }
                .pwk-greeting-label { font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase; opacity: 0.4; margin-bottom: 8px; }
                .pwk-greeting-name {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(36px, 7vw, 64px);
                    line-height: 0.9; letter-spacing: 0.03em;
                }
                .pwk-greeting-name em { font-style: normal; -webkit-text-stroke: 1.5px rgba(255,255,255,0.4); color: transparent; }
                .pwk-greeting-email { font-size: 12px; opacity: 0.4; margin-top: 10px; font-weight: 300; }

                .pwk-logout-btn {
                    display: inline-flex; align-items: center; gap: 8px;
                    background: none; border: 1px solid rgba(255,255,255,0.15);
                    color: #fff; cursor: pointer; padding: 10px 20px;
                    font-family: 'Barlow', sans-serif;
                    font-size: 10px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase;
                    transition: border-color 0.2s, background 0.2s;
                    white-space: nowrap;
                }
                .pwk-logout-btn:hover { border-color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.05); }

                /* Stats */
                .pwk-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.06); }
                .pwk-stat { padding: 20px 16px; }
                .pwk-stat-val { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 0.05em; line-height: 1; margin-bottom: 6px; }
                .pwk-stat-label { font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; opacity: 0.4; }

                /* Orders section */
                .pwk-orders-section { max-width: 860px; margin: 0 auto; padding: 32px 24px 60px; }
                .pwk-section-head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
                .pwk-section-title { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 0.05em; }
                .pwk-section-count { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; opacity: 0.4; }

                /* Order cards */
                .pwk-order-card { background: #fff; margin-bottom: 2px; overflow: hidden; }
                .pwk-order-head {
                    width: 100%; background: none; border: none; cursor: pointer;
                    padding: 20px 20px; display: flex; align-items: center;
                    justify-content: space-between; gap: 12px;
                    text-align: left; transition: background 0.15s;
                }
                .pwk-order-head:hover { background: #fafafa; }
                .pwk-order-meta { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 0; }
                .pwk-order-id { font-family: 'Bebas Neue', sans-serif; font-size: 16px; letter-spacing: 0.08em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                .pwk-order-date { font-size: 11px; opacity: 0.4; font-weight: 300; }
                .pwk-order-right { display: flex; align-items: center; gap: 14px; flex-shrink: 0; }
                .pwk-order-total { font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 0.05em; }

                /* Status badge */
                .pwk-status-badge {
                    font-family: 'Bebas Neue', sans-serif; font-size: 11px;
                    letter-spacing: 0.15em; text-transform: uppercase;
                    padding: 4px 10px;
                }
                .pwk-status-badge.pending    { background: #fff7ed; color: #c2410c; }
                .pwk-status-badge.paid       { background: #eff6ff; color: #1d4ed8; }
                .pwk-status-badge.processing { background: #eff6ff; color: #1d4ed8; }
                .pwk-status-badge.shipped    { background: #f5f3ff; color: #6d28d9; }
                .pwk-status-badge.delivered  { background: #f0fdf4; color: #15803d; }
                .pwk-status-badge.cancelled  { background: #fef2f2; color: #dc2626; }

                /* Expanded body */
                .pwk-order-body { border-top: 1px solid rgba(0,0,0,0.06); }

                /* Tracking */
                .pwk-track { padding: 24px 20px; border-bottom: 1px solid rgba(0,0,0,0.06); }
                .pwk-track-title { font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; opacity: 0.4; margin-bottom: 20px; }

                .pwk-track-steps { display: flex; align-items: flex-start; gap: 0; }
                .pwk-track-step { display: flex; flex-direction: column; align-items: center; flex: 1; position: relative; }

                .pwk-track-dot {
                    width: 30px; height: 30px; border-radius: 50%;
                    border: 1.5px solid rgba(0,0,0,0.12);
                    display: flex; align-items: center; justify-content: center;
                    font-family: 'Bebas Neue', sans-serif; font-size: 11px;
                    color: rgba(0,0,0,0.3); background: #fff; z-index: 1;
                    transition: all 0.3s;
                    flex-shrink: 0;
                }
                .pwk-track-dot.done { background: #000; border-color: #000; color: #fff; }
                .pwk-track-dot.active { background: #000; border-color: #000; color: #fff; box-shadow: 0 0 0 4px rgba(0,0,0,0.08); }

                .pwk-track-line {
                    position: absolute; top: 15px; left: calc(50% + 15px);
                    right: calc(-50% + 15px); height: 1.5px;
                    background: rgba(0,0,0,0.1); z-index: 0;
                }
                .pwk-track-line.done { background: #000; }

                .pwk-track-label {
                    font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase;
                    opacity: 0.3; margin-top: 8px; text-align: center; line-height: 1.4;
                }
                .pwk-track-label.done { opacity: 0.5; }
                .pwk-track-label.active { opacity: 1; font-weight: 600; }

                /* Items */
                .pwk-items { padding: 20px 20px; display: flex; flex-direction: column; gap: 16px; }
                .pwk-item { display: flex; align-items: center; gap: 14px; }
                .pwk-item-img { width: 56px; height: 70px; object-fit: cover; flex-shrink: 0; background: #f0f0f0; }
                .pwk-item-info { flex: 1; min-width: 0; }
                .pwk-item-name { font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .pwk-item-meta { font-size: 11px; opacity: 0.4; margin-top: 3px; font-weight: 300; }
                .pwk-item-price { font-family: 'Bebas Neue', sans-serif; font-size: 16px; letter-spacing: 0.05em; flex-shrink: 0; }

                /* Footer */
                .pwk-order-footer {
                    padding: 16px 20px; background: rgba(0,0,0,0.02);
                    border-top: 1px solid rgba(0,0,0,0.06);
                    display: flex; justify-content: space-between; align-items: center; gap: 12px;
                }
                .pwk-footer-label { font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; opacity: 0.4; margin-bottom: 4px; }
                .pwk-footer-total { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 0.05em; }
                .pwk-footer-ref { font-size: 10px; opacity: 0.3; font-family: monospace; }

                /* Cancelled */
                .pwk-cancelled-banner {
                    padding: 16px 20px; background: #fef2f2; border-bottom: 1px solid rgba(220,38,38,0.1);
                    color: #dc2626; font-size: 12px; font-weight: 500; letter-spacing: 0.1em;
                    text-transform: uppercase;
                }

                /* Empty state */
                .pwk-empty { text-align: center; padding: 60px 20px; }
                .pwk-empty-icon { width: 56px; height: 56px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
                .pwk-empty-title { font-family: 'Bebas Neue', sans-serif; font-size: 24px; letter-spacing: 0.05em; margin-bottom: 8px; }
                .pwk-empty-sub { font-size: 13px; opacity: 0.4; font-weight: 300; }
                .pwk-shop-btn {
                    display: inline-flex; align-items: center; gap: 8px;
                    background: #000; color: #fff; padding: 14px 32px; margin-top: 24px;
                    font-family: 'Barlow', sans-serif;
                    font-size: 11px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase;
                    text-decoration: none; transition: background 0.2s;
                }
                .pwk-shop-btn:hover { background: #222; }

                /* Skeleton */
                .pwk-skel { background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%); background-size: 200% 100%; animation: skel-shimmer 1.4s infinite; }
                @keyframes skel-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

                @media(max-width:560px) {
                    .pwk-stats { grid-template-columns: repeat(3,1fr); }
                    .pwk-stat-val { font-size: 22px; }
                    .pwk-order-total { display: none; }
                    .pwk-track-label { font-size: 8px; }
                }
            `}</style>

            <div className="pwk-dash">
                {/* Top hero bar */}
                <div className="pwk-dash-top">
                    <div className="pwk-dash-inner">
                        <div className="pwk-greeting-row">
                            <div>
                                <p className="pwk-greeting-label">Welcome back</p>
                                <h1 className="pwk-greeting-name">
                                    {user.fullName
                                        ? user.fullName.split(" ")[0].toUpperCase()
                                        : <em>MY ACCOUNT</em>
                                    }
                                </h1>
                                <p className="pwk-greeting-email">{user.email}</p>
                            </div>
                            <button
                                className="pwk-logout-btn"
                                onClick={async () => { await logout(); router.push("/"); }}
                            >
                                <LogOut size={14} strokeWidth={1.5} />
                                Sign Out
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="pwk-stats">
                            <div className="pwk-stat">
                                <p className="pwk-stat-val">{orders.length}</p>
                                <p className="pwk-stat-label">Total Orders</p>
                            </div>
                            <div className="pwk-stat">
                                <p className="pwk-stat-val">
                                    {orders.filter((o) => o.status === "delivered").length}
                                </p>
                                <p className="pwk-stat-label">Delivered</p>
                            </div>
                            <div className="pwk-stat">
                                <p className="pwk-stat-val">
                                    ₦{(totalSpent / 1000).toFixed(0)}k
                                </p>
                                <p className="pwk-stat-label">Total Spent</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders */}
                <div className="pwk-orders-section">
                    <div className="pwk-section-head">
                        <h2 className="pwk-section-title">Orders & Deliveries</h2>
                        {!ordersLoading && (
                            <span className="pwk-section-count">
                                {orders.length} order{orders.length !== 1 ? "s" : ""}
                            </span>
                        )}
                    </div>

                    {ordersLoading ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="pwk-skel" style={{ height: 72 }} />
                            ))}
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="pwk-empty">
                            <div className="pwk-empty-icon">
                                <Package size={24} strokeWidth={1.5} style={{ opacity: 0.3 }} />
                            </div>
                            <p className="pwk-empty-title">No Orders Yet</p>
                            <p className="pwk-empty-sub">Your orders will appear here once you make a purchase.</p>
                            <Link href="/shop" className="pwk-shop-btn">
                                <ShoppingBag size={14} strokeWidth={1.5} />
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {orders.map((order) => (
                                <OrderCard key={order.id} order={order} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

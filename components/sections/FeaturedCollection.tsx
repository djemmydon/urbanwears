"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/lib/types";
import { useCartStore } from "@/lib/cartStore";
import { toast } from "sonner";

const TABS = [
    { label: "All", value: "" },
    { label: "Polo", value: "polo" },
    { label: "T-Shirt", value: "tshirt" },
    { label: "Hoodie", value: "hoodie" },
    { label: "Tank Top", value: "Tan top" },
    { label: "Socks", value: "socks" },
    { label: "Joggers", value: "joggers" },
    { label: "2 Piece Set", value: "2 piece set" },
    { label: "Beanie", value: "beanie Hat" },
];

function ProductTile({ product }: { product: Product }) {
    const addToCart = useCartStore((s) => s.addToCart);
    const originalPrice = product.originalPrice ?? product.original_price;

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        const size = product.sizes.find((s) => s.inStock);
        if (!size) { toast.error("Out of stock"); return; }
        addToCart(product, size.size, product.colors[0]?.name ?? "");
        toast.success(`${product.name} added!`);
    };

    return (
        <Link href={`/products/${product.id}`} style={{ textDecoration: "none", color: "inherit", display: "block" }} className="prod-tile">
            {/* Image */}
            <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", background: "#f0f0f0", marginBottom: 14 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={product.image}
                    alt={product.name}
                    className="prod-tile-img"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}
                />

                {/* Badges */}
                <div style={{ position: "absolute", top: 12, left: 12, display: "flex", flexDirection: "column", gap: 4 }}>
                    {originalPrice && (
                        <span style={{
                            background: "#000", color: "#fff",
                            fontFamily: "'Barlow', sans-serif",
                            fontSize: 9, fontWeight: 600, letterSpacing: "0.18em",
                            textTransform: "uppercase", padding: "4px 8px",
                        }}>
                            Sale
                        </span>
                    )}
                    {product.trending && !originalPrice && (
                        <span style={{
                            background: "#fff", color: "#000",
                            fontFamily: "'Barlow', sans-serif",
                            fontSize: 9, fontWeight: 600, letterSpacing: "0.18em",
                            textTransform: "uppercase", padding: "4px 8px",
                        }}>
                            Hot
                        </span>
                    )}
                </div>

                {/* Quick add — visible on hover */}
                <button
                    onClick={handleAdd}
                    className="prod-tile-add"
                    style={{
                        position: "absolute", bottom: 0, left: 0, right: 0,
                        background: "#000", color: "#fff",
                        fontFamily: "'Barlow', sans-serif",
                        fontSize: 10, fontWeight: 500, letterSpacing: "0.2em",
                        textTransform: "uppercase", border: "none", cursor: "pointer",
                        padding: "13px 0",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        transform: "translateY(100%)",
                        transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
                    }}
                >
                    <Plus size={12} />
                    Quick Add
                </button>
            </div>

            {/* Info */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                        fontFamily: "'Barlow', sans-serif",
                        fontSize: 8, fontWeight: 400, letterSpacing: "0.3em",
                        textTransform: "uppercase", color: "rgba(0,0,0,0.35)",
                        marginBottom: 5,
                    }}>
                        {product.category}
                    </p>
                    <p style={{
                        fontFamily: "'Barlow', sans-serif",
                        fontSize: 14, fontWeight: 500,
                        color: "#000", lineHeight: 1.3,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                        {product.name}
                    </p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: 17, letterSpacing: "0.05em", color: "#000",
                    }}>
                        ₦{product.price.toLocaleString()}
                    </p>
                    {originalPrice && (
                        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "rgba(0,0,0,0.3)", textDecoration: "line-through", marginTop: 1 }}>
                            ₦{Number(originalPrice).toLocaleString()}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}

export default function FeaturedCollection() {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [filtered, setFiltered] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("");

    useEffect(() => {
        fetchProducts()
            .then((data) => { setAllProducts(data); setFiltered(data.slice(0, 8)); })
            .catch(() => setAllProducts([]))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const result = activeTab
            ? allProducts.filter((p) => p.type === activeTab)
            : allProducts;
        setFiltered(result.slice(0, 8));
    }, [activeTab, allProducts]);

    return (
        <section id="shop" style={{ background: "#fff", padding: "72px 0", overflowX: "hidden" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
                {/* Header */}
                <div style={{
                    display: "flex", alignItems: "flex-end",
                    justifyContent: "space-between", gap: 16,
                    marginBottom: 36, flexWrap: "wrap",
                }}>
                    <div>
                        <p style={{
                            fontFamily: "'Barlow', sans-serif",
                            fontSize: 10, letterSpacing: "0.4em",
                            textTransform: "uppercase", color: "rgba(0,0,0,0.4)",
                            marginBottom: 10,
                        }}>
                            New In
                        </p>
                        <h2 style={{
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: "clamp(40px, 6vw, 60px)",
                            letterSpacing: "0.03em", lineHeight: 0.9, color: "#000",
                        }}>
                            Featured Collection
                        </h2>
                    </div>

                    {/* Filter tabs — desktop */}
                    <div className="feat-tabs" style={{ display: "flex", gap: 0, border: "1px solid rgba(0,0,0,0.12)" }}>
                        {TABS.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => setActiveTab(tab.value)}
                                style={{
                                    fontFamily: "'Barlow', sans-serif",
                                    fontSize: 10, fontWeight: 500, letterSpacing: "0.2em",
                                    textTransform: "uppercase", border: "none",
                                    borderRight: "1px solid rgba(0,0,0,0.12)",
                                    padding: "10px 18px", cursor: "pointer",
                                    background: activeTab === tab.value ? "#000" : "#fff",
                                    color: activeTab === tab.value ? "#fff" : "rgba(0,0,0,0.45)",
                                    transition: "all 0.2s",
                                    outline: "none",
                                }}
                                className={`feat-tab${tab.value === TABS[TABS.length - 1].value ? " last" : ""}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Filter dropdown — mobile */}
                    <select
                        className="feat-select"
                        value={activeTab}
                        onChange={(e) => setActiveTab(e.target.value)}
                        style={{
                            display: "none",
                            fontFamily: "'Barlow', sans-serif",
                            fontSize: 12, fontWeight: 500, letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            border: "1px solid rgba(0,0,0,0.2)",
                            padding: "10px 16px",
                            background: "#fff", color: "#000",
                            cursor: "pointer", outline: "none",
                            width: "100%", maxWidth: 280,
                            borderRadius: 0,
                        }}
                    >
                        {TABS.map((tab) => (
                            <option key={tab.value} value={tab.value}>
                                {tab.label || "All"}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Product grid */}
                <div className="feat-grid" style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 16,
                }}>
                    {loading
                        ? Array.from({ length: 8 }).map((_, i) => (
                              <div key={i}>
                                  <div className="feat-skel" style={{ aspectRatio: "3/4", marginBottom: 14 }} />
                                  <div className="feat-skel" style={{ height: 12, width: "70%", marginBottom: 6 }} />
                                  <div className="feat-skel" style={{ height: 10, width: "40%" }} />
                              </div>
                          ))
                        : filtered.map((product) => (
                              <ProductTile key={product.id} product={product} />
                          ))}
                </div>

                {/* View all */}
                {!loading && (
                    <div style={{ textAlign: "center", marginTop: 48 }}>
                        <Link
                            href="/shop"
                            style={{
                                display: "inline-flex", alignItems: "center", gap: 10,
                                border: "1px solid #000", color: "#000",
                                fontFamily: "'Barlow', sans-serif",
                                fontSize: 11, fontWeight: 500, letterSpacing: "0.25em",
                                textTransform: "uppercase", textDecoration: "none",
                                padding: "15px 40px",
                                position: "relative", overflow: "hidden",
                            }}
                            className="feat-view-all"
                        >
                            <span>View All Products</span>
                        </Link>
                    </div>
                )}
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600&display=swap');

                .prod-tile:hover .prod-tile-img { transform: scale(1.05); }
                .prod-tile:hover .prod-tile-add { transform: translateY(0) !important; }

                .feat-tab.last { border-right: none !important; }

                .feat-view-all::before {
                    content: ''; position: absolute; inset: 0;
                    background: #000; transform: scaleY(0); transform-origin: bottom;
                    transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
                }
                .feat-view-all:hover::before { transform: scaleY(1); }
                .feat-view-all:hover { color: #fff !important; }
                .feat-view-all > * { position: relative; z-index: 1; }

                .feat-skel { background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%); background-size: 200% 100%; animation: feat-shimmer 1.4s infinite; }
                @keyframes feat-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

                @media (max-width: 768px) {
                    .feat-tabs { display: none !important; }
                    .feat-select { display: block !important; }
                    .feat-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
                }
                @media (max-width: 480px) {
                    .feat-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
                }
                @media (min-width: 769px) and (max-width: 1024px) { .feat-grid { grid-template-columns: repeat(3, 1fr) !important; } }
            `}</style>
        </section>
    );
}

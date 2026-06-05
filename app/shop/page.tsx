"use client";
import { useState, useEffect } from "react";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/lib/types";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import { toast } from "sonner";

const TABS = [
    { label: "All", value: "" },
    { label: "Polo", value: "polo" },
    { label: "T-Shirts", value: "tshirt" },
    { label: "Hoodies", value: "hoodie" },
    { label: "Tank Tops", value: "Tan top" },
    { label: "Socks", value: "socks" },
    { label: "Joggers", value: "joggers" },
    { label: "2 Piece Sets", value: "2 piece set" },
    { label: "Beanies", value: "beanie Hat" },
];

const SORT = [
    { label: "New Arrivals", value: "new" },
    { label: "Price: Low → High", value: "price-asc" },
    { label: "Price: High → Low", value: "price-desc" },
    { label: "Top Rated", value: "rating" },
];

export default function ShopPage() {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [filtered, setFiltered] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("");
    const [sort, setSort] = useState("new");
    const addToCart = useCartStore((s) => s.addToCart);

    useEffect(() => {
        fetchProducts()
            .then((data) => { setAllProducts(data); setFiltered(data); })
            .catch(() => setAllProducts([]))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        let result = activeTab ? allProducts.filter((p) => p.type === activeTab) : [...allProducts];
        if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
        else if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
        else if (sort === "rating") result.sort((a, b) => b.rating - a.rating);
        setFiltered(result);
    }, [activeTab, sort, allProducts]);

    const handleAdd = (e: React.MouseEvent, product: Product) => {
        e.preventDefault();
        const size = product.sizes.find((s) => s.inStock);
        if (!size) { toast.error("Out of stock"); return; }
        addToCart(product, size.size, product.colors[0]?.name ?? "");
        toast.success(`${product.name} added!`);
    };

    const originalPrice = (p: Product) => p.originalPrice ?? p.original_price;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600&display=swap');
                .shop-page { font-family: 'Barlow', sans-serif; }
                .shop-hero { width: 100%; }
                .shop-hero-title {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(52px, 10vw, 96px);
                    line-height: 0.9; letter-spacing: 0.03em;
                    margin-bottom: 16px;
                }
                .shop-hero-title em { font-style: normal; -webkit-text-stroke: 1.5px rgba(255,255,255,0.5); color: transparent; }

                .shop-tabs { display: flex; gap: 0; border-bottom: none; overflow-x: auto; scrollbar-width: none; }
                .shop-tabs::-webkit-scrollbar { display: none; }
                .shop-tab {
                    padding: 14px 24px; background: none; border: none;
                    font-family: 'Barlow', sans-serif;
                    font-size: 11px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase;
                    cursor: pointer; color: #000; opacity: 0.35; white-space: nowrap;
                    border-bottom: 2px solid transparent; margin-bottom: -1px;
                    transition: all 0.2s; flex-shrink: 0;
                }
                .shop-tab.active { opacity: 1; border-bottom-color: #000; }
                .shop-tab:hover:not(.active) { opacity: 0.65; }
                .shop-tabs-mobile { display: none; }
                @media (max-width: 640px) {
                    .shop-tabs { display: none; }
                    .shop-tabs-mobile { display: block; width: 100%; }
                    .shop-hero-inner { padding: 48px 20px 36px !important; }
                    .shop-grid { grid-template-columns: 1fr !important; gap: 0 !important; }
                    .shop-page-inner { padding-bottom: 60px !important; }
                }

                .shop-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2px; }
                @media (min-width: 640px) { .shop-grid { grid-template-columns: repeat(3, 1fr); } }
                @media (min-width: 1024px) { .shop-grid { grid-template-columns: repeat(4, 1fr); } }

                .shop-card { position: relative; overflow: hidden; background: #f2f2f2; cursor: pointer; border-bottom: 2px solid #fff; }
                .shop-card-img { aspect-ratio: 3/4; overflow: hidden; position: relative; }
                .shop-card-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.7s cubic-bezier(0.16,1,0.3,1); }
                .shop-card:hover .shop-card-img img { transform: scale(1.07); }
                .shop-card-overlay {
                    position: absolute; inset: 0;
                    background: rgba(0,0,0,0.45);
                    opacity: 0; transition: opacity 0.4s;
                    display: flex; align-items: center; justify-content: center;
                }
                .shop-card:hover .shop-card-overlay { opacity: 1; }
                .shop-card-btn {
                    display: inline-flex; align-items: center; gap: 8px;
                    background: #fff; color: #000;
                    font-family: 'Barlow', sans-serif; font-size: 10px;
                    font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase;
                    padding: 11px 20px; text-decoration: none;
                    transform: translateY(10px); opacity: 0;
                    transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.35s;
                }
                .shop-card:hover .shop-card-btn { transform: translateY(0); opacity: 1; }

                .shop-badge { position: absolute; top: 12px; left: 12px; font-family: 'Bebas Neue', sans-serif; font-size: 11px; letter-spacing: 0.15em; padding: 4px 10px; z-index: 2; }
                .shop-badge.new { background: #fff; color: #000; }
                .shop-badge.sale { background: #000; color: #fff; }

                .shop-card-info { padding: 14px 14px 18px; display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
                .shop-card-name { font-size: 13px; font-weight: 500; line-height: 1.35; }
                .shop-card-price { font-family: 'Bebas Neue', sans-serif; font-size: 16px; letter-spacing: 0.05em; opacity: 0.55; white-space: nowrap; }
                .shop-card-orig { font-size: 11px; opacity: 0.3; text-decoration: line-through; }

                .shop-skeleton { background: linear-gradient(90deg, #e8e8e8 25%, #f0f0f0 50%, #e8e8e8 75%); background-size: 200% 100%; animation: shop-shimmer 1.4s infinite; }
                @keyframes shop-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

                .shop-sort {
                    font-family: 'Barlow', sans-serif; font-size: 11px; font-weight: 500;
                    letter-spacing: 0.15em; text-transform: uppercase;
                    border: 1px solid rgba(0,0,0,0.15); background: none;
                    padding: 10px 16px; color: #000; outline: none; cursor: pointer;
                    appearance: none;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23000' stroke-width='1.2' fill='none'/%3E%3C/svg%3E");
                    background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px;
                }
            `}</style>

            <div className="shop-page" style={{ overflowX: "hidden" }}>
                {/* Hero — full-width black band */}
                <div className="shop-hero" style={{ background: "#000", color: "#fff", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="shop-hero-inner max-w-7xl mx-auto" style={{ padding: "60px 24px 48px" }}>
                        <p style={{ fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase", opacity: 0.4, marginBottom: 16, fontWeight: 300 }}>
                            All Collections
                        </p>
                        <h1 className="shop-hero-title">
                            SHOP<br /><em>ALL</em>
                        </h1>
                        <p style={{ fontSize: 14, fontWeight: 300, opacity: 0.5, maxWidth: 360, lineHeight: 1.7 }}>
                            Premium polos, tees & hoodies — {allProducts.length} pieces available.
                        </p>
                    </div>
                </div>

                <div className="shop-page-inner max-w-7xl mx-auto" style={{ paddingBottom: 80 }}>
                    {/* Tabs + Sort */}
                    <div style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, paddingRight: 16 }}>
                        {/* Desktop tabs */}
                        <div className="shop-tabs">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.value}
                                    className={`shop-tab ${activeTab === tab.value ? "active" : ""}`}
                                    onClick={() => setActiveTab(tab.value)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        {/* Mobile category select */}
                        <select
                            className="shop-tabs-mobile shop-sort"
                            value={activeTab}
                            onChange={(e) => setActiveTab(e.target.value)}
                            style={{ flex: 1, maxWidth: 180 }}
                        >
                            {TABS.map((tab) => (
                                <option key={tab.value} value={tab.value}>{tab.label || "All"}</option>
                            ))}
                        </select>
                        <select
                            className="shop-sort"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                        >
                            {SORT.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Count */}
                    <div style={{ padding: "16px 16px 0", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.4 }}>
                        {loading ? "Loading..." : `${filtered.length} products`}
                    </div>

                    {/* Grid */}
                    <div className="shop-grid p-0">
                        {loading
                            ? Array.from({ length: 8 }).map((_, i) => (
                                  <div key={i}>
                                      <div className="shop-card-img shop-skeleton" />
                                      <div style={{ padding: "14px 14px 18px" }}>
                                          <div className="shop-skeleton" style={{ height: 12, width: "70%", marginBottom: 8 }} />
                                          <div className="shop-skeleton" style={{ height: 10, width: "40%" }} />
                                      </div>
                                  </div>
                              ))
                            : filtered.map((product, i) => {
                                  const op = originalPrice(product);
                                  const discount = op ? Math.round(((op - product.price) / op) * 100) : 0;
                                  return (
                                      <Link key={product.id} href={`/products/${product.id}`} className="shop-card">
                                          <div className="shop-card-img">
                                              {/* eslint-disable-next-line @next/next/no-img-element */}
                                              <img src={product.image} alt={product.name} />
                                              {i === 0 && <div className="shop-badge new">New</div>}
                                              {op && discount > 0 && <div className="shop-badge sale">−{discount}%</div>}
                                              <div className="shop-card-overlay">
                                                  <span className="shop-card-btn">
                                                      View Details <ArrowRight size={11} />
                                                  </span>
                                              </div>
                                          </div>
                                          <div className="shop-card-info">
                                              <div>
                                                  <div className="shop-card-name">{product.name}</div>
                                                  <div className="shop-card-price">₦{product.price.toLocaleString()}</div>
                                                  {op && <div className="shop-card-orig">₦{Number(op).toLocaleString()}</div>}
                                              </div>
                                              <button
                                                  onClick={(e) => handleAdd(e, product)}
                                                  title="Add to cart"
                                                  style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "inherit", opacity: 0.4, transition: "opacity 0.2s", flexShrink: 0, marginTop: 2 }}
                                                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                                                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.4")}
                                              >
                                                  <ShoppingBag size={16} />
                                              </button>
                                          </div>
                                      </Link>
                                  );
                              })}
                    </div>

                    {!loading && filtered.length === 0 && (
                        <div style={{ textAlign: "center", padding: "80px 24px", fontSize: 13, opacity: 0.4 }}>
                            No products found in this category.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

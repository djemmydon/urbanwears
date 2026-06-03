"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ShoppingCart, Ruler, X, Heart, Share2 } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import { useWishlistStore } from "@/lib/wishlistStore";
import { toast } from "sonner";
import ReviewsSection from "@/components/products/ReviewsSection";
import RatingForm from "@/components/products/RatingForm";
import { fetchProduct } from "@/lib/api";
import { Product } from "@/lib/types";

export default function ProductDetail() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [showSizeChart, setShowSizeChart] = useState(false);
    const [refreshReviews, setRefreshReviews] = useState(0);

    const addToCart = useCartStore((s) => s.addToCart);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

    useEffect(() => {
        fetchProduct(params.id as string)
            .then((p) => {
                setProduct(p);
                setSelectedColor(p.colors?.[0]?.hex ?? "");
            })
            .catch(() => setProduct(null))
            .finally(() => setLoading(false));
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div
                    style={{
                        width: 40, height: 40,
                        border: "1.5px solid rgba(0,0,0,0.08)",
                        borderTopColor: "#000",
                        borderRadius: "50%",
                        animation: "spin 0.7s linear infinite",
                    }}
                />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
                <p className="text-gray-500 text-sm uppercase tracking-widest">Product not found</p>
                <Link href="/" className="text-xs uppercase tracking-widest underline underline-offset-4">
                    Back to Shop
                </Link>
            </div>
        );
    }

    const images = product.images && product.images.length > 0
        ? product.images
        : [product.image];

    const originalPrice = product.originalPrice ?? product.original_price;
    const inWishlist = isInWishlist(product.id);
    const totalStock = product.sizes.reduce((s, sz) => s + (sz.stockCount ?? 0), 0);
    const isSizeSelected = selectedSize !== "";
    const reviewCount = product.reviewCount ?? product.review_count ?? 0;

    const handleAddToCart = () => {
        if (!isSizeSelected) return;
        const colorName = product.colors.find((c) => c.hex === selectedColor)?.name || "Default";
        for (let i = 0; i < quantity; i++) {
            addToCart(product, selectedSize, colorName);
        }
        toast.success(`${product.name} (${selectedSize}) added to cart!`);
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied!");
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600&display=swap');
                .pwk-detail * { box-sizing: border-box; font-family: 'Barlow', sans-serif; }

                .pwk-detail { background: #fff; min-height: 100vh; color: #000; }

                .pwk-detail-header {
                    position: sticky; top: 0; z-index: 10;
                    background: rgba(255,255,255,0.92);
                    backdrop-filter: blur(12px);
                    border-bottom: 1px solid rgba(0,0,0,0.07);
                    padding: 14px 40px;
                    display: flex; align-items: center; justify-content: space-between;
                }
                @media (max-width: 640px) { .pwk-detail-header { padding: 12px 20px; } }

                .pwk-breadcrumb {
                    display: flex; align-items: center; gap: 6px;
                    font-size: 10px; letter-spacing: 0.18em;
                    text-transform: uppercase; overflow-x: auto;
                }
                .pwk-breadcrumb a { text-decoration: none; color: inherit; opacity: 0.4; transition: opacity 0.2s; }
                .pwk-breadcrumb a:hover { opacity: 0.8; }
                .pwk-breadcrumb span { opacity: 0.2; }
                .pwk-breadcrumb .active { opacity: 0.85; font-weight: 500; }
                .pwk-back-btn {
                    background: none; border: none; cursor: pointer;
                    display: flex; align-items: center; gap: 6px;
                    font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase;
                    opacity: 0.4; transition: opacity 0.2s; color: #000;
                }
                .pwk-back-btn:hover { opacity: 0.8; }

                .pwk-detail-grid {
                    display: grid; grid-template-columns: 1fr;
                    gap: 0; max-width: 1280px; margin: 0 auto;
                }
                @media (min-width: 768px) {
                    .pwk-detail-grid { grid-template-columns: 1fr 1fr; min-height: calc(100vh - 53px); }
                }

                .pwk-img-pane { position: relative; background: #f0f0f0; }
                @media (min-width: 768px) {
                    .pwk-img-pane { position: sticky; top: 53px; height: calc(100vh - 53px); }
                }
                .pwk-main-media { width: 100%; height: 100%; object-fit: cover; display: block; }
                .pwk-main-media-wrap { width: 100%; aspect-ratio: 3/4; }
                @media (min-width: 768px) {
                    .pwk-main-media-wrap { height: 100%; aspect-ratio: unset; }
                }

                .pwk-thumbs {
                    position: absolute; bottom: 0; left: 0; right: 0;
                    display: flex; gap: 2px;
                    background: rgba(0,0,0,0.3); padding: 12px; overflow-x: auto;
                }
                .pwk-thumb {
                    flex-shrink: 0; width: 56px; height: 70px;
                    border: 2px solid transparent; cursor: pointer;
                    overflow: hidden; transition: border-color 0.2s;
                }
                .pwk-thumb.active { border-color: #fff; }
                .pwk-thumb img { width: 100%; height: 100%; object-fit: cover; }

                .pwk-info-pane { padding: 48px 40px 60px; overflow-y: auto; }
                @media (max-width: 640px) { .pwk-info-pane { padding: 32px 20px 48px; } }

                .pwk-product-category {
                    font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
                    opacity: 0.35; margin-bottom: 14px;
                    display: flex; align-items: center; gap: 10px;
                }
                .pwk-product-category::before {
                    content: ''; display: block; width: 20px; height: 1px; background: currentColor;
                }
                .pwk-product-title {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(36px, 6vw, 56px);
                    line-height: 0.92; letter-spacing: 0.03em; margin-bottom: 20px;
                }
                .pwk-price-row { display: flex; align-items: baseline; gap: 12px; margin-bottom: 32px; }
                .pwk-price { font-family: 'Bebas Neue', sans-serif; font-size: 32px; letter-spacing: 0.05em; }
                .pwk-original-price { font-size: 15px; opacity: 0.3; text-decoration: line-through; }

                .pwk-divider { border: none; border-top: 1px solid rgba(0,0,0,0.07); margin: 24px 0; }

                .pwk-field-label {
                    font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase;
                    opacity: 0.4; margin-bottom: 10px;
                    display: flex; align-items: center; justify-content: space-between;
                }
                .pwk-size-chart-btn {
                    display: flex; align-items: center; gap: 5px;
                    background: none; border: none; cursor: pointer;
                    font-family: 'Barlow', sans-serif;
                    font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
                    color: #000; opacity: 0.4; transition: opacity 0.2s;
                    border-bottom: 1px solid rgba(0,0,0,0.2); padding-bottom: 1px;
                }
                .pwk-size-chart-btn:hover { opacity: 0.8; }

                .pwk-sizes { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
                .pwk-size-opt {
                    min-width: 48px; height: 48px; padding: 0 16px;
                    border: 1px solid rgba(0,0,0,0.15);
                    background: none; cursor: pointer; font-family: 'Barlow', sans-serif;
                    font-size: 13px; font-weight: 500; letter-spacing: 0.05em;
                    transition: all 0.2s; color: #000;
                }
                .pwk-size-opt:hover { border-color: #000; }
                .pwk-size-opt.selected { background: #000; color: #fff; border-color: #000; }
                .pwk-size-opt.oos { opacity: 0.3; cursor: not-allowed; text-decoration: line-through; }

                .pwk-colors { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; }
                .pwk-color-opt {
                    width: 36px; height: 36px; border-radius: 50%;
                    border: 2px solid transparent; cursor: pointer;
                    transition: all 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.15);
                }
                .pwk-color-opt.selected { border-color: #000; transform: scale(1.15); }

                .pwk-action-row { display: flex; gap: 10px; margin-bottom: 32px; }
                .pwk-qty-ctrl {
                    display: flex; align-items: center;
                    border: 1px solid rgba(0,0,0,0.15); flex-shrink: 0;
                }
                .pwk-qty-b {
                    width: 44px; height: 52px;
                    background: none; border: none; cursor: pointer; font-size: 18px;
                    opacity: 0.5; transition: opacity 0.2s;
                    display: flex; align-items: center; justify-content: center;
                }
                .pwk-qty-b:hover:not(:disabled) { opacity: 1; background: rgba(0,0,0,0.04); }
                .pwk-qty-b:disabled { opacity: 0.2; cursor: not-allowed; }
                .pwk-qty-val {
                    width: 44px; height: 52px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 14px; font-weight: 500;
                    border-left: 1px solid rgba(0,0,0,0.1);
                    border-right: 1px solid rgba(0,0,0,0.1);
                }
                .pwk-add-btn {
                    flex: 1; height: 52px; border: none; cursor: pointer;
                    background: #000; color: #fff;
                    font-family: 'Barlow', sans-serif;
                    font-size: 11px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase;
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                    position: relative; overflow: hidden; transition: color 0.35s;
                }
                .pwk-add-btn::before {
                    content: ''; position: absolute; inset: 0; background: #222;
                    transform: scaleX(0); transform-origin: right;
                    transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
                }
                .pwk-add-btn:hover::before { transform: scaleX(1); transform-origin: left; }
                .pwk-add-btn > * { position: relative; z-index: 1; }
                .pwk-add-btn:disabled { background: rgba(0,0,0,0.2); cursor: not-allowed; }
                .pwk-add-btn:disabled::before { display: none; }

                .pwk-action-icons { display: flex; gap: 8px; margin-bottom: 24px; }
                .pwk-icon-btn {
                    height: 44px; padding: 0 16px;
                    border: 1px solid rgba(0,0,0,0.15); background: none;
                    cursor: pointer; display: flex; align-items: center; gap: 6px;
                    font-family: 'Barlow', sans-serif;
                    font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase;
                    color: #000; transition: all 0.2s;
                }
                .pwk-icon-btn:hover { border-color: #000; }
                .pwk-icon-btn.active { background: #fff0f0; border-color: #dc2626; color: #dc2626; }

                .pwk-meta-grid {
                    display: grid; grid-template-columns: 1fr 1fr;
                    gap: 16px; margin-bottom: 24px;
                }
                .pwk-meta-item { padding: 14px; background: rgba(0,0,0,0.03); }
                .pwk-meta-key { font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; opacity: 0.35; margin-bottom: 6px; }
                .pwk-meta-val { font-size: 13px; font-weight: 500; }
                .pwk-in-stock { color: #16a34a; }
                .pwk-out-stock { color: #dc2626; }

                .pwk-desc { font-size: 13px; font-weight: 300; line-height: 1.75; opacity: 0.6; }

                /* Size chart modal */
                .pwk-modal-bg {
                    position: fixed; inset: 0; z-index: 100;
                    background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);
                    display: flex; align-items: center; justify-content: center; padding: 20px;
                }
                .pwk-modal {
                    background: #fff; max-width: 860px; width: 100%;
                    max-height: 90vh; overflow-y: auto; padding: 40px;
                }
                .pwk-modal-head {
                    display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px;
                }
                .pwk-modal-title { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 0.05em; }
                .pwk-modal-close { background: none; border: none; cursor: pointer; opacity: 0.4; transition: opacity 0.2s; }
                .pwk-modal-close:hover { opacity: 1; }
                .pwk-table-section h3 { font-family: 'Bebas Neue', sans-serif; font-size: 16px; letter-spacing: 0.1em; opacity: 0.5; margin-bottom: 12px; }
                .pwk-table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 32px; }
                .pwk-table th { padding: 10px 12px; text-align: left; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; opacity: 0.4; border-bottom: 1px solid rgba(0,0,0,0.1); font-weight: 500; }
                .pwk-table td { padding: 12px; border-bottom: 1px solid rgba(0,0,0,0.05); }
                .pwk-table td:first-child { font-weight: 600; }
                .pwk-table-note { font-size: 11px; opacity: 0.3; letter-spacing: 0.1em; text-transform: uppercase; text-align: center; margin-top: 16px; }
            `}</style>

            <div className="pwk-detail">
                {/* Sticky breadcrumb */}
                <header className="pwk-detail-header">
                    <nav className="pwk-breadcrumb">
                        <Link href="/">Home</Link>
                        <span>/</span>
                        <Link href="/#shop">Shop</Link>
                        <span>/</span>
                        <span className="active">{product.name}</span>
                    </nav>
                    <button className="pwk-back-btn" onClick={() => window.history.back()}>
                        <ChevronLeft size={14} />
                        Back
                    </button>
                </header>

                <div className="pwk-detail-grid">
                    {/* Image Pane */}
                    <div className="pwk-img-pane">
                        <div className="pwk-main-media-wrap">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={images[selectedImage] || images[0]}
                                alt={product.name}
                                className="pwk-main-media"
                            />
                        </div>

                        {/* Thumbnail strip */}
                        {images.length > 1 && (
                            <div className="pwk-thumbs">
                                {images.map((src, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`pwk-thumb ${selectedImage === idx ? "active" : ""}`}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={src} alt="" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info Pane */}
                    <div className="pwk-info-pane">
                        <div className="pwk-product-category">{product.category}</div>

                        <h1 className="pwk-product-title">{product.name}</h1>

                        <div className="pwk-price-row">
                            <span className="pwk-price">₦{product.price.toLocaleString()}</span>
                            {originalPrice && (
                                <span className="pwk-original-price">₦{Number(originalPrice).toLocaleString()}</span>
                            )}
                        </div>

                        <hr className="pwk-divider" />

                        {/* Color selector */}
                        {product.colors && product.colors.length > 0 && (
                            <div>
                                <div className="pwk-field-label">
                                    <span>
                                        Color:{" "}
                                        <span style={{ fontWeight: 600, opacity: 1 }}>
                                            {product.colors.find((c) => c.hex === selectedColor)?.name}
                                        </span>
                                    </span>
                                </div>
                                <div className="pwk-colors">
                                    {product.colors.map((c) => (
                                        <button
                                            key={c.hex}
                                            title={c.name}
                                            className={`pwk-color-opt ${selectedColor === c.hex ? "selected" : ""}`}
                                            style={{ backgroundColor: c.hex }}
                                            onClick={() => setSelectedColor(c.hex)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size selector */}
                        <div>
                            <div className="pwk-field-label">
                                <span>Select Size</span>
                                <button className="pwk-size-chart-btn" onClick={() => setShowSizeChart(true)}>
                                    <Ruler size={12} /> Size Chart
                                </button>
                            </div>
                            <div className="pwk-sizes">
                                {product.sizes.map((s) => (
                                    <button
                                        key={s.size}
                                        className={`pwk-size-opt ${selectedSize === s.size ? "selected" : ""} ${!s.inStock ? "oos" : ""}`}
                                        onClick={() => s.inStock && setSelectedSize(s.size)}
                                        disabled={!s.inStock}
                                    >
                                        {s.size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Qty + Add to Cart */}
                        <div className="pwk-action-row">
                            <div className="pwk-qty-ctrl">
                                <button
                                    className="pwk-qty-b"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                >
                                    −
                                </button>
                                <span className="pwk-qty-val">{quantity}</span>
                                <button className="pwk-qty-b" onClick={() => setQuantity(quantity + 1)}>+</button>
                            </div>
                            <button
                                className="pwk-add-btn"
                                onClick={handleAddToCart}
                                disabled={!isSizeSelected}
                            >
                                <ShoppingCart size={16} />
                                <span>{isSizeSelected ? "Add to Cart" : "Select a Size"}</span>
                            </button>
                        </div>

                        {/* Wishlist + Share */}
                        <div className="pwk-action-icons">
                            <button
                                className={`pwk-icon-btn ${inWishlist ? "active" : ""}`}
                                onClick={() => {
                                    inWishlist ? removeFromWishlist(product.id) : addToWishlist(product);
                                    toast[inWishlist ? "info" : "success"](
                                        inWishlist ? "Removed from wishlist" : "Added to wishlist",
                                    );
                                }}
                            >
                                <Heart size={14} className={inWishlist ? "fill-red-500" : ""} />
                                {inWishlist ? "Saved" : "Wishlist"}
                            </button>
                            <button className="pwk-icon-btn" onClick={handleShare}>
                                <Share2 size={14} />
                                Share
                            </button>
                        </div>

                        <hr className="pwk-divider" />

                        {/* Meta */}
                        <div className="pwk-meta-grid">
                            <div className="pwk-meta-item">
                                <div className="pwk-meta-key">Category</div>
                                <div className="pwk-meta-val">{product.category}</div>
                            </div>
                            <div className="pwk-meta-item">
                                <div className="pwk-meta-key">Availability</div>
                                <div className={`pwk-meta-val ${totalStock > 0 ? "pwk-in-stock" : "pwk-out-stock"}`}>
                                    {totalStock > 0 ? `${totalStock} in stock` : "Out of Stock"}
                                </div>
                            </div>
                            <div className="pwk-meta-item">
                                <div className="pwk-meta-key">Rating</div>
                                <div className="pwk-meta-val">{product.rating.toFixed(1)} / 5 ({reviewCount})</div>
                            </div>
                            <div className="pwk-meta-item">
                                <div className="pwk-meta-key">Type</div>
                                <div className="pwk-meta-val" style={{ textTransform: "capitalize" }}>{product.type}</div>
                            </div>
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div>
                                <div className="pwk-field-label">Description</div>
                                <p className="pwk-desc">{product.description}</p>
                            </div>
                        )}

                        <hr className="pwk-divider" />

                        {/* Reviews */}
                        <ReviewsSection productId={product.id} refreshTrigger={refreshReviews} />
                        <RatingForm
                            productId={product.id}
                            onReviewSubmitted={() => setRefreshReviews((n) => n + 1)}
                        />
                    </div>
                </div>
            </div>

            {/* Size Chart Modal */}
            {showSizeChart && (
                <div className="pwk-modal-bg" onClick={() => setShowSizeChart(false)}>
                    <div className="pwk-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="pwk-modal-head">
                            <div className="pwk-modal-title">URBANBLAQ — Size Guide</div>
                            <button className="pwk-modal-close" onClick={() => setShowSizeChart(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        {[
                            {
                                title: "Top — Polo / T-Shirt / Hoodie",
                                headers: ["Size", "Chest (in)", "Shoulder (in)", "Sleeve (in)", "Length (in)"],
                                rows: ["M", "L", "XL", "XXL", "3XL"].map((s, i) => [
                                    s, `${38 + i * 3}–${40 + i * 3}`,
                                    `${17.5 + i * 0.5}–${18 + i * 0.5}`,
                                    `${24 + i}–${25 + i}`,
                                    `${29 + i}–${31 + i}`,
                                ]),
                            },
                        ].map((section) => (
                            <div key={section.title} className="pwk-table-section">
                                <h3>{section.title}</h3>
                                <table className="pwk-table">
                                    <thead>
                                        <tr>{section.headers.map((h) => <th key={h}>{h}</th>)}</tr>
                                    </thead>
                                    <tbody>
                                        {section.rows.map((row, i) => (
                                            <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}

                        <p className="pwk-table-note">Need help? Reach us on WhatsApp</p>
                    </div>
                </div>
            )}
        </>
    );
}

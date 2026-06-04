"use client";

import Image from "next/image";
import Link from "next/link";

const CATEGORIES = [
    {
        name: "Polos",
        type: "polo",
        image: "/images/e1.png",
        tag: "Best Seller",
        desc: "Refined & polished",
    },
    {
        name: "T-Shirts",
        type: "tshirt",
        image: "/images/e3.png",
        tag: "New In",
        desc: "Clean everyday wear",
    },
    {
        name: "Hoodies",
        type: "hoodie",
        image: "/images/e2.png",
        tag: "Trending",
        desc: "Relaxed & premium",
    },
    {
        name: "Tank Tops",
        type: "Tan top",
        image: "/images/e1.png",
        tag: "Summer",
        desc: "Built for warm days",
    },
    {
        name: "Socks",
        type: "socks",
        image: "/images/e2.png",
        tag: "Essentials",
        desc: "Comfort from the ground up",
    },
    {
        name: "Joggers",
        type: "joggers",
        image: "/images/e3.png",
        tag: "New In",
        desc: "Comfort meets style",
    },
    {
        name: "2 Piece Sets",
        type: "2 piece set",
        image: "/images/e1.png",
        tag: "Featured",
        desc: "Effortless matching looks",
    },
    {
        name: "Beanie Hats",
        type: "beanie Hat",
        image: "/images/e2.png",
        tag: "Accessories",
        desc: "Stay warm, stay sharp",
    },
];

export default function CategoriesSection() {
    return (
        <section id="shop" style={{ background: "#f7f7f7", padding: "72px 0" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
                {/* Header */}
                <div style={{ marginBottom: 40, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                    <div>
                        <p style={{
                            fontFamily: "'Barlow', sans-serif",
                            fontSize: 10, letterSpacing: "0.4em",
                            textTransform: "uppercase", color: "rgba(0,0,0,0.4)",
                            marginBottom: 10,
                        }}>
                            Browse
                        </p>
                        <h2 style={{
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: "clamp(40px, 6vw, 60px)",
                            letterSpacing: "0.03em", lineHeight: 0.9, color: "#000",
                        }}>
                            Shop by Style
                        </h2>
                    </div>
                    <Link
                        href="/shop"
                        style={{
                            fontFamily: "'Barlow', sans-serif",
                            fontSize: 11, fontWeight: 500, letterSpacing: "0.2em",
                            textTransform: "uppercase", textDecoration: "none",
                            color: "#000", borderBottom: "1px solid rgba(0,0,0,0.3)",
                            paddingBottom: 2,
                        }}
                    >
                        View All →
                    </Link>
                </div>

                {/* Category tiles */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 12,
                }}
                    className="cat-grid"
                >
                    {CATEGORIES.map((cat) => (
                        <Link
                            key={cat.type}
                            href={`/category/${cat.type}`}
                            style={{ textDecoration: "none", color: "inherit", display: "block" }}
                            className="cat-card-link"
                        >
                            {/* Image box */}
                            <div style={{
                                position: "relative",
                                aspectRatio: "3/4",
                                overflow: "hidden",
                                background: "#e8e8e8",
                                marginBottom: 14,
                            }}>
                                <Image
                                    src={cat.image}
                                    alt={cat.name}
                                    fill
                                    className="cat-img"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    style={{ objectFit: "cover", transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}
                                />
                                {/* Tag chip */}
                                <div style={{
                                    position: "absolute", top: 14, left: 14,
                                    background: "#fff", color: "#000",
                                    fontFamily: "'Barlow', sans-serif",
                                    fontSize: 9, fontWeight: 600,
                                    letterSpacing: "0.2em", textTransform: "uppercase",
                                    padding: "5px 10px",
                                }}>
                                    {cat.tag}
                                </div>
                            </div>

                            {/* Info row */}
                            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
                                <div>
                                    <p style={{
                                        fontFamily: "'Bebas Neue', sans-serif",
                                        fontSize: 22, letterSpacing: "0.06em", color: "#000",
                                        marginBottom: 4, lineHeight: 1,
                                    }}>
                                        {cat.name}
                                    </p>
                                    <p style={{
                                        fontFamily: "'Barlow', sans-serif",
                                        fontSize: 11, fontWeight: 300, color: "rgba(0,0,0,0.45)",
                                        letterSpacing: "0.05em",
                                    }}>
                                        {cat.desc}
                                    </p>
                                </div>
                                <span style={{
                                    fontFamily: "'Barlow', sans-serif",
                                    fontSize: 11, fontWeight: 500, letterSpacing: "0.15em",
                                    textTransform: "uppercase", color: "#000",
                                    borderBottom: "1px solid rgba(0,0,0,0.25)", paddingBottom: 1,
                                    whiteSpace: "nowrap",
                                }}>
                                    Shop →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600&display=swap');
                .cat-card-link:hover .cat-img { transform: scale(1.05); }
                @media (max-width: 640px) {
                    .cat-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
                }
                @media (min-width: 641px) and (max-width: 900px) {
                    .cat-grid { grid-template-columns: repeat(3, 1fr) !important; }
                }
                @media (min-width: 901px) and (max-width: 1200px) {
                    .cat-grid { grid-template-columns: repeat(4, 1fr) !important; }
                }
            `}</style>
        </section>
    );
}

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const SLIDES = [
    {
        image: "/images/e1.png",
        tag: "New Season · 2025",
        headline: ["THE", "ESSENTIAL", "EDIT"],
        sub: "Premium polos, tees & hoodies for the modern wardrobe.",
        cta: { label: "Shop New Arrivals", href: "/shop" },
        secondary: { label: "View Lookbook", href: "/category/polo" },
    },
    {
        image: "/images/e3.png",
        tag: "Urban Collection",
        headline: ["STREET", "MEETS", "LUXE"],
        sub: "Crafted for those who move with intention.",
        cta: { label: "Shop T-Shirts", href: "/category/tshirt" },
        secondary: { label: "All Products", href: "/shop" },
    },
    {
        image: "/images/e2.png",
        tag: "Premium Essentials",
        headline: ["WEAR", "WHAT", "MATTERS"],
        sub: "Limited pieces. Unlimited style. New drops every week.",
        cta: { label: "Shop Hoodies", href: "/category/hoodie" },
        secondary: { label: "View All", href: "/shop" },
    },
];

const TICKER = ["Free Delivery Over ₦50,000", "New Season Arrivals", "Premium Essentials", "Limited Stock", "New Drops Weekly", "Free Returns"];

export default function HeroSection() {
    const [active, setActive] = useState(0);
    const [transitioning, setTransitioning] = useState(false);

    const go = (i: number) => {
        if (transitioning || i === active) return;
        setTransitioning(true);
        setTimeout(() => {
            setActive(i);
            setTransitioning(false);
        }, 350);
    };

    useEffect(() => {
        const id = setInterval(() => go((active + 1) % SLIDES.length), 5500);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active, transitioning]);

    const slide = SLIDES[active];

    return (
        <section style={{ background: "#fff" }}>
            {/* Main hero split */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                minHeight: "100svh",
            }}
                className="hero-grid"
            >
                {/* LEFT — image */}
                <div style={{ position: "relative", overflow: "hidden", background: "#f4f4f4" }}>
                    <Image
                        key={active}
                        src={slide.image}
                        alt={slide.headline.join(" ")}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={{
                            objectPosition: "top center",
                            opacity: transitioning ? 0 : 1,
                            transform: transitioning ? "scale(1.02)" : "scale(1)",
                            transition: "opacity 0.4s ease, transform 0.4s ease",
                        }}
                    />

                    {/* Slide indicators — bottom left */}
                    <div style={{
                        position: "absolute", bottom: 28, left: 28,
                        display: "flex", gap: 8, zIndex: 10,
                    }}>
                        {SLIDES.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => go(i)}
                                style={{
                                    width: i === active ? 28 : 8,
                                    height: 8,
                                    borderRadius: 4,
                                    background: "#fff",
                                    opacity: i === active ? 1 : 0.4,
                                    border: "none",
                                    cursor: "pointer",
                                    transition: "all 0.35s ease",
                                    padding: 0,
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* RIGHT — content */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "60px 56px",
                    background: "#fff",
                    position: "relative",
                }}>
                    {/* Top-right: slide counter */}
                    <div style={{
                        position: "absolute", top: 28, right: 32,
                        fontSize: 11, letterSpacing: "0.2em",
                        color: "rgba(0,0,0,0.25)",
                        fontFamily: "'Bebas Neue', sans-serif",
                    }}>
                        {String(active + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
                    </div>

                    <div
                        key={active}
                        style={{
                            opacity: transitioning ? 0 : 1,
                            transform: transitioning ? "translateY(8px)" : "translateY(0)",
                            transition: "opacity 0.35s ease, transform 0.35s ease",
                        }}
                    >
                        {/* Tag */}
                        <div style={{
                            display: "inline-flex", alignItems: "center", gap: 10,
                            marginBottom: 24,
                        }}>
                            <div style={{ width: 24, height: 1, background: "rgba(0,0,0,0.25)" }} />
                            <span style={{
                                fontSize: 10, letterSpacing: "0.35em",
                                textTransform: "uppercase", color: "rgba(0,0,0,0.45)",
                                fontFamily: "'Barlow', sans-serif", fontWeight: 400,
                            }}>
                                {slide.tag}
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 style={{
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: "clamp(56px, 8vw, 112px)",
                            lineHeight: 0.87,
                            letterSpacing: "0.02em",
                            color: "#000",
                            marginBottom: 28,
                        }}>
                            {slide.headline.map((word, i) => (
                                <span key={word} style={{
                                    display: "block",
                                    color: i === 1 ? "transparent" : "#000",
                                    WebkitTextStroke: i === 1 ? "1.5px #000" : undefined,
                                }}>
                                    {word}
                                </span>
                            ))}
                        </h1>

                        {/* Sub */}
                        <p style={{
                            fontFamily: "'Barlow', sans-serif",
                            fontSize: 14, fontWeight: 300,
                            lineHeight: 1.7, color: "rgba(0,0,0,0.55)",
                            maxWidth: 320, marginBottom: 40,
                        }}>
                            {slide.sub}
                        </p>

                        {/* CTAs */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            <Link
                                href={slide.cta.href}
                                style={{
                                    display: "inline-flex", alignItems: "center", gap: 10,
                                    background: "#000", color: "#fff",
                                    padding: "16px 32px",
                                    fontFamily: "'Barlow', sans-serif",
                                    fontSize: 11, fontWeight: 500, letterSpacing: "0.22em",
                                    textTransform: "uppercase", textDecoration: "none",
                                    alignSelf: "flex-start",
                                    position: "relative", overflow: "hidden",
                                }}
                                className="hero-cta-btn"
                            >
                                <span>{slide.cta.label}</span>
                                <ArrowRight size={13} />
                            </Link>
                            <Link
                                href={slide.secondary.href}
                                style={{
                                    fontFamily: "'Barlow', sans-serif",
                                    fontSize: 11, fontWeight: 400, letterSpacing: "0.2em",
                                    textTransform: "uppercase", textDecoration: "none",
                                    color: "rgba(0,0,0,0.4)",
                                    borderBottom: "1px solid rgba(0,0,0,0.2)",
                                    paddingBottom: 2, alignSelf: "flex-start",
                                    transition: "color 0.2s, border-color 0.2s",
                                }}
                                className="hero-ghost-link"
                            >
                                {slide.secondary.label}
                            </Link>
                        </div>
                    </div>

                    {/* Bottom brand stamp */}
                    <div style={{
                        position: "absolute", bottom: 28, left: 56, right: 32,
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}>
                        <span style={{
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: 11, letterSpacing: "0.4em",
                            color: "rgba(0,0,0,0.15)",
                        }}>
                            URBANBLAQ
                        </span>
                        <span style={{ fontSize: 10, letterSpacing: "0.2em", color: "rgba(0,0,0,0.2)", fontFamily: "'Barlow', sans-serif" }}>
                            PREMIUM ESSENTIALS
                        </span>
                    </div>
                </div>
            </div>

            {/* Ticker strip */}
            <div style={{
                background: "#000", color: "#fff",
                padding: "12px 0", overflow: "hidden",
                borderTop: "1px solid rgba(0,0,0,0.06)",
            }}>
                <div style={{
                    display: "flex", gap: 0,
                    animation: "ticker-scroll 24s linear infinite",
                    width: "max-content", whiteSpace: "nowrap",
                }}>
                    {[...Array(4)].map((_, rep) => (
                        TICKER.map((item, i) => (
                            <span key={`${rep}-${i}`} style={{
                                fontFamily: "'Barlow', sans-serif",
                                fontSize: 10, fontWeight: 500, letterSpacing: "0.3em",
                                textTransform: "uppercase", padding: "0 32px",
                                display: "flex", alignItems: "center", gap: 28,
                            }}>
                                {item}
                                <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.3)", display: "inline-block" }} />
                            </span>
                        ))
                    ))}
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:ital,wght@0,300;0,400;0,500;1,300&display=swap');

                @keyframes ticker-scroll {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }

                .hero-cta-btn::before {
                    content: '';
                    position: absolute; inset: 0;
                    background: #222;
                    transform: scaleX(0); transform-origin: right;
                    transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
                }
                .hero-cta-btn:hover::before { transform: scaleX(1); transform-origin: left; }
                .hero-cta-btn span, .hero-cta-btn svg { position: relative; z-index: 1; }
                .hero-ghost-link:hover { color: rgba(0,0,0,0.85) !important; border-bottom-color: rgba(0,0,0,0.5) !important; }

                @media (max-width: 768px) {
                    .hero-grid {
                        grid-template-columns: 1fr !important;
                        min-height: unset !important;
                    }
                    .hero-grid > div:first-child {
                        min-height: 75vw;
                        aspect-ratio: unset;
                        height: 72vw;
                    }
                    .hero-grid > div:last-child {
                        padding: 36px 24px 56px !important;
                    }
                }
            `}</style>
        </section>
    );
}

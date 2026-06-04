"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
    Search,
    X,
    ShoppingCart,
    User,
    ArrowRight,
    Heart,
    LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cartStore";
import { useWishlistStore } from "@/lib/wishlistStore";
import { useAuthStore } from "@/lib/authStore";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/lib/types";

const NAV_LINKS = [
    { label: "Shop", href: "/shop" },
    { label: "Collections", href: "/#shop" },
    { label: "Dashboard", href: "/dashboard" },
];

const DRAWER_LINKS = [
    { label: "Home", href: "/" },
    { label: "Shop All", href: "/shop" },
    { label: "Polos", href: "/category/polo" },
    { label: "T-Shirts", href: "/category/tshirt" },
    { label: "Hoodies", href: "/category/hoodie" },
    { label: "Tank Tops", href: "/category/Tan top" },
    { label: "Socks", href: "/category/socks" },
    { label: "Joggers", href: "/category/joggers" },
    { label: "2 Piece Sets", href: "/category/2 piece set" },
    { label: "Beanie Hats", href: "/category/beanie Hat" },
    { label: "My Dashboard", href: "/dashboard" },
    { label: "Wishlist", href: "/wishlist" },
];

export default function Header() {
    const [showNav, setShowNav] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [scrolled, setScrolled] = useState(false);
    const [allProducts, setAllProducts] = useState<Product[]>([]);

    const { getTotalItems, openCart } = useCartStore();
    const { items: wishlistItems } = useWishlistStore();
    const { user, logout, checkSession } = useAuthStore();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        checkSession();
    }, []);

    useEffect(() => {
        fetchProducts()
            .then(setAllProducts)
            .catch(() => {});
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (showNav || showSearch) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [showNav, showSearch]);

    const handleSearch = (q: string) => {
        setSearchQuery(q);
        if (!q.trim()) {
            setSearchResults([]);
            return;
        }
        setSearchResults(
            allProducts
                .filter(
                    (p) =>
                        p.name.toLowerCase().includes(q.toLowerCase()) ||
                        p.category.toLowerCase().includes(q.toLowerCase()),
                )
                .slice(0, 8),
        );
    };

    const handleSelectResult = (id: string) => {
        setShowSearch(false);
        setSearchQuery("");
        setSearchResults([]);
        router.push(`/products/${id}`);
    };

    const fg = "#000";
    const bg = "#fff";
    const bgScrolled = scrolled ? "rgba(255,255,255,0.95)" : "#fff";
    const border = "rgba(0,0,0,0.08)";
    const sborder = "rgba(0,0,0,0.15)";

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500&display=swap');
                .pnav*{box-sizing:border-box;font-family:'Barlow',sans-serif}

                .pnav-bar{
                    position:fixed;top:0;left:0;right:0;z-index:50;
                    display:grid;grid-template-columns:1fr auto 1fr;align-items:center;
                    padding:0 32px;height:68px;
                    transition:background .4s,border-color .4s;
                    border-bottom:1px solid transparent;
                }
                .pnav-bar.sc{border-bottom-color:var(--nb);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}
                .pnav-left{display:flex;align-items:center;gap:8px}
                .pnav-center{display:flex;justify-content:center;align-items:center}
                .pnav-right{display:flex;align-items:center;justify-content:flex-end;gap:20px}

                .pnav-brand{
                    font-family:'Bebas Neue',sans-serif;font-size:26px;letter-spacing:.12em;
                    text-decoration:none;color:inherit;line-height:1;padding:6px 2px;
                }

                .pnav-links{display:none;align-items:center;gap:28px}
                @media(min-width:768px){.pnav-links{display:flex}}
                .pnav-link{
                    font-size:10px;font-weight:500;letter-spacing:.25em;text-transform:uppercase;
                    text-decoration:none;color:inherit;opacity:.55;transition:opacity .2s;
                }
                .pnav-link:hover{opacity:1}

                .pnav-icon{background:none;border:none;cursor:pointer;color:inherit;display:flex;align-items:center;justify-content:center;opacity:.65;transition:opacity .2s;padding:4px;text-decoration:none;position:relative}
                .pnav-icon:hover{opacity:1}
                .pnav-badge{
                    position:absolute;top:-6px;right:-7px;width:16px;height:16px;
                    border-radius:50%;display:flex;align-items:center;justify-content:center;
                    font-size:9px;font-weight:600;
                }

                .pnav-ham{display:flex;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:4px}
                .pnav-ham s{display:block;height:1px;background:currentColor;transition:width .3s}
                .pnav-ham s:nth-child(1){width:22px}
                .pnav-ham s:nth-child(2){width:14px}
                .pnav-ham s:nth-child(3){width:18px}
                .pnav-ham:hover s{width:22px!important}

                .pnav-backdrop{position:fixed;inset:0;z-index:58;background:rgba(0,0,0,.65);backdrop-filter:blur(4px);opacity:0;pointer-events:none;transition:opacity .4s}
                .pnav-backdrop.on{opacity:1;pointer-events:all}
                .pnav-drawer{position:fixed;top:0;left:0;bottom:0;width:min(420px,90vw);z-index:59;display:flex;flex-direction:column;transform:translateX(-100%);transition:transform .45s cubic-bezier(.16,1,.3,1);overflow-y:auto;background:#fff;color:#000}
                .pnav-drawer.on{transform:translateX(0)}

                .pnav-dtop{display:flex;align-items:center;justify-content:space-between;padding:24px 28px;border-bottom:1px solid rgba(0,0,0,0.07)}
                .pnav-dlogo{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:.12em;text-decoration:none;color:#000}

                .pnav-dlinks{flex:1;padding:32px 28px;display:flex;flex-direction:column}
                .pnav-dlink{
                    font-family:'Bebas Neue',sans-serif;font-size:clamp(34px,8vw,50px);letter-spacing:.04em;
                    text-decoration:none;color:#000;border-bottom:1px solid rgba(0,0,0,0.07);
                    padding:13px 0;display:flex;align-items:center;justify-content:space-between;
                    opacity:.85;transition:opacity .2s,padding-left .2s;
                }
                .pnav-dlink:hover{opacity:1;padding-left:8px}
                .pnav-dlink svg{opacity:.3;flex-shrink:0}

                .pnav-search{position:fixed;inset:0;z-index:70;display:flex;flex-direction:column;opacity:0;pointer-events:none;transition:opacity .35s}
                .pnav-search.on{opacity:1;pointer-events:all}
                .pnav-sbar{display:flex;align-items:center;gap:16px;padding:0 40px;height:80px;border-bottom:1px solid rgba(0,0,0,0.08)}
                .pnav-sinput{flex:1;background:none;border:none;outline:none;font-family:'Bebas Neue',sans-serif;font-size:clamp(22px,5vw,36px);letter-spacing:.06em;color:#000}
                .pnav-sinput::placeholder{opacity:.25}
                .pnav-sresults{flex:1;padding:32px 40px;overflow-y:auto}
                .pnav-sitem{display:flex;align-items:center;justify-content:space-between;padding:16px 0;border-bottom:1px solid rgba(0,0,0,0.06);font-size:14px;text-decoration:none;color:#000;opacity:.7;transition:opacity .2s;gap:12px}
                .pnav-sitem:hover{opacity:1}
                .pnav-sitem-img{width:44px;height:56px;object-fit:cover;flex-shrink:0;background:#f0f0f0}
                .pnav-sempty{font-size:13px;opacity:.35;letter-spacing:.1em;font-weight:300}

                @media(max-width:640px){
                    .pnav-bar{padding:0 20px}
                    .pnav-sbar{padding:0 20px;height:68px}
                    .pnav-sresults{padding:20px}
                    .pnav-search-btn{display:none!important}
                    .pnav-right{gap:14px}
                }
            `}</style>

            <div
                style={
                    { "--nb": border, "--sb": sborder } as React.CSSProperties
                }
            >
                {/* NAVBAR */}
                <nav
                    className={`pnav-bar${scrolled ? " sc" : ""}`}
                    style={{
                        background: scrolled ? bgScrolled : bg,
                        color: fg,
                    }}
                >
                    {/* Left */}
                    <div className="pnav-left">
                        <button
                            className="pnav-ham pnav-icon"
                            onClick={() => setShowNav(true)}
                            aria-label="Menu"
                            style={{ color: fg }}
                        >
                            <s />
                            <s />
                            <s />
                        </button>
                        <div className="pnav-links">
                            {NAV_LINKS.map(({ label, href }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    className="pnav-link"
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Center — logo */}
                    <div className="pnav-center">
                        <Link
                            href="/"
                            className="pnav-brand"
                            style={{ color: "#000" }}
                        >
                            URBANBLAQ
                        </Link>
                    </div>

                    {/* Right */}
                    <div className="pnav-right">
                        <button
                            className="pnav-icon pnav-search-btn"
                            onClick={() => setShowSearch(true)}
                            aria-label="Search"
                            style={{ color: fg }}
                        >
                            <Search size={18} strokeWidth={1.5} />
                        </button>
                        {user ? (
                            <button
                                className="pnav-icon"
                                onClick={async () => {
                                    await logout();
                                    router.push("/");
                                }}
                                aria-label="Logout"
                                style={{ color: fg }}
                                title={`Signed in as ${user.email}`}
                            >
                                <LogOut size={18} strokeWidth={1.5} />
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="pnav-icon"
                                aria-label="Sign in"
                                style={{ color: fg }}
                            >
                                <User size={18} strokeWidth={1.5} />
                            </Link>
                        )}
                        <Link
                            href="/wishlist"
                            className="pnav-icon"
                            aria-label="Wishlist"
                            style={{ color: fg }}
                        >
                            <Heart size={18} strokeWidth={1.5} />
                            {wishlistItems.length > 0 && (
                                <span
                                    className="pnav-badge"
                                    style={{ background: fg, color: bg }}
                                >
                                    {wishlistItems.length}
                                </span>
                            )}
                        </Link>
                        <div
                            className="pnav-icon"
                            style={{ position: "relative" }}
                        >
                            <button
                                className="pnav-icon"
                                onClick={openCart}
                                aria-label="Cart"
                                style={{ color: fg }}
                            >
                                <ShoppingCart size={19} strokeWidth={1.5} />
                            </button>
                            {getTotalItems() > 0 && (
                                <span
                                    className="pnav-badge"
                                    style={{ background: fg, color: bg }}
                                >
                                    {getTotalItems()}
                                </span>
                            )}
                        </div>
                    </div>
                </nav>

                {/* BACKDROP */}
                <div
                    className={`pnav-backdrop${showNav ? " on" : ""}`}
                    onClick={() => setShowNav(false)}
                />

                {/* DRAWER */}
                <div className={`pnav-drawer${showNav ? " on" : ""}`}>
                    <div className="pnav-dtop">
                        <Link
                            href="/"
                            className="pnav-dlogo"
                            onClick={() => setShowNav(false)}
                        >
                            URBANBLAQ
                        </Link>
                        <button
                            className="pnav-icon"
                            onClick={() => setShowNav(false)}
                            style={{ color: "#000" }}
                        >
                            <X size={20} strokeWidth={1.5} />
                        </button>
                    </div>
                    <nav className="pnav-dlinks">
                        {DRAWER_LINKS.map(({ label, href }) => (
                            <Link
                                key={label}
                                href={href}
                                className="pnav-dlink"
                                onClick={() => setShowNav(false)}
                            >
                                {label}
                                <ArrowRight size={18} strokeWidth={1} />
                            </Link>
                        ))}
                        {user ? (
                            <button
                                className="pnav-dlink"
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    width: "100%",
                                    textAlign: "left",
                                    color: "#dc2626",
                                    fontFamily: "'Bebas Neue',sans-serif",
                                }}
                                onClick={async () => {
                                    setShowNav(false);
                                    await logout();
                                    router.push("/");
                                }}
                            >
                                Sign Out
                                <LogOut size={18} strokeWidth={1} />
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="pnav-dlink"
                                onClick={() => setShowNav(false)}
                            >
                                Sign In
                                <ArrowRight size={18} strokeWidth={1} />
                            </Link>
                        )}
                    </nav>
                </div>

                {/* SEARCH OVERLAY */}
                <div
                    className={`pnav-search${showSearch ? " on" : ""}`}
                    style={{ background: "#fff", color: "#000" }}
                >
                    <div className="pnav-sbar">
                        <Search
                            size={20}
                            strokeWidth={1.5}
                            style={{ opacity: 0.4, flexShrink: 0 }}
                        />
                        <input
                            className="pnav-sinput"
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            autoFocus={showSearch}
                        />
                        <button
                            className="pnav-icon"
                            onClick={() => {
                                setShowSearch(false);
                                setSearchQuery("");
                                setSearchResults([]);
                            }}
                            style={{ color: "#000" }}
                        >
                            <X size={20} strokeWidth={1.5} />
                        </button>
                    </div>
                    <div className="pnav-sresults">
                        {searchResults.length > 0 ? (
                            searchResults.map((p) => (
                                <button
                                    key={p.id}
                                    className="pnav-sitem"
                                    onClick={() => handleSelectResult(p.id)}
                                    style={{
                                        width: "100%",
                                        textAlign: "left",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                    }}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={p.image}
                                        alt={p.name}
                                        className="pnav-sitem-img"
                                    />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div
                                            style={{
                                                fontWeight: 500,
                                                fontSize: 13,
                                            }}
                                        >
                                            {p.name}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 12,
                                                opacity: 0.45,
                                                marginTop: 3,
                                                fontFamily:
                                                    "'Bebas Neue',sans-serif",
                                                letterSpacing: "0.05em",
                                            }}
                                        >
                                            ₦{p.price.toLocaleString()}
                                        </div>
                                    </div>
                                    <ArrowRight
                                        size={14}
                                        strokeWidth={1.5}
                                        style={{ opacity: 0.35, flexShrink: 0 }}
                                    />
                                </button>
                            ))
                        ) : searchQuery ? (
                            <p className="pnav-sempty">
                                No results for &ldquo;{searchQuery}&rdquo;
                            </p>
                        ) : (
                            <p className="pnav-sempty">
                                Start typing to search...
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

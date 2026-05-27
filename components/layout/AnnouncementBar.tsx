"use client";
import { useState, useEffect } from "react";

const MESSAGES = [
    "🔥 UP TO 60% OFF NEW ARRIVALS — SHOP NOW",
    "✨ FREE DELIVERY ON ALL ORDERS OVER $50",
    "🆕 NEW SEASON ESSENTIALS JUST DROPPED",
    "💳 FREE RETURNS · EASY EXCHANGES ON ALL ORDERS",
];

export default function AnnouncementBar() {
    const [current, setCurrent] = useState(0);
    const [fading, setFading] = useState(false);

    useEffect(() => {
        const id = setInterval(() => {
            setFading(true);
            setTimeout(() => {
                setCurrent((c) => (c + 1) % MESSAGES.length);
                setFading(false);
            }, 300);
        }, 4000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="bg-black text-white text-center py-2.5 px-4 text-[11px] tracking-[3px] uppercase font-semibold">
            <span
                className="transition-opacity duration-300"
                style={{ opacity: fading ? 0 : 1 }}
            >
                {MESSAGES[current]}
            </span>
        </div>
    );
}

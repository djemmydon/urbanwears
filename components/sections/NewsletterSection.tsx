"use client";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function NewsletterSection() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setSubmitted(true);
        setEmail("");
    };

    return (
        <section className="bg-black py-20 md:py-24">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                <p className="text-[10px] tracking-[6px] uppercase text-[var(--accent-hex)] font-semibold mb-4">
                    Don&apos;t miss out
                </p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
                    Get 10% Off
                    <br />
                    Your First Order
                </h2>
                <p className="text-gray-400 text-sm mb-10 max-w-sm mx-auto leading-relaxed">
                    Sign up to our newsletter for exclusive deals, new arrivals and style inspo straight to your inbox.
                </p>

                {submitted ? (
                    <div className="bg-[var(--accent-hex)] text-white font-black uppercase tracking-widest text-sm px-10 py-5 inline-block">
                        ✓ You&apos;re in! Check your inbox.
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto"
                    >
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-white/40 px-5 py-4 text-sm focus:outline-none focus:border-[var(--accent-hex)] transition-colors"
                        />
                        <button
                            type="submit"
                            className="bg-[var(--accent-hex)] text-white font-black uppercase tracking-[3px] text-xs px-7 py-4 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                            Subscribe <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </form>
                )}

                <p className="text-gray-600 text-xs mt-5 tracking-wide">
                    No spam, unsubscribe at any time.
                </p>
            </div>
        </section>
    );
}

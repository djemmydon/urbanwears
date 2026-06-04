"use client";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function NewsletterSection() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        try {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            if (!res.ok) throw new Error();
            setDone(true);
            setEmail("");
            toast.success("You're in! Check your inbox.");
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section style={{ padding: "48px 24px" }}>
            <div style={{
                maxWidth: 900,
                margin: "0 auto",
                background: "#000",
                borderRadius: 20,
                padding: "64px 40px",
                textAlign: "center",
            }}>
                <p style={{
                    fontSize: 10, letterSpacing: "6px",
                    textTransform: "uppercase", color: "#ff8c00",
                    fontWeight: 600, marginBottom: 16,
                }}>
                    Don&apos;t miss out
                </p>

                <h2 style={{
                    margin: "0 0 16px",
                    fontSize: "clamp(28px, 5vw, 48px)",
                    fontWeight: 900,
                    color: "#fff",
                    textTransform: "uppercase",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.05,
                }}>
                    Get 10% Off<br />Your First Order
                </h2>

                <p style={{ margin: "0 auto 36px", maxWidth: 400, fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
                    Sign up to our newsletter for exclusive deals, new arrivals and style inspo straight to your inbox.
                </p>

                {done ? (
                    <div style={{
                        display: "inline-block",
                        background: "#ff8c00",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 12,
                        letterSpacing: "3px",
                        textTransform: "uppercase",
                        padding: "16px 36px",
                        borderRadius: 4,
                    }}>
                        ✓ You&apos;re in! Check your inbox.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 0, maxWidth: 440, margin: "0 auto" }}>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            style={{
                                flex: 1,
                                background: "rgba(255,255,255,0.08)",
                                border: "1px solid rgba(255,255,255,0.15)",
                                borderRight: "none",
                                color: "#fff",
                                padding: "14px 20px",
                                fontSize: 13,
                                outline: "none",
                            }}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                background: "#ff8c00",
                                color: "#fff",
                                border: "none",
                                padding: "14px 24px",
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: "3px",
                                textTransform: "uppercase",
                                cursor: loading ? "not-allowed" : "pointer",
                                opacity: loading ? 0.7 : 1,
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                whiteSpace: "nowrap",
                            }}
                        >
                            {loading ? "..." : <><span>Subscribe</span><ArrowRight size={13} /></>}
                        </button>
                    </form>
                )}

                <p style={{ marginTop: 20, fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: "0.05em" }}>
                    No spam, unsubscribe at any time.
                </p>
            </div>
        </section>
    );
}

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [resendLoading, setResendLoading] = useState(false);
    const [resendSent, setResendSent] = useState(false);
    const isEmailNotConfirmed = error.includes("confirm your email");

    const { login, user } = useAuthStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || "/";

    useEffect(() => {
        if (user) router.replace(redirect);
    }, [user, router, redirect]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(email, password);
            router.replace(redirect);
        } catch (err: any) {
            setError(err.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600&display=swap');
                .auth-page { font-family: 'Barlow', sans-serif; }
                .auth-label { font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; opacity: 0.5; margin-bottom: 8px; display: block; }
                .auth-input {
                    width: 100%; padding: 14px 16px; border: 1px solid rgba(0,0,0,0.15);
                    background: none; font-family: 'Barlow', sans-serif;
                    font-size: 14px; outline: none; color: #000; transition: border-color 0.2s;
                }
                .auth-input:focus { border-color: #000; }
                .auth-input::placeholder { opacity: 0.35; }
                .auth-btn {
                    width: 100%; height: 52px; border: none; cursor: pointer;
                    background: #000; color: #fff;
                    font-family: 'Barlow', sans-serif;
                    font-size: 11px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase;
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                    position: relative; overflow: hidden; transition: color 0.35s;
                }
                .auth-btn::before {
                    content: ''; position: absolute; inset: 0; background: #222;
                    transform: scaleX(0); transform-origin: right;
                    transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
                }
                .auth-btn:hover::before { transform: scaleX(1); transform-origin: left; }
                .auth-btn:hover { color: #fff; }
                .auth-btn > * { position: relative; z-index: 1; }
                .auth-btn:disabled { background: rgba(0,0,0,0.2); cursor: not-allowed; }
                .auth-btn:disabled::before { display: none; }
            `}</style>

            <div className="auth-page min-h-[calc(100vh-68px)] bg-white flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-10">
                        <Link
                            href="/"
                            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: "0.12em" }}
                            className="text-black no-underline"
                        >
                            URBANLUXE
                        </Link>
                        <p className="mt-3 text-xs tracking-widest uppercase opacity-40">
                            Sign in to your account
                        </p>
                    </div>

                    {error && (
                        <div
                            className="mb-6 px-4 py-3 text-sm text-red-600"
                            style={{ border: "1px solid rgba(220,38,38,0.2)", background: "rgba(220,38,38,0.03)" }}
                        >
                            {error}
                            {isEmailNotConfirmed && (
                                <div className="mt-3">
                                    {resendSent ? (
                                        <p style={{ color: "#16a34a", fontSize: 12 }}>✓ Confirmation email resent. Check your inbox.</p>
                                    ) : (
                                        <button
                                            onClick={async () => {
                                                setResendLoading(true);
                                                await supabase.auth.resend({ type: "signup", email });
                                                setResendSent(true);
                                                setResendLoading(false);
                                            }}
                                            disabled={resendLoading}
                                            style={{
                                                background: "none", border: "none", cursor: "pointer",
                                                fontSize: 12, fontWeight: 600, color: "#dc2626",
                                                textDecoration: "underline", padding: 0,
                                            }}
                                        >
                                            {resendLoading ? "Sending..." : "Resend confirmation email →"}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="auth-label">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="auth-input"
                            />
                        </div>
                        <div>
                            <label className="auth-label">Password</label>
                            <div style={{ position: "relative" }}>
                                <input
                                    type={showPass ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="auth-input"
                                    style={{ paddingRight: 48 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass((v) => !v)}
                                    style={{
                                        position: "absolute", right: 14, top: "50%",
                                        transform: "translateY(-50%)", background: "none",
                                        border: "none", cursor: "pointer", opacity: 0.4,
                                    }}
                                >
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div style={{ paddingTop: 8 }}>
                            <button type="submit" className="auth-btn" disabled={loading}>
                                <span>{loading ? "Signing in..." : "Sign In"}</span>
                                {!loading && <ArrowRight size={14} />}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center space-y-3">
                        <p style={{ fontSize: 12, opacity: 0.4, letterSpacing: "0.1em" }}>
                            Don&apos;t have an account?{" "}
                            <Link
                                href={`/register${redirect !== "/" ? `?redirect=${redirect}` : ""}`}
                                style={{ opacity: 1, fontWeight: 600, textDecoration: "none", borderBottom: "1px solid currentColor" }}
                            >
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

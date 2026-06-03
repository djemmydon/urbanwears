"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

function RegisterForm() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const { register, user } = useAuthStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || "/";

    useEffect(() => {
        if (user) router.replace(redirect);
    }, [user, router, redirect]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        setLoading(true);
        try {
            await register(email, password, fullName);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "Could not create account");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[calc(100vh-68px)] bg-white flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center space-y-4">
                    <div
                        style={{
                            width: 56, height: 56, background: "#000",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            margin: "0 auto",
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: "0.05em" }}>
                        Account Created
                    </h2>
                    <p style={{ fontSize: 13, opacity: 0.5, lineHeight: 1.7 }}>
                        Check your email to confirm your account, then sign in.
                    </p>
                    <Link
                        href={`/login${redirect !== "/" ? `?redirect=${redirect}` : ""}`}
                        style={{
                            display: "inline-flex", alignItems: "center", gap: 8,
                            background: "#000", color: "#fff", padding: "14px 32px",
                            fontSize: 11, fontWeight: 500, letterSpacing: "0.22em",
                            textTransform: "uppercase", textDecoration: "none",
                        }}
                    >
                        Sign In <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        );
    }

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
                    <div className="text-center mb-10">
                        <Link
                            href="/"
                            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: "0.12em" }}
                            className="text-black no-underline"
                        >
                            URBANBLAQ
                        </Link>
                        <p className="mt-3 text-xs tracking-widest uppercase opacity-40">
                            Create your account
                        </p>
                    </div>

                    {error && (
                        <div
                            className="mb-6 px-4 py-3 text-sm text-red-600"
                            style={{ border: "1px solid rgba(220,38,38,0.2)", background: "rgba(220,38,38,0.03)" }}
                        >
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="auth-label">Full Name</label>
                            <input
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Your full name"
                                className="auth-input"
                            />
                        </div>
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
                                    placeholder="Min 6 characters"
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
                                <span>{loading ? "Creating account..." : "Create Account"}</span>
                                {!loading && <ArrowRight size={14} />}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <p style={{ fontSize: 12, opacity: 0.4, letterSpacing: "0.1em" }}>
                            Already have an account?{" "}
                            <Link
                                href={`/login${redirect !== "/" ? `?redirect=${redirect}` : ""}`}
                                style={{ opacity: 1, fontWeight: 600, textDecoration: "none", borderBottom: "1px solid currentColor" }}
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div style={{ width: 32, height: 32, border: "1.5px solid rgba(0,0,0,0.08)", borderTopColor: "#000", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
        }>
            <RegisterForm />
        </Suspense>
    );
}

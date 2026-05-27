"use client";
import { useState } from "react";
import { Menu } from "lucide-react";
import { useAdminStore } from "@/lib/adminStore";
import Sidebar from "@/components/admin/Sidebar";
import { toast } from "sonner";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, login } = useAdminStore();
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await new Promise((r) => setTimeout(r, 400));
        const ok = login(password);
        if (!ok) toast.error("Incorrect password");
        setLoading(false);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
                <div className="w-full max-w-sm">
                    <div className="text-center mb-10">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-black font-black text-2xl">U</span>
                        </div>
                        <h1 className="text-white text-2xl font-black tracking-tight">
                            URBANLUXE
                        </h1>
                        <p className="text-zinc-500 text-sm mt-1">Admin Panel</p>
                    </div>

                    <form
                        onSubmit={handleLogin}
                        className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800"
                    >
                        <h2 className="text-white text-xl font-semibold mb-6">
                            Sign In
                        </h2>
                        <input
                            type="password"
                            placeholder="Admin password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-zinc-800 text-white border border-zinc-700 px-4 py-3.5 rounded-2xl focus:outline-none focus:border-white/40 mb-4"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-white text-black rounded-2xl font-bold hover:bg-orange-500 transition-all disabled:opacity-60"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                        <p className="text-zinc-600 text-xs text-center mt-4">
                            Hint: admin123
                        </p>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950">
            {/* Mobile backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar — fixed overlay on mobile, static column on desktop */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 lg:static lg:z-auto shrink-0 transition-transform duration-300 ease-out ${
                    sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                }`}
            >
                <Sidebar onClose={() => setSidebarOpen(false)} />
            </aside>

            {/* Content area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile top bar */}
                <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-zinc-950 border-b border-zinc-800 shrink-0">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Open menu"
                        className="p-2 text-white hover:bg-zinc-800 rounded-xl transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
                            <span className="text-black font-black text-sm">U</span>
                        </div>
                        <span className="text-white font-black text-sm tracking-wider">
                            URBANLUXE ADMIN
                        </span>
                    </div>
                </div>

                <main className="flex-1 overflow-auto">{children}</main>
            </div>
        </div>
    );
}

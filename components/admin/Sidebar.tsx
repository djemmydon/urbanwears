"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    LogOut,
    ChevronRight,
    Store,
    X,
} from "lucide-react";
import { useAdminStore } from "@/lib/adminStore";
import { toast } from "sonner";

const NAV = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAdminStore();

    const handleLogout = () => {
        logout();
        toast.success("Logged out");
        router.push("/admin");
        onClose?.();
    };

    const handleNav = () => onClose?.();

    return (
        <aside className="w-64 h-full min-h-screen bg-zinc-950 text-white flex flex-col">
            {/* Brand */}
            <div className="px-6 py-6 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shrink-0">
                        <span className="text-black font-black text-lg">U</span>
                    </div>
                    <div>
                        <p className="font-black text-sm tracking-wider">URBANBLAQ</p>
                        <p className="text-[10px] text-zinc-500 tracking-widest">
                            ADMIN PANEL
                        </p>
                    </div>
                </div>
                {/* Close button — mobile only */}
                <button
                    onClick={onClose}
                    aria-label="Close menu"
                    className="lg:hidden p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                {NAV.map(({ href, label, icon: Icon }) => {
                    const active =
                        pathname === href || pathname.startsWith(href + "/");
                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={handleNav}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                                active
                                    ? "bg-white text-black"
                                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className="w-4 h-4" />
                                {label}
                            </div>
                            {active && (
                                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="px-4 py-4 border-t border-zinc-800 space-y-1">
                <Link
                    href="/"
                    onClick={handleNav}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all"
                >
                    <Store className="w-4 h-4" />
                    View Store
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>
        </aside>
    );
}

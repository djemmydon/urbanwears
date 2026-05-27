"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import RotatingColorPicker from "./RotatingColorPicker";
import CartModal from "./CartModal";
import { useCartStore } from "@/lib/cartStore";

export default function StoreShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith("/admin");
    const { isCartOpen, closeCart } = useCartStore();

    if (isAdmin) return <>{children}</>;

    return (
        <>
            <Header />
            {children}
            <RotatingColorPicker />
            <Footer />
            {/* Cart rendered here (body level) to avoid header stacking-context issues */}
            <CartModal isOpen={isCartOpen} onClose={closeCart} />
        </>
    );
}

import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import StoreShell from "@/components/layout/StoreShell";

const jakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-jakarta",
    display: "swap",
});

const cormorant = Cormorant_Garamond({
    subsets: ["latin"],
    variable: "--font-cormorant",
    weight: ["300", "400", "500", "600", "700"],
    style: ["normal", "italic"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "URBANBLAQ | Urbanblaqluxury — Premium Polos, T-Shirts & Hoodies",
    description: "Urbanblaqluxury — premium essentials for the modern wardrobe.",
    icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <head>
                {/* Prevent flash of wrong theme on load */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){try{var s=JSON.parse(localStorage.getItem('theme-storage')||'{}');var st=s.state||{};if(st.isDark)document.documentElement.classList.add('dark');if(st.accentColor)document.documentElement.style.setProperty('--accent-hex',st.accentColor);}catch(e){}})();`,
                    }}
                />
            </head>
            <body className={`${jakarta.variable} ${cormorant.variable} font-sans antialiased`}>
                <StoreShell>{children}</StoreShell>
                <Toaster position="top-center" richColors closeButton />
            </body>
        </html>
    );
}

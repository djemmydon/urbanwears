import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Terms of Service — URBANBLAQ" };

export default function TermsOfService() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-16">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-10">
                <ArrowLeft className="w-4 h-4" /> Back to Shop
            </Link>

            <div className="mb-10">
                <p className="text-xs tracking-[4px] uppercase text-orange-500 font-semibold mb-3">Legal</p>
                <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Terms of Service</h1>
                <p className="text-gray-500 text-sm">Last updated: June 2026</p>
            </div>

            <div className="space-y-8 text-gray-700 leading-relaxed text-sm">
                <Section title="1. Acceptance of Terms">
                    <p>By accessing and using the URBANBLAQ website, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.</p>
                </Section>

                <Section title="2. Products & Pricing">
                    <p>All prices are displayed in Nigerian Naira (₦) and are subject to change without notice. We reserve the right to modify or discontinue any product at any time. All purchases are subject to product availability.</p>
                </Section>

                <Section title="3. Orders & Payment">
                    <p>By placing an order, you confirm that the information you provide is accurate. Payment is processed securely through Paystack. We reserve the right to cancel any order if we suspect fraudulent activity.</p>
                </Section>

                <Section title="4. Shipping & Delivery">
                    <p>Delivery fees apply to all orders as shown at checkout. Estimated delivery times are provided at checkout but are not guaranteed. We are not responsible for delays caused by third-party couriers or unforeseen circumstances.</p>
                </Section>

                <Section title="5. Returns & Refunds">
                    <p>We accept returns within 7 days of delivery for items in their original, unworn condition with tags attached. Sale items and accessories may not be eligible for returns. See our <Link href="/returns" className="text-orange-500 underline">Returns & Exchanges</Link> policy for full details.</p>
                </Section>

                <Section title="6. Intellectual Property">
                    <p>All content on this website, including images, text, logos, and designs, are the property of URBANBLAQ and are protected by intellectual property laws. You may not reproduce or distribute any content without our written permission.</p>
                </Section>

                <Section title="7. Limitation of Liability">
                    <p>URBANBLAQ shall not be liable for any indirect, incidental, or consequential damages arising from your use of our website or products. Our total liability shall not exceed the amount paid for the specific product giving rise to the claim.</p>
                </Section>

                <Section title="8. Governing Law">
                    <p>These Terms of Service are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved in Nigerian courts.</p>
                </Section>

                <Section title="9. Contact">
                    <p>For questions about these Terms, contact us at <a href="mailto:melvin@urbanblaqluxury.com" className="text-orange-500 underline">melvin@urbanblaqluxury.com</a>.</p>
                </Section>
            </div>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h2 className="text-lg font-bold text-black mb-3">{title}</h2>
            <div className="space-y-2">{children}</div>
        </div>
    );
}

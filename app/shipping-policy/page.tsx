import Link from "next/link";
import { ArrowLeft, Package, Clock, MapPin, Phone } from "lucide-react";

export const metadata = { title: "Shipping Policy — URBANBLAQ" };

export default function ShippingPolicy() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-16">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-10">
                <ArrowLeft className="w-4 h-4" /> Back to Shop
            </Link>

            <div className="mb-10">
                <p className="text-xs tracking-[4px] uppercase text-orange-500 font-semibold mb-3">Legal</p>
                <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Shipping Policy</h1>
                <p className="text-gray-500 text-sm">Last updated: June 2026</p>
            </div>

            {/* Quick Info Cards */}
            <div className="grid sm:grid-cols-2 gap-4 mb-12">
                {[
                    { icon: Package, label: "Delivery Fee", value: "₦2,500 per order" },
                    { icon: Clock, label: "Processing Time", value: "1–2 business days" },
                    { icon: MapPin, label: "Delivery Time", value: "2–5 business days" },
                    { icon: Phone, label: "Order Support", value: "melvin@urbanblaqluxury.com" },
                ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="bg-gray-50 rounded-2xl p-5 flex items-start gap-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">{label}</p>
                            <p className="font-semibold text-sm">{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-8 text-gray-700 leading-relaxed text-sm">
                <Section title="Delivery Fee">
                    <p>A flat delivery fee of <strong className="text-black">₦2,500</strong> applies to all orders, regardless of order size or location within Nigeria. The delivery fee is displayed clearly at checkout before payment.</p>
                </Section>

                <Section title="Order Processing">
                    <p>Orders are processed within <strong className="text-black">1–2 business days</strong> after payment confirmation. Orders placed on weekends or public holidays will be processed on the next business day.</p>
                    <p>You will receive a confirmation email once your order has been placed and another notification when it has been dispatched.</p>
                </Section>

                <Section title="Delivery Timeframe">
                    <p>Once dispatched, orders typically arrive within <strong className="text-black">2–5 business days</strong> depending on your location:</p>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                        <li>Lagos — 1–2 business days</li>
                        <li>Other major cities (Abuja, Port Harcourt, Ibadan, Kano) — 2–3 business days</li>
                        <li>Other states — 3–5 business days</li>
                    </ul>
                </Section>

                <Section title="Tracking Your Order">
                    <p>Once your order is dispatched, you can track it via the <Link href="/orders" className="text-orange-500 underline">Order Tracking</Link> page using your email address. You will also receive updates via email.</p>
                </Section>

                <Section title="Delivery Issues">
                    <p>If your order has not arrived within the expected timeframe, or if you have any delivery concerns, please contact us at <a href="mailto:melvin@urbanblaqluxury.com" className="text-orange-500 underline">melvin@urbanblaqluxury.com</a> with your order number.</p>
                </Section>

                <Section title="Address Accuracy">
                    <p>Please ensure your delivery address is complete and accurate at checkout. URBANBLAQ is not responsible for orders delivered to an incorrect address provided by the customer.</p>
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

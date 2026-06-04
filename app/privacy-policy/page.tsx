import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Privacy Policy — URBANBLAQ" };

export default function PrivacyPolicy() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-16">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-10">
                <ArrowLeft className="w-4 h-4" /> Back to Shop
            </Link>

            <div className="mb-10">
                <p className="text-xs tracking-[4px] uppercase text-orange-500 font-semibold mb-3">Legal</p>
                <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Privacy Policy</h1>
                <p className="text-gray-500 text-sm">Last updated: June 2026</p>
            </div>

            <div className="prose prose-sm max-w-none space-y-8 text-gray-700 leading-relaxed">
                <Section title="1. Information We Collect">
                    <p>When you use URBANBLAQ, we collect information you provide directly to us, including your name, email address, phone number, delivery address, and payment information when you make a purchase.</p>
                    <p>We also automatically collect certain information about your device and how you interact with our website, including your IP address, browser type, and pages visited.</p>
                </Section>

                <Section title="2. How We Use Your Information">
                    <ul>
                        <li>To process and fulfil your orders</li>
                        <li>To send you order confirmations and shipping updates</li>
                        <li>To send newsletters and promotional emails (only if you subscribed)</li>
                        <li>To improve our website and customer experience</li>
                        <li>To respond to customer service requests</li>
                    </ul>
                </Section>

                <Section title="3. Sharing Your Information">
                    <p>We do not sell, trade, or transfer your personal information to third parties, except:</p>
                    <ul>
                        <li>Payment processors (Paystack) to complete transactions</li>
                        <li>Delivery partners to fulfil your orders</li>
                        <li>Service providers who assist in operating our website</li>
                        <li>When required by law</li>
                    </ul>
                </Section>

                <Section title="4. Cookies">
                    <p>Our website uses cookies to enhance your browsing experience, remember your preferences, and analyse website traffic. You can disable cookies in your browser settings, though some features may not function correctly.</p>
                </Section>

                <Section title="5. Data Security">
                    <p>We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction.</p>
                </Section>

                <Section title="6. Your Rights">
                    <p>You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at <a href="mailto:melvin@urbanblaqluxury.com" className="text-orange-500 underline">melvin@urbanblaqluxury.com</a>.</p>
                </Section>

                <Section title="7. Newsletter & Marketing">
                    <p>If you subscribed to our newsletter, you can unsubscribe at any time by clicking "Unsubscribe" in any email we send, or by contacting us directly.</p>
                </Section>

                <Section title="8. Contact">
                    <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:melvin@urbanblaqluxury.com" className="text-orange-500 underline">melvin@urbanblaqluxury.com</a>.</p>
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

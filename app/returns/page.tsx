import Link from "next/link";
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export const metadata = { title: "Returns & Exchanges — URBANBLAQ" };

export default function ReturnsPage() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-16">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-10">
                <ArrowLeft className="w-4 h-4" /> Back to Shop
            </Link>

            <div className="mb-10">
                <p className="text-xs tracking-[4px] uppercase text-orange-500 font-semibold mb-3">Legal</p>
                <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Returns & Exchanges</h1>
                <p className="text-gray-500 text-sm">Last updated: June 2026</p>
            </div>

            {/* Return window banner */}
            <div className="bg-black text-white rounded-2xl p-6 flex items-center gap-4 mb-12">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shrink-0">
                    <RefreshCw className="w-6 h-6 text-white" />
                </div>
                <div>
                    <p className="font-bold text-lg">7-Day Return Window</p>
                    <p className="text-gray-400 text-sm">Returns accepted within 7 days of delivery for eligible items.</p>
                </div>
            </div>

            <div className="space-y-8 text-gray-700 leading-relaxed text-sm">
                <Section title="Return Eligibility">
                    <div className="grid sm:grid-cols-2 gap-3">
                        <div className="bg-green-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="font-semibold text-green-800 text-xs uppercase tracking-wide">Eligible for Return</span>
                            </div>
                            <ul className="space-y-1 text-green-700 text-xs">
                                <li>• Unworn items with tags attached</li>
                                <li>• Original packaging intact</li>
                                <li>• Returned within 7 days of delivery</li>
                                <li>• Full-price items</li>
                            </ul>
                        </div>
                        <div className="bg-red-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <XCircle className="w-4 h-4 text-red-600" />
                                <span className="font-semibold text-red-800 text-xs uppercase tracking-wide">Not Eligible</span>
                            </div>
                            <ul className="space-y-1 text-red-700 text-xs">
                                <li>• Worn or washed items</li>
                                <li>• Items without original tags</li>
                                <li>• Sale / discounted items</li>
                                <li>• Accessories (socks, beanies)</li>
                            </ul>
                        </div>
                    </div>
                </Section>

                <Section title="How to Return">
                    <ol className="list-decimal list-inside space-y-2">
                        <li>Email us at <a href="mailto:melvin@urbanblaqluxury.com" className="text-orange-500 underline">melvin@urbanblaqluxury.com</a> with your order number and reason for return</li>
                        <li>We will confirm your return request within 1–2 business days</li>
                        <li>Pack the item securely in its original packaging</li>
                        <li>Ship the item to the return address provided in our email</li>
                        <li>Once received and inspected, your refund will be processed within 5–7 business days</li>
                    </ol>
                </Section>

                <Section title="Exchanges">
                    <p>We currently do not offer direct exchanges. If you need a different size or colour, please return the original item for a refund and place a new order for the item you want.</p>
                </Section>

                <Section title="Refunds">
                    <p>Approved refunds will be processed back to your original payment method within <strong className="text-black">5–7 business days</strong> of us receiving and inspecting the returned item.</p>
                    <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
                        <p className="text-yellow-800 text-xs">Note: The original delivery fee (₦2,500) is non-refundable. Return shipping costs are the customer's responsibility.</p>
                    </div>
                </Section>

                <Section title="Damaged or Wrong Items">
                    <p>If you receive a damaged or incorrect item, please contact us within <strong className="text-black">48 hours</strong> of delivery at <a href="mailto:melvin@urbanblaqluxury.com" className="text-orange-500 underline">melvin@urbanblaqluxury.com</a> with a photo of the item. We will arrange a free return and full refund or replacement at no extra cost.</p>
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

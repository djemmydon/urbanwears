import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Size Guide — URBANBLAQ" };

const SIZES = [
    { size: "M", chest: "38–40", waist: "30–32", hip: "38–40", height: "5'7\"–5'9\"" },
    { size: "L", chest: "41–43", waist: "33–35", hip: "41–43", height: "5'9\"–5'11\"" },
    { size: "XL", chest: "44–46", waist: "36–38", hip: "44–46", height: "5'11\"–6'1\"" },
    { size: "XXL", chest: "47–49", waist: "39–41", hip: "47–49", height: "6'1\"–6'3\"" },
];

const JOGGER_SIZES = [
    { size: "M", waist: "30–32", hip: "38–40", inseam: "29–30", length: "40–41" },
    { size: "L", waist: "33–35", hip: "41–43", inseam: "30–31", length: "41–42" },
    { size: "XL", waist: "36–38", hip: "44–46", inseam: "31–32", length: "42–43" },
    { size: "XXL", waist: "39–41", hip: "47–49", inseam: "32–33", length: "43–44" },
];

export default function SizeGuide() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-16">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-10">
                <ArrowLeft className="w-4 h-4" /> Back to Shop
            </Link>

            <div className="mb-10">
                <p className="text-xs tracking-[4px] uppercase text-orange-500 font-semibold mb-3">Help</p>
                <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Size Guide</h1>
                <p className="text-gray-500 text-sm">All measurements are in inches unless stated otherwise.</p>
            </div>

            {/* How to measure */}
            <div className="bg-black text-white rounded-2xl p-8 mb-12">
                <h2 className="font-black text-xl uppercase tracking-tight mb-4">How to Measure</h2>
                <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-300">
                    {[
                        { label: "Chest", desc: "Measure around the fullest part of your chest, keeping the tape horizontal." },
                        { label: "Waist", desc: "Measure around your natural waistline, just above your hips." },
                        { label: "Hips", desc: "Measure around the fullest part of your hips and seat." },
                        { label: "Inseam", desc: "Measure from your crotch to the bottom of your ankle." },
                    ].map(({ label, desc }) => (
                        <div key={label} className="flex gap-3">
                            <span className="w-2 h-2 mt-1.5 rounded-full bg-orange-500 shrink-0" />
                            <div>
                                <p className="font-semibold text-white mb-0.5">{label}</p>
                                <p>{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tops: Polo, T-Shirt, Hoodie, Tank Top */}
            <section className="mb-12">
                <h2 className="font-black text-2xl uppercase tracking-tight mb-6">
                    Tops <span className="text-gray-400 font-normal text-base normal-case tracking-normal">— Polo, T-Shirt, Hoodie, Tank Top</span>
                </h2>
                <div className="overflow-x-auto rounded-2xl border border-gray-200">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-black text-white">
                                <th className="px-5 py-4 text-left font-semibold">Size</th>
                                <th className="px-5 py-4 text-left font-semibold">Chest (in)</th>
                                <th className="px-5 py-4 text-left font-semibold">Waist (in)</th>
                                <th className="px-5 py-4 text-left font-semibold">Hip (in)</th>
                                <th className="px-5 py-4 text-left font-semibold">Height</th>
                            </tr>
                        </thead>
                        <tbody>
                            {SIZES.map((row, i) => (
                                <tr key={row.size} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                    <td className="px-5 py-4 font-bold">{row.size}</td>
                                    <td className="px-5 py-4 text-gray-600">{row.chest}</td>
                                    <td className="px-5 py-4 text-gray-600">{row.waist}</td>
                                    <td className="px-5 py-4 text-gray-600">{row.hip}</td>
                                    <td className="px-5 py-4 text-gray-600">{row.height}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Joggers / Bottoms */}
            <section className="mb-12">
                <h2 className="font-black text-2xl uppercase tracking-tight mb-6">
                    Bottoms <span className="text-gray-400 font-normal text-base normal-case tracking-normal">— Joggers, 2 Piece Sets</span>
                </h2>
                <div className="overflow-x-auto rounded-2xl border border-gray-200">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-black text-white">
                                <th className="px-5 py-4 text-left font-semibold">Size</th>
                                <th className="px-5 py-4 text-left font-semibold">Waist (in)</th>
                                <th className="px-5 py-4 text-left font-semibold">Hip (in)</th>
                                <th className="px-5 py-4 text-left font-semibold">Inseam (in)</th>
                                <th className="px-5 py-4 text-left font-semibold">Length (in)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {JOGGER_SIZES.map((row, i) => (
                                <tr key={row.size} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                    <td className="px-5 py-4 font-bold">{row.size}</td>
                                    <td className="px-5 py-4 text-gray-600">{row.waist}</td>
                                    <td className="px-5 py-4 text-gray-600">{row.hip}</td>
                                    <td className="px-5 py-4 text-gray-600">{row.inseam}</td>
                                    <td className="px-5 py-4 text-gray-600">{row.length}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Tips */}
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 text-sm text-orange-900">
                <p className="font-bold mb-2">Not sure which size to pick?</p>
                <ul className="space-y-1">
                    <li>• If you&apos;re between sizes, we recommend sizing up for a relaxed fit</li>
                    <li>• Our polos and t-shirts are true to size</li>
                    <li>• Hoodies are slightly oversized by design</li>
                    <li>• For 2 piece sets, choose based on whichever body part measures larger</li>
                </ul>
                <p className="mt-3">Still unsure? Email us at <a href="mailto:melvin@urbanblaqluxury.com" className="underline font-medium">melvin@urbanblaqluxury.com</a> — we&apos;re happy to help.</p>
            </div>
        </div>
    );
}

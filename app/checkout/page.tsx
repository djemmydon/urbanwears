"use client";
import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/cartStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import {
    Lock,
    CheckCircle,
    ShoppingBag,
    User,
    Phone,
    MapPin,
    Mail,
} from "lucide-react";
import { usePaystack } from "@/hooks/usePaystack";
import { useUserStore } from "@/lib/userStore";
import { useAuthStore } from "@/lib/authStore";
import { createOrder, verifyPayment } from "@/lib/api";

export default function CheckoutPage() {
    // ── ALL hooks must be at the top, before any conditional return ──
    const { items, getTotalPrice, clearCart } = useCartStore();
    const { pay, loaded: paystackLoaded } = usePaystack();
    const router = useRouter();
    const { setUserInfo } = useUserStore();
    const { user, checkSession, loading: authLoading } = useAuthStore();

    const [step, setStep] = useState<"details" | "success">("details");
    const [isProcessing, setIsProcessing] = useState(false);
    const [completedOrderId, setCompletedOrderId] = useState("");
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
    });

    useEffect(() => {
        checkSession();
    }, []);

    // Pre-fill form when user loads
    useEffect(() => {
        if (user) {
            setForm((f) => ({
                ...f,
                fullName: f.fullName || user.fullName || "",
                email: f.email || user.email || "",
            }));
        }
    }, [user]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.replace("/login?redirect=/checkout");
        }
    }, [user, authLoading, router]);

    // ── Conditional renders after all hooks ──
    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div
                    style={{
                        width: 36,
                        height: 36,
                        border: "1.5px solid rgba(0,0,0,0.08)",
                        borderTopColor: "#000",
                        borderRadius: "50%",
                        animation: "spin 0.7s linear infinite",
                    }}
                />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    const SHIPPING_FEE = 2500;
    const subtotal = getTotalPrice();
    const total = subtotal + SHIPPING_FEE;
    const currency = process.env.NEXT_PUBLIC_PAYSTACK_CURRENCY || "NGN";

    const updateForm = (field: string, value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const handlePay = () => {
        if (items.length === 0) {
            toast.error("Your cart is empty");
            return;
        }
        if (!form.email || !form.fullName || !form.phone) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsProcessing(true);

        pay({
            email: form.email,
            amount: total,
            onSuccess: async (reference) => {
                try {
                    // 1. Verify payment server-side
                    await verifyPayment(reference);

                    // 2. Save order to Supabase
                    const order = await createOrder({
                        items,
                        total,
                        email: form.email,
                        fullName: form.fullName,
                        phone: form.phone,
                        address: form.address,
                        paymentReference: reference,
                        currency,
                    });

                    // 3. Save user info for order tracking
                    setUserInfo({
                        email: form.email,
                        fullName: form.fullName,
                        phone: form.phone,
                        address: form.address,
                    });

                    clearCart();
                    setCompletedOrderId(order.id);
                    setStep("success");

                    toast.success("Payment successful!", {
                        description: `Order #${order.id} confirmed`,
                    });
                } catch {
                    toast.error(
                        "Something went wrong saving your order. Contact support with reference: " +
                            reference,
                    );
                } finally {
                    setIsProcessing(false);
                }
            },
            onCancel: () => {
                setIsProcessing(false);
                toast.info("Payment cancelled");
            },
        });
    };

    if (step === "success") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-zinc-950 dark:to-black px-6">
                <div className="text-center max-w-md w-full">
                    <div className="mx-auto w-24 h-24 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mb-8">
                        <CheckCircle className="w-14 h-14 text-green-500" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">
                        Order Confirmed!
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-2">
                        Thank you, {form.fullName}!
                    </p>
                    <p className="font-mono text-sm bg-gray-100 dark:bg-zinc-800 px-4 py-2 rounded-xl inline-block mb-8">
                        {completedOrderId}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 mb-10">
                        A confirmation has been sent to{" "}
                        <span className="font-medium text-black dark:text-white">
                            {form.email}
                        </span>
                    </p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => router.push("/orders")}
                            className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-semibold hover:bg-orange-500 hover:text-white transition-all"
                        >
                            Track My Order
                        </button>
                        <button
                            onClick={() => router.push("/")}
                            className="w-full py-4 border border-gray-200 dark:border-zinc-700 rounded-2xl font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="mb-10">
                <h1 className="text-4xl font-bold">Checkout</h1>
                <p className="text-gray-500 mt-2">
                    Secure payment powered by Paystack
                </p>
            </div>

            <div className="grid lg:grid-cols-5 gap-10">
                {/* Left: Customer Details */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-gray-100 dark:border-zinc-800">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <User className="w-5 h-5" /> Contact Information
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Full Name{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={form.fullName}
                                    onChange={(e) =>
                                        updateForm("fullName", e.target.value)
                                    }
                                    className="w-full p-4 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-transparent focus:border-[var(--accent-hex)] focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Email Address{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={form.email}
                                        onChange={(e) =>
                                            updateForm("email", e.target.value)
                                        }
                                        className="w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-transparent focus:border-[var(--accent-hex)] focus:outline-none"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1.5">
                                    Used to track your order
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Phone Number{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="tel"
                                        placeholder="+234 800 000 0000"
                                        value={form.phone}
                                        onChange={(e) =>
                                            updateForm("phone", e.target.value)
                                        }
                                        className="w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-transparent focus:border-[var(--accent-hex)] focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-gray-100 dark:border-zinc-800">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <MapPin className="w-5 h-5" /> Delivery Address
                        </h2>
                        <textarea
                            placeholder="Street address, city, state..."
                            rows={3}
                            value={form.address}
                            onChange={(e) =>
                                updateForm("address", e.target.value)
                            }
                            className="w-full p-4 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-transparent focus:border-[var(--accent-hex)] focus:outline-none resize-none"
                        />
                    </div>

                    {/* Order Items */}
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-gray-100 dark:border-zinc-800">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5" /> Order Summary
                        </h2>
                        <div className="space-y-5">
                            {items.length === 0 ? (
                                <p className="text-gray-500 text-center py-6">
                                    Your cart is empty
                                </p>
                            ) : (
                                items.map((item) => (
                                    <div
                                        key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                                        className="flex gap-4"
                                    >
                                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-zinc-800">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold leading-tight">
                                                {item.name}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-0.5">
                                                {item.selectedSize} •{" "}
                                                {item.selectedColor} ×{" "}
                                                {item.quantity}
                                            </p>
                                            <p className="font-bold mt-1">
                                                ₦
                                                {(
                                                    item.price * item.quantity
                                                ).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Payment Summary */}
                <div className="lg:col-span-2">
                    <div className="sticky top-24 bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-gray-100 dark:border-zinc-800">
                        <h3 className="text-xl font-semibold mb-6">
                            Payment Summary
                        </h3>

                        <div className="space-y-4 text-base mb-6">
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>
                                    Subtotal (
                                    {items.reduce((s, i) => s + i.quantity, 0)}{" "}
                                    items)
                                </span>
                                <span>₦{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Delivery Fee</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    ₦{SHIPPING_FEE.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between font-bold text-2xl pt-4 border-t border-gray-100 dark:border-zinc-700">
                                <span>Total</span>
                                <span>₦{total.toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePay}
                            disabled={
                                isProcessing ||
                                !paystackLoaded ||
                                items.length === 0
                            }
                            className="w-full py-5 bg-[var(--accent-hex)] text-white rounded-2xl font-bold text-lg hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all active:scale-[0.98] cursor-pointer"
                        >
                            {isProcessing ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-black rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Lock className="w-5 h-5" />
                                    Pay ₦{total.toLocaleString()} with Paystack
                                </>
                            )}
                        </button>

                        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                            <Lock className="w-3 h-3" />
                            <span>Secured by Paystack • 256-bit SSL</span>
                        </div>

                        <div className="mt-6 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-700">
                            <p className="text-xs text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                                You'll be redirected to Paystack to complete
                                your payment securely. Your order details are
                                saved automatically.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

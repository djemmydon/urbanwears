"use client";
import { useEffect, useState } from "react";

declare global {
    interface Window {
        PaystackPop: {
            new (): {
                newTransaction: (config: {
                    key: string;
                    email: string;
                    amount: number;
                    currency?: string;
                    ref?: string;
                    onSuccess: (transaction: { reference: string }) => void;
                    onCancel: () => void;
                }) => void;
            };
        };
    }
}

export function usePaystack() {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (document.querySelector('script[src*="paystack"]')) {
            setLoaded(true);
            return;
        }
        const script = document.createElement("script");
        script.src = "https://js.paystack.co/v2/inline.js";
        script.async = true;
        script.onload = () => setLoaded(true);
        document.body.appendChild(script);
    }, []);

    const pay = (config: {
        email: string;
        amount: number;
        currency?: string;
        onSuccess: (reference: string) => void;
        onCancel: () => void;
    }) => {
        if (!loaded || typeof window === "undefined" || !window.PaystackPop)
            return;
        const paystack = new window.PaystackPop();
        paystack.newTransaction({
            key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
            email: config.email,
            amount: Math.round(config.amount * 100),
            currency: config.currency || process.env.PAYSTACK_CURRENCY || "NGN",
            ref: `UL-${Date.now()}`,
            onSuccess: (transaction) => config.onSuccess(transaction.reference),
            onCancel: config.onCancel,
        });
    };

    return { pay, loaded };
}

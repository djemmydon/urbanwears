import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { reference } = await request.json();

    if (!reference) {
        return NextResponse.json(
            { error: "Reference is required" },
            { status: 400 },
        );
    }

    const res = await fetch(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
        },
    );

    const data = await res.json();

    if (!data.status || data.data?.status !== "success") {
        return NextResponse.json(
            { error: data.message || "Payment not successful" },
            { status: 400 },
        );
    }

    return NextResponse.json({
        status: data.data.status,
        amount: data.data.amount / 100,
        currency: data.data.currency,
        reference: data.data.reference,
        email: data.data.customer?.email,
    });
}

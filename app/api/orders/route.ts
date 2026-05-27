import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function GET(request: Request) {
    const supabase = createServerSupabase();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    let query = supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });

    if (email) query = query.eq("email", email);

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
}

export async function POST(request: Request) {
    const supabase = createServerSupabase();
    const body = await request.json();
    const {
        items,
        total,
        email,
        fullName,
        phone,
        address,
        paymentReference,
        currency,
    } = body;

    const orderId = `ORD-${Date.now()}`;

    const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
            id: orderId,
            email,
            full_name: fullName,
            phone,
            address,
            total,
            status: "paid",
            payment_method: "paystack",
            payment_reference: paymentReference,
            currency: currency || "NGN",
        })
        .select()
        .single();

    if (orderError) {
        return NextResponse.json(
            { error: orderError.message },
            { status: 500 },
        );
    }

    const orderItems = items.map((item: any) => ({
        order_id: orderId,
        product_id: item.id,
        name: item.name,
        size: item.selectedSize,
        color: item.selectedColor,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
    }));

    const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

    if (itemsError) {
        return NextResponse.json(
            { error: itemsError.message },
            { status: 500 },
        );
    }

    // Deduct stock for each item
    for (const item of items) {
        const { data: product } = await supabase
            .from("products")
            .select("sizes")
            .eq("id", item.id)
            .single();

        if (product?.sizes) {
            const updatedSizes = product.sizes.map((s: any) => {
                if (s.size === item.selectedSize) {
                    const newCount = Math.max(
                        0,
                        (s.stockCount || 0) - item.quantity,
                    );
                    return { ...s, stockCount: newCount, inStock: newCount > 0 };
                }
                return s;
            });
            await supabase
                .from("products")
                .update({ sizes: updatedSizes })
                .eq("id", item.id);
        }
    }

    return NextResponse.json(order);
}

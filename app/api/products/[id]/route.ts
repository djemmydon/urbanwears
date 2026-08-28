import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const supabase = createServerSupabase();
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
        ...data,
        originalPrice: data.original_price,
        reviewCount: data.review_count,
    });
}

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const supabase = createServerSupabase();

    // Keep historical orders intact when a product is removed. The order item
    // stores a snapshot of the product, so its foreign-key reference can be
    // cleared without deleting the order or its line item.
    const { error: referencesError } = await supabase
        .from("order_items")
        .update({ product_id: null })
        .eq("product_id", id);

    if (referencesError) {
        return NextResponse.json(
            { error: referencesError.message },
            { status: 500 },
        );
    }

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const supabase = createServerSupabase();
    const body = await request.json();

    const { data, error } = await supabase
        .from("products")
        .update(body)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

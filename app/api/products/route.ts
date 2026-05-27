import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function POST(request: Request) {
    const supabase = createServerSupabase();
    const body = await request.json();

    const id = body.id || `p-${Date.now()}`;
    const { data, error } = await supabase
        .from("products")
        .insert({ ...body, id })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
        ...data,
        originalPrice: data.original_price,
        reviewCount: data.review_count,
    });
}

export async function GET(request: Request) {
    const supabase = createServerSupabase();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const trending = searchParams.get("trending");
    const onSale = searchParams.get("onSale");

    let query = supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

    if (type) query = query.eq("type", type);
    if (category) query = query.eq("category", category);
    if (trending === "true") query = query.eq("trending", true);
    if (onSale === "true") query = query.not("original_price", "is", null);

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const normalized = (data || []).map(normalizeProduct);
    return NextResponse.json(normalized);
}

function normalizeProduct(p: any) {
    return {
        ...p,
        originalPrice: p.original_price,
        reviewCount: p.review_count,
    };
}

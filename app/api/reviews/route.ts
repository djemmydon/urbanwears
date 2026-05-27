import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function GET(request: Request) {
    const supabase = createServerSupabase();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
        return NextResponse.json(
            { error: "productId is required" },
            { status: 400 },
        );
    }

    const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
}

export async function POST(request: Request) {
    const supabase = createServerSupabase();

    const body = await request.json();
    const { productId, userName, rating, text } = body;

    if (!productId || !userName || !rating || !text) {
        return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 },
        );
    }

    const { data, error } = await supabase
        .from("reviews")
        .insert({ product_id: productId, user_name: userName, rating, text })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Recalculate product rating + review count
    const { data: allReviews } = await supabase
        .from("reviews")
        .select("rating")
        .eq("product_id", productId);

    if (allReviews && allReviews.length > 0) {
        const avg =
            allReviews.reduce((s: number, r: any) => s + r.rating, 0) /
            allReviews.length;
        await supabase
            .from("products")
            .update({
                rating: Math.round(avg * 10) / 10,
                review_count: allReviews.length,
            })
            .eq("id", productId);
    }

    return NextResponse.json(data);
}

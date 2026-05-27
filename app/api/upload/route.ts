import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function POST(request: Request) {
    const supabase = createServerSupabase();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
        return NextResponse.json(
            { error: "Only JPEG, PNG, WebP and GIF are allowed" },
            { status: 400 },
        );
    }

    if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
            { error: "File size must be under 5 MB" },
            { status: 400 },
        );
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error } = await supabase.storage
        .from("productimages")
        .upload(filename, buffer, {
            contentType: file.type,
            upsert: false,
        });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const {
        data: { publicUrl },
    } = supabase.storage.from("productimages").getPublicUrl(filename);

    return NextResponse.json({ url: publicUrl });
}

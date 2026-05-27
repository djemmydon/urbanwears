import { Product, Review, Order, CartItem } from "./types";

const base =
    typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// ── Products ────────────────────────────────────────────────

export async function fetchProducts(params?: {
    type?: string;
    category?: string;
    trending?: boolean;
    onSale?: boolean;
}): Promise<Product[]> {
    const url = new URL("/api/products", base);
    if (params?.type) url.searchParams.set("type", params.type);
    if (params?.category) url.searchParams.set("category", params.category);
    if (params?.trending) url.searchParams.set("trending", "true");
    if (params?.onSale) url.searchParams.set("onSale", "true");
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
}

export async function fetchProduct(id: string): Promise<Product> {
    const res = await fetch(`${base}/api/products/${id}`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Product not found");
    return res.json();
}

// ── Reviews ─────────────────────────────────────────────────

export async function fetchReviews(productId: string): Promise<Review[]> {
    const res = await fetch(
        `${base}/api/reviews?productId=${productId}`,
        { cache: "no-store" },
    );
    if (!res.ok) throw new Error("Failed to fetch reviews");
    return res.json();
}

export async function submitReview(data: {
    productId: string;
    userName: string;
    rating: number;
    text: string;
}): Promise<Review> {
    const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to submit review");
    return res.json();
}

// ── Orders ───────────────────────────────────────────────────

export async function fetchOrders(email?: string): Promise<Order[]> {
    const url = email
        ? `/api/orders?email=${encodeURIComponent(email)}`
        : "/api/orders";
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch orders");
    return res.json();
}

export async function createOrder(data: {
    items: CartItem[];
    total: number;
    email: string;
    fullName: string;
    phone: string;
    address: string;
    paymentReference: string;
    currency: string;
}): Promise<Order> {
    const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create order");
    return res.json();
}

export async function updateOrderStatus(
    orderId: string,
    status: Order["status"],
): Promise<Order> {
    const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update order");
    return res.json();
}

// ── Payment ──────────────────────────────────────────────────

export async function verifyPayment(
    reference: string,
): Promise<{ status: string; amount: number; currency: string }> {
    const res = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
    });
    if (!res.ok) throw new Error("Payment verification failed");
    return res.json();
}

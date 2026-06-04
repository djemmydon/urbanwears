export interface Product {
    id: string;
    name: string;
    type:
        | "polo"
        | "tshirt"
        | "hoodie"
        | "Tan top"
        | "socks"
        | "joggers"
        | "2 piece set"
        | "beanie Hat";
    price: number;
    originalPrice?: number;
    original_price?: number;
    rating: number;
    reviewCount: number;
    review_count?: number;
    sizes: {
        size: "M" | "L" | "XL" | "XXL";
        inStock: boolean;
        stockCount?: number;
    }[];
    colors: { name: string; hex: string }[];
    description: string;
    image: string;
    images?: string[];
    category: string;
    trending?: boolean;
}

export interface Review {
    id: string;
    productId?: string;
    product_id?: string;
    userName?: string;
    user_name?: string;
    rating: number;
    text: string;
    date?: string;
    created_at?: string;
}

export interface CartItem extends Product {
    selectedSize: string;
    selectedColor: string;
    quantity: number;
}

export interface Order {
    id: string;
    email?: string;
    fullName?: string;
    full_name?: string;
    phone?: string;
    address?: string;
    items: CartItem[];
    order_items?: OrderItemDB[];
    total: number;
    status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
    orderDate?: string;
    created_at?: string;
    paymentMethod?: string;
    payment_method?: string;
    paymentReference?: string;
    payment_reference?: string;
    currency?: string;
}

export interface OrderItemDB {
    id: string;
    order_id: string;
    product_id: string;
    name: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
    image?: string;
}

// lib/reviews.ts
import { Review } from "./types";

export const mockReviews: Review[] = [
    {
        id: "r1",
        productId: "1",
        userName: "Alex Chen",
        rating: 5,
        text: "The quality is insane. Best polo I've ever owned. Fits perfectly.",
        date: "2025-05-12",
    },
    {
        id: "r2",
        productId: "1",
        userName: "Sarah Kim",
        rating: 4,
        text: "Very comfortable fabric. Only wish it had one more color option.",
        date: "2025-05-10",
    },
    {
        id: "r3",
        productId: "2",
        userName: "Marcus Okoro",
        rating: 5,
        text: "This orange hoodie is fire! Soft inside, looks premium.",
        date: "2025-05-08",
    },
    // Add more as needed...
];

export const getReviewsByProductId = (productId: string) =>
    mockReviews.filter((r) => r.productId === productId);

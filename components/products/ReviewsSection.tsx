"use client";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { fetchReviews } from "@/lib/api";
import { Review } from "@/lib/types";

export default function ReviewsSection({
    productId,
    refreshTrigger,
}: {
    productId: string;
    refreshTrigger: number;
}) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 3;

    useEffect(() => {
        setLoading(true);
        fetchReviews(productId)
            .then(setReviews)
            .catch(() => setReviews([]))
            .finally(() => {
                setLoading(false);
                setCurrentPage(1);
            });
    }, [productId, refreshTrigger]);

    const totalPages = Math.ceil(reviews.length / reviewsPerPage);
    const paginated = reviews.slice(
        (currentPage - 1) * reviewsPerPage,
        currentPage * reviewsPerPage,
    );

    const avgRating = reviews.length
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : "0.0";

    return (
        <div className="mt-10">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold">Customer Reviews</h3>
                {reviews.length > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold">{avgRating}</span>
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${Number(avgRating) >= i ? "fill-(--accent-hex) text-(--accent-hex)" : "text-gray-300"}`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-gray-500">
                            ({reviews.length})
                        </span>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="space-y-6">
                    {[1, 2].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded-xl w-1/3 mb-2" />
                            <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded-xl w-full" />
                        </div>
                    ))}
                </div>
            ) : reviews.length === 0 ? (
                <p className="text-gray-500 py-4">
                    No reviews yet. Be the first to review!
                </p>
            ) : (
                <>
                    <div className="space-y-6">
                        {paginated.map((review) => {
                            const date =
                                review.created_at || review.date || "";
                            const name =
                                review.user_name || review.userName || "Anonymous";
                            return (
                                <div
                                    key={review.id}
                                    className="border-b border-gray-100 dark:border-zinc-800 pb-6"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center font-semibold text-sm">
                                                {name[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">
                                                    {name}
                                                </p>
                                                <div className="flex mt-0.5">
                                                    {[1, 2, 3, 4, 5].map(
                                                        (i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-3.5 h-3.5 ${review.rating >= i ? "fill-(--accent-hex) text-(--accent-hex)" : "text-gray-300"}`}
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {date
                                                ? new Date(
                                                      date,
                                                  ).toLocaleDateString(
                                                      "en-US",
                                                      {
                                                          month: "short",
                                                          day: "numeric",
                                                          year: "numeric",
                                                      },
                                                  )
                                                : ""}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm ml-12">
                                        {review.text}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                            {Array.from(
                                { length: totalPages },
                                (_, i) => i + 1,
                            ).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-9 h-9 rounded-xl text-sm transition-all ${currentPage === page ? "bg-black dark:bg-white text-white dark:text-black" : "hover:bg-gray-100 dark:hover:bg-zinc-800"}`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

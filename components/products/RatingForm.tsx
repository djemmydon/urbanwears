"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { submitReview } from "@/lib/api";

export default function RatingForm({
    productId,
    onReviewSubmitted,
}: {
    productId: string;
    onReviewSubmitted: () => void;
}) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [name, setName] = useState("");
    const [text, setText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Please enter your name");
            return;
        }
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }
        if (text.trim().length < 10) {
            toast.error("Review must be at least 10 characters");
            return;
        }

        setIsSubmitting(true);
        try {
            await submitReview({ productId, userName: name, rating, text });
            toast.success("Review submitted! Thank you.");
            setRating(0);
            setName("");
            setText("");
            onReviewSubmitted();
        } catch {
            toast.error("Failed to submit review. Try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-8 border-t border-gray-100 dark:border-zinc-800 pt-8"
        >
            <h3 className="text-xl font-semibold mb-6">Write a Review</h3>

            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Your Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Alex Chen"
                        className="w-full p-4 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-transparent focus:border-(--accent-hex) focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Your Rating
                    </label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                type="button"
                                key={star}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                                className="transition-transform hover:scale-110"
                            >
                                <Star
                                    className={`w-8 h-8 ${star <= (hover || rating) ? "fill-(--accent-hex) text-(--accent-hex)" : "text-gray-300 dark:text-zinc-600"}`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Your Review
                    </label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="What did you think? (min. 10 characters)"
                        rows={4}
                        className="w-full p-4 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-transparent focus:border-(--accent-hex) focus:outline-none resize-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-(--accent-hex) text-black font-bold rounded-2xl hover:brightness-110 transition-all disabled:opacity-60 active:scale-[0.98]"
                >
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
            </div>
        </form>
    );
}

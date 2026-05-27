"use client";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageCarousel({
    images,
    alt,
}: {
    images: string[];
    alt: string;
}) {
    const [current, setCurrent] = useState(0);

    if (!images.length) return null;

    const prev = () =>
        setCurrent((i) => (i - 1 + images.length) % images.length);
    const next = () => setCurrent((i) => (i + 1) % images.length);

    return (
        <div className="space-y-4 sticky top-8">
            {/* Main image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 dark:bg-zinc-800 group">
                <Image
                    src={images[current]}
                    alt={`${alt} – image ${current + 1}`}
                    fill
                    className="object-cover transition-opacity duration-300"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={current === 0}
                />

                {/* Counter badge */}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium">
                    {current + 1} / {images.length}
                </div>

                {/* Nav arrows – only if multiple images */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            aria-label="Previous image"
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-zinc-900/90 rounded-2xl flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-zinc-800 transition-all opacity-0 group-hover:opacity-100"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={next}
                            aria-label="Next image"
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-zinc-900/90 rounded-2xl flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-zinc-800 transition-all opacity-0 group-hover:opacity-100"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
                <div className="flex gap-3">
                    {images.map((src, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            aria-label={`View image ${i + 1}`}
                            className={`relative flex-1 aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                                i === current
                                    ? "border-orange-500 opacity-100"
                                    : "border-transparent opacity-50 hover:opacity-80"
                            }`}
                        >
                            <Image
                                src={src}
                                alt={`${alt} thumbnail ${i + 1}`}
                                fill
                                className="object-cover"
                                sizes="80px"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Dot indicators for mobile */}
            {images.length > 1 && (
                <div className="flex justify-center gap-1.5 sm:hidden">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`rounded-full transition-all ${
                                i === current
                                    ? "w-5 h-2 bg-orange-500"
                                    : "w-2 h-2 bg-gray-300 dark:bg-zinc-600"
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

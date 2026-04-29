import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { FadeIn } from './FadeIn';

interface GalleryImage {
    url: string;
    sort_order: number;
}

interface MasonryGalleryProps {
    images: GalleryImage[];
    layout?: 'masonry' | 'grid' | 'carousel';
    imageClassName?: string;
    containerClassName?: string;
}

export function MasonryGallery({ images, layout = 'masonry', imageClassName = '', containerClassName = '' }: MasonryGalleryProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    if (!images || images.length === 0) return null;

    // Ensure images are sorted by sort_order
    const sortedImages = [...images].sort((a, b) => a.sort_order - b.sort_order);

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        document.body.style.overflow = 'hidden'; // prevent background scrolling
    };

    const closeLightbox = () => {
        setLightboxIndex(null);
        document.body.style.overflow = '';
    };

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (lightboxIndex !== null && lightboxIndex < sortedImages.length - 1) {
            setLightboxIndex(lightboxIndex + 1);
        }
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (lightboxIndex !== null && lightboxIndex > 0) {
            setLightboxIndex(lightboxIndex - 1);
        }
    };

    return (
        <>
            {layout === 'masonry' && (
                <div className={`grid grid-cols-2 gap-3 auto-rows-[120px] md:auto-rows-[160px] ${containerClassName}`}>
                    {sortedImages.map((img, index) => {
                        // Interlocking pattern: 1 large (span 2 cols, 2 rows), 2 small (1 col, 1 row)
                        const isLarge = index % 3 === 0;
                        return (
                            <div
                                key={index}
                                onClick={() => openLightbox(index)}
                                className={`cursor-pointer overflow-hidden relative group ${isLarge ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'
                                    }`}
                            >
                                <img
                                    src={img.url}
                                    alt={`Gallery ${index}`}
                                    loading="lazy"
                                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${imageClassName}`}
                                    referrerPolicy="no-referrer"
                                />
                                <div className={`absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors ${imageClassName}`}></div>
                            </div>
                        );
                    })}
                </div>
            )}

            {layout === 'grid' && (
                <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 ${containerClassName}`}>
                    {sortedImages.map((img, index) => (
                        <div
                            key={index}
                            onClick={() => openLightbox(index)}
                            className="cursor-pointer overflow-hidden relative group aspect-square"
                        >
                            <img
                                src={img.url}
                                alt={`Gallery ${index}`}
                                loading="lazy"
                                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${imageClassName}`}
                                referrerPolicy="no-referrer"
                            />
                            <div className={`absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors ${imageClassName}`}></div>
                        </div>
                    ))}
                </div>
            )}

            {layout === 'carousel' && (
                <div className={`flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 pb-4 ${containerClassName}`}>
                    {sortedImages.map((img, index) => (
                        <div
                            key={index}
                            onClick={() => openLightbox(index)}
                            className="shrink-0 w-[85%] sm:w-[70%] aspect-[4/5] cursor-pointer overflow-hidden relative group snap-center"
                        >
                            <img
                                src={img.url}
                                alt={`Gallery ${index}`}
                                loading="lazy"
                                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${imageClassName}`}
                                referrerPolicy="no-referrer"
                            />
                            <div className={`absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors ${imageClassName}`}></div>
                        </div>
                    ))}
                </div>
            )}

            {/* Lightbox */}
            {lightboxIndex !== null && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center touch-none"
                    onClick={closeLightbox}
                >
                    {/* Close Button */}
                    <button
                        className="absolute top-6 right-6 text-white/70 hover:text-white p-2 z-10"
                        onClick={closeLightbox}
                    >
                        <X className="w-8 h-8" />
                    </button>

                    {/* Prev Button */}
                    {lightboxIndex > 0 && (
                        <button
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 z-10"
                            onClick={prevImage}
                        >
                            <ChevronLeft className="w-10 h-10" />
                        </button>
                    )}

                    {/* Next Button */}
                    {lightboxIndex < sortedImages.length - 1 && (
                        <button
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 z-10"
                            onClick={nextImage}
                        >
                            <ChevronRight className="w-10 h-10" />
                        </button>
                    )}

                    {/* Main Image Container */}
                    <div
                        className="w-full h-full max-w-4xl max-h-[85vh] p-4 flex flex-col items-center justify-center transition-transform duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={sortedImages[lightboxIndex].url}
                            alt={`Gallery view ${lightboxIndex}`}
                            className="max-w-full max-h-full object-contain pointer-events-none"
                        />
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 font-sans text-sm tracking-widest">
                            {lightboxIndex + 1} / {sortedImages.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

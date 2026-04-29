import React from 'react';
import type { Block } from '../../types';
import { FadeIn } from '../FadeIn';
import { MasonryGallery } from '../MasonryGallery';
import { CircularGallery } from '../ui/circular-gallery';
import { ElegantCarousel } from '../ui/elegant-carousel';
import { Image as ImageIcon } from 'lucide-react';

export function GalleryBlock({ block }: { block: Block }) {
    const cfg = block.config;
    const images = cfg.images || [];

    if (images.length === 0) return null;

    // Default masonry if not specified
    const layout = cfg.layout || 'masonry';

    return (
        <section className="py-20 px-6 max-w-md mx-auto">
            <FadeIn direction="up">
                <div className="text-center mb-10">
                    <ImageIcon className="w-8 h-8 mx-auto text-lathe-ink/60 mb-4" />
                    <h2 className="text-3xl font-bold italic font-serif mb-3">Momen Bahagia</h2>
                </div>

                {layout === 'circular' ? (
                    <div className="h-[400px] w-full relative">
                        <CircularGallery
                            items={images.map((img: any, i: number) => ({
                                common: `Momen ${i + 1}`,
                                binomial: 'Foto Prewedding',
                                photo: {
                                    url: img.url,
                                    text: `Momen ${i + 1}`,
                                    by: 'Pasangan'
                                }
                            }))}
                            radius={160}
                        />
                    </div>
                ) : layout === 'carousel' ? (
                    <ElegantCarousel
                        slides={images.map((img: any, i: number) => ({
                            title: `Momen ${i + 1}`,
                            subtitle: cfg.title || "Prewedding Album",
                            description: cfg.description || "Sebuah perjalanan cinta yang terekam dalam bingkai waktu.",
                            imageUrl: img.url,
                            accent: "var(--color-lathe-yellow)",
                        }))}
                        autoPlayDuration={4000}
                    />
                ) : (
                    <MasonryGallery images={images} layout={layout} imageClassName="rounded-xl" />
                )}
            </FadeIn>
        </section>
    );
}

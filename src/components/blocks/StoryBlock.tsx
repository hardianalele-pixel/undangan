import React from 'react';
import type { Block, StoryItem } from '../../types';
import { FadeIn } from '../FadeIn';
import { BookOpen } from 'lucide-react';

export function StoryBlock({ block }: { block: Block }) {
    const cfg = block.config;
    const items: StoryItem[] = cfg.items || [];

    if (items.length === 0) return null;

    return (
        <section className="py-20 px-6 max-w-lg mx-auto">
            <FadeIn direction="up">
                <div className="text-center mb-12">
                    <BookOpen className="w-8 h-8 mx-auto text-lathe-ink/60 mb-4" />
                    <h2 className="text-3xl font-bold italic font-serif">Love Story</h2>
                </div>

                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-lathe-ink/15" />

                    <div className="space-y-10">
                        {items.map((item, i) => (
                            <div key={i} className="relative pl-12">
                                {/* Timeline dot */}
                                <div className="absolute left-[11px] top-1 w-[10px] h-[10px] rounded-full bg-lathe-ink/40 border-2 border-lathe-surface" />

                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold italic font-serif">{item.title}</h3>
                                    {item.date && (
                                        <p className="text-xs font-sans text-lathe-ink/50 uppercase tracking-wider">{item.date}</p>
                                    )}
                                    {item.image && (
                                        <div className="rounded-xl overflow-hidden my-3 border border-lathe-ink/10">
                                            <img src={item.image} alt={item.title} className="w-full object-cover max-h-48" referrerPolicy="no-referrer" />
                                        </div>
                                    )}
                                    <p className="font-sans text-sm text-lathe-ink/70 leading-relaxed">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </FadeIn>
        </section>
    );
}

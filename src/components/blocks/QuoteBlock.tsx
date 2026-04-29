import React from 'react';
import type { Block } from '../../types';
import { useInvitation } from '../../contexts/InvitationContext';
import { FadeIn } from '../FadeIn';
import { Sparkles } from 'lucide-react';

export function QuoteBlock({ block }: { block: Block }) {
    const { invite } = useInvitation();
    const layout = invite.theme_config?.layout || 'classic';
    const cfg = block.config;

    if (layout === 'modern') return <QuoteModern cfg={cfg} />;
    if (layout === 'ornate') return <QuoteOrnate cfg={cfg} />;
    return <QuoteClassic cfg={cfg} />;
}

/** Classic: centered italic quote with subtle background */
function QuoteClassic({ cfg }: { cfg: any }) {
    return (
        <section className="py-16 px-6 border-t border-b overflow-hidden relative" style={{ borderColor: 'var(--color-lathe-ink)', backgroundColor: 'var(--color-lathe-surface)' }}>
            <FadeIn direction="up" className="max-w-md mx-auto text-center space-y-4">
                <Sparkles className="w-6 h-6 mx-auto" style={{ color: 'var(--color-lathe-ink)', opacity: 0.3 }} />
                <blockquote className="text-lg md:text-xl italic leading-relaxed font-serif" style={{ color: 'var(--color-lathe-ink)', opacity: 0.8 }}>
                    {cfg.text || '"Cinta itu indah."'}
                </blockquote>
                {cfg.source && (
                    <cite className="block text-sm font-sans not-italic" style={{ color: 'var(--color-lathe-ink)', opacity: 0.4 }}>
                        -- {cfg.source}
                    </cite>
                )}
            </FadeIn>
        </section>
    );
}

/** Modern: left-aligned with bold accent bar */
function QuoteModern({ cfg }: { cfg: any }) {
    return (
        <section className="py-16 px-6" style={{ backgroundColor: 'var(--color-lathe-surface)' }}>
            <FadeIn direction="up" className="max-w-md mx-auto">
                <div className="border-l-4 rounded-r-xl pl-6 py-4 relative overflow-hidden" style={{ borderColor: 'var(--color-lathe-yellow)' }}>
                    <div className="absolute inset-0 z-0" style={{ backgroundColor: 'var(--color-lathe-ink)', opacity: 0.05 }} />
                    <div className="relative z-10">
                        <blockquote className="text-base leading-relaxed font-sans" style={{ color: 'var(--color-lathe-ink)', opacity: 0.8 }}>
                            {cfg.text || '"Cinta itu indah."'}
                        </blockquote>
                        {cfg.source && (
                            <cite className="block text-xs font-sans font-bold not-italic mt-3 uppercase tracking-wider" style={{ color: 'var(--color-lathe-yellow)' }}>
                                {cfg.source}
                            </cite>
                        )}
                    </div>
                </div>
            </FadeIn>
        </section>
    );
}

/** Ornate: centered with decorative ornamental lines above and below */
function QuoteOrnate({ cfg }: { cfg: any }) {
    return (
        <section className="py-16 px-6" style={{ backgroundColor: 'var(--color-lathe-surface)' }}>
            <FadeIn direction="up" className="max-w-md mx-auto text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                    <div className="h-px w-8 opacity-20" style={{ backgroundColor: 'var(--color-lathe-yellow)' }} />
                    <div className="w-1.5 h-1.5 rounded-full opacity-30" style={{ backgroundColor: 'var(--color-lathe-yellow)' }} />
                    <div className="h-px w-8 opacity-20" style={{ backgroundColor: 'var(--color-lathe-yellow)' }} />
                </div>
                <blockquote className="text-lg md:text-xl italic leading-relaxed font-serif px-4" style={{ color: 'var(--color-lathe-ink)', opacity: 0.8 }}>
                    {cfg.text || '"Cinta itu indah."'}
                </blockquote>
                {cfg.source && (
                    <cite className="block text-xs font-sans not-italic" style={{ color: 'var(--color-lathe-ink)', opacity: 0.4 }}>
                        -- {cfg.source}
                    </cite>
                )}
                <div className="flex items-center justify-center gap-3">
                    <div className="h-px w-8 opacity-20" style={{ backgroundColor: 'var(--color-lathe-yellow)' }} />
                    <div className="w-1.5 h-1.5 rounded-full opacity-30" style={{ backgroundColor: 'var(--color-lathe-yellow)' }} />
                    <div className="h-px w-8 opacity-20" style={{ backgroundColor: 'var(--color-lathe-yellow)' }} />
                </div>
            </FadeIn>
        </section>
    );
}

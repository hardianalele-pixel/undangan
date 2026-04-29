/**
 * Closing Block -- the final thank-you section.
 * Shows couple signature, closing prayer, and gratitude message.
 */
import React from 'react';
import type { Block } from '../../types';
import { useInvitation } from '../../contexts/InvitationContext';
import { OrnamentalDivider, FloralCorner } from '../decorative/Ornaments';
import { FadeIn } from '../FadeIn';

export function ClosingBlock({ block }: { block: Block }) {
    const { invite } = useInvitation();
    const { meta, theme_config } = invite;
    const cfg = block.config;
    const layout = theme_config?.layout || 'classic';

    if (layout === 'modern') return <ClosingModern meta={meta} cfg={cfg} />;
    if (layout === 'ornate') return <ClosingOrnate meta={meta} cfg={cfg} />;
    return <ClosingClassic meta={meta} cfg={cfg} />;
}

function ClosingClassic({ meta, cfg }: any) {
    return (
        <section className="py-20 px-6 text-center max-w-lg mx-auto">
            <FadeIn direction="up" className="space-y-6">
                <OrnamentalDivider variant="simple" color="var(--color-lathe-ink)" className="w-16 mx-auto" opacity={0.2} />

                <p className="text-sm font-serif italic leading-relaxed" style={{ color: 'var(--color-lathe-ink)', opacity: 0.7 }}>
                    {cfg.message || 'Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.'}
                </p>

                <div className="pt-4">
                    <p className="text-xs tracking-[0.2em] uppercase font-sans mb-3" style={{ color: 'var(--color-lathe-ink)', opacity: 0.4 }}>
                        Dengan Hormat
                    </p>
                    <p className="text-2xl font-bold italic font-serif" style={{ color: 'var(--color-lathe-ink)' }}>
                        {meta.groomName || 'Nama Pria'} & {meta.brideName || 'Nama Wanita'}
                    </p>
                </div>

                {cfg.prayer && (
                    <div className="pt-6 border-t" style={{ borderColor: 'var(--color-lathe-ink)', opacity: 0.1 }}>
                        <p className="text-xs italic font-serif" style={{ color: 'var(--color-lathe-ink)', opacity: 0.5 }}>
                            {cfg.prayer}
                        </p>
                    </div>
                )}

                <OrnamentalDivider variant="simple" color="var(--color-lathe-ink)" className="w-16 mx-auto" opacity={0.2} />
            </FadeIn>
        </section>
    );
}

function ClosingModern({ meta, cfg }: any) {
    return (
        <section className="py-16 px-6 max-w-md mx-auto">
            <FadeIn direction="up" className="space-y-6 text-left">
                <div className="h-1 w-10 rounded-full" style={{ backgroundColor: 'var(--color-lathe-yellow)' }} />

                <p className="text-sm font-sans leading-relaxed" style={{ color: 'var(--color-lathe-ink)', opacity: 0.6 }}>
                    {cfg.message || 'Atas kehadiran dan doa restu Anda, kami mengucapkan terima kasih.'}
                </p>

                <div className="pt-2">
                    <p className="text-xs font-bold tracking-[0.2em] uppercase font-sans mb-2" style={{ color: 'var(--color-lathe-ink)', opacity: 0.3 }}>
                        With Love
                    </p>
                    <p className="text-3xl font-black font-sans tracking-tight" style={{ color: 'var(--color-lathe-ink)' }}>
                        {meta.groomName} & {meta.brideName}
                    </p>
                </div>
            </FadeIn>
        </section>
    );
}

function ClosingOrnate({ meta, cfg }: any) {
    return (
        <section className="py-20 px-6 text-center max-w-lg mx-auto relative">
            <FloralCorner color="var(--color-lathe-yellow)" className="absolute top-0 left-0 w-16 h-16" opacity={0.15} />
            <FloralCorner color="var(--color-lathe-yellow)" className="absolute top-0 right-0 w-16 h-16 scale-x-[-1]" opacity={0.15} />

            <FadeIn direction="up" className="space-y-6">
                <OrnamentalDivider variant="floral" color="var(--color-lathe-yellow)" className="w-32 mx-auto" opacity={0.3} />

                <p className="text-sm font-serif italic leading-relaxed" style={{ color: 'var(--color-lathe-ink)', opacity: 0.7 }}>
                    {cfg.message || 'Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.'}
                </p>

                <div className="pt-4">
                    <p className="text-[10px] tracking-[0.3em] uppercase font-sans mb-3" style={{ color: 'var(--color-lathe-ink)', opacity: 0.3 }}>
                        Kami yang berbahagia
                    </p>
                    <p className="text-2xl font-bold italic font-serif" style={{ color: 'var(--color-lathe-ink)' }}>
                        {meta.groomName} & {meta.brideName}
                    </p>
                </div>

                {cfg.prayer && (
                    <p className="text-xs italic font-serif pt-4" style={{ color: 'var(--color-lathe-ink)', opacity: 0.4 }}>
                        {cfg.prayer}
                    </p>
                )}

                <OrnamentalDivider variant="floral" color="var(--color-lathe-yellow)" className="w-32 mx-auto" opacity={0.3} />
            </FadeIn>
        </section>
    );
}

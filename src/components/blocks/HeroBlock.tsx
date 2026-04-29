import React from 'react';
import type { Block } from '../../types';
import { useInvitation } from '../../contexts/InvitationContext';
import { FadeIn } from '../FadeIn';
import { GradientHeading } from '../ui/gradient-heading';
import { LayeredText } from '../ui/layered-text';

export function HeroBlock({ block }: { block: Block }) {
    const { invite, guestName } = useInvitation();
    const { meta, theme_config } = invite;
    const cfg = block.config;
    const layout = theme_config?.layout || 'classic';

    if (layout === 'modern') return <HeroModern meta={meta} cfg={cfg} guestName={guestName} />;
    if (layout === 'ornate') return <HeroOrnate meta={meta} cfg={cfg} guestName={guestName} />;
    return <HeroClassic meta={meta} cfg={cfg} guestName={guestName} />;
}

/** Classic: full-bleed, centered serif, minimal */
function HeroClassic({ meta, cfg, guestName }: any) {
    return (
        <section
            className="relative min-h-[85vh] flex flex-col items-center justify-end text-center pb-20 overflow-hidden"
            style={{ backgroundColor: 'var(--color-lathe-surface)', color: 'var(--color-lathe-ink)' }}
        >
            {meta.heroImage && (
                <div className="absolute inset-0 z-0">
                    <img src={meta.heroImage} alt="Couple" loading="eager" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--color-lathe-surface), var(--color-lathe-surface, 0.4), transparent)' }} />
                </div>
            )}

            <FadeIn direction="up" className="relative z-10 w-full px-6 flex flex-col items-center gap-6">
                {cfg.showGuestName && guestName && (
                    <div className="mb-4">
                        <p className="text-xs tracking-[0.2em] uppercase font-sans font-medium opacity-80 mb-2">Kepada Yth:</p>
                        <p className="text-xl font-bold italic">{guestName}</p>
                    </div>
                )}
                <div className="space-y-2">
                    <p className="text-sm tracking-[0.2em] uppercase font-sans font-medium opacity-80">
                        {cfg.subtitle || 'Pernikahan'}
                    </p>
                    {cfg.textStyle === 'gradient' ? (
                        <div className="flex flex-col items-center">
                            <GradientHeading variant="default" size="xxl" weight="bold">
                                {meta.groomName || 'Nama Pria'}
                            </GradientHeading>
                            <span className="block text-2xl font-normal italic font-serif my-2">&</span>
                            <GradientHeading variant="default" size="xxl" weight="bold">
                                {meta.brideName || 'Nama Wanita'}
                            </GradientHeading>
                        </div>
                    ) : cfg.textStyle === 'layered' ? (
                        <div className="flex flex-col items-center">
                            <LayeredText
                                lines={[{ top: meta.groomName || 'Nama Pria', bottom: meta.brideName || 'Nama Wanita' }]}
                                fontSize="3.5rem"
                                fontSizeMd="3rem"
                                lineHeight={50}
                                lineHeightMd={45}
                                className="py-6"
                            />
                        </div>
                    ) : (
                        <h1 className="text-5xl md:text-6xl font-bold italic tracking-tight font-serif">
                            {meta.groomName || 'Nama Pria'} <br />&<br /> {meta.brideName || 'Nama Wanita'}
                        </h1>
                    )}
                </div>
                <div className="h-px w-16 mx-auto my-4 opacity-30" style={{ backgroundColor: 'var(--color-lathe-ink)' }} />
                <p className="text-lg font-medium font-sans tracking-wide">
                    {meta.eventDate ? new Date(meta.eventDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Segera Hadir'}
                </p>
            </FadeIn>
        </section>
    );
}

/** Modern: bold sans-serif heading, accent bar, compact layout */
function HeroModern({ meta, cfg, guestName }: any) {
    return (
        <section
            className="relative min-h-[80vh] flex flex-col overflow-hidden"
            style={{ backgroundColor: 'var(--color-lathe-surface)', color: 'var(--color-lathe-ink)' }}
        >
            {meta.heroImage && (
                <div className="absolute inset-0 z-0">
                    <img src={meta.heroImage} alt="Couple" loading="eager" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/40" />
                </div>
            )}

            <FadeIn direction="up" className="relative z-10 flex-1 flex flex-col justify-end p-8">
                {cfg.showGuestName && guestName && (
                    <div className="mb-6 inline-flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-widest opacity-70">
                        <div className="w-6 h-px" style={{ backgroundColor: 'var(--color-lathe-yellow)' }} />
                        Kepada {guestName}
                    </div>
                )}

                <div className="space-y-1 mb-6">
                    <p className="text-xs font-sans font-bold uppercase tracking-[0.3em] opacity-60">
                        {cfg.subtitle || 'The Wedding'}
                    </p>
                    {cfg.textStyle === 'gradient' ? (
                        <div className="flex flex-col">
                            <GradientHeading variant="default" size="xl" weight="bold">
                                {meta.groomName || 'Nama Pria'}
                            </GradientHeading>
                            <span className="block text-lg font-normal italic font-serif opacity-50 my-1">&</span>
                            <GradientHeading variant="default" size="xl" weight="bold">
                                {meta.brideName || 'Nama Wanita'}
                            </GradientHeading>
                        </div>
                    ) : cfg.textStyle === 'layered' ? (
                        <div className="flex flex-col">
                            <LayeredText
                                lines={[{ top: meta.groomName || 'Nama Pria', bottom: meta.brideName || 'Nama Wanita' }]}
                                fontSize="2.5rem"
                                fontSizeMd="2rem"
                                lineHeight={40}
                                lineHeightMd={32}
                            />
                        </div>
                    ) : (
                        <h1 className="text-4xl md:text-5xl font-bold font-sans tracking-tight leading-[1.1]">
                            {meta.groomName || 'Nama Pria'}
                            <span className="block text-lg font-normal italic font-serif opacity-50 my-1">&</span>
                            {meta.brideName || 'Nama Wanita'}
                        </h1>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <div className="h-1 w-12 rounded-full" style={{ backgroundColor: 'var(--color-lathe-yellow)' }} />
                    <p className="text-sm font-sans font-bold uppercase tracking-widest">
                        {meta.eventDate ? new Date(meta.eventDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Segera'}
                    </p>
                </div>
            </FadeIn>
        </section>
    );
}

/** Ornate: decorative borders, overlay card, centered with ornamental lines */
function HeroOrnate({ meta, cfg, guestName }: any) {
    return (
        <section
            className="relative min-h-[90vh] flex flex-col items-center justify-center text-center overflow-hidden"
            style={{ backgroundColor: 'var(--color-lathe-surface)', color: 'var(--color-lathe-ink)' }}
        >
            {meta.heroImage && (
                <div className="absolute inset-0 z-0">
                    <img src={meta.heroImage} alt="Couple" loading="eager" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, var(--color-lathe-surface) 30%, transparent 80%)' }} />
                    <div className="absolute inset-0 opacity-60" style={{ backgroundColor: 'var(--color-lathe-surface)' }} />
                </div>
            )}

            <FadeIn direction="up" className="relative z-10 w-full px-8 flex flex-col items-center gap-4">
                {/* Ornamental top */}
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-px w-10 opacity-30" style={{ backgroundColor: 'var(--color-lathe-yellow)' }} />
                    <div className="w-2 h-2 rounded-full opacity-40" style={{ backgroundColor: 'var(--color-lathe-yellow)' }} />
                    <div className="h-px w-10 opacity-30" style={{ backgroundColor: 'var(--color-lathe-yellow)' }} />
                </div>

                <p className="text-[10px] tracking-[0.3em] uppercase font-sans font-medium opacity-60">
                    {cfg.subtitle || 'Undangan Pernikahan'}
                </p>

                {cfg.showGuestName && guestName && (
                    <div className="mb-2 p-3 border rounded-lg opacity-80" style={{ borderColor: 'var(--color-lathe-yellow)' }}>
                        <p className="text-[10px] font-sans tracking-widest uppercase opacity-60">Kepada Yth:</p>
                        <p className="text-sm font-bold italic">{guestName}</p>
                    </div>
                )}

                {cfg.textStyle === 'layered' ? (
                    <LayeredText
                        lines={[
                            { top: meta.groomName || 'Nama Pria', bottom: meta.brideName || 'Nama Wanita' },
                            { top: meta.brideName || 'Nama Wanita', bottom: meta.groomName || 'Nama Pria' }
                        ]}
                        fontSize="3.5rem"
                        fontSizeMd="2.5rem"
                        lineHeight={50}
                        lineHeightMd={40}
                        className="py-12"
                    />
                ) : (
                    <>
                        <h1 className="text-4xl md:text-5xl font-bold italic tracking-tight font-serif leading-tight">
                            {meta.groomName || 'Nama Pria'}
                        </h1>
                        <div className="flex items-center gap-3">
                            <div className="h-px w-8 opacity-20" style={{ backgroundColor: 'var(--color-lathe-ink)' }} />
                            <span className="text-2xl font-serif italic opacity-40">&</span>
                            <div className="h-px w-8 opacity-20" style={{ backgroundColor: 'var(--color-lathe-ink)' }} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold italic tracking-tight font-serif leading-tight">
                            {meta.brideName || 'Nama Wanita'}
                        </h1>
                    </>
                )}

                <div className="mt-4 p-3 px-6 border rounded-full text-xs font-sans font-medium tracking-widest uppercase" style={{ borderColor: 'var(--color-lathe-ink)', opacity: 0.4 }}>
                    {meta.eventDate ? new Date(meta.eventDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Segera Hadir'}
                </div>

                {/* Ornamental bottom */}
                <div className="flex items-center gap-3 mt-4">
                    <div className="h-px w-10 opacity-30" style={{ backgroundColor: 'var(--color-lathe-yellow)' }} />
                    <div className="w-2 h-2 rounded-full opacity-40" style={{ backgroundColor: 'var(--color-lathe-yellow)' }} />
                    <div className="h-px w-10 opacity-30" style={{ backgroundColor: 'var(--color-lathe-yellow)' }} />
                </div>
            </FadeIn>
        </section>
    );
}

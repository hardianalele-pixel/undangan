/**
 * Opening Gate Block -- the first thing guests see.
 * Fullscreen cover with couple names, guest name, background image,
 * and a "Buka Undangan" button that triggers music playback.
 *
 * Layout variants:
 * - classic: centered text, simple fade
 * - modern: split layout, bold typography
 * - ornate: decorative borders, ornamental elements
 */
import React from 'react';
import type { Block } from '../../types';
import { useInvitation } from '../../contexts/InvitationContext';
import { FloralCorner, OrnamentalDivider, BackgroundPattern } from '../decorative/Ornaments';
import { motion } from 'motion/react';
import { GradientHeading } from '../ui/gradient-heading';
import { LayeredText } from '../ui/layered-text';

export function OpeningBlock({ block }: { block: Block }) {
    const { invite } = useInvitation();
    const { meta, theme_config } = invite;
    const cfg = block.config;
    const layout = theme_config?.layout || 'classic';

    const guestName = cfg.guestName || 'Tamu Undangan';
    const heroImage = meta.heroImage || cfg.backgroundImage || '';

    if (layout === 'modern') return <OpeningModern meta={meta} cfg={cfg} heroImage={heroImage} guestName={guestName} />;
    if (layout === 'ornate') return <OpeningOrnate meta={meta} cfg={cfg} heroImage={heroImage} guestName={guestName} />;
    return <OpeningClassic meta={meta} cfg={cfg} heroImage={heroImage} guestName={guestName} />;
}

/** Classic: centered, elegant, minimal decorations */
function OpeningClassic({ meta, cfg, heroImage, guestName }: any) {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
            {/* Background */}
            {heroImage && (
                <div className="absolute inset-0">
                    <img src={heroImage} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-b from-lathe-surface/40 to-lathe-surface/90" />
                </div>
            )}

            <BackgroundPattern pattern={cfg.backgroundPattern || 'dots'} color="var(--color-lathe-ink)" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="relative z-10 space-y-6 px-6"
            >
                <p className="text-xs tracking-[0.3em] uppercase font-sans" style={{ color: 'var(--color-lathe-ink)', opacity: 0.5 }}>
                    {cfg.subtitle || 'The Wedding Of'}
                </p>

                <OrnamentalDivider variant="simple" color="var(--color-lathe-yellow)" className="w-24 mx-auto" />

                {cfg.textStyle === 'gradient' ? (
                    <div className="flex flex-col items-center">
                        <GradientHeading variant="default" size="xxl" weight="bold">
                            {meta.groomName || 'Nama Pria'}
                        </GradientHeading>
                        <span className="block text-2xl font-serif italic my-3" style={{ color: 'var(--color-lathe-yellow)', opacity: 0.6 }}>&</span>
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
                    <>
                        <h1 className="text-4xl md:text-6xl font-bold italic font-serif" style={{ color: 'var(--color-lathe-ink)' }}>
                            {meta.groomName || 'Nama Pria'}
                        </h1>
                        <p className="text-2xl font-serif italic" style={{ color: 'var(--color-lathe-yellow)', opacity: 0.6 }}>
                            &
                        </p>
                        <h1 className="text-4xl md:text-6xl font-bold italic font-serif" style={{ color: 'var(--color-lathe-ink)' }}>
                            {meta.brideName || 'Nama Wanita'}
                        </h1>
                    </>
                )}

                <OrnamentalDivider variant="simple" color="var(--color-lathe-yellow)" className="w-24 mx-auto" />

                {/* Guest name */}
                <div className="pt-6 space-y-2">
                    <p className="text-xs tracking-[0.2em] uppercase font-sans" style={{ color: 'var(--color-lathe-ink)', opacity: 0.4 }}>
                        Kepada Yth.
                    </p>
                    <p className="text-lg font-semibold font-serif" style={{ color: 'var(--color-lathe-ink)' }}>
                        {guestName}
                    </p>
                </div>

                {/* Open button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-8 px-8 py-3 rounded-full text-sm font-bold tracking-wide uppercase transition-colors"
                    style={{
                        backgroundColor: 'var(--color-lathe-ink)',
                        color: 'var(--color-lathe-surface)',
                    }}
                >
                    Buka Undangan
                </motion.button>
            </motion.div>
        </section>
    );
}

/** Modern: bold, asymmetric, accent bar */
function OpeningModern({ meta, cfg, heroImage, guestName }: any) {
    return (
        <section className="relative min-h-screen flex flex-col overflow-hidden">
            {/* Background */}
            {heroImage && (
                <div className="absolute inset-0">
                    <img src={heroImage} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-br from-lathe-surface/90 to-lathe-surface/40" />
                </div>
            )}

            <div className="relative z-10 flex flex-col justify-end min-h-screen p-8 md:p-16">
                {/* Accent bar */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '4rem' }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="h-1 rounded-full mb-6"
                    style={{ backgroundColor: 'var(--color-lathe-yellow)' }}
                />

                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="space-y-2"
                >
                    <p className="text-xs font-bold tracking-[0.3em] uppercase font-sans" style={{ color: 'var(--color-lathe-ink)', opacity: 0.4 }}>
                        {cfg.subtitle || 'Wedding Invitation'}
                    </p>
                    {cfg.textStyle === 'gradient' ? (
                        <div className="flex flex-col">
                            <GradientHeading variant="default" size="xl" weight="black">
                                {meta.groomName || 'Nama'}
                            </GradientHeading>
                            <div className="flex items-center gap-4 py-2">
                                <div className="w-8 h-px" style={{ backgroundColor: 'var(--color-lathe-yellow)' }} />
                                <span className="text-xl font-bold" style={{ color: 'var(--color-lathe-yellow)' }}>&</span>
                                <div className="w-8 h-px" style={{ backgroundColor: 'var(--color-lathe-yellow)' }} />
                            </div>
                            <GradientHeading variant="default" size="xl" weight="black">
                                {meta.brideName || 'Nama'}
                            </GradientHeading>
                        </div>
                    ) : cfg.textStyle === 'layered' ? (
                        <div className="flex flex-col">
                            <LayeredText
                                lines={[{ top: meta.groomName || 'Nama', bottom: meta.brideName || 'Nama' }]}
                                fontSize="3.5rem"
                                fontSizeMd="3rem"
                                lineHeight={50}
                                lineHeightMd={45}
                                className="py-6"
                            />
                        </div>
                    ) : (
                        <>
                            <h1 className="text-5xl md:text-7xl font-black font-sans tracking-tight" style={{ color: 'var(--color-lathe-ink)' }}>
                                {meta.groomName || 'Nama'}
                            </h1>
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-px" style={{ backgroundColor: 'var(--color-lathe-yellow)' }} />
                                <span className="text-xl font-bold" style={{ color: 'var(--color-lathe-yellow)' }}>&</span>
                                <div className="w-8 h-px" style={{ backgroundColor: 'var(--color-lathe-yellow)' }} />
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black font-sans tracking-tight" style={{ color: 'var(--color-lathe-ink)' }}>
                                {meta.brideName || 'Nama'}
                            </h1>
                        </>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    className="mt-8 flex items-center gap-6"
                >
                    <div className="space-y-1">
                        <p className="text-[10px] tracking-[0.2em] uppercase font-sans" style={{ color: 'var(--color-lathe-ink)', opacity: 0.3 }}>Dear</p>
                        <p className="text-sm font-bold" style={{ color: 'var(--color-lathe-ink)' }}>{guestName}</p>
                    </div>
                    <button
                        className="px-6 py-2.5 text-xs font-bold tracking-wide uppercase rounded-md transition-colors"
                        style={{
                            backgroundColor: 'var(--color-lathe-yellow)',
                            color: 'var(--color-lathe-surface)',
                        }}
                    >
                        Open Invitation
                    </button>
                </motion.div>
            </div>
        </section>
    );
}

/** Ornate: decorative borders, ornamental elements, centered with gold frame */
function OpeningOrnate({ meta, cfg, heroImage, guestName }: any) {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
            {/* Background */}
            {heroImage && (
                <div className="absolute inset-0">
                    <img src={heroImage} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-lathe-surface/80" />
                </div>
            )}

            <BackgroundPattern pattern={cfg.backgroundPattern || 'diagonal'} color="var(--color-lathe-yellow)" />

            {/* Corner ornaments */}
            <FloralCorner color="var(--color-lathe-yellow)" className="absolute top-4 left-4 w-24 h-24" opacity={0.25} />
            <FloralCorner color="var(--color-lathe-yellow)" className="absolute top-4 right-4 w-24 h-24 scale-x-[-1]" opacity={0.25} />
            <FloralCorner color="var(--color-lathe-yellow)" className="absolute bottom-4 left-4 w-24 h-24 scale-y-[-1]" opacity={0.25} />
            <FloralCorner color="var(--color-lathe-yellow)" className="absolute bottom-4 right-4 w-24 h-24 scale-[-1]" opacity={0.25} />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="relative z-10 space-y-5 px-8 py-12"
            >
                {/* Decorative top */}
                <OrnamentalDivider variant="floral" color="var(--color-lathe-yellow)" className="w-40 mx-auto" opacity={0.4} />

                <p className="text-[10px] tracking-[0.4em] uppercase font-sans" style={{ color: 'var(--color-lathe-ink)', opacity: 0.4 }}>
                    {cfg.subtitle || 'Undangan Pernikahan'}
                </p>

                {cfg.textStyle === 'layered' ? (
                    <LayeredText
                        lines={[
                            { top: meta.groomName || 'Nama Pria', bottom: meta.brideName || 'Nama Wanita' },
                            { top: meta.brideName || 'Nama Wanita', bottom: meta.groomName || 'Nama Pria' }
                        ]}
                        fontSize="3.5rem"
                        fontSizeMd="3rem"
                        lineHeight={50}
                        lineHeightMd={45}
                        className="py-8"
                    />
                ) : (
                    <>
                        <h1 className="text-4xl md:text-5xl font-bold italic font-serif" style={{ color: 'var(--color-lathe-ink)' }}>
                            {meta.groomName || 'Nama Pria'}
                        </h1>
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-lathe-yellow)', opacity: 0.4 }} />
                            <span className="text-3xl font-serif italic" style={{ color: 'var(--color-lathe-yellow)', opacity: 0.5 }}>&</span>
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-lathe-yellow)', opacity: 0.4 }} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold italic font-serif" style={{ color: 'var(--color-lathe-ink)' }}>
                            {meta.brideName || 'Nama Wanita'}
                        </h1>
                    </>
                )}

                <OrnamentalDivider variant="floral" color="var(--color-lathe-yellow)" className="w-40 mx-auto" opacity={0.4} />

                {/* Guest name */}
                <div className="pt-4 space-y-2">
                    <p className="text-[10px] tracking-[0.3em] uppercase font-sans" style={{ color: 'var(--color-lathe-ink)', opacity: 0.3 }}>
                        Kepada Yth. Bapak/Ibu/Saudara/i
                    </p>
                    <p className="text-lg font-bold italic font-serif" style={{ color: 'var(--color-lathe-ink)' }}>
                        {guestName}
                    </p>
                </div>

                {/* Open button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 px-8 py-3 rounded-full text-xs font-bold tracking-[0.15em] uppercase border-2 transition-colors"
                    style={{
                        borderColor: 'var(--color-lathe-yellow)',
                        color: 'var(--color-lathe-ink)',
                        backgroundColor: 'transparent',
                    }}
                >
                    Buka Undangan
                </motion.button>
            </motion.div>
        </section>
    );
}

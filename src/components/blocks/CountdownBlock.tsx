import React, { useState, useEffect } from 'react';
import type { Block } from '../../types';
import { useInvitation } from '../../contexts/InvitationContext';
import { FadeIn } from '../FadeIn';

export function CountdownBlock({ block }: { block: Block }) {
    const { invite } = useInvitation();
    const { meta, theme_config } = invite;
    const cfg = block.config;
    const layout = theme_config?.layout || 'classic';
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        if (!meta.eventDate) return;
        const target = new Date(`${meta.eventDate}T${meta.eventTime || '00:00'}`).getTime();
        const update = () => {
            const now = Date.now();
            const diff = Math.max(0, target - now);
            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / (1000 * 60)) % 60),
                seconds: Math.floor((diff / 1000) % 60),
            });
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [meta.eventDate, meta.eventTime]);

    const items = [
        { value: timeLeft.days, label: 'Hari' },
        { value: timeLeft.hours, label: 'Jam' },
        { value: timeLeft.minutes, label: 'Menit' },
        { value: timeLeft.seconds, label: 'Detik' },
    ];

    if (layout === 'modern') return <CountdownModern items={items} label={cfg.label} />;
    if (layout === 'ornate') return <CountdownOrnate items={items} label={cfg.label} />;
    return <CountdownClassic items={items} label={cfg.label} />;
}

/** Classic: thin bordered boxes, centered grid */
function CountdownClassic({ items, label }: { items: any[]; label?: string }) {
    return (
        <section className="py-16 px-6" style={{ backgroundColor: 'var(--color-lathe-surface)' }}>
            <FadeIn direction="up" className="max-w-sm mx-auto text-center">
                <h2 className="text-2xl font-bold italic font-serif mb-8" style={{ color: 'var(--color-lathe-ink)' }}>
                    {label || 'Menuju Hari Bahagia'}
                </h2>
                <div className="flex justify-center gap-3">
                    {items.map((item) => (
                        <div
                            key={item.label}
                            className="w-[72px] py-4 rounded-xl border text-center"
                            style={{ borderColor: 'var(--color-lathe-ink)', opacity: 0.15 }}
                        >
                            <div className="text-3xl font-bold font-serif tabular-nums" style={{ color: 'var(--color-lathe-ink)', opacity: 1 }}>
                                {String(item.value).padStart(2, '0')}
                            </div>
                            <div className="text-[10px] font-sans mt-1 uppercase tracking-wider" style={{ color: 'var(--color-lathe-ink)', opacity: 0.5 }}>
                                {item.label}
                            </div>
                        </div>
                    ))}
                </div>
            </FadeIn>
        </section>
    );
}

/** Modern: pill-shaped boxes with accent background, bold numbers */
function CountdownModern({ items, label }: { items: any[]; label?: string }) {
    return (
        <section className="py-16 px-6" style={{ backgroundColor: 'var(--color-lathe-surface)' }}>
            <FadeIn direction="up" className="max-w-sm mx-auto">
                <p className="text-xs font-sans font-bold uppercase tracking-[0.3em] mb-6 text-center" style={{ color: 'var(--color-lathe-ink)', opacity: 0.5 }}>
                    {label || 'Countdown'}
                </p>
                <div className="flex justify-center gap-2">
                    {items.map((item) => (
                        <div
                            key={item.label}
                            className="flex-1 max-w-[80px] rounded-2xl py-5 text-center"
                            style={{ backgroundColor: 'var(--color-lathe-yellow)', opacity: 0.9 }}
                        >
                            <div className="text-3xl font-bold font-sans tabular-nums" style={{ color: 'var(--color-lathe-surface)' }}>
                                {String(item.value).padStart(2, '0')}
                            </div>
                            <div className="text-[9px] font-sans mt-1 uppercase tracking-widest font-bold" style={{ color: 'var(--color-lathe-surface)', opacity: 0.7 }}>
                                {item.label}
                            </div>
                        </div>
                    ))}
                </div>
            </FadeIn>
        </section>
    );
}

/** Ornate: bordered number boxes with decorative separators */
function CountdownOrnate({ items, label }: { items: any[]; label?: string }) {
    return (
        <section className="py-16 px-6" style={{ backgroundColor: 'var(--color-lathe-surface)' }}>
            <FadeIn direction="up" className="max-w-sm mx-auto text-center">
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="h-px flex-1 opacity-15" style={{ backgroundColor: 'var(--color-lathe-yellow)' }} />
                    <h2 className="text-lg font-bold italic font-serif px-2" style={{ color: 'var(--color-lathe-ink)' }}>
                        {label || 'Menuju Hari Bahagia'}
                    </h2>
                    <div className="h-px flex-1 opacity-15" style={{ backgroundColor: 'var(--color-lathe-yellow)' }} />
                </div>
                <div className="flex justify-center gap-2 items-center">
                    {items.map((item, i) => (
                        <React.Fragment key={item.label}>
                            <div
                                className="w-[64px] py-3 border-2 rounded-lg text-center"
                                style={{ borderColor: 'var(--color-lathe-yellow)', opacity: 0.6 }}
                            >
                                <div className="text-2xl font-bold font-serif tabular-nums" style={{ color: 'var(--color-lathe-ink)', opacity: 1 }}>
                                    {String(item.value).padStart(2, '0')}
                                </div>
                                <div className="text-[9px] font-sans mt-0.5 uppercase tracking-wider" style={{ color: 'var(--color-lathe-ink)', opacity: 0.4 }}>
                                    {item.label}
                                </div>
                            </div>
                            {i < items.length - 1 && (
                                <span className="text-lg font-bold opacity-20" style={{ color: 'var(--color-lathe-ink)' }}>:</span>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </FadeIn>
        </section>
    );
}

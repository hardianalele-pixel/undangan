import React from 'react';
import type { Block } from '../../types';
import { useInvitation } from '../../contexts/InvitationContext';
import { FadeIn } from '../FadeIn';
import { Calendar, Clock, MapPin } from 'lucide-react';

export function EventBlock({ block }: { block: Block }) {
    const { invite } = useInvitation();
    const { meta, theme_config } = invite;
    const cfg = block.config;
    const layout = theme_config?.layout || 'classic';

    const formatDate = (d: string) => {
        if (!d) return '-';
        return new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    const data = { meta, cfg, formatDate };

    if (layout === 'modern') return <EventModern {...data} />;
    if (layout === 'ornate') return <EventOrnate {...data} />;
    return <EventClassic {...data} />;
}

/** Classic: centered text blocks with icon, rounded borders */
function EventClassic({ meta, cfg, formatDate }: any) {
    return (
        <section className="py-20 px-6 max-w-lg mx-auto">
            <FadeIn direction="up" className="space-y-16">
                <div className="text-center">
                    <Calendar className="w-8 h-8 mx-auto mb-4" style={{ color: 'var(--color-lathe-ink)', opacity: 0.4 }} />
                    <h2 className="text-3xl font-bold italic font-serif" style={{ color: 'var(--color-lathe-ink)' }}>Jadwal Acara</h2>
                </div>

                {cfg.showAkad !== false && (
                    <div className="text-center space-y-3 p-6 border rounded-2xl" style={{ borderColor: 'var(--color-lathe-ink)', opacity: 0.8 }}>
                        <h3 className="text-xl font-bold italic font-serif" style={{ color: 'var(--color-lathe-ink)' }}>Akad Nikah</h3>
                        <p className="font-sans font-medium" style={{ color: 'var(--color-lathe-ink)' }}>{formatDate(meta.eventDate)}</p>
                        <p className="font-sans flex items-center justify-center gap-2" style={{ color: 'var(--color-lathe-ink)', opacity: 0.7 }}>
                            <Clock className="w-4 h-4" /> {cfg.akadTime || meta.eventTime || '-'}
                        </p>
                    </div>
                )}

                {cfg.showResepsi !== false && (
                    <div className="text-center space-y-3 p-6 border rounded-2xl" style={{ borderColor: 'var(--color-lathe-ink)', opacity: 0.8 }}>
                        <h3 className="text-xl font-bold italic font-serif" style={{ color: 'var(--color-lathe-ink)' }}>Resepsi</h3>
                        <p className="font-sans font-medium" style={{ color: 'var(--color-lathe-ink)' }}>{formatDate(meta.eventDate)}</p>
                        <p className="font-sans flex items-center justify-center gap-2" style={{ color: 'var(--color-lathe-ink)', opacity: 0.7 }}>
                            <Clock className="w-4 h-4" /> {cfg.resepsiTime || meta.eventTime || '-'}
                        </p>
                    </div>
                )}
            </FadeIn>
        </section>
    );
}

/** Modern: horizontal card-row layout, bold sans-serif */
function EventModern({ meta, cfg, formatDate }: any) {
    return (
        <section className="py-16 px-6 max-w-md mx-auto">
            <FadeIn direction="up" className="space-y-4">
                <p className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-center mb-4" style={{ color: 'var(--color-lathe-ink)', opacity: 0.4 }}>
                    Events
                </p>

                {cfg.showAkad !== false && (
                    <div className="flex items-start gap-4 p-5 rounded-2xl border" style={{ borderColor: 'var(--color-lathe-ink)', opacity: 0.8 }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-lathe-yellow)', opacity: 0.8 }}>
                            <Calendar className="w-5 h-5" style={{ color: 'var(--color-lathe-surface)' }} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-base font-bold font-sans" style={{ color: 'var(--color-lathe-ink)' }}>Akad Nikah</h3>
                            <p className="text-sm font-sans mt-1" style={{ color: 'var(--color-lathe-ink)', opacity: 0.6 }}>{formatDate(meta.eventDate)}</p>
                            <p className="text-sm font-sans" style={{ color: 'var(--color-lathe-ink)', opacity: 0.5 }}>{cfg.akadTime || meta.eventTime || '-'}</p>
                        </div>
                    </div>
                )}

                {cfg.showResepsi !== false && (
                    <div className="flex items-start gap-4 p-5 rounded-2xl border" style={{ borderColor: 'var(--color-lathe-ink)', opacity: 0.8 }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-lathe-yellow)', opacity: 0.8 }}>
                            <MapPin className="w-5 h-5" style={{ color: 'var(--color-lathe-surface)' }} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-base font-bold font-sans" style={{ color: 'var(--color-lathe-ink)' }}>Resepsi</h3>
                            <p className="text-sm font-sans mt-1" style={{ color: 'var(--color-lathe-ink)', opacity: 0.6 }}>{formatDate(meta.eventDate)}</p>
                            <p className="text-sm font-sans" style={{ color: 'var(--color-lathe-ink)', opacity: 0.5 }}>{cfg.resepsiTime || meta.eventTime || '-'}</p>
                        </div>
                    </div>
                )}
            </FadeIn>
        </section>
    );
}

/** Ornate: bordered section with decorative header, centered */
function EventOrnate({ meta, cfg, formatDate }: any) {
    return (
        <section className="py-20 px-6 max-w-lg mx-auto">
            <FadeIn direction="up" className="space-y-12">
                <div className="flex items-center justify-center gap-3">
                    <div className="h-px w-12 opacity-20" style={{ backgroundColor: 'var(--color-lathe-yellow)' }} />
                    <h2 className="text-2xl font-bold italic font-serif" style={{ color: 'var(--color-lathe-ink)' }}>Jadwal Acara</h2>
                    <div className="h-px w-12 opacity-20" style={{ backgroundColor: 'var(--color-lathe-yellow)' }} />
                </div>

                {cfg.showAkad !== false && (
                    <div className="text-center p-6 border-2 rounded-lg" style={{ borderColor: 'var(--color-lathe-yellow)', opacity: 0.5 }}>
                        <h3 className="text-lg font-bold italic font-serif mb-3" style={{ color: 'var(--color-lathe-ink)', opacity: 1 }}>Akad Nikah</h3>
                        <p className="font-sans text-sm font-medium" style={{ color: 'var(--color-lathe-ink)', opacity: 0.8 }}>{formatDate(meta.eventDate)}</p>
                        <p className="font-sans text-sm mt-1 flex items-center justify-center gap-1" style={{ color: 'var(--color-lathe-ink)', opacity: 0.5 }}>
                            <Clock className="w-3.5 h-3.5" /> {cfg.akadTime || meta.eventTime || '-'}
                        </p>
                    </div>
                )}

                {cfg.showResepsi !== false && (
                    <div className="text-center p-6 border-2 rounded-lg" style={{ borderColor: 'var(--color-lathe-yellow)', opacity: 0.5 }}>
                        <h3 className="text-lg font-bold italic font-serif mb-3" style={{ color: 'var(--color-lathe-ink)', opacity: 1 }}>Resepsi</h3>
                        <p className="font-sans text-sm font-medium" style={{ color: 'var(--color-lathe-ink)', opacity: 0.8 }}>{formatDate(meta.eventDate)}</p>
                        <p className="font-sans text-sm mt-1 flex items-center justify-center gap-1" style={{ color: 'var(--color-lathe-ink)', opacity: 0.5 }}>
                            <Clock className="w-3.5 h-3.5" /> {cfg.resepsiTime || meta.eventTime || '-'}
                        </p>
                    </div>
                )}
            </FadeIn>
        </section>
    );
}

import React from 'react';
import type { Block } from '../../types';
import { useInvitation } from '../../contexts/InvitationContext';
import { FadeIn } from '../FadeIn';
import { Heart } from 'lucide-react';

export function CoupleBlock({ block }: { block: Block }) {
    const { invite } = useInvitation();
    const { meta, theme_config } = invite;
    const cfg = block.config;
    const layout = theme_config?.layout || 'classic';

    if (layout === 'modern') return <CoupleModern meta={meta} cfg={cfg} />;
    if (layout === 'ornate') return <CoupleOrnate meta={meta} cfg={cfg} />;
    return <CoupleClassic meta={meta} cfg={cfg} />;
}

/** Classic: side-by-side names with thin divider, serif */
function CoupleClassic({ meta, cfg }: any) {
    return (
        <section className="py-20 px-6 max-w-lg mx-auto">
            <FadeIn direction="up" className="space-y-10">
                <div className="text-center">
                    <Heart className="w-8 h-8 mx-auto mb-4" style={{ color: 'var(--color-lathe-ink)', opacity: 0.4 }} />
                    <h2 className="text-3xl font-bold italic font-serif mb-2" style={{ color: 'var(--color-lathe-ink)' }}>Mempelai</h2>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-10 text-center">
                    <PersonClassic name={meta.groomName || 'Nama Pria'} full={cfg.groomFull} parents={cfg.groomParents} photo={cfg.groomPhoto} />
                    <div className="text-4xl font-serif italic opacity-30" style={{ color: 'var(--color-lathe-ink)' }}>&</div>
                    <PersonClassic name={meta.brideName || 'Nama Wanita'} full={cfg.brideFull} parents={cfg.brideParents} photo={cfg.bridePhoto} />
                </div>
            </FadeIn>
        </section>
    );
}

function PersonClassic({ name, full, parents, photo }: any) {
    return (
        <div className="flex-1 space-y-3">
            {photo && (
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4" style={{ borderColor: 'var(--color-lathe-ink)', opacity: 0.1 }}>
                    <img src={photo} alt={name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
            )}
            <h3 className="text-2xl font-bold italic font-serif" style={{ color: 'var(--color-lathe-ink)' }}>{name}</h3>
            {full && <p className="text-sm font-sans" style={{ color: 'var(--color-lathe-ink)', opacity: 0.7 }}>{full}</p>}
            {parents && <p className="text-xs font-sans" style={{ color: 'var(--color-lathe-ink)', opacity: 0.5 }}>Putra/i dari {parents}</p>}
        </div>
    );
}

/** Modern: card-based, bold sans-serif, stacked cards */
function CoupleModern({ meta, cfg }: any) {
    return (
        <section className="py-16 px-6 max-w-md mx-auto">
            <FadeIn direction="up" className="space-y-6">
                <p className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-center mb-4" style={{ color: 'var(--color-lathe-ink)', opacity: 0.4 }}>
                    The Couple
                </p>
                <PersonCardModern name={meta.groomName || 'Nama Pria'} full={cfg.groomFull} parents={cfg.groomParents} photo={cfg.groomPhoto} />
                <div className="flex items-center gap-4 justify-center">
                    <div className="h-px flex-1" style={{ backgroundColor: 'var(--color-lathe-yellow)', opacity: 0.3 }} />
                    <Heart className="w-5 h-5" style={{ color: 'var(--color-lathe-yellow)', opacity: 0.6 }} />
                    <div className="h-px flex-1" style={{ backgroundColor: 'var(--color-lathe-yellow)', opacity: 0.3 }} />
                </div>
                <PersonCardModern name={meta.brideName || 'Nama Wanita'} full={cfg.brideFull} parents={cfg.brideParents} photo={cfg.bridePhoto} />
            </FadeIn>
        </section>
    );
}

function PersonCardModern({ name, full, parents, photo }: any) {
    return (
        <div className="flex items-center gap-5 p-5 rounded-2xl border" style={{ borderColor: 'var(--color-lathe-ink)', opacity: 0.8, background: 'var(--color-lathe-surface)' }}>
            {photo && (
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={photo} alt={name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
            )}
            <div className="text-left flex-1">
                <h3 className="text-xl font-bold font-sans" style={{ color: 'var(--color-lathe-ink)' }}>{name}</h3>
                {full && <p className="text-sm font-sans mt-0.5" style={{ color: 'var(--color-lathe-ink)', opacity: 0.6 }}>{full}</p>}
                {parents && <p className="text-xs font-sans mt-1" style={{ color: 'var(--color-lathe-ink)', opacity: 0.4 }}>{parents}</p>}
            </div>
        </div>
    );
}

/** Ornate: circular frames, decorative dividers, centered with gold accents */
function CoupleOrnate({ meta, cfg }: any) {
    return (
        <section className="py-20 px-6 max-w-lg mx-auto">
            <FadeIn direction="up" className="space-y-8 text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="h-px w-12 opacity-20" style={{ backgroundColor: 'var(--color-lathe-yellow)' }} />
                    <h2 className="text-2xl font-bold italic font-serif" style={{ color: 'var(--color-lathe-ink)' }}>Mempelai</h2>
                    <div className="h-px w-12 opacity-20" style={{ backgroundColor: 'var(--color-lathe-yellow)' }} />
                </div>

                <PersonOrnate name={meta.groomName || 'Nama Pria'} full={cfg.groomFull} parents={cfg.groomParents} photo={cfg.groomPhoto} />

                <div className="flex items-center justify-center gap-3 py-2">
                    <div className="w-2 h-2 rounded-full opacity-30" style={{ backgroundColor: 'var(--color-lathe-yellow)' }} />
                    <span className="text-3xl font-serif italic opacity-30" style={{ color: 'var(--color-lathe-ink)' }}>&</span>
                    <div className="w-2 h-2 rounded-full opacity-30" style={{ backgroundColor: 'var(--color-lathe-yellow)' }} />
                </div>

                <PersonOrnate name={meta.brideName || 'Nama Wanita'} full={cfg.brideFull} parents={cfg.brideParents} photo={cfg.bridePhoto} />
            </FadeIn>
        </section>
    );
}

function PersonOrnate({ name, full, parents, photo }: any) {
    return (
        <div className="space-y-3">
            {photo && (
                <div className="w-36 h-36 mx-auto rounded-full overflow-hidden border-[3px] p-1" style={{ borderColor: 'var(--color-lathe-yellow)', opacity: 0.5 }}>
                    <img src={photo} alt={name} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
                </div>
            )}
            <h3 className="text-2xl font-bold italic font-serif" style={{ color: 'var(--color-lathe-ink)' }}>{name}</h3>
            {full && <p className="text-sm font-sans" style={{ color: 'var(--color-lathe-ink)', opacity: 0.7 }}>{full}</p>}
            {parents && <p className="text-xs font-sans" style={{ color: 'var(--color-lathe-ink)', opacity: 0.5 }}>Putra/i dari {parents}</p>}
        </div>
    );
}

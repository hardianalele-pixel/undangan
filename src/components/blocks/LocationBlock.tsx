import React from 'react';
import type { Block } from '../../types';
import { useInvitation } from '../../contexts/InvitationContext';
import { FadeIn } from '../FadeIn';
import { MapPin } from 'lucide-react';

export function LocationBlock({ block }: { block: Block }) {
    const { invite } = useInvitation();
    const { meta } = invite;
    const cfg = block.config;

    return (
        <section className="py-20 px-6 max-w-lg mx-auto">
            <FadeIn direction="up" className="text-center space-y-6">
                <MapPin className="w-8 h-8 mx-auto text-lathe-ink/60" />
                <h2 className="text-3xl font-bold italic font-serif">Lokasi</h2>

                <p className="font-sans font-medium text-lathe-ink leading-relaxed max-w-sm mx-auto">
                    {meta.venueName || 'Nama Tempat'}
                </p>

                {cfg.showMap && meta.googleMapsLink && (
                    <div className="space-y-4">
                        <div className="aspect-video rounded-xl overflow-hidden border border-lathe-ink/10">
                            <iframe
                                title="Location Map"
                                src={meta.googleMapsLink.includes('embed') ? meta.googleMapsLink : `https://maps.google.com/maps?q=${encodeURIComponent(meta.venueName)}&output=embed`}
                                className="w-full h-full"
                                loading="lazy"
                                allowFullScreen
                            />
                        </div>
                        <a
                            href={meta.googleMapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-bold text-lathe-surface bg-lathe-ink px-6 py-3 rounded-full hover:bg-lathe-ink/80 transition-colors font-sans"
                        >
                            <MapPin className="w-4 h-4" />
                            Buka Google Maps
                        </a>
                    </div>
                )}

                {!cfg.showMap && meta.googleMapsLink && (
                    <a
                        href={meta.googleMapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-bold text-lathe-surface bg-lathe-ink px-6 py-3 rounded-full hover:bg-lathe-ink/80 transition-colors font-sans"
                    >
                        Buka Google Maps
                    </a>
                )}
            </FadeIn>
        </section>
    );
}

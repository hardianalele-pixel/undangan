import React from 'react';
import type { Block } from '../../types';
import { useInvitation } from '../../contexts/InvitationContext';
import { FadeIn } from '../FadeIn';
import { Gift } from 'lucide-react';

export function GiftBlock({ block }: { block: Block }) {
    const { invite, isPreview } = useInvitation();
    const { meta } = invite;
    const cfg = block.config;

    const handleTrackClick = () => {
        if (!isPreview) {
            // Track envelope/gift clicks
            const stored = localStorage.getItem('lathe_interactions');
            const interactions = stored ? JSON.parse(stored) : {};
            if (!interactions[invite.slug]) interactions[invite.slug] = { giftClicks: 0 };
            interactions[invite.slug].giftClicks++;
            localStorage.setItem('lathe_interactions', JSON.stringify(interactions));
        }
    };

    return (
        <section className="py-20 px-6 bg-lathe-ink/5 border-t border-b border-lathe-ink/10">
            <FadeIn direction="up" className="max-w-sm mx-auto text-center space-y-6">
                <Gift className="w-8 h-8 mx-auto text-lathe-ink/60" />
                <h2 className="text-3xl font-bold italic font-serif">Tanda Kasih</h2>
                <p className="font-sans text-sm text-lathe-ink/70 leading-relaxed">
                    Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless.
                </p>

                {/* Bank Accounts */}
                {cfg.bankAccounts && cfg.bankAccounts.length > 0 && (
                    <div className="space-y-3">
                        {cfg.bankAccounts.map((acc: any, i: number) => (
                            <div key={i} className="bg-white p-4 border border-lathe-ink/10 rounded-xl text-left font-sans" onClick={handleTrackClick}>
                                <p className="text-xs text-lathe-ink/50 uppercase tracking-wider">{acc.bank}</p>
                                <p className="font-mono font-bold text-lg mt-1">{acc.number}</p>
                                <p className="text-sm text-lathe-ink/70">a.n. {acc.name}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* QRIS */}
                {cfg.showQris && meta.qrisBarcode && (
                    <div className="bg-white p-4 border border-lathe-ink/10 shadow-sm rounded-xl inline-block" onClick={handleTrackClick}>
                        <img
                            src={meta.qrisBarcode}
                            alt="QRIS Barcode"
                            loading="lazy"
                            className="w-48 h-48 object-contain"
                            referrerPolicy="no-referrer"
                        />
                    </div>
                )}
            </FadeIn>
        </section>
    );
}

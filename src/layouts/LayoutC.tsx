import React, { useState } from 'react';
import { useInvitation } from '../contexts/InvitationContext';
import { FadeIn } from '../components/FadeIn';
import { Calendar, MapPin, Clock, Gift, Send, Heart, Image as ImageIcon } from 'lucide-react';
import { MasonryGallery } from '../components/MasonryGallery';

export function LayoutC() {
    const { invite, guestName, isPreview, handleRsvpSubmit } = useInvitation();
    const [isOpened, setIsOpened] = useState(false);

    const [rsvpData, setRsvpData] = React.useState({
        name: '',
        attendance: 'yes',
        message: ''
    });

    const handleRsvpChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setRsvpData(prev => ({ ...prev, [name]: value }));
    };

    const submitRsvp = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isPreview) handleRsvpSubmit(rsvpData);
    };

    const handleOpen = () => {
        setIsOpened(true);
    };

    return (
        <div className={`theme-${invite.theme || 'terracotta'} bg-lathe-surface text-lathe-ink font-serif selection:bg-lathe-yellow selection:text-lathe-ink w-full min-h-[100dvh] relative overflow-hidden`}>

            {/* Cover / Envelope (Wax Seal Intro) */}
            <div
                className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-lathe-ink text-lathe-surface transition-transform duration-[1500ms] ease-in-out ${isOpened ? '-translate-y-full' : 'translate-y-0'
                    }`}
            >
                {/* Subtle texture or pattern for envelope could go here */}

                <div className="text-center space-y-12 max-w-sm px-6">
                    <div className="space-y-4">
                        <p className="text-xs tracking-[0.3em] font-sans uppercase text-lathe-surface/50">
                            The Wedding Of
                        </p>
                        <h1 className="text-4xl md:text-5xl font-bold italic text-lathe-yellow">
                            {invite.groomName} <br />&<br /> {invite.brideName}
                        </h1>
                    </div>

                    <div className="relative">
                        {/* The Wax Seal Button */}
                        <button
                            onClick={handleOpen}
                            className="relative z-10 w-24 h-24 rounded-full bg-red-800 text-white flex items-center justify-center shadow-2xl border-4 border-red-900 mx-auto hover:bg-red-700 hover:scale-105 active:scale-95 transition-all outline-none cursor-pointer group"
                            style={{
                                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5), 0 10px 25px rgba(0,0,0,0.3)',
                                background: 'radial-gradient(ellipse at center, #991b1b 0%, #7f1d1d 100%)'
                            }}
                        >
                            <span className="font-serif italic text-3xl font-bold drop-shadow-md group-hover:rotate-12 transition-transform duration-500">
                                {invite.groomName.charAt(0)}{invite.brideName.charAt(0)}
                            </span>
                        </button>
                        <p className="font-sans text-xs tracking-widest uppercase text-lathe-surface/60 mt-8 animate-pulse">
                            Ketuk untuk membuka
                        </p>
                    </div>

                    {guestName && (
                        <div className="pt-12 border-t border-lathe-surface/10 space-y-2">
                            <p className="text-xs font-sans text-lathe-surface/50">Kpd Yth:</p>
                            <p className="text-xl font-bold">{guestName}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Invitation Content (Inside the Envelope) */}
            <main className="h-full overflow-y-auto">
                <div className="max-w-md mx-auto bg-white min-h-screen border-x border-lathe-ink/5 shadow-2xl pb-24">

                    {/* Header Image Square */}
                    <div className="w-full aspect-square relative bg-lathe-surface/50">
                        {invite.heroImage ? (
                            <img
                                src={invite.heroImage}
                                alt="Couple"
                                loading="eager"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center opacity-30">
                                <Heart className="w-12 h-12" />
                            </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white to-transparent"></div>
                    </div>

                    {/* Titles */}
                    <section className="px-8 text-center -mt-12 relative z-10 mb-16">
                        <FadeIn direction="up">
                            <div className="bg-white p-6 shadow-xl border border-lathe-ink/5 pt-10">
                                <p className="text-xs font-sans tracking-widest uppercase text-lathe-ink/50 mb-4">Pernikahan</p>
                                <h2 className="text-4xl font-bold italic text-lathe-ink mb-6">
                                    {invite.groomName} & {invite.brideName}
                                </h2>
                                <p className="font-sans text-sm text-lathe-ink/80 font-medium">
                                    {invite.eventDate ? new Date(invite.eventDate).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    }) : '-'}
                                </p>
                            </div>
                        </FadeIn>
                    </section>

                    {/* Events Data */}
                    <section className="px-8 mb-16">
                        <FadeIn direction="up" className="bg-lathe-surface/30 p-8 border border-lathe-ink/10 space-y-8">
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-bold tracking-widest uppercase font-sans text-lathe-ink">Resepsi</h3>
                                <p className="text-sm font-sans text-lathe-ink/70">
                                    Pukul {invite.eventTime} WIB
                                </p>
                            </div>
                            <div className="h-px bg-lathe-ink/10 w-full mx-auto"></div>
                            <div className="text-center space-y-4">
                                <h3 className="text-xl font-bold tracking-widest uppercase font-sans text-lathe-ink">Lokasi</h3>
                                <p className="text-sm font-sans text-lathe-ink/80 leading-relaxed font-medium">
                                    {invite.venueName}
                                </p>
                                {invite.googleMapsLink && (
                                    <a href={invite.googleMapsLink} target="_blank" rel="noopener noreferrer" className="block w-max mx-auto px-6 py-2 border border-lathe-ink text-xs uppercase tracking-widest font-bold hover:bg-lathe-ink hover:text-white transition-colors">
                                        Google Maps
                                    </a>
                                )}
                            </div>
                        </FadeIn>
                    </section>

                    {/* Gift */}
                    {invite.qrisBarcode && (
                        <section className="px-8 mb-16">
                            <FadeIn direction="up" className="text-center border-y border-lathe-ink/10 py-12">
                                <Gift className="w-6 h-6 mx-auto mb-4 text-lathe-ink/50" />
                                <h2 className="text-2xl font-bold italic mb-4">Tanda Kasih</h2>
                                <div className="inline-block p-4 border border-lathe-ink/10 shadow-sm bg-white mb-4">
                                    <img src={invite.qrisBarcode} className="w-32 h-32 object-contain" alt="QRIS" />
                                </div>
                            </FadeIn>
                        </section>
                    )}

                    {/* RSVP */}
                    <section className="px-8 mb-8">
                        <FadeIn direction="up" className="bg-lathe-ink text-white p-8">
                            <h2 className="text-2xl font-bold italic mb-6 text-center">Kehadiran</h2>
                            <form onSubmit={submitRsvp} className="space-y-4 font-sans text-sm">
                                <input type="text" name="name" value={rsvpData.name} onChange={handleRsvpChange} required placeholder="Nama" className="w-full bg-white/10 border border-white/20 p-3 text-white placeholder-white/50 focus:outline-none focus:border-white transition-colors" />
                                <select name="attendance" value={rsvpData.attendance} onChange={handleRsvpChange} className="w-full bg-lathe-ink border border-white/20 p-3 text-white focus:outline-none focus:border-white transition-colors appearance-none">
                                    <option value="yes">Akan Hadir</option>
                                    <option value="no">Berhalangan</option>
                                </select>
                                <textarea name="message" value={rsvpData.message} onChange={handleRsvpChange} placeholder="Pesan" rows={3} className="w-full bg-white/10 border border-white/20 p-3 text-white placeholder-white/50 focus:outline-none focus:border-white transition-colors"></textarea>
                                <button type="submit" className="w-full bg-white text-lathe-ink font-bold py-3 hover:bg-white/90 transition-colors uppercase tracking-widest text-xs">Kirim Konfirmasi</button>
                            </form>
                        </FadeIn>
                    </section>

                    {/* Optional Gallery */}
                    {invite.enableGallery && invite.gallery && invite.gallery.length > 0 && (
                        <section className="px-8 mb-16">
                            <FadeIn direction="up" className="text-center py-4">
                                <h2 className="text-2xl font-bold italic mb-8 text-lathe-ink">
                                    Potret Bahagia
                                </h2>
                                <MasonryGallery images={invite.gallery} imageClassName="rounded-sm shadow-md border-4 border-white" />
                            </FadeIn>
                        </section>
                    )}

                </div>
            </main>
        </div>
    );
}

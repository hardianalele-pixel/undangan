import React from 'react';
import { useInvitation } from '../contexts/InvitationContext';
import { FadeIn } from '../components/FadeIn';
import { Calendar, MapPin, Clock, Gift, Send, Image as ImageIcon } from 'lucide-react';
import { MasonryGallery } from '../components/MasonryGallery';

export function LayoutB() {
    const { invite, guestName, isPreview, handleRsvpSubmit } = useInvitation();

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

    return (
        <div className={`theme-${invite.theme || 'sage'} bg-lathe-surface text-lathe-ink font-serif selection:bg-lathe-yellow selection:text-lathe-ink w-full min-h-[100dvh] flex flex-col items-center py-8 px-4`}>

            {/* Arch Hero Section */}
            <section className="relative w-full max-w-sm mx-auto flex flex-col items-center text-center">

                {guestName && (
                    <FadeIn direction="up" className="mb-6">
                        <p className="text-xs tracking-widest uppercase font-sans font-medium text-lathe-ink/60 mb-2">
                            Undangan Spesial Untuk
                        </p>
                        <p className="text-xl font-bold border-b border-lathe-ink inline-block pb-1">
                            {guestName}
                        </p>
                    </FadeIn>
                )}

                <FadeIn direction="up" delay={0.1} className="w-full relative">
                    <div className="w-full aspect-[3/4] overflow-hidden rounded-[50%_50%_0_0] border-4 border-lathe-surface shadow-xl relative bg-lathe-ink/5">
                        {invite.heroImage && (
                            <img
                                src={invite.heroImage}
                                alt="Couple"
                                loading="eager"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                            />
                        )}
                        {/* Elegant overlay overlay for text readability if needed */}
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-lathe-surface/80 to-transparent"></div>
                    </div>

                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-full">
                        <h1 className="text-5xl md:text-6xl font-bold italic tracking-tight text-shadow-sm bg-lathe-surface/90 rounded-full py-4 px-8 border border-lathe-ink/10 shadow-lg backdrop-blur-sm whitespace-nowrap">
                            {invite.groomName} & {invite.brideName}
                        </h1>
                    </div>
                </FadeIn>
            </section>

            {/* Spacing for floating title */}
            <div className="h-20 w-full"></div>

            <FadeIn direction="up" className="text-center mt-4 mb-12">
                <p className="text-sm font-sans tracking-[0.2em] uppercase text-lathe-ink/60 mb-2">Pernikahan Suci</p>
                <p className="text-lg font-medium font-sans border-t border-lathe-ink/20 pt-4 w-48 mx-auto">
                    {invite.eventDate ? new Date(invite.eventDate).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    }) : 'Segera Hadir'}
                </p>
            </FadeIn>

            {/* Details Box */}
            <section className="w-full max-w-sm mx-auto bg-white rounded-3xl p-8 shadow-sm border border-lathe-ink/10 mb-12">
                <FadeIn direction="up" className="space-y-10">
                    <div className="text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-lathe-ink/5 flex items-center justify-center mx-auto mb-2">
                            <Calendar className="w-5 h-5 text-lathe-ink" />
                        </div>
                        <h3 className="text-xl font-bold italic">Akad & Resepsi</h3>
                        <div className="font-sans text-sm text-lathe-ink/80 space-y-1">
                            <p className="font-semibold text-lathe-ink">
                                {invite.eventDate ? new Date(invite.eventDate).toLocaleDateString('id-ID', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                }) : '-'}
                            </p>
                            <p className="flex items-center justify-center gap-1">
                                <Clock className="w-3 h-3" />
                                {invite.eventTime}
                            </p>
                        </div>
                    </div>

                    <div className="h-px bg-lathe-ink/10 w-full"></div>

                    <div className="text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-lathe-ink/5 flex items-center justify-center mx-auto mb-2">
                            <MapPin className="w-5 h-5 text-lathe-ink" />
                        </div>
                        <h3 className="text-xl font-bold italic">Lokasi</h3>
                        <div className="font-sans text-sm text-lathe-ink/80 space-y-3">
                            <p className="font-semibold text-lathe-ink leading-relaxed max-w-[200px] mx-auto">{invite.venueName}</p>
                            {invite.googleMapsLink && (
                                <a
                                    href={invite.googleMapsLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 font-bold text-lathe-ink bg-lathe-yellow px-5 py-2.5 rounded-full hover:bg-lathe-yellow/80 transition-colors shadow-sm"
                                >
                                    Petunjuk Arah
                                </a>
                            )}
                        </div>
                    </div>
                </FadeIn>
            </section>

            {/* Optional Gallery Section */}
            {invite.enableGallery && invite.gallery && invite.gallery.length > 0 && (
                <section className="w-full max-w-sm mx-auto mb-12">
                    <FadeIn direction="up">
                        <div className="text-center mb-8">
                            <div className="w-12 h-12 rounded-full bg-lathe-ink/5 flex items-center justify-center mx-auto mb-3">
                                <ImageIcon className="w-5 h-5 text-lathe-ink" />
                            </div>
                            <h2 className="text-2xl font-bold italic">Momen Bahagia</h2>
                        </div>
                        {/* Use arched borders for images to match Layout B */}
                        <MasonryGallery images={invite.gallery} imageClassName="rounded-[50%_50%_0_0] border-4 border-white shadow-sm" />
                    </FadeIn>
                </section>
            )}

            {/* Digital Envelope Arch */}
            {invite.qrisBarcode && (
                <section className="w-full max-w-sm mx-auto bg-lathe-ink text-lathe-surface rounded-[50%_50%_0_0] pt-16 pb-12 px-8 mb-12 text-center">
                    <FadeIn direction="up" className="space-y-6">
                        <Gift className="w-8 h-8 mx-auto text-lathe-surface/60" />
                        <h2 className="text-3xl font-bold italic">Tanda Kasih</h2>
                        <p className="font-sans text-xs text-lathe-surface/70 leading-relaxed">
                            Doa restu Anda merupakan karunia yang sangat berarti. Bagi yang ingin memberikan tanda kasih secara digital:
                        </p>
                        <div className="bg-white p-3 rounded-xl inline-block shadow-lg mx-auto">
                            <img
                                src={invite.qrisBarcode}
                                alt="QRIS Barcode"
                                loading="lazy"
                                className="w-40 h-40 object-contain mx-auto"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                        <p className="font-sans text-[10px] text-lathe-surface/50 tracking-widest uppercase">Pindai QRIS Di Atas</p>
                    </FadeIn>
                </section>
            )}

            {/* RSVP Section */}
            <section className="w-full max-w-sm mx-auto mb-16">
                <FadeIn direction="up" className="bg-white p-8 rounded-3xl shadow-sm border border-lathe-ink/10">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold italic mb-2">Kehadiran</h2>
                        <p className="font-sans text-xs text-lathe-ink/60">Konfirmasi via WhatsApp</p>
                    </div>

                    <form onSubmit={submitRsvp} className="space-y-4 font-sans text-sm">
                        <div>
                            <input
                                type="text"
                                name="name"
                                value={rsvpData.name}
                                onChange={handleRsvpChange}
                                required
                                className="w-full h-11 px-4 bg-lathe-surface rounded-lg border border-transparent focus:border-lathe-ink/30 focus:outline-none transition-colors"
                                placeholder="Nama Lengkap"
                            />
                        </div>
                        <div>
                            <select
                                name="attendance"
                                value={rsvpData.attendance}
                                onChange={handleRsvpChange}
                                className="w-full h-11 px-4 bg-lathe-surface rounded-lg border border-transparent focus:border-lathe-ink/30 focus:outline-none transition-colors"
                            >
                                <option value="yes">Ya, saya hadir</option>
                                <option value="no">Maaf, berhalangan</option>
                            </select>
                        </div>
                        <div>
                            <textarea
                                name="message"
                                value={rsvpData.message}
                                onChange={handleRsvpChange}
                                rows={3}
                                className="w-full p-4 bg-lathe-surface rounded-lg border border-transparent focus:border-lathe-ink/30 focus:outline-none transition-colors resize-none"
                                placeholder="Pesan..."
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full h-11 flex items-center justify-center gap-2 bg-lathe-ink text-lathe-surface font-semibold rounded-lg hover:bg-lathe-ink/90 transition-colors mt-2"
                        >
                            <Send className="w-4 h-4" />
                            Kirim RSVP
                        </button>
                    </form>
                </FadeIn>
            </section>
        </div>
    );
}

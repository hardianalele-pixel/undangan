import React from 'react';
import { useInvitation } from '../contexts/InvitationContext';
import { FadeIn } from '../components/FadeIn';
import { Calendar, MapPin, Clock, Gift, Send, Image as ImageIcon } from 'lucide-react';
import { MasonryGallery } from '../components/MasonryGallery';

export function LayoutA() {
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
        <div className={`theme-${invite.theme || 'elegant'} bg-lathe-surface text-lathe-ink font-serif selection:bg-lathe-yellow selection:text-lathe-ink w-full`}>
            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex flex-col items-center justify-end text-center pb-20 overflow-hidden">
                {invite.heroImage && (
                    <div className="absolute inset-0 z-0">
                        <img
                            src={invite.heroImage}
                            alt="Couple"
                            loading="eager"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                        {/* Fade to background color gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-lathe-surface via-lathe-surface/40 to-transparent"></div>
                    </div>
                )}

                <FadeIn direction="up" className="relative z-10 w-full px-6 flex flex-col items-center gap-6">
                    {guestName && (
                        <div className="mb-4">
                            <p className="text-xs tracking-[0.2em] uppercase font-sans font-medium text-lathe-ink/80 mb-2">
                                Kepada Yth:
                            </p>
                            <p className="text-xl font-bold italic">
                                {guestName}
                            </p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <p className="text-sm tracking-[0.2em] uppercase font-sans font-medium text-lathe-ink/80">
                            Pernikahan
                        </p>
                        <h1 className="text-5xl md:text-6xl font-bold italic tracking-tight text-shadow-sm">
                            {invite.groomName} <br />&<br /> {invite.brideName}
                        </h1>
                    </div>

                    <div className="h-px bg-lathe-ink/30 w-16 mx-auto my-4"></div>

                    <p className="text-lg font-medium font-sans tracking-wide">
                        {invite.eventDate ? new Date(invite.eventDate).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        }) : 'Segera Hadir'}
                    </p>
                </FadeIn>
            </section>

            {/* Details Section */}
            <section className="py-20 px-6 max-w-lg mx-auto">
                <FadeIn direction="up" className="space-y-16">
                    <div className="text-center space-y-4">
                        <Calendar className="w-8 h-8 mx-auto text-lathe-ink/60" />
                        <h3 className="text-2xl font-bold italic">Akad & Resepsi</h3>
                        <div className="font-sans text-lathe-ink/80 space-y-1">
                            <p className="font-medium text-lathe-ink">
                                {invite.eventDate ? new Date(invite.eventDate).toLocaleDateString('id-ID', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                }) : '-'}
                            </p>
                            <p className="flex items-center justify-center gap-2">
                                <Clock className="w-4 h-4" />
                                {invite.eventTime}
                            </p>
                        </div>
                    </div>

                    <div className="text-center space-y-4">
                        <MapPin className="w-8 h-8 mx-auto text-lathe-ink/60" />
                        <h3 className="text-2xl font-bold italic">Lokasi</h3>
                        <div className="font-sans text-lathe-ink/80 space-y-3">
                            <p className="font-medium text-lathe-ink leading-relaxed max-w-sm mx-auto">{invite.venueName}</p>
                            {invite.googleMapsLink && (
                                <a
                                    href={invite.googleMapsLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm font-bold text-lathe-surface bg-lathe-ink px-6 py-3 rounded-full hover:bg-lathe-ink/80 transition-colors"
                                >
                                    Buka Google Maps
                                </a>
                            )}
                        </div>
                    </div>
                </FadeIn>
            </section>

            {/* Optional Gallery Section */}
            {invite.enableGallery && invite.gallery && invite.gallery.length > 0 && (
                <section className="py-20 px-6 max-w-md mx-auto">
                    <FadeIn direction="up">
                        <div className="text-center mb-10">
                            <ImageIcon className="w-8 h-8 mx-auto text-lathe-ink/60 mb-4" />
                            <h2 className="text-3xl font-bold italic mb-3">Momen Bahagia</h2>
                        </div>
                        <MasonryGallery images={invite.gallery} imageClassName="rounded-xl" />
                    </FadeIn>
                </section>
            )}

            {/* Digital Envelope */}
            {invite.qrisBarcode && (
                <section className="py-20 px-6 bg-lathe-ink/5 border-t border-b border-lathe-ink/10">
                    <FadeIn direction="up" className="max-w-sm mx-auto text-center space-y-6">
                        <Gift className="w-8 h-8 mx-auto text-lathe-ink/60" />
                        <h2 className="text-3xl font-bold italic">Tanda Kasih</h2>
                        <p className="font-sans text-sm text-lathe-ink/70 leading-relaxed">
                            Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless.
                        </p>
                        <div className="bg-white p-4 border border-lathe-ink/10 shadow-sm rounded-xl inline-block">
                            <img
                                src={invite.qrisBarcode}
                                alt="QRIS Barcode"
                                loading="lazy"
                                className="w-48 h-48 object-contain"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                    </FadeIn>
                </section>
            )}

            {/* RSVP Section */}
            <section className="py-20 px-6 max-w-sm mx-auto">
                <FadeIn direction="up">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold italic mb-3">Kehadiran</h2>
                        <p className="font-sans text-sm text-lathe-ink/70">Harap konfirmasi kehadiran Anda</p>
                    </div>

                    <form onSubmit={submitRsvp} className="space-y-5 font-sans">
                        <div>
                            <input
                                type="text"
                                name="name"
                                value={rsvpData.name}
                                onChange={handleRsvpChange}
                                required
                                className="w-full h-12 px-4 bg-transparent border-b border-lathe-ink/30 focus:border-lathe-ink focus:outline-none transition-colors"
                                placeholder="Nama Lengkap"
                            />
                        </div>
                        <div>
                            <select
                                name="attendance"
                                value={rsvpData.attendance}
                                onChange={handleRsvpChange}
                                className="w-full h-12 px-4 bg-transparent border-b border-lathe-ink/30 focus:border-lathe-ink focus:outline-none transition-colors appearance-none"
                            >
                                <option value="yes">Hadir</option>
                                <option value="no">Tidak Hadir</option>
                            </select>
                        </div>
                        <div>
                            <textarea
                                name="message"
                                value={rsvpData.message}
                                onChange={handleRsvpChange}
                                rows={3}
                                className="w-full p-4 bg-transparent border-b border-lathe-ink/30 focus:border-lathe-ink focus:outline-none transition-colors resize-none"
                                placeholder="Pesan untuk pasangan..."
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full h-12 mt-4 flex items-center justify-center gap-2 bg-lathe-ink text-lathe-surface font-bold rounded-full hover:bg-lathe-ink/90 transition-colors"
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

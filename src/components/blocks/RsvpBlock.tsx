import React, { useState } from 'react';
import type { Block } from '../../types';
import { useInvitation } from '../../contexts/InvitationContext';
import { FadeIn } from '../FadeIn';
import { Send } from 'lucide-react';

export function RsvpBlock({ block }: { block: Block }) {
    const { invite, isPreview, handleRsvpSubmit } = useInvitation();
    const cfg = block.config;

    const [rsvpData, setRsvpData] = useState({
        name: '',
        attendance: 'yes',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setRsvpData(prev => ({ ...prev, [name]: value }));
    };

    const submitRsvp = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isPreview) handleRsvpSubmit(rsvpData);
    };

    return (
        <section className="py-20 px-6 max-w-sm mx-auto">
            <FadeIn direction="up">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold italic font-serif mb-3">Kehadiran</h2>
                    <p className="font-sans text-sm text-lathe-ink/70">Harap konfirmasi kehadiran Anda</p>
                </div>

                <form onSubmit={submitRsvp} className="space-y-5 font-sans">
                    <div>
                        <input
                            type="text"
                            name="name"
                            value={rsvpData.name}
                            onChange={handleChange}
                            required
                            className="w-full h-12 px-4 bg-transparent border-b border-lathe-ink/30 focus:border-lathe-ink focus:outline-none transition-colors"
                            placeholder="Nama Lengkap"
                        />
                    </div>
                    <div>
                        <select
                            name="attendance"
                            value={rsvpData.attendance}
                            onChange={handleChange}
                            className="w-full h-12 px-4 bg-transparent border-b border-lathe-ink/30 focus:border-lathe-ink focus:outline-none transition-colors appearance-none"
                        >
                            <option value="yes">Hadir</option>
                            <option value="no">Tidak Hadir</option>
                        </select>
                    </div>
                    {cfg.showMessage !== false && (
                        <div>
                            <textarea
                                name="message"
                                value={rsvpData.message}
                                onChange={handleChange}
                                rows={3}
                                className="w-full p-4 bg-transparent border-b border-lathe-ink/30 focus:border-lathe-ink focus:outline-none transition-colors resize-none"
                                placeholder="Pesan untuk pasangan..."
                            />
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full h-12 mt-4 flex items-center justify-center gap-2 bg-lathe-ink text-lathe-surface font-bold rounded-full hover:bg-lathe-ink/90 transition-colors"
                    >
                        <Send className="w-4 h-4" />
                        {cfg.submitLabel || 'Kirim RSVP'}
                    </button>
                </form>
            </FadeIn>
        </section>
    );
}

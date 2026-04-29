import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { guestbookAPI } from '../utils/api';
import { Heart, MessageSquare } from 'lucide-react';
import type { GuestBookEntry } from '../types';

export function BroadcastScreen() {
    const { slug } = useParams();
    const [entries, setEntries] = useState<GuestBookEntry[]>([]);
    const [currentEntry, setCurrentEntry] = useState<GuestBookEntry | null>(null);
    const [coupleName, setCoupleName] = useState('');
    const [isRevealing, setIsRevealing] = useState(false);
    const queueRef = useRef<GuestBookEntry[]>([]);

    // Fetch couple name
    useEffect(() => {
        if (!slug) return;
        fetch(`/api/invitations/${slug}/public`)
            .then(r => r.json())
            .then(data => {
                if (data.meta) setCoupleName(`${data.meta.groomName} & ${data.meta.brideName}`);
            })
            .catch(() => { });
    }, [slug]);

    // SSE for real-time entries
    useEffect(() => {
        if (!slug) return;

        const evtSource = new EventSource(`/api/guestbook/${slug}/stream`);

        evtSource.addEventListener('init', (e) => {
            const data = JSON.parse(e.data);
            setEntries(data.entries || []);
        });

        evtSource.addEventListener('guestbook_entry', (e) => {
            const data = JSON.parse(e.data);
            queueRef.current.push(data.entry);
            processQueue();
        });

        return () => evtSource.close();
    }, [slug]);

    const processQueue = () => {
        if (isRevealing || queueRef.current.length === 0) return;

        const next = queueRef.current.shift()!;
        setIsRevealing(true);
        setCurrentEntry(next);
        setEntries(prev => [next, ...prev]);

        // Show for 8 seconds, then check queue again
        setTimeout(() => {
            setIsRevealing(false);
            setCurrentEntry(null);
            setTimeout(() => processQueue(), 1000);
        }, 8000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white font-sans overflow-hidden flex flex-col">
            {/* Header */}
            <header className="p-6 text-center border-b border-white/5">
                <p className="text-sm text-white/30 tracking-[0.3em] uppercase font-sans">Pesan & Doa</p>
                {coupleName && (
                    <h1 className="text-3xl md:text-5xl font-bold italic font-serif mt-2 bg-gradient-to-r from-rose-300 via-amber-200 to-rose-300 bg-clip-text text-transparent">
                        {coupleName}
                    </h1>
                )}
            </header>

            {/* Main Display */}
            <main className="flex-1 flex items-center justify-center p-8 relative">
                {/* Current Entry Reveal */}
                {currentEntry ? (
                    <div
                        className="max-w-3xl w-full text-center space-y-8"
                        style={{
                            animation: 'fadeInUp 0.8s ease-out forwards',
                        }}
                    >
                        {/* Photo */}
                        {currentEntry.photo_path && (
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto overflow-hidden border-4 border-white/10 shadow-2xl shadow-purple-500/20">
                                <img src={currentEntry.photo_path} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                        )}

                        {/* Guest Name */}
                        <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-300 to-rose-300 bg-clip-text text-transparent">
                            {currentEntry.guest_name}
                        </p>

                        {/* Message */}
                        {currentEntry.message && (
                            <div className="relative">
                                <MessageSquare className="w-8 h-8 mx-auto text-white/10 mb-4" />
                                <blockquote className="text-xl md:text-3xl font-serif italic leading-relaxed text-white/90 max-w-2xl mx-auto">
                                    "{currentEntry.message}"
                                </blockquote>
                            </div>
                        )}

                        {/* Signature */}
                        {currentEntry.signature_path && (
                            <div className="flex justify-center mt-6">
                                <img
                                    src={currentEntry.signature_path}
                                    alt="Signature"
                                    className="h-16 md:h-20 opacity-60 invert"
                                    referrerPolicy="no-referrer"
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    /* Idle State: Rotating recent entries */
                    <div className="text-center space-y-8">
                        <Heart className="w-20 h-20 mx-auto text-rose-500/20 animate-pulse" />
                        <p className="text-2xl text-white/20 font-serif italic">
                            Menunggu pesan baru...
                        </p>
                        {entries.length > 0 && (
                            <div className="max-w-lg mx-auto space-y-4 mt-12">
                                <p className="text-xs text-white/20 uppercase tracking-widest">Pesan Terbaru</p>
                                {entries.slice(0, 3).map(entry => (
                                    <div key={entry.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-left border border-white/5">
                                        <p className="text-sm font-bold text-amber-200/80">{entry.guest_name}</p>
                                        {entry.message && <p className="text-sm text-white/60 italic mt-1">"{entry.message}"</p>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Ambient Particles */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/10 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float ${8 + Math.random() * 12}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 5}s`,
                        }}
                    />
                ))}
            </div>

            {/* Injected Animations */}
            <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.1; }
          50% { transform: translateY(-30px) translateX(10px); opacity: 0.3; }
        }
      `}</style>
        </div>
    );
}

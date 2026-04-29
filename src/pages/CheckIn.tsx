import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { QrCode, Search, UserPlus, Users, Star, CheckCircle2 } from 'lucide-react';
import { checkinAPI } from '../utils/api';
import type { Guest, CheckInStats } from '../types';

export function CheckIn() {
    const { slug } = useParams();
    const [mode, setMode] = useState<'scan' | 'search' | 'manual'>('search');
    const [stats, setStats] = useState<CheckInStats | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Guest[]>([]);
    const [recentCheckin, setRecentCheckin] = useState<{ name: string; message: string } | null>(null);
    const [manualForm, setManualForm] = useState({ name: '', pax: 1 });
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!slug) return;
        checkinAPI.getStats(slug).then((data: any) => setStats(data));

        // Set up SSE for live stats
        const evtSource = new EventSource(`/api/checkin/${slug}/stream`);
        evtSource.addEventListener('init', (e) => {
            const data = JSON.parse(e.data);
            setStats(data.stats);
        });
        evtSource.addEventListener('guest_checked_in', (e) => {
            const data = JSON.parse(e.data);
            setStats(data.stats);
            setRecentCheckin({ name: data.guest.name, message: `Selamat datang!` });
            setTimeout(() => setRecentCheckin(null), 5000);
        });
        return () => evtSource.close();
    }, [slug]);

    const handleSearch = async () => {
        if (!slug || searchQuery.length < 2) return;
        try {
            const data = await checkinAPI.search(slug, searchQuery);
            setSearchResults((data as any).guests || []);
        } catch { }
    };

    const handleManualCheckin = async (guestId: string) => {
        if (!slug) return;
        try {
            const result = await checkinAPI.manualCheckIn(slug, guestId) as any;
            setRecentCheckin({ name: result.guest.name, message: result.message });
            setSearchResults(prev => prev.map(g => g.id === guestId ? { ...g, checked_in_at: new Date().toISOString() } : g));
            if (result.stats) setStats(result.stats);
            setTimeout(() => setRecentCheckin(null), 5000);
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white font-sans">
            {/* Header */}
            <header className="p-4 text-center border-b border-white/10">
                <h1 className="text-xl font-bold">Check-In Tamu</h1>
                {slug && <p className="text-sm text-white/60">{slug}</p>}
            </header>

            {/* Success Toast */}
            {recentCheckin && (
                <div className="fixed top-4 inset-x-4 z-50 bg-green-500 text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-[slideDown_0.3s_ease-out]">
                    <CheckCircle2 className="w-8 h-8 shrink-0" />
                    <div>
                        <p className="font-bold text-lg">{recentCheckin.name}</p>
                        <p className="text-sm text-green-100">{recentCheckin.message}</p>
                    </div>
                </div>
            )}

            {/* Stats Bar */}
            {stats && (
                <div className="grid grid-cols-3 gap-3 p-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                        <Users className="w-5 h-5 mx-auto mb-1 text-blue-300" />
                        <p className="text-2xl font-bold">{stats.checked_in}/{stats.total_guests}</p>
                        <p className="text-[10px] text-white/50 uppercase">Hadir</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                        <Star className="w-5 h-5 mx-auto mb-1 text-yellow-300" />
                        <p className="text-2xl font-bold">{stats.vip_checked_in}/{stats.vip_total}</p>
                        <p className="text-[10px] text-white/50 uppercase">VIP</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                        <Users className="w-5 h-5 mx-auto mb-1 text-green-300" />
                        <p className="text-2xl font-bold">{stats.total_pax}</p>
                        <p className="text-[10px] text-white/50 uppercase">Total Pax</p>
                    </div>
                </div>
            )}

            {/* Mode Tabs */}
            <div className="flex gap-2 px-4 mb-4">
                {[
                    { id: 'search' as const, icon: Search, label: 'Cari Nama' },
                    { id: 'scan' as const, icon: QrCode, label: 'Scan QR' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setMode(tab.id)}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${mode === tab.id ? 'bg-white text-slate-900' : 'bg-white/10 text-white/60'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" /> {tab.label}
                    </button>
                ))}
            </div>

            {/* Search Mode */}
            {mode === 'search' && (
                <div className="px-4 space-y-3">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/50"
                            placeholder="Ketik nama tamu..."
                        />
                        <button onClick={handleSearch} className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold">
                            <Search className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-2">
                        {searchResults.map(guest => (
                            <div key={guest.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between">
                                <div>
                                    <p className="font-bold flex items-center gap-2">
                                        {guest.name}
                                        {guest.is_vip ? <Star className="w-4 h-4 text-yellow-400" fill="currentColor" /> : null}
                                    </p>
                                    <p className="text-sm text-white/50">{guest.pax} orang</p>
                                </div>
                                {guest.checked_in_at ? (
                                    <span className="bg-green-500/20 text-green-300 px-3 py-1.5 rounded-full text-xs font-bold">
                                        ✓ Sudah Hadir
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => handleManualCheckin(guest.id)}
                                        className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-green-400 transition-colors"
                                    >
                                        Check In
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* QR Scan Mode */}
            {mode === 'scan' && (
                <div className="px-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center space-y-4">
                        <QrCode className="w-16 h-16 mx-auto text-white/30" />
                        <p className="text-white/60 text-sm">
                            Fitur QR scanner memerlukan akses kamera. Arahkan kamera ke QR code tamu.
                        </p>
                        <div className="bg-white/5 rounded-xl aspect-square max-w-xs mx-auto flex items-center justify-center border-2 border-dashed border-white/20">
                            <p className="text-white/30 text-xs">Camera Preview</p>
                        </div>
                        <div>
                            <p className="text-xs text-white/40 mb-2">Atau masukkan kode QR manual:</p>
                            <div className="flex gap-2 max-w-xs mx-auto">
                                <input
                                    type="text"
                                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 font-mono focus:outline-none"
                                    placeholder="Token QR..."
                                    onKeyDown={async (e) => {
                                        if (e.key === 'Enter') {
                                            const token = (e.target as HTMLInputElement).value;
                                            if (!token) return;
                                            try {
                                                const result = await checkinAPI.scanQR(token) as any;
                                                setRecentCheckin({ name: result.guest.name, message: result.message });
                                                if (result.stats) setStats(result.stats);
                                                (e.target as HTMLInputElement).value = '';
                                            } catch (err: any) {
                                                alert(err.message || 'QR tidak valid');
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

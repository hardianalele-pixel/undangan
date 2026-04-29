import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { SignatureCanvas } from '../components/SignatureCanvas';
import { SelfieCapture } from '../components/SelfieCapture';
import { guestbookAPI } from '../utils/api';
import { Heart, Pen, Camera, Send, CheckCircle2 } from 'lucide-react';

export function KioskGuestBook() {
    const { slug } = useParams();
    const [currentGuest, setCurrentGuest] = useState<{ id: string; name: string } | null>(null);
    const [message, setMessage] = useState('');
    const [signatureData, setSignatureData] = useState('');
    const [photoData, setPhotoData] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [step, setStep] = useState<'idle' | 'write' | 'sign' | 'photo' | 'confirm'>('idle');
    const [coupleName, setCoupleName] = useState('');

    // Listen for check-in events via SSE
    useEffect(() => {
        if (!slug) return;

        const evtSource = new EventSource(`/api/checkin/${slug}/stream`);
        evtSource.addEventListener('guest_checked_in', (e) => {
            const data = JSON.parse(e.data);
            setCurrentGuest({ id: data.guest.id, name: data.guest.name });
            setStep('write');
            setMessage('');
            setSignatureData('');
            setPhotoData('');
            setSubmitted(false);
        });

        // Also fetch couple name
        fetch(`/api/invitations/${slug}/public`)
            .then(r => r.json())
            .then(data => {
                if (data.meta) {
                    setCoupleName(`${data.meta.groomName} & ${data.meta.brideName}`);
                }
            })
            .catch(() => { });

        return () => evtSource.close();
    }, [slug]);

    const handleSubmit = useCallback(async () => {
        if (!slug || !currentGuest) return;
        setSubmitting(true);
        try {
            await guestbookAPI.submit(slug, {
                guest_id: currentGuest.id,
                guest_name: currentGuest.name,
                message,
                signature_image: signatureData,
                photo: photoData,
            });
            setSubmitted(true);
            setTimeout(() => {
                setStep('idle');
                setCurrentGuest(null);
                setSubmitted(false);
            }, 5000);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    }, [slug, currentGuest, message, signatureData, photoData]);

    // Idle screen
    if (step === 'idle') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 flex items-center justify-center p-8">
                <div className="text-center space-y-8 max-w-2xl animate-pulse">
                    <Heart className="w-20 h-20 mx-auto text-rose-300" />
                    <h1 className="text-5xl md:text-7xl font-bold italic font-serif text-slate-800">
                        Buku Tamu Digital
                    </h1>
                    {coupleName && (
                        <p className="text-2xl text-slate-500 font-serif italic">{coupleName}</p>
                    )}
                    <p className="text-lg text-slate-400 font-sans">
                        Menunggu tamu berikutnya...
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-300">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        Terhubung — siap menerima check-in
                    </div>
                </div>
            </div>
        );
    }

    // Submitted screen
    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-8">
                <div className="text-center space-y-6 animate-[fadeIn_0.5s_ease-out]">
                    <CheckCircle2 className="w-24 h-24 mx-auto text-green-500" />
                    <h2 className="text-4xl font-bold text-green-800 font-serif italic">Terima Kasih!</h2>
                    <p className="text-xl text-green-600">{currentGuest?.name}</p>
                    <p className="text-green-500">Pesan Anda telah tersimpan</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 flex flex-col">
            {/* Kiosk Header */}
            <header className="bg-white/50 backdrop-blur-sm border-b border-slate-200 p-6 text-center">
                <p className="text-sm text-slate-400 uppercase tracking-wider font-sans">Selamat Datang</p>
                <h1 className="text-3xl md:text-4xl font-bold italic font-serif text-slate-800 mt-1">
                    {currentGuest?.name || 'Tamu'}
                </h1>
                <p className="text-slate-400 mt-2 font-sans">Silahkan tinggalkan pesan untuk mempelai ❤️</p>
            </header>

            {/* Content Area */}
            <main className="flex-1 p-6 md:p-12 max-w-5xl mx-auto w-full">
                {/* Steps */}
                <div className="flex items-center justify-center gap-4 mb-8 font-sans text-sm">
                    {[
                        { id: 'write', icon: Pen, label: 'Pesan' },
                        { id: 'sign', icon: Pen, label: 'Tanda Tangan' },
                        { id: 'photo', icon: Camera, label: 'Foto' },
                        { id: 'confirm', icon: Send, label: 'Kirim' },
                    ].map((s, i) => (
                        <button
                            key={s.id}
                            onClick={() => setStep(s.id as any)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${step === s.id ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-400'
                                }`}
                        >
                            <s.icon className="w-4 h-4" />
                            {s.label}
                        </button>
                    ))}
                </div>

                {/* Step: Write Message */}
                {step === 'write' && (
                    <div className="max-w-2xl mx-auto space-y-6">
                        <textarea
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            className="w-full h-48 p-6 text-xl border-2 border-slate-200 rounded-2xl focus:border-slate-800 focus:outline-none resize-none font-serif text-slate-700 bg-white"
                            placeholder="Tulis pesan dan doa untuk mempelai..."
                            autoFocus
                        />
                        <div className="flex justify-end">
                            <button onClick={() => setStep('sign')} className="bg-slate-800 text-white px-8 py-3 rounded-full font-bold font-sans hover:bg-slate-700 transition-colors">
                                Selanjutnya →
                            </button>
                        </div>
                    </div>
                )}

                {/* Step: Signature */}
                {step === 'sign' && (
                    <div className="max-w-2xl mx-auto space-y-6">
                        <p className="text-center text-slate-500 font-sans">Gunakan jari atau stylus untuk menandatangani:</p>
                        <SignatureCanvas
                            onSave={setSignatureData}
                            width={600}
                            height={200}
                        />
                        <div className="flex justify-between">
                            <button onClick={() => setStep('write')} className="text-slate-400 px-6 py-3 font-sans hover:text-slate-600">← Kembali</button>
                            <button onClick={() => setStep('photo')} className="bg-slate-800 text-white px-8 py-3 rounded-full font-bold font-sans hover:bg-slate-700 transition-colors">
                                Selanjutnya →
                            </button>
                        </div>
                    </div>
                )}

                {/* Step: Photo */}
                {step === 'photo' && (
                    <div className="max-w-md mx-auto space-y-6">
                        <p className="text-center text-slate-500 font-sans">Ambil foto selfie (opsional):</p>
                        <SelfieCapture onCapture={setPhotoData} />
                        <div className="flex justify-between">
                            <button onClick={() => setStep('sign')} className="text-slate-400 px-6 py-3 font-sans hover:text-slate-600">← Kembali</button>
                            <button onClick={() => setStep('confirm')} className="bg-slate-800 text-white px-8 py-3 rounded-full font-bold font-sans hover:bg-slate-700 transition-colors">
                                Selanjutnya →
                            </button>
                        </div>
                    </div>
                )}

                {/* Step: Confirm & Submit */}
                {step === 'confirm' && (
                    <div className="max-w-2xl mx-auto space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                            <h3 className="font-bold font-sans text-slate-800">Konfirmasi Pesan Anda</h3>
                            {message && <p className="text-slate-600 font-serif italic">"{message}"</p>}
                            {signatureData && (
                                <div>
                                    <p className="text-xs text-slate-400 font-sans mb-1">Tanda tangan:</p>
                                    <img src={signatureData} alt="Signature" className="h-16 border border-slate-100 rounded" />
                                </div>
                            )}
                            {photoData && (
                                <div>
                                    <p className="text-xs text-slate-400 font-sans mb-1">Foto:</p>
                                    <img src={photoData} alt="Selfie" className="w-32 h-32 object-cover rounded-xl" />
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between">
                            <button onClick={() => setStep('photo')} className="text-slate-400 px-6 py-3 font-sans hover:text-slate-600">← Kembali</button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="bg-rose-500 text-white px-10 py-4 rounded-full font-bold font-sans text-lg hover:bg-rose-400 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                <Send className="w-5 h-5" />
                                {submitting ? 'Mengirim...' : 'Kirim Pesan'}
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';

interface TooltipContent {
    title: string;
    description: string;
}

const TIPS: TooltipContent[] = [
    {
        title: 'Panel Seksi',
        description: 'Klik seksi di sidebar kiri untuk mulai mengedit. Anda bisa menyusun ulang, menyembunyikan, atau menambah seksi baru.',
    },
    {
        title: 'Preview Langsung',
        description: 'Undangan Anda ditampilkan langsung di tengah. Klik blok di preview untuk mengedit secara langsung.',
    },
    {
        title: 'Panel Konfigurasi',
        description: 'Setelah memilih seksi, panel kanan akan menampilkan formulir untuk mengatur konten seksi tersebut.',
    },
    {
        title: 'Simpan & Publikasikan',
        description: 'Gunakan tombol Simpan untuk menyimpan draft, atau Publikasikan untuk membuat undangan dapat diakses publik.',
    },
];

const STORAGE_KEY = 'lathe_onboarding_builder_seen';

interface OnboardingTooltipsProps {
    active: boolean;
}

/**
 * Onboarding tooltip that pops up in the center of the screen
 * and cycles through tips. Non-linear: all tips shown in a
 * card centered on screen, navigated with next/dismiss.
 */
export function OnboardingTooltips({ active }: OnboardingTooltipsProps) {
    const [currentTip, setCurrentTip] = useState(0);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        const seen = localStorage.getItem(STORAGE_KEY);
        if (seen === 'true') {
            setDismissed(true);
        }
    }, []);

    if (!active || dismissed) return null;

    const tip = TIPS[currentTip];
    if (!tip) return null;

    const handleNext = () => {
        if (currentTip < TIPS.length - 1) {
            setCurrentTip(currentTip + 1);
        } else {
            handleDismiss();
        }
    };

    const handleDismiss = () => {
        setDismissed(true);
        localStorage.setItem(STORAGE_KEY, 'true');
    };

    const isLast = currentTip === TIPS.length - 1;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-[1px]"
                onClick={handleDismiss}
            />

            {/* Centered card */}
            <div className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none">
                <div className="pointer-events-auto bg-white rounded-2xl shadow-2xl border border-lathe-ink/10 p-6 max-w-sm w-full mx-4">
                    {/* Step indicator */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-1.5">
                            {TIPS.map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentTip
                                            ? 'bg-lathe-ink w-5'
                                            : i < currentTip
                                                ? 'bg-lathe-ink/30'
                                                : 'bg-lathe-ink/10'
                                        }`}
                                />
                            ))}
                        </div>
                        <button
                            onClick={handleDismiss}
                            className="p-1.5 rounded-lg hover:bg-lathe-ink/5 text-lathe-ink/40 hover:text-lathe-ink transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="mb-5">
                        <h3 className="text-base font-bold text-lathe-ink mb-1.5">
                            {tip.title}
                        </h3>
                        <p className="text-sm text-lathe-ink/60 leading-relaxed">
                            {tip.description}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleDismiss}
                            className="text-xs text-lathe-ink/40 hover:text-lathe-ink/60 transition-colors"
                        >
                            Lewati
                        </button>
                        <button
                            onClick={handleNext}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-lathe-ink text-white rounded-lg hover:bg-lathe-ink/90 transition-colors"
                        >
                            {isLast ? 'Mulai Membangun' : 'Lanjut'}
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

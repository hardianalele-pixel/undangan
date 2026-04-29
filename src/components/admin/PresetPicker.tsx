import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PRESETS, type Preset } from '../../presets';
import { getThemeColors } from '../../utils/themes';
import { DEFAULT_HERO, ALL_PORTRAITS } from '../../utils/defaultImages';

interface PresetPickerProps {
    onSelect: (presetId: string) => void;
}

/**
 * Preset selection screen — each card is a visually distinct "Dribbble shot."
 * Uses preset personality fonts, gradients, and hero layouts.
 * Respects light/dark mode via ThemeContext.
 */
export function PresetPicker({ onSelect }: PresetPickerProps) {
    const navigate = useNavigate();

    // Load all preset fonts
    useEffect(() => {
        const urls = [...new Set(PRESETS.map((p) => p.personality.fontImport))];
        urls.forEach((url) => {
            const existing = document.querySelector(`link[href="${url}"]`);
            if (!existing) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = url;
                document.head.appendChild(link);
            }
        });
    }, []);

    return (
        <div className="min-h-screen bg-lathe-surface dark:bg-lathe-ink text-lathe-ink dark:text-lathe-surface font-sans transition-colors duration-300">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-lathe-surface/80 dark:bg-lathe-ink/80 backdrop-blur-md border-b border-lathe-ink/10 dark:border-lathe-surface/10">
                <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-sm text-lathe-ink/60 dark:text-lathe-surface/60 hover:text-lathe-ink dark:hover:text-lathe-surface transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali
                    </button>
                    <h1 className="text-sm font-bold">Pilih Template</h1>
                    <button
                        onClick={() => onSelect(PRESETS[0].id)}
                        className="text-sm text-lathe-ink/40 dark:text-lathe-surface/40 hover:text-lathe-ink/80 dark:hover:text-lathe-surface/80 transition-colors"
                    >
                        Lewati
                    </button>
                </div>
            </header>

            {/* Hero */}
            <section className="max-w-6xl mx-auto px-6 pt-12 pb-8 text-center">
                <h2 className="text-3xl font-bold tracking-tight">
                    Mulai dengan template
                </h2>
                <p className="mt-3 text-sm text-lathe-ink/60 dark:text-lathe-surface/60 max-w-lg mx-auto leading-relaxed">
                    Setiap template memiliki karakter visual yang unik. Pilih yang paling sesuai dengan gaya acara Anda.
                </p>
            </section>

            {/* Grid */}
            <section className="max-w-6xl mx-auto px-6 pb-16">
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {PRESETS.map((preset, idx) => (
                        <PresetCard
                            key={preset.id}
                            preset={preset}
                            delay={idx * 0.06}
                            imageIndex={idx % ALL_PORTRAITS.length}
                            onSelect={() => onSelect(preset.id)}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}

// ─── Motion configs per style ───────────────────────────────────

const HOVER_MOTION: Record<string, object> = {
    fade: { opacity: [1, 0.85, 1], transition: { duration: 0.6 } },
    'slide-up': { y: -8, transition: { duration: 0.3, ease: 'easeOut' } },
    scale: { scale: 1.03, transition: { duration: 0.3, ease: 'easeOut' } },
    'blur-in': { y: -4, scale: 1.01, transition: { duration: 0.3 } },
};

// ─── Preset Card ────────────────────────────────────────────────

interface PresetCardProps {
    preset: Preset;
    delay: number;
    imageIndex: number;
    onSelect: () => void;
}

const PresetCard: React.FC<PresetCardProps> = ({ preset, delay, imageIndex, onSelect }) => {
    const colors = getThemeColors(preset.theme);
    const { personality } = preset;
    const [groom, bride] = preset.previewNames;
    const previewImage = ALL_PORTRAITS[imageIndex] || DEFAULT_HERO;
    const hoverAnim = HOVER_MOTION[personality.motionStyle] || HOVER_MOTION.fade;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4, ease: 'easeOut' }}
            whileHover={hoverAnim}
            className="group cursor-pointer"
            onClick={onSelect}
        >
            {/* Card */}
            <div
                className="relative rounded-2xl overflow-hidden border border-lathe-ink/10 dark:border-lathe-surface/10 group-hover:border-lathe-ink/30 dark:group-hover:border-lathe-surface/30 transition-all duration-300 group-hover:shadow-2xl"
                style={{ background: personality.cardGradient }}
            >
                <div
                    className="aspect-[9/16] flex flex-col relative overflow-hidden"
                    style={{ color: colors.ink }}
                >
                    {/* Hero area — varies by heroLayout */}
                    <HeroPreview
                        layout={personality.heroLayout}
                        image={previewImage}
                        colors={colors}
                        accent={preset.accent}
                    />

                    {/* Content overlay */}
                    <div className="relative z-10 flex-1 flex flex-col items-center justify-end p-5 pb-6">
                        {/* Subtitle */}
                        <p
                            className="text-[8px] tracking-[0.25em] uppercase font-medium mb-2"
                            style={{ color: colors.ink, opacity: 0.5, fontFamily: personality.fontBody }}
                        >
                            The Wedding Of
                        </p>

                        {/* Couple names in preset's display font */}
                        <div className="text-center">
                            <p
                                className="text-xl font-semibold leading-tight"
                                style={{ fontFamily: personality.fontDisplay, color: colors.ink }}
                            >
                                {groom}
                            </p>
                            <p
                                className="text-sm my-0.5 italic"
                                style={{ color: preset.accent, fontFamily: personality.fontBody }}
                            >
                                &
                            </p>
                            <p
                                className="text-xl font-semibold leading-tight"
                                style={{ fontFamily: personality.fontDisplay, color: colors.ink }}
                            >
                                {bride}
                            </p>
                        </div>

                        <div className="h-px w-8 mx-auto mt-3 mb-2" style={{ backgroundColor: colors.ink, opacity: 0.12 }} />

                        <p
                            className="text-[9px] font-medium tracking-wider"
                            style={{ opacity: 0.5, color: colors.ink, fontFamily: personality.fontBody }}
                        >
                            28 . 03 . 2026
                        </p>
                    </div>

                    {/* Hover CTA */}
                    <div className="absolute inset-0 z-20 bg-black/0 group-hover:bg-black/25 transition-all duration-300 flex items-center justify-center">
                        <span className="text-white text-xs font-bold px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-3 group-hover:translate-y-0 shadow-lg">
                            Gunakan Template
                        </span>
                    </div>
                </div>
            </div>

            {/* Card info */}
            <div className="mt-3 px-1">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-bold">{preset.name}</h3>
                    <span
                        className="text-[9px] font-medium px-1.5 py-0.5 rounded-md"
                        style={{
                            backgroundColor: preset.accent + '15',
                            color: preset.accent,
                        }}
                    >
                        {preset.layout}
                    </span>
                </div>
                <p className="text-xs text-lathe-ink/50 dark:text-lathe-surface/50 line-clamp-1">
                    {preset.description}
                </p>

                {/* Font preview strip */}
                <div className="flex items-center gap-2 mt-2">
                    <span
                        className="text-[10px] text-lathe-ink/30 dark:text-lathe-surface/30"
                        style={{ fontFamily: personality.fontDisplay }}
                    >
                        Aa
                    </span>
                    <span
                        className="text-[10px] text-lathe-ink/30 dark:text-lathe-surface/30"
                        style={{ fontFamily: personality.fontBody }}
                    >
                        Aa
                    </span>
                    <div className="flex-1" />
                    <div className="flex -space-x-1">
                        <div className="w-3 h-3 rounded-full border border-lathe-surface dark:border-lathe-ink" style={{ backgroundColor: colors.surface }} />
                        <div className="w-3 h-3 rounded-full border border-lathe-surface dark:border-lathe-ink" style={{ backgroundColor: preset.accent }} />
                        <div className="w-3 h-3 rounded-full border border-lathe-surface dark:border-lathe-ink" style={{ backgroundColor: colors.ink }} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// ─── Hero Preview Layouts ───────────────────────────────────────

function HeroPreview({
    layout,
    image,
    colors,
    accent,
}: {
    layout: string;
    image: string;
    colors: { surface: string; ink: string; yellow: string };
    accent: string;
}) {
    switch (layout) {
        case 'arch-frame':
            return (
                <div className="relative h-[55%] flex items-center justify-center p-5" style={{ backgroundColor: colors.surface }}>
                    {/* Arch frame */}
                    <div
                        className="w-[65%] h-full rounded-t-full overflow-hidden border-2 shadow-inner"
                        style={{ borderColor: accent + '40' }}
                    >
                        <img src={image} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    {/* Decorative corner ornaments */}
                    <div className="absolute top-3 left-3 w-6 h-6 border-t border-l" style={{ borderColor: accent + '25' }} />
                    <div className="absolute top-3 right-3 w-6 h-6 border-t border-r" style={{ borderColor: accent + '25' }} />
                </div>
            );

        case 'split-screen':
            return (
                <div className="relative h-[55%] flex">
                    <div className="w-1/2 overflow-hidden">
                        <img src={image} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div
                        className="w-1/2 flex items-center justify-center p-3"
                        style={{ backgroundColor: colors.surface }}
                    >
                        <div className="w-px h-12" style={{ backgroundColor: accent + '30' }} />
                    </div>
                </div>
            );

        case 'full-bleed':
            return (
                <div className="relative h-[55%]">
                    <img src={image} alt="" className="w-full h-full object-cover" loading="lazy" />
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(to bottom, transparent 30%, ${colors.surface})`
                        }}
                    />
                </div>
            );

        case 'centered':
        default:
            return (
                <div className="relative h-[55%] flex items-center justify-center p-6" style={{ backgroundColor: colors.surface }}>
                    <div className="w-[55%] aspect-square rounded-full overflow-hidden border-2 shadow-lg" style={{ borderColor: accent + '30' }}>
                        <img src={image} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </div>
                </div>
            );
    }
}

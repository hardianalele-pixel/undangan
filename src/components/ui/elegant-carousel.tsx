import React, { useState, useEffect, useRef, useCallback } from 'react';

interface SlideData {
    title: string;
    subtitle: string;
    description: string;
    accent: string;
    imageUrl: string;
}

interface ElegantCarouselProps {
    slides: SlideData[];
    autoPlayDuration?: number;
}

export function ElegantCarousel({
    slides,
    autoPlayDuration = 6000,
}: ElegantCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [direction, setDirection] = useState<'next' | 'prev'>('next');
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const TRANSITION_DURATION = 800;

    const goToSlide = useCallback(
        (index: number, dir?: 'next' | 'prev') => {
            if (isTransitioning || index === currentIndex) return;
            setDirection(dir || (index > currentIndex ? 'next' : 'prev'));
            setIsTransitioning(true);
            setProgress(0);

            setTimeout(() => {
                setCurrentIndex(index);
                setTimeout(() => {
                    setIsTransitioning(false);
                }, 50);
            }, TRANSITION_DURATION / 2);
        },
        [isTransitioning, currentIndex]
    );

    const goNext = useCallback(() => {
        const nextIndex = (currentIndex + 1) % slides.length;
        goToSlide(nextIndex, 'next');
    }, [currentIndex, slides.length, goToSlide]);

    const goPrev = useCallback(() => {
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(prevIndex, 'prev');
    }, [currentIndex, slides.length, goToSlide]);

    useEffect(() => {
        if (isPaused) return;

        progressRef.current = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) return 100;
                return prev + 100 / (autoPlayDuration / 50);
            });
        }, 50);

        intervalRef.current = setInterval(() => {
            goNext();
        }, autoPlayDuration);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (progressRef.current) clearInterval(progressRef.current);
        };
    }, [currentIndex, isPaused, goNext, autoPlayDuration]);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };
    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };
    const handleTouchEnd = () => {
        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > 60) {
            diff > 0 ? goNext() : goPrev();
        }
    };

    const currentSlide = slides[currentIndex];

    return (
        <div
            className="relative w-full max-w-5xl mx-auto overflow-hidden bg-lathe-surface dark:bg-lathe-ink text-lathe-ink dark:text-lathe-surface rounded-3xl border border-lathe-ink/10 dark:border-lathe-surface/10"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Background accent wash */}
            <div
                className="absolute inset-0 pointer-events-none transition-all duration-700 opacity-10"
                style={{
                    background: `radial-gradient(ellipse at 70% 50%, ${currentSlide.accent} 0%, transparent 70%)`,
                }}
            />

            <div className="relative flex flex-col-reverse items-center gap-8 p-6 min-h-[500px]">
                {/* Left: Text Content */}
                <div className="flex-1 space-y-4 z-10">
                    <div
                        className={`flex items-center gap-3 text-xs font-mono tracking-wider uppercase transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-60 translate-y-0'
                            }`}
                    >
                        <span className="w-8 h-px bg-current" />
                        <span>
                            {String(currentIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                        </span>
                    </div>

                    <h2
                        className={`text-3xl font-bold tracking-tight transition-all duration-600 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                            }`}
                        style={{ transitionDelay: isTransitioning ? '0ms' : '100ms' }}
                    >
                        {currentSlide.title}
                    </h2>

                    <p
                        className={`text-sm font-semibold uppercase tracking-[0.2em] transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'
                            }`}
                        style={{
                            color: currentSlide.accent,
                            transitionDelay: isTransitioning ? '0ms' : '200ms',
                        }}
                    >
                        {currentSlide.subtitle}
                    </p>

                    <p
                        className={`text-sm leading-relaxed max-w-md transition-all duration-500 opacity-60 ${isTransitioning ? 'opacity-0 translate-y-3' : 'translate-y-0'
                            }`}
                        style={{ transitionDelay: isTransitioning ? '0ms' : '300ms' }}
                    >
                        {currentSlide.description}
                    </p>

                    {/* Navigation Arrows */}
                    <div className="flex items-center gap-3 pt-4">
                        <button
                            onClick={goPrev}
                            className="w-10 h-10 rounded-full border border-lathe-ink/20 dark:border-lathe-surface/20 flex items-center justify-center hover:bg-lathe-ink/5 dark:hover:bg-lathe-surface/10 transition-colors"
                            aria-label="Previous slide"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={goNext}
                            className="w-10 h-10 rounded-full border border-lathe-ink/20 dark:border-lathe-surface/20 flex items-center justify-center hover:bg-lathe-ink/5 dark:hover:bg-lathe-surface/10 transition-colors"
                            aria-label="Next slide"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Right: Image */}
                <div className="flex-1 relative w-full shrink-0">
                    <div className={`relative overflow-hidden rounded-xl transition-all duration-700 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                        <img
                            src={currentSlide.imageUrl}
                            alt={currentSlide.title}
                            className="w-full h-[300px] sm:h-[400px] object-cover"
                            referrerPolicy="no-referrer"
                        />
                        <div
                            className="absolute inset-0 opacity-20"
                            style={{
                                background: `linear-gradient(135deg, ${currentSlide.accent} 0%, transparent 50%)`,
                            }}
                        />
                    </div>

                    {/* Decorative frame corners */}
                    <div
                        className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2"
                        style={{ borderColor: currentSlide.accent }}
                    />
                    <div
                        className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2"
                        style={{ borderColor: currentSlide.accent }}
                    />
                </div>
            </div>

            {/* Progress Indicators */}
            <div className="flex items-center gap-4 px-6 pb-6 w-full max-w-md mx-auto">
                {slides.map((slide, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`flex-1 text-left group ${index === currentIndex ? 'opacity-100' : 'opacity-40 hover:opacity-60'} transition-opacity`}
                        aria-label={`Go to slide ${index + 1}`}
                    >
                        <div className="h-0.5 bg-lathe-ink/20 dark:bg-lathe-surface/20 rounded-full overflow-hidden mb-2">
                            <div
                                className="h-full rounded-full transition-all duration-200"
                                style={{
                                    width: index === currentIndex ? `${progress}%` : index < currentIndex ? '100%' : '0%',
                                    backgroundColor: index === currentIndex ? currentSlide.accent : 'currentColor',
                                }}
                            />
                        </div>
                        <span className="text-[10px] font-medium tracking-wide">{slide.title}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export type { SlideData };

/**
 * Reusable decorative SVG components for wedding invitation blocks.
 * These replace the need for external image assets.
 */
import React from 'react';

interface OrnamentProps {
    color?: string;
    className?: string;
    opacity?: number;
}

/**
 * Floral corner ornament -- top-left orientation. Rotate for other corners.
 */
export function FloralCorner({ color = 'currentColor', className = '', opacity = 0.3 }: OrnamentProps) {
    return (
        <svg
            viewBox="0 0 120 120"
            fill="none"
            className={className}
            style={{ opacity }}
        >
            <path
                d="M0 0 C20 5, 35 15, 45 30 C50 40, 48 50, 40 55 C35 58, 28 56, 25 50 C22 44, 25 38, 30 36 C38 32, 45 35, 48 42"
                stroke={color}
                strokeWidth="1.5"
                fill="none"
            />
            <path
                d="M0 0 C5 20, 15 35, 30 45 C40 50, 50 48, 55 40 C58 35, 56 28, 50 25 C44 22, 38 25, 36 30 C32 38, 35 45, 42 48"
                stroke={color}
                strokeWidth="1.5"
                fill="none"
            />
            <circle cx="25" cy="25" r="2" fill={color} />
            <circle cx="15" cy="15" r="1.5" fill={color} />
            <circle cx="40" cy="10" r="1" fill={color} />
            <circle cx="10" cy="40" r="1" fill={color} />
        </svg>
    );
}

/**
 * Horizontal ornamental divider with central element.
 */
export function OrnamentalDivider({
    color = 'currentColor',
    className = '',
    opacity = 0.3,
    variant = 'classic',
}: OrnamentProps & { variant?: 'classic' | 'floral' | 'geometric' | 'simple' }) {
    if (variant === 'simple') {
        return (
            <div className={`flex items-center gap-3 ${className}`} style={{ opacity }}>
                <div className="flex-1 h-px" style={{ backgroundColor: color }} />
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                <div className="flex-1 h-px" style={{ backgroundColor: color }} />
            </div>
        );
    }

    if (variant === 'geometric') {
        return (
            <div className={`flex items-center justify-center gap-2 ${className}`} style={{ opacity }}>
                <div className="w-12 h-px" style={{ backgroundColor: color }} />
                <div className="w-2 h-2 rotate-45 border" style={{ borderColor: color }} />
                <div className="w-2 h-2 rotate-45" style={{ backgroundColor: color }} />
                <div className="w-2 h-2 rotate-45 border" style={{ borderColor: color }} />
                <div className="w-12 h-px" style={{ backgroundColor: color }} />
            </div>
        );
    }

    if (variant === 'floral') {
        return (
            <svg viewBox="0 0 200 24" className={className} style={{ opacity }}>
                <line x1="0" y1="12" x2="70" y2="12" stroke={color} strokeWidth="0.5" />
                <path d="M80 12 C85 6, 95 6, 100 12 C105 18, 115 18, 120 12" stroke={color} strokeWidth="1" fill="none" />
                <circle cx="100" cy="12" r="2" fill={color} />
                <line x1="130" y1="12" x2="200" y2="12" stroke={color} strokeWidth="0.5" />
            </svg>
        );
    }

    // Classic
    return (
        <div className={`flex items-center justify-center gap-3 ${className}`} style={{ opacity }}>
            <div className="flex items-center gap-1">
                <div className="w-8 h-px" style={{ backgroundColor: color }} />
                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: color }} />
                <div className="w-3 h-px" style={{ backgroundColor: color }} />
            </div>
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                <path
                    d="M12 4 C14 6, 16 10, 16 12 C16 14, 14 16, 12 18 C10 16, 8 14, 8 12 C8 10, 10 6, 12 4Z"
                    stroke={color}
                    strokeWidth="1"
                    fill="none"
                />
                <circle cx="12" cy="12" r="1.5" fill={color} />
            </svg>
            <div className="flex items-center gap-1">
                <div className="w-3 h-px" style={{ backgroundColor: color }} />
                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: color }} />
                <div className="w-8 h-px" style={{ backgroundColor: color }} />
            </div>
        </div>
    );
}

/**
 * Photo frame component with various shapes via CSS clip-path.
 */
export function PhotoFrame({
    src,
    alt,
    shape = 'rectangle',
    className = '',
    borderColor = 'currentColor',
    borderWidth = 2,
}: {
    src: string;
    alt: string;
    shape?: 'rectangle' | 'arch' | 'circle' | 'hexagon' | 'oval';
    className?: string;
    borderColor?: string;
    borderWidth?: number;
}) {
    const clipPaths: Record<string, string> = {
        rectangle: 'none',
        arch: 'polygon(0% 30%, 5% 15%, 15% 5%, 30% 0%, 70% 0%, 85% 5%, 95% 15%, 100% 30%, 100% 100%, 0% 100%)',
        circle: 'circle(50% at 50% 50%)',
        hexagon: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
        oval: 'ellipse(45% 50% at 50% 50%)',
    };

    return (
        <div className={`relative inline-block ${className}`}>
            {/* Border frame */}
            <div
                className="absolute inset-0"
                style={{
                    clipPath: clipPaths[shape],
                    border: `${borderWidth}px solid ${borderColor}`,
                    borderRadius: shape === 'rectangle' ? '0.5rem' : undefined,
                }}
            />
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                style={{
                    clipPath: clipPaths[shape] !== 'none' ? clipPaths[shape] : undefined,
                    borderRadius: shape === 'rectangle' ? '0.5rem' : undefined,
                }}
            />
        </div>
    );
}

/**
 * Background pattern overlay using CSS gradients.
 */
export function BackgroundPattern({
    pattern = 'none',
    color = '#000000',
    className = '',
}: {
    pattern: 'none' | 'dots' | 'lines' | 'crosses' | 'diagonal';
    color?: string;
    className?: string;
}) {
    const patterns: Record<string, string> = {
        none: 'none',
        dots: `radial-gradient(color-mix(in srgb, ${color} 10%, transparent) 1px, transparent 1px)`,
        lines: `repeating-linear-gradient(0deg, transparent, transparent 19px, color-mix(in srgb, ${color} 8%, transparent) 19px, color-mix(in srgb, ${color} 8%, transparent) 20px)`,
        crosses: `radial-gradient(color-mix(in srgb, ${color} 10%, transparent) 1.5px, transparent 1.5px), radial-gradient(color-mix(in srgb, ${color} 10%, transparent) 1.5px, transparent 1.5px)`,
        diagonal: `repeating-linear-gradient(45deg, transparent, transparent 14px, color-mix(in srgb, ${color} 6%, transparent) 14px, color-mix(in srgb, ${color} 6%, transparent) 15px)`,
    };

    const sizes: Record<string, string | undefined> = {
        none: undefined,
        dots: '20px 20px',
        lines: undefined,
        crosses: '20px 20px',
        diagonal: undefined,
    };

    if (pattern === 'none') return null;

    return (
        <div
            className={`absolute inset-0 pointer-events-none ${className}`}
            style={{
                backgroundImage: patterns[pattern],
                backgroundSize: sizes[pattern],
            }}
        />
    );
}

/**
 * Batik-inspired decorative border for ornate presets.
 */
export function BatikBorder({
    color = 'currentColor',
    className = '',
    side = 'top',
}: {
    color?: string;
    className?: string;
    side?: 'top' | 'bottom' | 'left' | 'right';
}) {
    const isHorizontal = side === 'top' || side === 'bottom';

    return (
        <svg
            viewBox={isHorizontal ? '0 0 400 20' : '0 0 20 400'}
            className={className}
            preserveAspectRatio="none"
            style={{ opacity: 0.2 }}
        >
            {isHorizontal ? (
                <>
                    {Array.from({ length: 20 }).map((_, i) => (
                        <g key={i} transform={`translate(${i * 20}, 0)`}>
                            <path d="M0 10 L5 0 L10 10 L15 0 L20 10" stroke={color} strokeWidth="0.5" fill="none" />
                            <circle cx="10" cy="10" r="1" fill={color} />
                        </g>
                    ))}
                </>
            ) : (
                <>
                    {Array.from({ length: 20 }).map((_, i) => (
                        <g key={i} transform={`translate(0, ${i * 20})`}>
                            <path d="M10 0 L0 5 L10 10 L0 15 L10 20" stroke={color} strokeWidth="0.5" fill="none" />
                            <circle cx="10" cy="10" r="1" fill={color} />
                        </g>
                    ))}
                </>
            )}
        </svg>
    );
}

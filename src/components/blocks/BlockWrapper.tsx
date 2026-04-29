import React, { useRef, useEffect } from 'react';
import { cn } from '../Button';

interface BlockWrapperProps {
    blockId: string;
    blockLabel: string;
    isSelected: boolean;
    isBuilder: boolean;
    onSelect?: (blockId: string) => void;
    children: React.ReactNode;
    className?: string;
}

/**
 * Wraps each block in the visual builder with interactive overlays.
 * In builder mode: click-to-select, hover outlines, and selection highlights.
 * In public mode: renders children without any decoration.
 */
export function BlockWrapper({
    blockId,
    blockLabel,
    isSelected,
    isBuilder,
    onSelect,
    children,
    className,
}: BlockWrapperProps) {
    const ref = useRef<HTMLDivElement>(null);

    // Removed aggressive scrollIntoView that caused disruptive jumping
    // The user will scroll the preview canvas manually.

    if (!isBuilder) {
        return <div data-block-id={blockId}>{children}</div>;
    }

    return (
        <div
            ref={ref}
            data-block-id={blockId}
            className={cn(
                'relative group cursor-pointer transition-all duration-150',
                isSelected && 'ring-2 ring-blue-500 ring-offset-1',
                className
            )}
            onClick={(e) => {
                e.stopPropagation();
                onSelect?.(blockId);
            }}
        >
            {/* Hover overlay */}
            <div
                className={cn(
                    'absolute inset-0 z-10 pointer-events-none transition-all duration-150',
                    isSelected
                        ? 'border-2 border-blue-500'
                        : 'border border-dashed border-transparent group-hover:border-blue-300'
                )}
            />

            {/* Block label badge */}
            <div
                className={cn(
                    'absolute top-0 left-0 z-20 px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase pointer-events-none transition-all duration-150',
                    isSelected
                        ? 'bg-blue-500 text-white opacity-100'
                        : 'bg-blue-500/80 text-white opacity-0 group-hover:opacity-100'
                )}
            >
                {blockLabel}
            </div>

            {children}
        </div>
    );
}

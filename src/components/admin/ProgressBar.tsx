import React from 'react';

interface ProgressBarProps {
    completed: number;
    total: number;
}

/**
 * Displays the invitation completion progress.
 * Shows a simple fill bar without confusing step text.
 */
export function ProgressBar({ completed, total }: ProgressBarProps) {
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <div className="flex items-center gap-2 text-xs" title={`${completed} dari ${total} seksi terisi`}>
            <div className="w-24 h-1.5 bg-lathe-ink/10 rounded-full overflow-hidden">
                <div
                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className="text-lathe-ink/40 font-medium tabular-nums">{pct}%</span>
        </div>
    );
}

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Loader2, X } from 'lucide-react';

interface ConfirmModalProps {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'neutral';
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmModal({
    open,
    title,
    message,
    confirmLabel = 'Konfirmasi',
    cancelLabel = 'Batal',
    variant = 'neutral',
    loading = false,
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={!loading ? onCancel : undefined}
                    />

                    {/* Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10 bg-lathe-surface dark:bg-lathe-ink rounded-xl shadow-2xl border border-lathe-ink/10 dark:border-lathe-surface/10 w-full max-w-sm mx-4 overflow-hidden"
                    >
                        <div className="p-6">
                            {/* Icon */}
                            {variant === 'danger' && (
                                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-4">
                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                </div>
                            )}

                            <h3 className="text-base font-bold text-lathe-ink dark:text-lathe-surface mb-1.5">
                                {title}
                            </h3>
                            <p className="text-sm text-lathe-ink/60 dark:text-lathe-surface/60 leading-relaxed">
                                {message}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 px-6 pb-6">
                            <button
                                onClick={onCancel}
                                disabled={loading}
                                className="flex-1 h-9 text-sm font-medium border border-lathe-ink/15 dark:border-lathe-surface/15 rounded-lg hover:bg-lathe-ink/5 dark:hover:bg-lathe-surface/10 transition-colors disabled:opacity-50 text-lathe-ink dark:text-lathe-surface"
                            >
                                {cancelLabel}
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={loading}
                                className={`flex-1 h-9 text-sm font-bold rounded-lg transition-colors disabled:opacity-70 flex items-center justify-center gap-2 ${variant === 'danger'
                                    ? 'bg-red-500 text-white hover:bg-red-600'
                                    : 'bg-lathe-ink text-lathe-surface hover:bg-lathe-ink/90'
                                    }`}
                            >
                                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                {confirmLabel}
                            </button>
                        </div>

                        {/* Close button */}
                        {!loading && (
                            <button
                                onClick={onCancel}
                                className="absolute top-4 right-4 p-1 rounded-md text-lathe-ink/30 dark:text-lathe-surface/30 hover:text-lathe-ink/60 dark:hover:text-lathe-surface/60 hover:bg-lathe-ink/5 dark:hover:bg-lathe-surface/10 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

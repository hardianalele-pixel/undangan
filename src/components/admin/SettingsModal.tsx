import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Palette } from 'lucide-react';
import { cn } from '../Button';
import { Input } from '../Input';
import { MediaInput } from '../MediaInput';
import { PRESETS } from '../../presets';
import type { InvitationMeta, ThemeConfig } from '../../types';

const THEMES = [
    { id: 'elegant', name: 'Bawaan', color: '#D4AF37', bg: '#FAF8F3' },
    { id: 'terracotta', name: 'Terracotta', color: '#C35B3C', bg: '#FDFBF7' },
    { id: 'sage', name: 'Sage', color: '#8A9A86', bg: '#F9FAF8' },
    { id: 'nord', name: 'Navy', color: '#ebcb8b', bg: '#2e3440' },
    { id: 'rose-pine', name: 'Rose', color: '#f6c177', bg: '#191724' },
    { id: 'catppuccin-mocha', name: 'Mocha', color: '#f9e2af', bg: '#1e1e2e' },
];

interface SettingsModalProps {
    open: boolean;
    meta: InvitationMeta;
    slug: string;
    status: string;
    themeConfig: ThemeConfig;
    isEditing: boolean;
    onUpdateMeta: (field: string, value: any) => void;
    onUpdateSlug: (slug: string) => void;
    onUpdateTheme: (config: Partial<ThemeConfig>) => void;
    onApplyPreset: (presetId: string) => void;
    onClose: () => void;
}

export function SettingsModal({
    open,
    meta,
    slug,
    status,
    themeConfig,
    isEditing,
    onUpdateMeta,
    onUpdateSlug,
    onUpdateTheme,
    onApplyPreset,
    onClose,
}: SettingsModalProps) {
    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />

                    {/* Drawer from right */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 bottom-0 w-[400px] max-w-[90vw] bg-lathe-surface dark:bg-lathe-ink text-lathe-ink dark:text-lathe-surface shadow-2xl z-50 flex flex-col transition-colors border-l border-lathe-ink/10 dark:border-lathe-surface/10"
                    >
                        {/* Header */}
                        <div className="h-14 flex items-center justify-between px-5 border-b border-lathe-ink/10 dark:border-lathe-surface/10 flex-shrink-0">
                            <h3 className="text-sm font-bold text-lathe-ink dark:text-lathe-surface">Pengaturan Undangan</h3>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-md hover:bg-lathe-ink/5 dark:hover:bg-lathe-surface/10 text-lathe-ink/40 dark:text-lathe-surface/40 hover:text-lathe-ink dark:hover:text-lathe-surface transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-6">
                            {/* Identity */}
                            <FieldGroup label="Identitas Pasangan">
                                <div className="grid grid-cols-2 gap-3">
                                    <Input label="Nama Pria" value={meta.groomName} onChange={(e) => onUpdateMeta('groomName', e.target.value)} placeholder="Adit" />
                                    <Input label="Nama Wanita" value={meta.brideName} onChange={(e) => onUpdateMeta('brideName', e.target.value)} placeholder="Siti" />
                                </div>
                                <Input label="Slug URL" value={slug} onChange={(e) => onUpdateSlug(e.target.value)} placeholder="adit-siti" className="font-mono" />
                            </FieldGroup>

                            {/* Event */}
                            <FieldGroup label="Detail Acara">
                                <div className="grid grid-cols-2 gap-3">
                                    <Input label="Tanggal" type="date" value={meta.eventDate} onChange={(e) => onUpdateMeta('eventDate', e.target.value)} />
                                    <Input label="Waktu" type="time" value={meta.eventTime} onChange={(e) => onUpdateMeta('eventTime', e.target.value)} />
                                </div>
                                <Input label="Tempat" value={meta.venueName} onChange={(e) => onUpdateMeta('venueName', e.target.value)} placeholder="Grand Ballroom" />
                                <Input label="Google Maps" type="url" value={meta.googleMapsLink} onChange={(e) => onUpdateMeta('googleMapsLink', e.target.value)} placeholder="https://maps.google.com/..." />
                            </FieldGroup>

                            {/* Contact */}
                            <FieldGroup label="Kontak dan Media">
                                <Input label="WhatsApp RSVP" type="tel" value={meta.whatsappNumber} onChange={(e) => onUpdateMeta('whatsappNumber', e.target.value)} placeholder="6281234567890" />
                                <MediaInput label="QRIS Barcode" value={meta.qrisBarcode || ''} onChange={(v) => onUpdateMeta('qrisBarcode', v)} accept="image/*" type="qris" />
                            </FieldGroup>

                            {/* Theme */}
                            <FieldGroup label="Tema Warna">
                                <div className="grid grid-cols-3 gap-2">
                                    {THEMES.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => onUpdateTheme({ theme: t.id })}
                                            className={cn(
                                                'flex flex-col items-center gap-1.5 p-2.5 rounded-lg border text-xs transition-all',
                                                themeConfig.theme === t.id
                                                    ? 'border-lathe-ink dark:border-lathe-surface bg-lathe-ink/5 dark:bg-lathe-surface/10 font-bold'
                                                    : 'border-lathe-ink/10 dark:border-lathe-surface/10 hover:border-lathe-ink/30 dark:hover:border-lathe-surface/30'
                                            )}
                                        >
                                            <div className="flex rounded-full overflow-hidden w-6 h-6 flex-shrink-0 border border-lathe-ink/5 dark:border-lathe-surface/5">
                                                <div className="w-1/2 h-full" style={{ backgroundColor: t.bg }} />
                                                <div className="w-1/2 h-full" style={{ backgroundColor: t.color }} />
                                            </div>
                                            {t.name}
                                        </button>
                                    ))}
                                </div>
                            </FieldGroup>

                            {/* Presets */}
                            <FieldGroup label="Preset Template">
                                <div className="space-y-1.5">
                                    {PRESETS.map((p) => (
                                        <button
                                            key={p.id}
                                            onClick={() => !isEditing && onApplyPreset(p.id)}
                                            disabled={isEditing}
                                            className={cn(
                                                'w-full text-left px-3 py-2.5 rounded-md text-xs border transition-all',
                                                themeConfig.preset === p.id
                                                    ? 'border-lathe-ink dark:border-lathe-surface bg-lathe-ink/5 dark:bg-lathe-surface/10 text-lathe-ink dark:text-lathe-surface font-bold'
                                                    : 'border-lathe-ink/10 dark:border-lathe-surface/10 hover:border-lathe-ink/30 dark:hover:border-lathe-surface/30',
                                                isEditing && themeConfig.preset !== p.id && 'opacity-40 cursor-not-allowed'
                                            )}
                                        >
                                            <span className="font-medium">{p.name}</span>
                                            <span className="opacity-50 ml-2">({p.blocks.length} seksi)</span>
                                        </button>
                                    ))}
                                </div>
                                {isEditing && (
                                    <p className="text-[10px] text-lathe-ink/50 dark:text-lathe-surface/50 mt-1">
                                        Preset tidak dapat diubah setelah undangan dibuat.
                                    </p>
                                )}
                            </FieldGroup>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-2.5">
            <p className="text-[10px] font-bold text-lathe-ink/50 dark:text-lathe-surface/50 uppercase tracking-widest">{label}</p>
            <div className="space-y-2.5">{children}</div>
        </div>
    );
}

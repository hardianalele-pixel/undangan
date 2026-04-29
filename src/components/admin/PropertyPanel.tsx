import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { Input } from '../Input';
import { MediaInput } from '../MediaInput';
import type { Block, InvitationMeta } from '../../types';

interface PropertyPanelProps {
    activeBlock: Block | null;
    meta: InvitationMeta;
    onUpdateBlockConfig: (blockId: string, key: string, value: any) => void;
    onDeleteBlock: (blockId: string) => void;
    onUpdateMeta: (field: string, value: any) => void;
    onClose: () => void;
}

/**
 * Right panel for the visual builder.
 * Shows contextual config for the selected block.
 * Hero block includes cover image + audio editing (most critical visual elements).
 */
export function PropertyPanel({
    activeBlock,
    meta,
    onUpdateBlockConfig,
    onDeleteBlock,
    onUpdateMeta,
    onClose,
}: PropertyPanelProps) {
    if (!activeBlock) return null;

    return (
        <aside className="w-[340px] flex-shrink-0 bg-lathe-surface dark:bg-lathe-ink text-lathe-ink dark:text-lathe-surface border-l border-lathe-ink/10 dark:border-lathe-surface/10 flex flex-col h-full overflow-hidden transition-colors">
            {/* Panel header */}
            <div className="h-12 flex items-center justify-between px-4 border-b border-lathe-ink/10 dark:border-lathe-surface/10 flex-shrink-0">
                <h3 className="text-xs font-bold uppercase tracking-widest text-lathe-ink/50 dark:text-lathe-surface/50">
                    {getBlockLabel(activeBlock.type)}
                </h3>
                <button
                    onClick={onClose}
                    className="p-1 rounded hover:bg-lathe-ink/5 dark:hover:bg-lathe-surface/10 text-lathe-ink/40 hover:text-lathe-ink dark:text-lathe-surface/40 dark:hover:text-lathe-surface transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Panel content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {renderBlockFields(activeBlock.type, activeBlock.config, (key, value) => onUpdateBlockConfig(activeBlock.id, key, value), meta, onUpdateMeta)}

                <div className="pt-4 border-t border-lathe-ink/10 dark:border-lathe-surface/10">
                    <button
                        onClick={() => onDeleteBlock(activeBlock.id)}
                        className="flex items-center gap-2 text-xs text-red-500 hover:text-red-700 transition-colors"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Hapus seksi ini
                    </button>
                </div>
            </div>
        </aside>
    );
}

// ---------------------------------------------------------------------------
// Block config forms
// ---------------------------------------------------------------------------

function renderBlockFields(
    type: string,
    cfg: any,
    onUpdate: (key: string, value: any) => void,
    meta: InvitationMeta,
    onUpdateMeta: (field: string, value: any) => void
) {
    switch (type) {
        case 'hero':
            return (
                <div className="space-y-4">
                    <FieldGroup label="Foto Sampul">
                        <MediaInput
                            label="Foto utama undangan"
                            value={meta.heroImage || ''}
                            onChange={(v) => onUpdateMeta('heroImage', v)}
                            accept="image/*"
                            type="image"
                        />
                    </FieldGroup>
                    <FieldGroup label="Musik Latar">
                        <MediaInput
                            label="Audio yang diputar saat dibuka"
                            value={meta.audioUrl || ''}
                            onChange={(v) => onUpdateMeta('audioUrl', v)}
                            accept="audio/*"
                            type="audio"
                        />
                    </FieldGroup>
                    <FieldGroup label="Teks">
                        <Input
                            label="Subtitle"
                            value={cfg.subtitle || ''}
                            onChange={(e) => onUpdate('subtitle', e.target.value)}
                            placeholder="Pernikahan"
                        />
                    </FieldGroup>
                    <Checkbox
                        label="Tampilkan nama tamu"
                        checked={cfg.showGuestName !== false}
                        onChange={(v) => onUpdate('showGuestName', v)}
                    />
                </div>
            );

        case 'couple':
            return (
                <div className="space-y-4">
                    <FieldGroup label="Profil Pria">
                        <Input label="Nama lengkap" value={cfg.groomFull || ''} onChange={(e) => onUpdate('groomFull', e.target.value)} placeholder="Ahmad bin Abdullah" />
                        <Input label="Orang tua" value={cfg.groomParents || ''} onChange={(e) => onUpdate('groomParents', e.target.value)} placeholder="Bpk. Abdullah & Ibu Fatimah" />
                        <MediaInput label="Foto" value={cfg.groomPhoto || ''} onChange={(v) => onUpdate('groomPhoto', v)} accept="image/*" type="image" />
                    </FieldGroup>
                    <FieldGroup label="Profil Wanita">
                        <Input label="Nama lengkap" value={cfg.brideFull || ''} onChange={(e) => onUpdate('brideFull', e.target.value)} />
                        <Input label="Orang tua" value={cfg.brideParents || ''} onChange={(e) => onUpdate('brideParents', e.target.value)} />
                        <MediaInput label="Foto" value={cfg.bridePhoto || ''} onChange={(v) => onUpdate('bridePhoto', v)} accept="image/*" type="image" />
                    </FieldGroup>
                </div>
            );

        case 'event':
            return (
                <div className="space-y-4">
                    <FieldGroup label="Akad Nikah">
                        <Checkbox label="Tampilkan" checked={cfg.showAkad !== false} onChange={(v) => onUpdate('showAkad', v)} />
                        <Input label="Waktu" type="time" value={cfg.akadTime || ''} onChange={(e) => onUpdate('akadTime', e.target.value)} />
                        <Input label="Tempat" value={cfg.akadVenue || ''} onChange={(e) => onUpdate('akadVenue', e.target.value)} />
                    </FieldGroup>
                    <FieldGroup label="Resepsi">
                        <Checkbox label="Tampilkan" checked={cfg.showResepsi !== false} onChange={(v) => onUpdate('showResepsi', v)} />
                        <Input label="Waktu" type="time" value={cfg.resepsiTime || ''} onChange={(e) => onUpdate('resepsiTime', e.target.value)} />
                        <Input label="Tempat" value={cfg.resepsiVenue || ''} onChange={(e) => onUpdate('resepsiVenue', e.target.value)} />
                    </FieldGroup>
                </div>
            );

        case 'countdown':
            return (
                <Input
                    label="Label"
                    value={cfg.label || ''}
                    onChange={(e) => onUpdate('label', e.target.value)}
                    placeholder="Menuju Hari Bahagia"
                />
            );

        case 'quote':
            return (
                <div className="space-y-3">
                    <div>
                        <label className="text-xs font-medium text-neutral-500 block mb-1">Teks Kutipan</label>
                        <textarea
                            value={cfg.text || ''}
                            onChange={(e) => onUpdate('text', e.target.value)}
                            className="w-full bg-lathe-surface dark:bg-lathe-ink text-lathe-ink dark:text-lathe-surface border border-lathe-ink/20 dark:border-lathe-surface/20 rounded-md p-2.5 text-sm min-h-[80px] resize-none focus:outline-none focus:border-lathe-primary transition-colors"
                        />
                    </div>
                    <Input label="Sumber" value={cfg.source || ''} onChange={(e) => onUpdate('source', e.target.value)} placeholder="QS. Ar-Rum: 21" />
                </div>
            );

        case 'gift':
            return (
                <div className="space-y-3">
                    <Checkbox label="Tampilkan QRIS" checked={cfg.showQris !== false} onChange={(v) => onUpdate('showQris', v)} />
                    <p className="text-[10px] text-neutral-400">Rekening bank dapat dikonfigurasi di versi mendatang.</p>
                </div>
            );

        case 'rsvp':
            return (
                <div className="space-y-3">
                    <Checkbox label="Tampilkan kolom pesan" checked={cfg.showMessage !== false} onChange={(v) => onUpdate('showMessage', v)} />
                    <Input label="Label tombol" value={cfg.submitLabel || ''} onChange={(e) => onUpdate('submitLabel', e.target.value)} placeholder="Kirim RSVP" />
                </div>
            );

        case 'gallery':
            return (
                <div className="space-y-4">
                    <FieldGroup label="Tampilan">
                        <select
                            value={cfg.layout || 'masonry'}
                            onChange={(e) => onUpdate('layout', e.target.value)}
                            className="w-full bg-lathe-surface dark:bg-lathe-ink text-lathe-ink dark:text-lathe-surface border border-lathe-ink/20 dark:border-lathe-surface/20 rounded-md p-2 text-sm focus:outline-none focus:border-lathe-primary transition-colors"
                        >
                            <option value="masonry">Kolase Acak (Masonry)</option>
                            <option value="grid">Kotak Seragam (Grid)</option>
                            <option value="carousel">Satu per satu (Carousel)</option>
                        </select>
                    </FieldGroup>
                    <div className="space-y-3">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Daftar Foto</p>
                        {(cfg.images || []).map((img: any, i: number) => (
                            <div key={i} className="flex gap-2 items-end">
                                <div className="flex-1">
                                    <Input
                                        value={img.url}
                                        onChange={(e) => {
                                            const imgs = [...(cfg.images || [])];
                                            imgs[i] = { ...imgs[i], url: e.target.value };
                                            onUpdate('images', imgs);
                                        }}
                                        placeholder="URL gambar"
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        const imgs = [...(cfg.images || [])];
                                        imgs.splice(i, 1);
                                        onUpdate('images', imgs);
                                    }}
                                    className="p-2 text-red-400 hover:text-red-600 transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={() =>
                                onUpdate('images', [
                                    ...(cfg.images || []),
                                    { url: '', sort_order: (cfg.images || []).length },
                                ])
                            }
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                            + Tambah foto
                        </button>
                    </div>
                </div>
            );

        case 'location':
            return (
                <Checkbox
                    label="Tampilkan peta embed"
                    checked={cfg.showMap !== false}
                    onChange={(v) => onUpdate('showMap', v)}
                />
            );

        case 'story':
            return (
                <div className="space-y-3">
                    {(cfg.items || []).map((item: any, i: number) => (
                        <div key={i}>
                            <FieldGroup label={`Milestone ${i + 1}`}>
                                <Input value={item.title} onChange={(e) => {
                                    const items = [...(cfg.items || [])];
                                    items[i] = { ...items[i], title: e.target.value };
                                    onUpdate('items', items);
                                }} placeholder="Judul" />
                                <textarea
                                    value={item.description}
                                    onChange={(e) => {
                                        const items = [...(cfg.items || [])];
                                        items[i] = { ...items[i], description: e.target.value };
                                        onUpdate('items', items);
                                    }}
                                    className="w-full bg-lathe-surface dark:bg-lathe-ink text-lathe-ink dark:text-lathe-surface border border-lathe-ink/20 dark:border-lathe-surface/20 rounded-md p-2 text-xs min-h-[48px] resize-none focus:outline-none focus:border-lathe-primary transition-colors"
                                    placeholder="Deskripsi"
                                />
                                <button
                                    onClick={() => {
                                        const items = [...(cfg.items || [])];
                                        items.splice(i, 1);
                                        onUpdate('items', items);
                                    }}
                                    className="text-xs text-red-400 hover:text-red-600"
                                >
                                    Hapus
                                </button>
                            </FieldGroup>
                        </div>
                    ))}
                    <button
                        onClick={() =>
                            onUpdate('items', [
                                ...(cfg.items || []),
                                { title: '', date: '', description: '', image: '' },
                            ])
                        }
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                        + Tambah milestone
                    </button>
                </div>
            );

        default:
            return <p className="text-xs text-neutral-400">Tidak ada konfigurasi untuk blok ini.</p>;
    }
}

// ---------------------------------------------------------------------------
// Shared UI primitives
// ---------------------------------------------------------------------------

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <p className="text-[10px] font-bold text-lathe-ink/50 dark:text-lathe-surface/50 uppercase tracking-widest">{label}</p>
            <div className="space-y-2">{children}</div>
        </div>
    );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <label className="flex items-center gap-2 text-xs text-lathe-ink/80 dark:text-lathe-surface/80 cursor-pointer select-none">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="rounded border-lathe-ink/20 dark:border-lathe-surface/20 bg-lathe-surface dark:bg-lathe-ink text-lathe-ink dark:text-lathe-surface focus:ring-lathe-ink dark:focus:ring-lathe-surface"
            />
            {label}
        </label>
    );
}

function getBlockLabel(type: string): string {
    const labels: Record<string, string> = {
        hero: 'Sampul',
        quote: 'Pembukaan',
        couple: 'Profil Pasangan',
        event: 'Detail Acara',
        story: 'Love Story',
        gallery: 'Album Foto',
        countdown: 'Hitung Mundur',
        location: 'Lokasi',
        gift: 'Tanda Kasih',
        rsvp: 'RSVP',
    };
    return labels[type] || type;
}

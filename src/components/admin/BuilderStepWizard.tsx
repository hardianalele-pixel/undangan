import React, { useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../Button';
import {
    GripVertical, Plus, ChevronDown, Check, AlertCircle,
    Image, Heart, Calendar, BookOpen, Camera, MapPin,
    Clock, MessageSquare, Quote, Gift, DoorOpen, X,
    Trash2, ArrowRight,
} from 'lucide-react';
import { BLOCK_TYPES } from '../../presets';
import { Input } from '../Input';
import { MediaInput } from '../MediaInput';
import type { Block, InvitationMeta } from '../../types';

// ─── Section metadata ───────────────────────────────────────────

const SECTION_META: Record<string, { label: string; icon: React.ElementType; prompt: string }> = {
    opening: { label: 'Pintu Pembuka', icon: DoorOpen, prompt: 'Atur tampilan halaman pembuka undangan' },
    hero: { label: 'Sampul', icon: Image, prompt: 'Unggah foto utama dan atur tampilan sampul' },
    quote: { label: 'Kutipan', icon: Quote, prompt: 'Pilih kutipan ayat atau doa' },
    couple: { label: 'Profil Pasangan', icon: Heart, prompt: 'Isi data lengkap kedua mempelai' },
    event: { label: 'Detail Acara', icon: Calendar, prompt: 'Masukkan waktu dan lokasi acara' },
    story: { label: 'Love Story', icon: BookOpen, prompt: 'Ceritakan perjalanan cinta kalian' },
    gallery: { label: 'Galeri Foto', icon: Camera, prompt: 'Tambahkan foto-foto prewedding' },
    countdown: { label: 'Hitung Mundur', icon: Clock, prompt: 'Atur label penghitung mundur' },
    location: { label: 'Lokasi', icon: MapPin, prompt: 'Tambahkan link Google Maps' },
    gift: { label: 'Tanda Kasih', icon: Gift, prompt: 'Atur rekening atau QRIS untuk hadiah' },
    rsvp: { label: 'RSVP', icon: MessageSquare, prompt: 'Atur formulir konfirmasi kehadiran' },
    closing: { label: 'Penutup', icon: X, prompt: 'Tulis pesan penutup undangan' },
};

// ─── Props ──────────────────────────────────────────────────────

interface BuilderStepWizardProps {
    blocks: Block[];
    meta: InvitationMeta;
    activeStepId: string | null;
    onSetActiveStep: (blockId: string | null) => void;
    onReorderBlocks: (blocks: Block[]) => void;
    onToggleVisibility: (blockId: string) => void;
    onAddBlock: (type: Block['type']) => void;
    onUpdateBlockConfig: (blockId: string, key: string, value: any) => void;
    onDeleteBlock: (blockId: string) => void;
    onUpdateMeta: (field: string, value: any) => void;
}

export function BuilderStepWizard({
    blocks,
    meta,
    activeStepId,
    onSetActiveStep,
    onReorderBlocks,
    onToggleVisibility,
    onAddBlock,
    onUpdateBlockConfig,
    onDeleteBlock,
    onUpdateMeta,
}: BuilderStepWizardProps) {
    const [showAddMenu, setShowAddMenu] = React.useState(false);
    const [dragIdx, setDragIdx] = React.useState<number | null>(null);
    const [dropTargetIdx, setDropTargetIdx] = React.useState<number | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const sorted = useMemo(() => [...blocks].sort((a, b) => a.sort_order - b.sort_order), [blocks]);

    // Removed auto-scroll on active step to prevent disruptive jumping
    useEffect(() => {
        // Auto-scroll removed per user request
    }, [activeStepId]);

    const getMeta = (type: string) =>
        SECTION_META[type] || { label: type, icon: Gift, prompt: 'Konfigurasi seksi ini' };

    // Advance to strictly the next step in list
    const advanceToNext = (currentId: string) => {
        const currentIdx = sorted.findIndex((b) => b.id === currentId);
        if (currentIdx >= 0 && currentIdx < sorted.length - 1) {
            onSetActiveStep(sorted[currentIdx + 1].id);
            return;
        }
        // At the end, simply close the active step
        onSetActiveStep(null);
    };

    // ─── Drag handlers ──────────────────────────────────────────

    const handleDragStart = (e: React.DragEvent, idx: number) => {
        setDragIdx(idx);
        const ghost = e.currentTarget.cloneNode(true) as HTMLElement;
        ghost.style.position = 'absolute';
        ghost.style.top = '-9999px';
        ghost.style.opacity = '0.9';
        document.body.appendChild(ghost);
        e.dataTransfer.setDragImage(ghost, 0, 0);
        requestAnimationFrame(() => ghost.remove());
    };

    const handleDragOver = (e: React.DragEvent, idx: number) => {
        e.preventDefault();
        if (dragIdx === null || dragIdx === idx) {
            setDropTargetIdx(null);
            return;
        }
        setDropTargetIdx(idx);
    };

    const handleDrop = (e: React.DragEvent, idx: number) => {
        e.preventDefault();
        if (dragIdx === null || dragIdx === idx) return;
        const reordered = [...sorted];
        const [item] = reordered.splice(dragIdx, 1);
        reordered.splice(idx, 0, item);
        reordered.forEach((b, i) => (b.sort_order = i));
        onReorderBlocks(reordered);
        setDragIdx(null);
        setDropTargetIdx(null);
    };

    const handleDragEnd = () => {
        setDragIdx(null);
        setDropTargetIdx(null);
    };

    return (
        <aside className="w-[420px] flex-shrink-0 bg-lathe-surface dark:bg-lathe-ink text-lathe-ink dark:text-lathe-surface border-r border-lathe-ink/10 dark:border-lathe-surface/10 flex flex-col h-full overflow-hidden transition-colors">
            {/* Step cards */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5 pt-4">
                {sorted.map((block, idx) => {
                    const sectionMeta = getMeta(block.type);
                    const Icon = sectionMeta.icon;
                    const isActive = activeStepId === block.id;
                    const isDragging = dragIdx === idx;
                    const isDropTarget = dropTargetIdx === idx;

                    return (
                        <React.Fragment key={block.id}>
                            {/* Drop indicator */}
                            {isDropTarget && dragIdx !== null && dragIdx > idx && (
                                <div className="h-0.5 mx-2 rounded-full bg-blue-500" />
                            )}

                            <div
                                data-step-id={block.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, idx)}
                                onDragOver={(e) => handleDragOver(e, idx)}
                                onDrop={(e) => handleDrop(e, idx)}
                                onDragEnd={handleDragEnd}
                                className={cn(
                                    'rounded-xl border transition-all duration-200',
                                    isActive
                                        ? 'border-lathe-ink/20 dark:border-lathe-surface/20 bg-lathe-surface dark:bg-lathe-ink shadow-sm'
                                        : 'border-transparent hover:border-lathe-ink/10 dark:hover:border-lathe-surface/10',
                                    isDragging && 'opacity-20 scale-95',
                                    !block.visible && 'opacity-40',
                                )}
                            >
                                {/* Step header (always visible) */}
                                <button
                                    onClick={() => onSetActiveStep(isActive ? null : block.id)}
                                    className="w-full flex items-center gap-3 px-3 py-3 text-left group"
                                >
                                    {/* Drag handle */}
                                    <GripVertical className="w-3.5 h-3.5 text-lathe-ink/20 dark:text-lathe-surface/20 cursor-grab flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    {/* Step number + icon */}
                                    <div className={cn(
                                        'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
                                        isActive
                                            ? 'bg-lathe-ink/10 dark:bg-lathe-surface/15 text-lathe-ink dark:text-lathe-surface'
                                            : 'bg-lathe-ink/5 dark:bg-lathe-surface/10 text-lathe-ink/40 dark:text-lathe-surface/40'
                                    )}>
                                        <Icon className="w-4 h-4" />
                                    </div>

                                    {/* Label */}
                                    <div className="flex-1 min-w-0">
                                        <p className={cn(
                                            'text-xs font-semibold truncate',
                                            isActive ? 'text-lathe-ink dark:text-lathe-surface' : 'text-lathe-ink/70 dark:text-lathe-surface/70'
                                        )}>
                                            {sectionMeta.label}
                                        </p>
                                    </div>

                                    {/* Chevron */}
                                    <ChevronDown className={cn(
                                        'w-4 h-4 text-lathe-ink/30 dark:text-lathe-surface/30 flex-shrink-0 transition-transform duration-200',
                                        isActive && 'rotate-180'
                                    )} />
                                </button>

                                {/* Expanded: form fields */}
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-4 pb-4 space-y-4">
                                                {/* Prompt */}
                                                <p className="text-[11px] text-lathe-ink/50 dark:text-lathe-surface/50 leading-relaxed">
                                                    {sectionMeta.prompt}
                                                </p>

                                                {/* Inline form */}
                                                <StepForm
                                                    block={block}
                                                    meta={meta}
                                                    onUpdateConfig={(key, value) => onUpdateBlockConfig(block.id, key, value)}
                                                    onUpdateMeta={onUpdateMeta}
                                                />

                                                {/* Footer: continue + delete */}
                                                <div className="flex items-center justify-between pt-2 border-t border-lathe-ink/5 dark:border-lathe-surface/5">
                                                    <button
                                                        onClick={() => onDeleteBlock(block.id)}
                                                        className="flex items-center gap-1.5 text-[10px] text-red-500/60 hover:text-red-600 dark:text-red-400/60 dark:hover:text-red-400 transition-colors"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                        Hapus
                                                    </button>

                                                    <button
                                                        onClick={() => advanceToNext(block.id)}
                                                        className="flex items-center gap-1.5 text-xs font-semibold text-lathe-ink/70 dark:text-lathe-surface/70 hover:text-lathe-ink dark:hover:text-lathe-surface transition-colors"
                                                    >
                                                        Lanjut
                                                        <ArrowRight className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Drop indicator below */}
                            {isDropTarget && dragIdx !== null && dragIdx < idx && (
                                <div className="h-0.5 mx-2 rounded-full bg-blue-500" />
                            )}
                        </React.Fragment>
                    );
                })}

                {/* Add section */}
                <AnimatePresence>
                    {showAddMenu && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-lathe-surface dark:bg-lathe-ink border border-lathe-ink/10 dark:border-lathe-surface/10 rounded-xl shadow-lg overflow-hidden"
                        >
                            <div className="p-2 grid grid-cols-2 gap-1">
                                {BLOCK_TYPES.map((bt) => {
                                    const meta = getMeta(bt.type);
                                    const BtIcon = meta.icon;
                                    return (
                                        <button
                                            key={bt.type}
                                            className="text-left px-3 py-2.5 text-xs rounded-lg hover:bg-lathe-ink/5 dark:hover:bg-lathe-surface/10 flex items-center gap-2 transition-colors text-lathe-ink/60 dark:text-lathe-surface/60 hover:text-lathe-ink dark:hover:text-lathe-surface"
                                            onClick={() => {
                                                onAddBlock(bt.type);
                                                setShowAddMenu(false);
                                            }}
                                        >
                                            <BtIcon className="w-3.5 h-3.5 text-lathe-ink/30 dark:text-lathe-surface/30" />
                                            {meta.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!showAddMenu && (
                    <button
                        onClick={() => setShowAddMenu(true)}
                        className="w-full flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl text-xs text-lathe-ink/40 dark:text-lathe-surface/40 hover:text-lathe-ink/70 dark:hover:text-lathe-surface/70 hover:bg-lathe-ink/5 dark:hover:bg-lathe-surface/10 border border-dashed border-lathe-ink/10 dark:border-lathe-surface/10 transition-colors"
                    >
                        <Plus className="w-3 h-3" />
                        Tambah Seksi
                    </button>
                )}
            </div>
        </aside>
    );
}

// ─── Step Form ──────────────────────────────────────────────────
// Inline forms for each block type (migrated from PropertyPanel)

function StepForm({
    block,
    meta,
    onUpdateConfig,
    onUpdateMeta,
}: {
    block: Block;
    meta: InvitationMeta;
    onUpdateConfig: (key: string, value: any) => void;
    onUpdateMeta: (field: string, value: any) => void;
}) {
    const cfg = block.config || {};

    switch (block.type) {
        case 'hero':
            return (
                <div className="space-y-3">
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
                    <Input
                        label="Subtitle"
                        value={cfg.subtitle || ''}
                        onChange={(e) => onUpdateConfig('subtitle', e.target.value)}
                        placeholder="Pernikahan"
                    />
                    <FieldGroup label="Gaya Teks Utama (Opsional)">
                        <select
                            value={cfg.textStyle || 'default'}
                            onChange={(e) => onUpdateConfig('textStyle', e.target.value)}
                            className="w-full text-sm bg-transparent border-0 focus:ring-0 p-0 text-lathe-ink dark:text-lathe-surface flex-1 cursor-pointer"
                        >
                            <option value="default" className="text-lathe-ink bg-lathe-surface dark:text-lathe-surface dark:bg-lathe-ink">Standar (Default)</option>
                            <option value="gradient" className="text-lathe-ink bg-lathe-surface dark:text-lathe-surface dark:bg-lathe-ink">Gradien Modern</option>
                            <option value="layered" className="text-lathe-ink bg-lathe-surface dark:text-lathe-surface dark:bg-lathe-ink">Tumpuk Berlapis (Layered)</option>
                        </select>
                    </FieldGroup>
                    <StepCheckbox
                        label="Tampilkan nama tamu"
                        checked={cfg.showGuestName !== false}
                        onChange={(v) => onUpdateConfig('showGuestName', v)}
                    />
                </div>
            );

        case 'couple':
            return (
                <div className="space-y-3">
                    <FieldGroup label="Profil Pria">
                        <Input label="Nama lengkap" value={cfg.groomFull || ''} onChange={(e) => onUpdateConfig('groomFull', e.target.value)} placeholder="Ahmad bin Abdullah" />
                        <Input label="Orang tua" value={cfg.groomParents || ''} onChange={(e) => onUpdateConfig('groomParents', e.target.value)} placeholder="Bpk. Abdullah & Ibu Fatimah" />
                        <MediaInput label="Foto" value={cfg.groomPhoto || ''} onChange={(v) => onUpdateConfig('groomPhoto', v)} accept="image/*" type="image" />
                    </FieldGroup>
                    <FieldGroup label="Profil Wanita">
                        <Input label="Nama lengkap" value={cfg.brideFull || ''} onChange={(e) => onUpdateConfig('brideFull', e.target.value)} />
                        <Input label="Orang tua" value={cfg.brideParents || ''} onChange={(e) => onUpdateConfig('brideParents', e.target.value)} />
                        <MediaInput label="Foto" value={cfg.bridePhoto || ''} onChange={(v) => onUpdateConfig('bridePhoto', v)} accept="image/*" type="image" />
                    </FieldGroup>
                </div>
            );

        case 'event':
            return (
                <div className="space-y-3">
                    <FieldGroup label="Akad Nikah">
                        <StepCheckbox label="Tampilkan" checked={cfg.showAkad !== false} onChange={(v) => onUpdateConfig('showAkad', v)} />
                        <Input label="Waktu" type="time" value={cfg.akadTime || ''} onChange={(e) => onUpdateConfig('akadTime', e.target.value)} />
                        <Input label="Tempat" value={cfg.akadVenue || ''} onChange={(e) => onUpdateConfig('akadVenue', e.target.value)} />
                    </FieldGroup>
                    <FieldGroup label="Resepsi">
                        <StepCheckbox label="Tampilkan" checked={cfg.showResepsi !== false} onChange={(v) => onUpdateConfig('showResepsi', v)} />
                        <Input label="Waktu" type="time" value={cfg.resepsiTime || ''} onChange={(e) => onUpdateConfig('resepsiTime', e.target.value)} />
                        <Input label="Tempat" value={cfg.resepsiVenue || ''} onChange={(e) => onUpdateConfig('resepsiVenue', e.target.value)} />
                    </FieldGroup>
                </div>
            );

        case 'countdown':
            return (
                <Input
                    label="Label"
                    value={cfg.label || ''}
                    onChange={(e) => onUpdateConfig('label', e.target.value)}
                    placeholder="Menuju Hari Bahagia"
                />
            );

        case 'quote':
            return (
                <div className="space-y-3">
                    <div>
                        <label className="text-[10px] font-medium text-lathe-ink/50 dark:text-lathe-surface/50 block mb-1">Teks Kutipan</label>
                        <textarea
                            value={cfg.text || ''}
                            onChange={(e) => onUpdateConfig('text', e.target.value)}
                            className="w-full bg-lathe-surface dark:bg-lathe-ink text-lathe-ink dark:text-lathe-surface border border-lathe-ink/15 dark:border-lathe-surface/15 rounded-lg p-2.5 text-sm min-h-[80px] resize-none focus:outline-none focus:border-lathe-ink/40 dark:focus:border-lathe-surface/40 transition-colors"
                        />
                    </div>
                    <Input label="Sumber" value={cfg.source || ''} onChange={(e) => onUpdateConfig('source', e.target.value)} placeholder="QS. Ar-Rum: 21" />
                </div>
            );

        case 'gift':
            return (
                <div className="space-y-3">
                    <StepCheckbox label="Tampilkan QRIS" checked={cfg.showQris !== false} onChange={(v) => onUpdateConfig('showQris', v)} />
                    <p className="text-[10px] text-lathe-ink/40 dark:text-lathe-surface/40">Rekening bank dapat dikonfigurasi di versi mendatang.</p>
                </div>
            );

        case 'rsvp':
            return (
                <div className="space-y-3">
                    <StepCheckbox label="Tampilkan kolom pesan" checked={cfg.showMessage !== false} onChange={(v) => onUpdateConfig('showMessage', v)} />
                    <Input label="Label tombol" value={cfg.submitLabel || ''} onChange={(e) => onUpdateConfig('submitLabel', e.target.value)} placeholder="Kirim RSVP" />
                </div>
            );

        case 'gallery':
            return (
                <div className="space-y-3">
                    <FieldGroup label="Tampilan">
                        <select
                            value={cfg.layout || 'masonry'}
                            onChange={(e) => onUpdateConfig('layout', e.target.value)}
                            className="w-full bg-lathe-surface dark:bg-lathe-ink text-lathe-ink dark:text-lathe-surface border border-lathe-ink/15 dark:border-lathe-surface/15 rounded-lg p-2 text-sm focus:outline-none focus:border-lathe-ink/40 dark:focus:border-lathe-surface/40 transition-colors"
                        >
                            <option value="masonry">Kolase Acak (Masonry)</option>
                            <option value="grid">Kotak Seragam (Grid)</option>
                            <option value="carousel">Korsel Elegan (Elegant Carousel)</option>
                            <option value="circular">Galeri Melingkar (Circular)</option>
                        </select>
                    </FieldGroup>
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold text-lathe-ink/40 dark:text-lathe-surface/40 uppercase tracking-widest">Daftar Foto</p>
                        {(cfg.images || []).map((img: any, i: number) => (
                            <div key={i} className="flex gap-2 items-end">
                                <div className="flex-1">
                                    <MediaInput
                                        label={`Foto ${i + 1}`}
                                        value={img.url || ''}
                                        onChange={(v) => {
                                            const imgs = [...(cfg.images || [])];
                                            imgs[i] = { ...imgs[i], url: v };
                                            onUpdateConfig('images', imgs);
                                        }}
                                        accept="image/*"
                                        type="image"
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        const imgs = [...(cfg.images || [])];
                                        imgs.splice(i, 1);
                                        onUpdateConfig('images', imgs);
                                    }}
                                    className="p-2 text-red-400 hover:text-red-600 transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={() =>
                                onUpdateConfig('images', [
                                    ...(cfg.images || []),
                                    { url: '', sort_order: (cfg.images || []).length },
                                ])
                            }
                            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                        >
                            + Tambah foto
                        </button>
                    </div>
                </div>
            );

        case 'location':
            return (
                <StepCheckbox
                    label="Tampilkan peta embed"
                    checked={cfg.showMap !== false}
                    onChange={(v) => onUpdateConfig('showMap', v)}
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
                                    onUpdateConfig('items', items);
                                }} placeholder="Judul" />
                                <textarea
                                    value={item.description}
                                    onChange={(e) => {
                                        const items = [...(cfg.items || [])];
                                        items[i] = { ...items[i], description: e.target.value };
                                        onUpdateConfig('items', items);
                                    }}
                                    className="w-full bg-lathe-surface dark:bg-lathe-ink text-lathe-ink dark:text-lathe-surface border border-lathe-ink/15 dark:border-lathe-surface/15 rounded-lg p-2 text-xs min-h-[48px] resize-none focus:outline-none focus:border-lathe-ink/40 dark:focus:border-lathe-surface/40 transition-colors"
                                    placeholder="Deskripsi"
                                />
                                <MediaInput
                                    label="Foto Opsional"
                                    value={item.image || ''}
                                    onChange={(v) => {
                                        const items = [...(cfg.items || [])];
                                        items[i] = { ...items[i], image: v };
                                        onUpdateConfig('items', items);
                                    }}
                                    accept="image/*"
                                    type="image"
                                />
                                <button
                                    onClick={() => {
                                        const items = [...(cfg.items || [])];
                                        items.splice(i, 1);
                                        onUpdateConfig('items', items);
                                    }}
                                    className="text-xs text-red-400 hover:text-red-600 dark:text-red-400/60 dark:hover:text-red-400"
                                >
                                    Hapus
                                </button>
                            </FieldGroup>
                        </div>
                    ))}
                    <button
                        onClick={() =>
                            onUpdateConfig('items', [
                                ...(cfg.items || []),
                                { title: '', date: '', description: '', image: '' },
                            ])
                        }
                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                    >
                        + Tambah milestone
                    </button>
                </div>
            );

        case 'opening':
            return (
                <div className="space-y-3">
                    <Input
                        label="Subtitle"
                        value={cfg.subtitle || ''}
                        onChange={(e) => onUpdateConfig('subtitle', e.target.value)}
                        placeholder="The Wedding Of"
                    />
                    <FieldGroup label="Pola Latar">
                        <select
                            value={cfg.backgroundPattern || 'dots'}
                            onChange={(e) => onUpdateConfig('backgroundPattern', e.target.value)}
                            className="w-full bg-lathe-surface dark:bg-lathe-ink text-lathe-ink dark:text-lathe-surface border border-lathe-ink/15 dark:border-lathe-surface/15 rounded-lg p-2 text-sm focus:outline-none focus:border-lathe-ink/40 dark:focus:border-lathe-surface/40 transition-colors"
                        >
                            <option value="none">Tidak ada</option>
                            <option value="dots">Titik-titik</option>
                            <option value="lines">Garis-garis</option>
                            <option value="crosses">Palang</option>
                            <option value="diagonal">Diagonal</option>
                        </select>
                    </FieldGroup>
                    <FieldGroup label="Gaya Teks Utama (Opsional)">
                        <select
                            value={cfg.textStyle || 'default'}
                            onChange={(e) => onUpdateConfig('textStyle', e.target.value)}
                            className="w-full text-sm bg-transparent border-0 focus:ring-0 p-0 text-lathe-ink dark:text-lathe-surface flex-1 cursor-pointer"
                        >
                            <option value="default" className="text-lathe-ink bg-lathe-surface dark:text-lathe-surface dark:bg-lathe-ink">Standar (Default)</option>
                            <option value="gradient" className="text-lathe-ink bg-lathe-surface dark:text-lathe-surface dark:bg-lathe-ink">Gradien Modern</option>
                            <option value="layered" className="text-lathe-ink bg-lathe-surface dark:text-lathe-surface dark:bg-lathe-ink">Tumpuk Berlapis (Layered)</option>
                        </select>
                    </FieldGroup>
                </div>
            );

        case 'closing':
            return (
                <div className="space-y-3">
                    <div>
                        <label className="text-[10px] font-medium text-lathe-ink/50 dark:text-lathe-surface/50 block mb-1">Pesan Penutup</label>
                        <textarea
                            value={cfg.message || ''}
                            onChange={(e) => onUpdateConfig('message', e.target.value)}
                            className="w-full bg-lathe-surface dark:bg-lathe-ink text-lathe-ink dark:text-lathe-surface border border-lathe-ink/15 dark:border-lathe-surface/15 rounded-lg p-2.5 text-sm min-h-[80px] resize-none focus:outline-none focus:border-lathe-ink/40 dark:focus:border-lathe-surface/40 transition-colors"
                        />
                    </div>
                </div>
            );

        default:
            return <p className="text-xs text-lathe-ink/40 dark:text-lathe-surface/40">Tidak ada konfigurasi untuk blok ini.</p>;
    }
}

// ─── Shared primitives ──────────────────────────────────────────

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <p className="text-[10px] font-bold text-lathe-ink/40 dark:text-lathe-surface/40 uppercase tracking-widest">{label}</p>
            <div className="space-y-2">{children}</div>
        </div>
    );
}

function StepCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <label className="flex items-center gap-2 text-xs text-lathe-ink/70 dark:text-lathe-surface/70 cursor-pointer select-none">
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

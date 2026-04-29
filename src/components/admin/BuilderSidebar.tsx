import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../Button';
import {
    GripVertical, Eye, EyeOff, Plus,
    Image, Heart, Calendar, BookOpen, Camera, MapPin,
    Clock, MessageSquare, Quote, Gift,
} from 'lucide-react';
import { BLOCK_TYPES } from '../../presets';
import type { Block } from '../../types';

const SECTION_META: Record<string, { label: string; icon: React.ElementType }> = {
    hero: { label: 'Sampul', icon: Image },
    quote: { label: 'Pembukaan', icon: Quote },
    couple: { label: 'Profil Pasangan', icon: Heart },
    event: { label: 'Detail Acara', icon: Calendar },
    story: { label: 'Love Story', icon: BookOpen },
    gallery: { label: 'Album Foto', icon: Camera },
    countdown: { label: 'Hitung Mundur', icon: Clock },
    location: { label: 'Lokasi', icon: MapPin },
    gift: { label: 'Tanda Kasih', icon: Gift },
    rsvp: { label: 'RSVP', icon: MessageSquare },
};

interface BuilderSidebarProps {
    blocks: Block[];
    selectedBlockId: string | null;
    onSelectBlock: (blockId: string) => void;
    onReorderBlocks: (blocks: Block[]) => void;
    onToggleVisibility: (blockId: string) => void;
    onAddBlock: (type: Block['type']) => void;
}

export function BuilderSidebar({
    blocks,
    selectedBlockId,
    onSelectBlock,
    onReorderBlocks,
    onToggleVisibility,
    onAddBlock,
}: BuilderSidebarProps) {
    const [dragIdx, setDragIdx] = React.useState<number | null>(null);
    const [dropTargetIdx, setDropTargetIdx] = React.useState<number | null>(null);
    const [showAddMenu, setShowAddMenu] = React.useState(false);

    const sorted = [...blocks].sort((a, b) => a.sort_order - b.sort_order);

    const handleDragStart = (e: React.DragEvent, idx: number) => {
        setDragIdx(idx);
        const ghost = e.currentTarget.cloneNode(true) as HTMLElement;
        ghost.style.position = 'absolute';
        ghost.style.top = '-9999px';
        ghost.style.opacity = '0.9';
        ghost.style.transform = 'scale(1.02)';
        ghost.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
        ghost.style.borderRadius = '8px';
        ghost.style.width = `${e.currentTarget.clientWidth}px`;
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

    const getMeta = (type: string) =>
        SECTION_META[type] || { label: type, icon: Gift };

    return (
        <aside className="w-56 flex-shrink-0 bg-white border-r border-neutral-200 flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    Seksi
                </p>
                <button
                    onClick={() => setShowAddMenu(!showAddMenu)}
                    className="p-1 rounded-md hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
                    title="Tambah seksi"
                >
                    <Plus className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Section tree */}
            <div className="flex-1 overflow-y-auto px-2 pb-2">
                <div className="space-y-0.5 relative">
                    {sorted.map((block, idx) => {
                        const sectionMeta = getMeta(block.type);
                        const Icon = sectionMeta.icon;
                        const isActive = selectedBlockId === block.id;
                        const isDragging = dragIdx === idx;
                        const isDropTarget = dropTargetIdx === idx;

                        return (
                            <React.Fragment key={block.id}>
                                {/* Drop indicator -- above */}
                                {isDropTarget && dragIdx !== null && dragIdx > idx && (
                                    <motion.div
                                        layoutId="drop-indicator"
                                        className="h-0.5 mx-2 rounded-full bg-blue-500"
                                        initial={{ scaleX: 0, opacity: 0 }}
                                        animate={{ scaleX: 1, opacity: 1 }}
                                        transition={{ duration: 0.15 }}
                                    />
                                )}

                                <div
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, idx)}
                                    onDragOver={(e) => handleDragOver(e, idx)}
                                    onDrop={(e) => handleDrop(e, idx)}
                                    onDragEnd={handleDragEnd}
                                    className={cn(
                                        'flex items-center gap-1.5 px-2 py-2 rounded-lg text-sm cursor-pointer transition-all duration-150 select-none group',
                                        isActive
                                            ? 'bg-neutral-900 text-white font-medium'
                                            : 'text-neutral-600 hover:bg-neutral-50',
                                        !block.visible && 'opacity-40',
                                        isDragging && 'opacity-20 scale-95',
                                    )}
                                    onClick={() => onSelectBlock(block.id)}
                                >
                                    <GripVertical className="w-3.5 h-3.5 text-neutral-300 cursor-grab flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <Icon className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-white' : 'text-neutral-400')} />
                                    <span className="flex-1 truncate text-xs">{sectionMeta.label}</span>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onToggleVisibility(block.id);
                                        }}
                                        className="p-0.5 rounded hover:bg-neutral-200 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        {block.visible ? (
                                            <Eye className="w-3 h-3 text-neutral-300" />
                                        ) : (
                                            <EyeOff className="w-3 h-3 text-neutral-300" />
                                        )}
                                    </button>
                                </div>

                                {/* Drop indicator -- below */}
                                {isDropTarget && dragIdx !== null && dragIdx < idx && (
                                    <motion.div
                                        layoutId="drop-indicator"
                                        className="h-0.5 mx-2 rounded-full bg-blue-500"
                                        initial={{ scaleX: 0, opacity: 0 }}
                                        animate={{ scaleX: 1, opacity: 1 }}
                                        transition={{ duration: 0.15 }}
                                    />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* Add section dropdown */}
                <AnimatePresence>
                    {showAddMenu && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-2 bg-white border border-neutral-200 rounded-lg shadow-lg overflow-hidden"
                        >
                            {BLOCK_TYPES.map((bt) => {
                                const meta = getMeta(bt.type);
                                const BtIcon = meta.icon;
                                return (
                                    <button
                                        key={bt.type}
                                        className="w-full text-left px-3 py-2.5 text-xs hover:bg-neutral-50 hover:text-neutral-900 flex items-center gap-2.5 transition-colors text-neutral-600"
                                        onClick={() => {
                                            onAddBlock(bt.type);
                                            setShowAddMenu(false);
                                        }}
                                    >
                                        <BtIcon className="w-4 h-4 text-neutral-400" />
                                        {meta.label}
                                    </button>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Add button */}
                {!showAddMenu && (
                    <button
                        onClick={() => setShowAddMenu(true)}
                        className="w-full flex items-center justify-center gap-1.5 px-2 py-2 mt-2 rounded-lg text-xs text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 border border-dashed border-neutral-200 transition-colors"
                    >
                        <Plus className="w-3 h-3" />
                        Tambah Seksi
                    </button>
                )}
            </div>
        </aside>
    );
}

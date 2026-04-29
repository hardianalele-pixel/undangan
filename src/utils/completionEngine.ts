import type { Block, InvitationMeta } from '../types';

export interface SectionStatus {
    filled: number;
    total: number;
    missing: string[];
}

/**
 * Compute per-block completion status.
 * Returns a Map keyed by block ID.
 */
export function computeCompletion(
    meta: InvitationMeta,
    blocks: Block[]
): Map<string, SectionStatus> {
    const map = new Map<string, SectionStatus>();

    for (const block of blocks) {
        if (!block.visible) continue;
        map.set(block.id, getBlockStatus(block, meta));
    }

    return map;
}

/**
 * Aggregate completion across all visible blocks.
 */
export function globalCompletion(
    meta: InvitationMeta,
    blocks: Block[]
): { percent: number; readyToPublish: boolean } {
    const statuses = computeCompletion(meta, blocks);
    let totalFields = 0;
    let filledFields = 0;

    statuses.forEach((s) => {
        totalFields += s.total;
        filledFields += s.filled;
    });

    const percent = totalFields === 0 ? 100 : Math.round((filledFields / totalFields) * 100);
    return { percent, readyToPublish: percent >= 80 };
}

function getBlockStatus(block: Block, meta: InvitationMeta): SectionStatus {
    const cfg = block.config || {};

    switch (block.type) {
        case 'hero': {
            const missing: string[] = [];
            if (!meta.heroImage) missing.push('Foto sampul');
            return { filled: 1 - missing.length, total: 1, missing };
        }

        case 'couple': {
            const fields = [
                ['groomFull', 'Nama lengkap pria'],
                ['brideFull', 'Nama lengkap wanita'],
                ['groomParents', 'Orang tua pria'],
                ['brideParents', 'Orang tua wanita'],
            ] as const;
            const missing = fields.filter(([k]) => !cfg[k]).map(([, l]) => l);
            return { filled: fields.length - missing.length, total: fields.length, missing };
        }

        case 'event': {
            const missing: string[] = [];
            if (!meta.eventDate) missing.push('Tanggal acara');
            if (!meta.venueName) missing.push('Nama tempat');
            if (!meta.eventTime) missing.push('Waktu acara');
            return { filled: 3 - missing.length, total: 3, missing };
        }

        case 'gallery': {
            const images = cfg.images || [];
            const hasImages = images.some((img: any) => img.url);
            const missing = hasImages ? [] : ['Minimal 1 foto'];
            return { filled: hasImages ? 1 : 0, total: 1, missing };
        }

        case 'rsvp': {
            const missing: string[] = [];
            if (!meta.whatsappNumber) missing.push('Nomor WhatsApp');
            return { filled: 1 - missing.length, total: 1, missing };
        }

        case 'gift': {
            const missing: string[] = [];
            if (!meta.qrisBarcode && !(cfg.bankAccounts?.length)) missing.push('QRIS atau rekening');
            return { filled: 1 - missing.length, total: 1, missing };
        }

        case 'story': {
            const items = cfg.items || [];
            const filled = items.filter((it: any) => it.title && it.description).length;
            const total = Math.max(items.length, 1);
            const missing = filled < total ? [`${total - filled} milestone belum diisi`] : [];
            return { filled, total, missing };
        }

        case 'location': {
            const missing: string[] = [];
            if (!meta.googleMapsLink) missing.push('Link Google Maps');
            return { filled: 1 - missing.length, total: 1, missing };
        }

        // opening, closing, quote, countdown — minimal config
        default:
            return { filled: 1, total: 1, missing: [] };
    }
}

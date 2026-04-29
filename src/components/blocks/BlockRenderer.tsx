import React from 'react';
import type { Block } from '../../types';
import type { BuilderModeContext } from '../../pages/InviteView';
import { BlockWrapper } from './BlockWrapper';
import { OpeningBlock } from './OpeningBlock';
import { HeroBlock } from './HeroBlock';
import { CoupleBlock } from './CoupleBlock';
import { EventBlock } from './EventBlock';
import { CountdownBlock } from './CountdownBlock';
import { LocationBlock } from './LocationBlock';
import { GalleryBlock } from './GalleryBlock';
import { StoryBlock } from './StoryBlock';
import { QuoteBlock } from './QuoteBlock';
import { GiftBlock } from './GiftBlock';
import { RsvpBlock } from './RsvpBlock';
import { ClosingBlock } from './ClosingBlock';

const BLOCK_COMPONENTS: Record<string, React.FC<{ block: Block }>> = {
    opening: OpeningBlock,
    hero: HeroBlock,
    couple: CoupleBlock,
    event: EventBlock,
    countdown: CountdownBlock,
    location: LocationBlock,
    gallery: GalleryBlock,
    story: StoryBlock,
    quote: QuoteBlock,
    gift: GiftBlock,
    rsvp: RsvpBlock,
    closing: ClosingBlock,
};

const BLOCK_LABELS: Record<string, string> = {
    opening: 'Pembukaan',
    hero: 'Sampul',
    couple: 'Profil Pasangan',
    event: 'Detail Acara',
    countdown: 'Hitung Mundur',
    location: 'Lokasi',
    gallery: 'Album Foto',
    story: 'Love Story',
    quote: 'Ayat / Doa',
    gift: 'Tanda Kasih',
    rsvp: 'RSVP',
    closing: 'Penutup',
};

interface BlockRendererProps {
    blocks: Block[];
    builderMode?: BuilderModeContext;
}

/**
 * Master renderer: iterates visible blocks sorted by sort_order,
 * wraps each in BlockWrapper when in builder mode for interactive selection.
 */
export function BlockRenderer({ blocks, builderMode }: BlockRendererProps) {
    const visibleBlocks = blocks
        .filter((b) => b.visible)
        .sort((a, b) => a.sort_order - b.sort_order);

    const isBuilder = !!builderMode;

    return (
        <>
            {visibleBlocks.map((block) => {
                const Component = BLOCK_COMPONENTS[block.type];
                if (!Component) return null;

                return (
                    <React.Fragment key={block.id}>
                        <BlockWrapper
                            blockId={block.id}
                            blockLabel={BLOCK_LABELS[block.type] || block.type}
                            isSelected={builderMode?.selectedBlockId === block.id}
                            isBuilder={isBuilder}
                            onSelect={builderMode?.onSelectBlock}
                        >
                            <Component block={block} />
                        </BlockWrapper>
                    </React.Fragment>
                );
            })}
        </>
    );
}

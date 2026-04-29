import React from 'react';
import { InviteView } from '../../pages/InviteView';
import type { InvitationDocument } from '../../types';

interface PreviewCanvasProps {
    document: InvitationDocument;
    mode: 'mobile' | 'desktop';
    selectedBlockId: string | null;
    onSelectBlock: (blockId: string) => void;
}

/**
 * Center panel of the visual builder.
 * Renders the invitation preview inside a phone or browser frame.
 * Uses proper centering and overflow handling (no scale hacks).
 */
export function PreviewCanvas({
    document,
    mode,
    selectedBlockId,
    onSelectBlock,
}: PreviewCanvasProps) {
    return (
        <div
            className="flex-1 flex items-start justify-center overflow-y-auto overflow-x-hidden p-8"
            style={{
                background: 'radial-gradient(circle at 50% 0%, #f0f0f0 0%, #fafafa 70%)',
                backgroundImage: 'radial-gradient(circle, #e5e5e5 1px, transparent 1px)',
                backgroundSize: '20px 20px',
            }}
        >
            {mode === 'mobile' ? (
                <MobileFrame
                    document={document}
                    selectedBlockId={selectedBlockId}
                    onSelectBlock={onSelectBlock}
                />
            ) : (
                <DesktopFrame
                    document={document}
                    selectedBlockId={selectedBlockId}
                    onSelectBlock={onSelectBlock}
                />
            )}
        </div>
    );
}

/**
 * Phone frame with proper sizing and no scale transforms.
 */
function MobileFrame({
    document,
    selectedBlockId,
    onSelectBlock,
}: {
    document: InvitationDocument;
    selectedBlockId: string | null;
    onSelectBlock: (blockId: string) => void;
}) {
    return (
        <div className="flex-shrink-0 my-4">
            {/* Outer bezel */}
            <div
                className="bg-gray-900 rounded-[2.5rem] p-[10px] shadow-2xl"
                style={{ width: 360 }}
            >
                {/* Screen */}
                <div
                    className="relative bg-transparent rounded-[2rem] overflow-hidden"
                    style={{ height: 720 }}
                >
                    {/* Scrollable content */}
                    <div
                        className="w-full h-full overflow-y-auto overflow-x-hidden"
                        style={{ scrollBehavior: 'smooth' }}
                    >
                        <InviteView
                            previewData={document}
                            builderMode={{
                                selectedBlockId,
                                onSelectBlock,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Browser-style frame for desktop preview.
 */
function DesktopFrame({
    document,
    selectedBlockId,
    onSelectBlock,
}: {
    document: InvitationDocument;
    selectedBlockId: string | null;
    onSelectBlock: (blockId: string) => void;
}) {
    return (
        <div className="w-full max-w-4xl my-4">
            {/* Browser chrome */}
            <div className="bg-gray-200 rounded-t-xl px-4 py-2.5 flex items-center gap-2">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4">
                    <div className="bg-white rounded-md h-6 flex items-center px-3">
                        <span className="text-[11px] text-gray-400 font-mono">
                            https://undangan.co/{document.slug || 'preview'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content area */}
            <div className="border border-t-0 border-gray-200 rounded-b-xl overflow-hidden shadow-lg">
                <div
                    className="overflow-y-auto overflow-x-hidden"
                    style={{ maxHeight: '80vh', scrollBehavior: 'smooth' }}
                >
                    <InviteView
                        previewData={document}
                        builderMode={{
                            selectedBlockId,
                            onSelectBlock,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

import React, { useRef, useEffect, useState } from 'react';
import { Eraser } from 'lucide-react';

interface SignatureCanvasProps {
    onSave: (dataUrl: string) => void;
    width?: number;
    height?: number;
    lineColor?: string;
    lineWidth?: number;
}

export function SignatureCanvas({
    onSave,
    width = 500,
    height = 200,
    lineColor = '#1A1A1A',
    lineWidth = 3,
}: SignatureCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set up canvas for high-DPI displays
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(dpr, dpr);

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;
    }, [width, height, lineColor, lineWidth]);

    const getPos = (e: React.TouchEvent | React.MouseEvent) => {
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        if ('touches' in e) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top,
            };
        }
        return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
    };

    const startDraw = (e: React.TouchEvent | React.MouseEvent) => {
        e.preventDefault();
        setIsDrawing(true);
        setHasDrawn(true);
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    };

    const draw = (e: React.TouchEvent | React.MouseEvent) => {
        if (!isDrawing) return;
        e.preventDefault();
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    };

    const endDraw = () => {
        setIsDrawing(false);
        if (hasDrawn) {
            const dataUrl = canvasRef.current?.toDataURL('image/png') || '';
            onSave(dataUrl);
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const dpr = window.devicePixelRatio || 1;
        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
        setHasDrawn(false);
        onSave('');
    };

    return (
        <div className="relative">
            <canvas
                ref={canvasRef}
                className="border border-lathe-ink/20 rounded-xl cursor-crosshair touch-none bg-white w-full"
                style={{ maxWidth: width }}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={endDraw}
                onMouseLeave={endDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={endDraw}
            />
            <button
                type="button"
                onClick={clearCanvas}
                className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-lathe-ink/10 hover:bg-white transition-all"
                title="Hapus"
            >
                <Eraser className="w-4 h-4 text-lathe-ink/60" />
            </button>
            {!hasDrawn && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-lathe-ink/20 text-sm font-sans">Tanda tangan di sini...</p>
                </div>
            )}
        </div>
    );
}

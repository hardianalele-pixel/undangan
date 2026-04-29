import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, RotateCcw, Check } from 'lucide-react';

interface SelfieCaptureProps {
    onCapture: (dataUrl: string) => void;
}

export function SelfieCapture({ onCapture }: SelfieCaptureProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [photo, setPhoto] = useState<string>('');
    const [error, setError] = useState('');

    const startCamera = useCallback(async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setError('');
        } catch (err) {
            setError('Kamera tidak tersedia');
        }
    }, []);

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    }, [stream]);

    useEffect(() => {
        return () => {
            // Cleanup on unmount
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    const takePhoto = () => {
        if (!videoRef.current) return;
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d')!;

        // Mirror the image (front camera)
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0);

        // Compress as JPEG
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setPhoto(dataUrl);
        onCapture(dataUrl);
        stopCamera();
    };

    const retake = () => {
        setPhoto('');
        onCapture('');
        startCamera();
    };

    if (photo) {
        return (
            <div className="relative rounded-xl overflow-hidden border border-lathe-ink/20">
                <img src={photo} alt="Selfie" className="w-full aspect-[4/3] object-cover" />
                <div className="absolute bottom-3 inset-x-3 flex gap-2">
                    <button onClick={retake} className="flex-1 bg-white/90 backdrop-blur-sm text-lathe-ink font-bold text-sm py-2 rounded-full flex items-center justify-center gap-2 hover:bg-white transition-all">
                        <RotateCcw className="w-4 h-4" /> Ulangi
                    </button>
                    <button onClick={() => { }} className="flex-1 bg-lathe-ink text-white font-bold text-sm py-2 rounded-full flex items-center justify-center gap-2">
                        <Check className="w-4 h-4" /> OK
                    </button>
                </div>
            </div>
        );
    }

    if (stream) {
        return (
            <div className="relative rounded-xl overflow-hidden border border-lathe-ink/20">
                <video ref={videoRef} autoPlay playsInline muted className="w-full aspect-[4/3] object-cover" style={{ transform: 'scaleX(-1)' }} />
                <button onClick={takePhoto} className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-lathe-ink/20 shadow-lg hover:scale-105 transition-transform flex items-center justify-center">
                    <div className="w-12 h-12 bg-lathe-ink rounded-full" />
                </button>
            </div>
        );
    }

    return (
        <div className="rounded-xl border-2 border-dashed border-lathe-ink/20 p-8 text-center">
            {error ? (
                <p className="text-sm text-red-500 mb-3">{error}</p>
            ) : (
                <Camera className="w-10 h-10 mx-auto text-lathe-ink/30 mb-3" />
            )}
            <button onClick={startCamera} className="bg-lathe-ink text-lathe-surface font-bold text-sm px-6 py-2.5 rounded-full hover:bg-lathe-ink/90 transition-colors flex items-center gap-2 mx-auto">
                <Camera className="w-4 h-4" /> Buka Kamera
            </button>
            <p className="text-xs text-lathe-ink/40 mt-2">Opsional — ambil foto selfie</p>
        </div>
    );
}

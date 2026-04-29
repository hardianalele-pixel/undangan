import React, { useState, useEffect, useRef } from 'react';
import { Music, Pause } from 'lucide-react';
import { cn } from './Button';

interface AudioPlayerProps {
  url: string;
}

export function AudioPlayer({ url }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.loop = true;
    } else {
      audioRef.current.src = url;
    }

    // Try to autoplay, but handle browser restrictions gracefully
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Autoplay was prevented by the browser. User must interact first.
          setIsPlaying(false);
        });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [url]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button
      onClick={togglePlay}
      className={cn(
        "fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-lathe-ink bg-lathe-surface text-lathe-ink shadow-lg transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lathe-ink",
        isPlaying ? "animate-[spin_4s_linear_infinite]" : "hover:scale-105"
      )}
      aria-label={isPlaying ? "Pause background music" : "Play background music"}
    >
      {isPlaying ? (
        <Pause className="h-5 w-5" />
      ) : (
        <Music className="h-5 w-5" />
      )}
    </button>
  );
}

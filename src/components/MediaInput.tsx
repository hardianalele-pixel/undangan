import React, { useRef, useState, DragEvent } from 'react';
import { Upload, Image as ImageIcon, Music, QrCode } from 'lucide-react';
import { Input } from './Input';
import { cn } from './Button';

interface MediaInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  accept: string;
  type: 'image' | 'audio' | 'qris';
  placeholder?: string;
}

export function MediaInput({ label, value, onChange, accept, type, placeholder }: MediaInputProps) {
  const [mode, setMode] = useState<'url' | 'upload'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const isBase64 = value.startsWith('data:');

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-lathe-ink">{label}</label>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={cn("text-xs px-2 py-1 rounded", mode === 'upload' ? "bg-lathe-ink/10 font-medium" : "text-lathe-ink/60 hover:bg-lathe-ink/5")}
          >
            Upload
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={cn("text-xs px-2 py-1 rounded", mode === 'url' ? "bg-lathe-ink/10 font-medium" : "text-lathe-ink/60 hover:bg-lathe-ink/5")}
          >
            URL
          </button>
        </div>
      </div>

      {mode === 'url' ? (
        <Input
          type="url"
          value={isBase64 ? '' : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <div 
          className={cn(
            "border-2 border-dashed p-6 flex flex-col items-center justify-center cursor-pointer transition-colors",
            isDragging ? "border-lathe-ink bg-lathe-ink/5" : "border-lathe-ink/20 bg-lathe-surface/50 hover:bg-lathe-surface"
          )}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept={accept}
            onChange={handleFileChange}
          />
          {value && isBase64 ? (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-lathe-yellow/20 text-lathe-ink flex items-center justify-center mx-auto mb-2">
                {type === 'audio' ? <Music className="w-6 h-6" /> : type === 'qris' ? <QrCode className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
              </div>
              <p className="text-sm font-medium">File uploaded successfully</p>
              <p className="text-xs text-lathe-ink/60 mt-1">Click or drag to replace</p>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="w-6 h-6 text-lathe-ink/40 mx-auto mb-2" />
              <p className="text-sm font-medium">Click to upload file</p>
              <p className="text-xs text-lathe-ink/60 mt-1">or drag and drop</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

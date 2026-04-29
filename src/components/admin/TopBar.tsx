import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../Button';
import { ExternalLink, Save, Loader2, Monitor, Smartphone, Settings, ArrowLeft, Moon, Sun, Laptop } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface TopBarProps {
    title: string;
    slug: string;
    saving: boolean;
    previewMode: 'mobile' | 'desktop';
    onPreviewModeChange: (mode: 'mobile' | 'desktop') => void;
    onSave: () => void;
    onPublish: () => void;
    onOpenSettings: () => void;
    isPublished: boolean;
}

/**
 * Top bar for the visual builder.
 * Shows invitation title, device toggle, settings gear, and save/publish actions.
 */
export function TopBar({
    title,
    slug,
    saving,
    previewMode,
    onPreviewModeChange,
    onSave,
    onPublish,
    onOpenSettings,
    isPublished,
}: TopBarProps) {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <header className="h-14 flex items-center gap-4 px-4 border-b border-lathe-ink/10 dark:border-lathe-surface/10 bg-lathe-surface dark:bg-lathe-ink text-lathe-ink dark:text-lathe-surface flex-shrink-0 transition-colors">

            <button
                onClick={() => navigate('/dashboard')}
                className="p-1.5 rounded-md hover:bg-lathe-ink/5 dark:hover:bg-lathe-surface/10 transition-colors"
                title="Kembali ke Dasbor"
            >
                <ArrowLeft className="w-4.5 h-4.5" />
            </button>

            {/* Title */}
            <div className="flex items-center gap-3 min-w-0">
                <h2 className="text-sm font-bold truncate">{title || 'Undangan Baru'}</h2>
                {slug && (
                    <Link
                        to={`/${slug}`}
                        target="_blank"
                        className="text-neutral-400 hover:text-neutral-700 transition-colors"
                        title="Lihat undangan"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                )}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Device toggle */}
            <div className="flex items-center bg-lathe-ink/5 dark:bg-lathe-surface/10 rounded-lg p-0.5 gap-0.5">
                <button
                    onClick={() => onPreviewModeChange('mobile')}
                    className={cn(
                        'p-1.5 rounded-md transition-colors',
                        previewMode === 'mobile'
                            ? 'bg-lathe-surface dark:bg-lathe-ink shadow-sm text-lathe-ink dark:text-lathe-surface'
                            : 'text-lathe-ink/40 dark:text-lathe-surface/40 hover:text-lathe-ink dark:hover:text-lathe-surface'
                    )}
                    title="Tampilan mobile"
                >
                    <Smartphone className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onPreviewModeChange('desktop')}
                    className={cn(
                        'p-1.5 rounded-md transition-colors',
                        previewMode === 'desktop'
                            ? 'bg-lathe-surface dark:bg-lathe-ink shadow-sm text-lathe-ink dark:text-lathe-surface'
                            : 'text-lathe-ink/40 dark:text-lathe-surface/40 hover:text-lathe-ink dark:hover:text-lathe-surface'
                    )}
                    title="Tampilan desktop"
                >
                    <Monitor className="w-4 h-4" />
                </button>
            </div>

            {/* Theme toggle */}
            <button
                title={`Theme: ${theme}`}
                onClick={toggleTheme}
                className="p-1.5 rounded-md text-lathe-ink/40 hover:text-lathe-ink dark:text-lathe-surface/40 dark:hover:text-lathe-surface hover:bg-lathe-ink/5 dark:hover:bg-lathe-surface/10 transition-colors"
            >
                {theme === 'dark' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
                <span className="sr-only">Toggle theme</span>
            </button>

            {/* Settings gear */}
            <button
                onClick={onOpenSettings}
                className="p-1.5 rounded-md text-lathe-ink/40 hover:text-lathe-ink dark:text-lathe-surface/40 dark:hover:text-lathe-surface hover:bg-lathe-ink/5 dark:hover:bg-lathe-surface/10 transition-colors"
                title="Pengaturan undangan"
            >
                <Settings className="w-4.5 h-4.5" />
            </button>

            {/* Actions */}
            <div className="flex items-center gap-2">
                <button
                    onClick={onSave}
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 px-3 h-8 text-xs font-medium border border-lathe-ink/20 dark:border-lathe-surface/20 rounded-md hover:bg-lathe-ink/5 dark:hover:bg-lathe-surface/10 transition-colors disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    Simpan
                </button>
                <button
                    onClick={onPublish}
                    className={cn(
                        'inline-flex items-center gap-1.5 px-4 h-8 text-xs font-bold rounded-md transition-colors',
                        isPublished
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                            : 'lathe-signal text-lathe-ink hover:brightness-105'
                    )}
                >
                    {isPublished ? 'Published' : 'Publikasikan'}
                </button>
            </div>
        </header>
    );
}

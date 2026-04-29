import React, { useState, useEffect } from 'react';
import { Save, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AppLayout } from '../components/layout/AppLayout';

export interface GlobalSettings {
    fonnteApiKey: string;
    customFavicon: string;
    customFooter: string;
}

const DEFAULT_SETTINGS: GlobalSettings = {
    fonnteApiKey: '',
    customFavicon: '',
    customFooter: '',
};

export const getGlobalSettings = (): GlobalSettings => {
    const saved = localStorage.getItem('lathe_global_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
};

export function Settings() {
    const [settings, setSettings] = useState<GlobalSettings>(DEFAULT_SETTINGS);
    const [saveMessage, setSaveMessage] = useState('');

    useEffect(() => {
        setSettings(getGlobalSettings());
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem('lathe_global_settings', JSON.stringify(settings));

        // Apply favicon dynamically
        if (settings.customFavicon) {
            let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.getElementsByTagName('head')[0].appendChild(link);
            }
            link.href = settings.customFavicon;
        }

        setSaveMessage('Pengaturan berhasil disimpan.');
        setTimeout(() => setSaveMessage(''), 3000);
    };

    return (
        <AppLayout title="Pengaturan">
            <div className="p-8 overflow-y-auto w-full h-full">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-full bg-lathe-ink/5 dark:bg-lathe-surface/10 flex items-center justify-center shrink-0">
                            <SettingsIcon className="w-6 h-6 text-lathe-ink dark:text-lathe-surface" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-lathe-ink dark:text-lathe-surface">Pengaturan Agensi</h1>
                            <p className="text-lathe-ink/60 dark:text-lathe-surface/60 mt-1">Konfigurasi branding dan integrasi API untuk agensi Anda.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="space-y-8">

                        {/* API Integrations */}
                        <section className="bg-white dark:bg-lathe-ink p-6 rounded-xl ring-1 ring-lathe-ink/10 dark:ring-lathe-surface/10">
                            <h2 className="text-lg font-semibold mb-4 border-b border-lathe-ink/20 dark:border-lathe-surface/20 pb-2 text-lathe-ink dark:text-lathe-surface">Integrasi Gateway</h2>
                            <div className="space-y-4">
                                <Input
                                    label="API Key Fonnte (WhatsApp Gateway)"
                                    name="fonnteApiKey"
                                    value={settings.fonnteApiKey}
                                    onChange={handleChange}
                                    placeholder="Paste API Key Fonnte Anda di sini"
                                />
                                <p className="text-sm text-lathe-ink/60">
                                    Dibutuhkan untuk fitur Auto-Reply RSVP dan WA Broadcast. Dapatkan key di <a href="https://fonnte.com" target="_blank" rel="noreferrer" className="underline">fonnte.com</a>.
                                </p>
                            </div>
                        </section>

                        {/* White-Label Branding */}
                        <section className="bg-white dark:bg-lathe-ink p-6 rounded-xl ring-1 ring-lathe-ink/10 dark:ring-lathe-surface/10">
                            <h2 className="text-lg font-semibold mb-4 border-b border-lathe-ink/20 dark:border-lathe-surface/20 pb-2 text-lathe-ink dark:text-lathe-surface">White-Label Branding</h2>
                            <div className="space-y-6">
                                <div>
                                    <Input
                                        label="URL Favicon Kustom"
                                        name="customFavicon"
                                        type="url"
                                        value={settings.customFavicon}
                                        onChange={handleChange}
                                        placeholder="https://example.com/favicon.ico"
                                    />
                                    <p className="text-sm text-lathe-ink/60 mt-1">
                                        Ikon kecil yang muncul di tab browser.
                                    </p>
                                </div>

                                <div>
                                    <Input
                                        label="Teks Footer Undangan Kustom"
                                        name="customFooter"
                                        value={settings.customFooter}
                                        onChange={handleChange}
                                        placeholder="Made with ❤️ by Adit Digital Agency"
                                    />
                                    <p className="text-sm text-lathe-ink/60 mt-1">
                                        Akan ditampilkan di bagian paling bawah setiap undangan digital klien.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <div className="flex items-center justify-end gap-4 pt-4">
                            {saveMessage && (
                                <span className="text-sm font-medium text-green-600">{saveMessage}</span>
                            )}
                            <Button type="submit" className="gap-2 lathe-signal text-lathe-ink border-lathe-ink">
                                <Save className="w-4 h-4" />
                                Simpan Pengaturan
                            </Button>
                        </div>

                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

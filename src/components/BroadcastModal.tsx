import React, { useState } from 'react';
import { X, Send, AlertCircle, FileText } from 'lucide-react';
import { Button } from './Button';
import { getGlobalSettings } from '../pages/Settings';

interface BroadcastModalProps {
    isOpen: boolean;
    onClose: () => void;
    invite: any;
}

export function BroadcastModal({ isOpen, onClose, invite }: BroadcastModalProps) {
    const [csvData, setCsvData] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [progress, setProgress] = useState(0);
    const [total, setTotal] = useState(0);
    const [results, setResults] = useState<{ name: string; phone: string; status: 'pending' | 'success' | 'failed' }[]>([]);

    if (!isOpen) return null;

    const globalSettings = getGlobalSettings();
    const hasFonnteKey = !!globalSettings.fonnteApiKey;

    const parseCsv = (text: string) => {
        return text.split('\n')
            .map(line => line.split(',').map(s => s.trim()))
            .filter(parts => parts.length >= 2 && parts[0] && parts[1]);
    };

    const handleBroadcast = async () => {
        if (!hasFonnteKey) return;

        const rows = parseCsv(csvData);
        if (rows.length === 0) return;

        setIsSending(true);
        setTotal(rows.length);
        setProgress(0);

        const initialResults = rows.map(([name, phone]) => ({ name, phone, status: 'pending' as const }));
        setResults(initialResults);

        // Blast loop
        for (let i = 0; i < rows.length; i++) {
            const [name, phone] = rows[i];
            const link = `https://undang-aja.com/invite/${invite.slug}?to=${encodeURIComponent(name)}`;
            const message = `Kepada Yth. Bapak/Ibu/Saudara/i *${name}*,\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk hadir dan memberikan doa restu pada acara pernikahan kami.\n\nDetail undangan dapat dilihat pada tautan berikut:\n${link}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.\n\nTerima kasih,\n${invite.groomName} & ${invite.brideName}`;

            try {
                // Real implementation would use fetch to Fonnte:
                /*
                await fetch('https://api.fonnte.com/send', {
                  method: 'POST',
                  headers: {
                    'Authorization': globalSettings.fonnteApiKey,
                  },
                  body: new URLSearchParams({
                    target: phone,
                    message: message,
                    countryCode: '62'
                  })
                });
                */

                // Mock delay for demonstration
                await new Promise(resolve => setTimeout(resolve, 800));

                setResults(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'success' } : r));
            } catch (err) {
                setResults(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'failed' } : r));
            }
            setProgress(i + 1);
        }

        setIsSending(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-lathe-ink/50 backdrop-blur-sm">
            <div className="bg-lathe-surface dark:bg-lathe-ink text-lathe-ink dark:text-lathe-surface w-full max-w-2xl border border-lathe-ink/10 dark:border-lathe-surface/10 shadow-2xl flex flex-col max-h-[90vh] transition-colors rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-lathe-ink/10 dark:border-lathe-surface/10">
                    <div>
                        <h2 className="text-xl font-bold">Broadcast WhatsApp</h2>
                        <p className="text-sm text-lathe-ink/60 dark:text-lathe-surface/60 mt-1">
                            {invite.groomName} & {invite.brideName}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-lathe-ink/5 dark:hover:bg-lathe-surface/10 rounded-full transition-colors" disabled={isSending}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                    {!hasFonnteKey && (
                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold">API Key Fonnte Belum Dikonfigurasi</h4>
                                <p className="text-sm mt-1">Anda harus mengatur API Key Fonnte di menu Pengaturan sebelum dapat melakukan Broadcast WhatsApp otomatis.</p>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                            <FileText className="w-4 h-4" />
                            Tempel Data Tamu (CSV)
                        </label>
                        <p className="text-xs text-lathe-ink/60 dark:text-lathe-surface/60 mb-3 block">Format: Nama, Nomor HP (Gunakan kode negara, misal: 62812...)</p>
                        <textarea
                            className="w-full h-48 p-4 border border-lathe-ink/20 dark:border-lathe-surface/20 bg-transparent font-mono text-sm focus:outline-none focus:border-lathe-primary transition-colors resize-none rounded-lg"
                            placeholder={'Budi Santoso, 6281234567890\nSiti Aminah, 6289876543210'}
                            value={csvData}
                            onChange={(e) => setCsvData(e.target.value)}
                            disabled={isSending || !hasFonnteKey}
                        />
                    </div>

                    {total > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm font-medium">
                                <span>Progress Pengiriman</span>
                                <span>{progress} / {total} Tamu</span>
                            </div>
                            <div className="h-2 w-full bg-lathe-ink/10 dark:bg-lathe-surface/10 overflow-hidden rounded-full">
                                <div
                                    className="h-full lathe-signal transition-all duration-300 ease-out rounded-full"
                                    style={{ width: `${(progress / total) * 100}%` }}
                                ></div>
                            </div>

                            <div className="max-h-32 overflow-y-auto border border-lathe-ink/10 dark:border-lathe-surface/10 bg-transparent rounded-lg text-xs">
                                {results.map((r, i) => (
                                    <div key={i} className="flex items-center justify-between p-2 border-b border-lathe-ink/5 last:border-0">
                                        <span className="font-mono">{r.name} ({r.phone})</span>
                                        <span className={`font-medium ${r.status === 'success' ? 'text-green-600' :
                                            r.status === 'failed' ? 'text-red-600' : 'text-lathe-ink/40'
                                            }`}>
                                            {r.status === 'success' ? 'Terkirim' : r.status === 'failed' ? 'Gagal' : 'Menunggu...'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-lathe-ink/10 dark:border-lathe-surface/10 bg-transparent flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} disabled={isSending}>
                        Tutup
                    </Button>
                    <Button
                        className="gap-2 lathe-signal text-lathe-ink border-lathe-ink"
                        onClick={handleBroadcast}
                        disabled={isSending || !csvData.trim() || !hasFonnteKey}
                    >
                        <Send className="w-4 h-4" />
                        {isSending ? 'Mengirim...' : 'Mulai Broadcast'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

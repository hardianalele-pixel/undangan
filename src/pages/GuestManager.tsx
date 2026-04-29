import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ArrowLeft, Plus, Trash2, Star, QrCode, Download, Upload, Users } from 'lucide-react';
import { guestsAPI, invitationsAPI } from '../utils/api';
import { generateQRDataURL } from '../utils/qr';
import type { Guest, InvitationDocument } from '../types';

export function GuestManager() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [invite, setInvite] = useState<InvitationDocument | null>(null);
    const [guests, setGuests] = useState<Guest[]>([]);
    const [showAdd, setShowAdd] = useState(false);
    const [newGuest, setNewGuest] = useState({ name: '', phone: '', pax: 1, is_vip: false });
    const [csvInput, setCsvInput] = useState('');
    const [showImport, setShowImport] = useState(false);

    useEffect(() => {
        if (!slug) return;
        // Get invitation by slug from list
        invitationsAPI.list().then((data: any) => {
            const inv = data.invitations.find((i: any) => i.slug === slug);
            if (inv) {
                setInvite(inv);
                loadGuests(inv.id);
            }
        });
    }, [slug]);

    const loadGuests = async (invitationId: string) => {
        try {
            const data = await guestsAPI.list(invitationId);
            setGuests((data as any).guests || []);
        } catch { }
    };

    const handleAdd = async () => {
        if (!invite || !newGuest.name) return;
        try {
            await guestsAPI.add(invite.id, newGuest);
            await loadGuests(invite.id);
            setNewGuest({ name: '', phone: '', pax: 1, is_vip: false });
            setShowAdd(false);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleDelete = async (guestId: string) => {
        try {
            await guestsAPI.delete(guestId);
            setGuests(prev => prev.filter(g => g.id !== guestId));
        } catch { }
    };

    const handleToggleVip = async (guest: Guest) => {
        try {
            await guestsAPI.update(guest.id, { is_vip: guest.is_vip ? 0 : 1 });
            setGuests(prev => prev.map(g => g.id === guest.id ? { ...g, is_vip: g.is_vip ? 0 : 1 } : g));
        } catch { }
    };

    const handleImport = async () => {
        if (!invite || !csvInput.trim()) return;
        const rows = csvInput.split('\n').map(line => line.split(',').map(s => s.trim())).filter(r => r.length >= 1 && r[0]);
        const guestList = rows.map(([name, phone, pax]) => ({
            name, phone: phone || '', pax: parseInt(pax) || 1, is_vip: false,
        }));
        try {
            await guestsAPI.batchImport(invite.id, guestList);
            await loadGuests(invite.id);
            setCsvInput('');
            setShowImport(false);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const downloadQR = (guest: Guest) => {
        const dataUrl = generateQRDataURL(guest.qr_token, 300);
        const link = document.createElement('a');
        link.download = `qr-${guest.name.replace(/\s+/g, '-')}.png`;
        link.href = dataUrl;
        link.click();
    };

    const totalPax = guests.reduce((sum, g) => sum + g.pax, 0);
    const checkedIn = guests.filter(g => g.checked_in_at).length;

    return (
        <AppLayout title="Daftar Tamu">
            <div className="p-8 overflow-y-auto w-full h-full">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="w-10 h-10 p-0 rounded-full text-lathe-ink dark:text-lathe-surface hover:bg-lathe-ink/5 dark:hover:bg-lathe-surface/10">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold tracking-tight text-lathe-ink dark:text-lathe-surface">Daftar Tamu</h1>
                            {invite && <p className="text-lathe-ink/60 dark:text-lathe-surface/60 mt-1 font-medium">{invite.meta.groomName} & {invite.meta.brideName}</p>}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowImport(!showImport)}>
                                <Upload className="w-4 h-4" /> Import CSV
                            </Button>
                            <Button size="sm" className="gap-2 lathe-signal text-lathe-ink border-lathe-ink" onClick={() => setShowAdd(!showAdd)}>
                                <Plus className="w-4 h-4" /> Tambah Tamu
                            </Button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        {[
                            { label: 'Total Tamu', value: guests.length, icon: Users },
                            { label: 'Total Pax', value: totalPax, icon: Users },
                            { label: 'VIP', value: guests.filter(g => g.is_vip).length, icon: Star },
                            { label: 'Checked In', value: checkedIn, icon: QrCode },
                        ].map((s, i) => (
                            <div key={i} className="bg-white dark:bg-lathe-ink p-4 text-center rounded-xl ring-1 ring-lathe-ink/10 dark:ring-lathe-surface/10">
                                <s.icon className="w-5 h-5 mx-auto text-lathe-ink/40 dark:text-lathe-surface/40 mb-2" />
                                <p className="text-2xl font-bold text-lathe-ink dark:text-lathe-surface">{s.value}</p>
                                <p className="text-xs text-lathe-ink/60 dark:text-lathe-surface/60 font-medium">{s.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Import CSV Panel */}
                    {showImport && (
                        <div className="bg-white dark:bg-lathe-ink p-6 mb-6 space-y-4 rounded-xl ring-1 ring-lathe-ink/10 dark:ring-lathe-surface/10">
                            <h3 className="font-bold text-lathe-ink dark:text-lathe-surface">Import dari CSV</h3>
                            <p className="text-xs text-lathe-ink/60 dark:text-lathe-surface/60">Format: Nama, Nomor HP, Jumlah Orang (satu per baris)</p>
                            <textarea
                                className="w-full h-32 p-3 border border-lathe-ink/20 font-mono text-sm rounded resize-none focus:outline-none focus:border-lathe-ink"
                                placeholder={'Budi Santoso, 6281234567890, 2\nSiti Aminah, 6289876543210, 1'}
                                value={csvInput}
                                onChange={e => setCsvInput(e.target.value)}
                            />
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => setShowImport(false)}>Batal</Button>
                                <Button size="sm" className="lathe-signal text-lathe-ink border-lathe-ink" onClick={handleImport}>Import</Button>
                            </div>
                        </div>
                    )}

                    {/* Add Guest Panel */}
                    {showAdd && (
                        <div className="bg-white dark:bg-lathe-ink p-6 mb-6 rounded-xl ring-1 ring-lathe-ink/10 dark:ring-lathe-surface/10">
                            <h3 className="font-bold mb-4 text-lathe-ink dark:text-lathe-surface">Tambah Tamu Baru</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Input label="Nama" value={newGuest.name} onChange={e => setNewGuest(p => ({ ...p, name: e.target.value }))} placeholder="Nama tamu" required />
                                <Input label="No. HP" value={newGuest.phone} onChange={e => setNewGuest(p => ({ ...p, phone: e.target.value }))} placeholder="628..." />
                                <Input label="Jumlah Orang" type="number" value={String(newGuest.pax)} onChange={e => setNewGuest(p => ({ ...p, pax: parseInt(e.target.value) || 1 }))} />
                                <div className="flex items-end gap-3">
                                    <label className="flex items-center gap-2 text-sm mb-1">
                                        <input type="checkbox" checked={newGuest.is_vip} onChange={e => setNewGuest(p => ({ ...p, is_vip: e.target.checked }))} />
                                        VIP
                                    </label>
                                    <Button size="sm" className="lathe-signal text-lathe-ink border-lathe-ink" onClick={handleAdd}>Tambah</Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Guest Table */}
                    {guests.length === 0 ? (
                        <div className="border border-dashed border-lathe-ink/20 dark:border-lathe-surface/20 rounded-xl p-12 text-center bg-lathe-surface/50 dark:bg-lathe-ink/50">
                            <Users className="w-12 h-12 mx-auto text-lathe-ink/20 dark:text-lathe-surface/20 mb-4" />
                            <h3 className="text-lg font-medium mb-2 text-lathe-ink dark:text-lathe-surface">Belum ada tamu</h3>
                            <p className="text-lathe-ink/60 dark:text-lathe-surface/60">Tambahkan tamu secara manual atau import dari CSV.</p>
                        </div>
                    ) : (
                        <div className="overflow-hidden bg-white dark:bg-lathe-ink rounded-xl ring-1 ring-lathe-ink/10 dark:ring-lathe-surface/10">
                            <table className="w-full text-left text-sm text-lathe-ink dark:text-lathe-surface">
                                <thead className="bg-lathe-ink/5 dark:bg-lathe-surface/5 border-b border-lathe-ink/10 dark:border-lathe-surface/10">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Nama</th>
                                        <th className="px-4 py-3 font-medium">No. HP</th>
                                        <th className="px-4 py-3 font-medium text-center">Pax</th>
                                        <th className="px-4 py-3 font-medium text-center">VIP</th>
                                        <th className="px-4 py-3 font-medium text-center">Status</th>
                                        <th className="px-4 py-3 font-medium text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-lathe-ink/10">
                                    {guests.map(guest => (
                                        <tr key={guest.id} className="hover:bg-lathe-ink/5 transition-colors">
                                            <td className="px-4 py-3 font-medium">{guest.name}</td>
                                            <td className="px-4 py-3 text-lathe-ink/70 font-mono text-xs">{guest.phone || '-'}</td>
                                            <td className="px-4 py-3 text-center">{guest.pax}</td>
                                            <td className="px-4 py-3 text-center">
                                                <button onClick={() => handleToggleVip(guest)} className={`p-1 rounded ${guest.is_vip ? 'text-yellow-500' : 'text-lathe-ink/20 hover:text-yellow-400'}`}>
                                                    <Star className="w-4 h-4" fill={guest.is_vip ? 'currentColor' : 'none'} />
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {guest.checked_in_at ? (
                                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">✓ Hadir</span>
                                                ) : (
                                                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Belum</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button onClick={() => downloadQR(guest)} className="p-1.5 hover:bg-lathe-ink/5 rounded" title="Download QR">
                                                        <Download className="w-4 h-4 text-lathe-ink/60" />
                                                    </button>
                                                    <button onClick={() => handleDelete(guest.id)} className="p-1.5 hover:bg-red-50 rounded text-red-400 hover:text-red-600" title="Hapus">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { BroadcastModal } from '../components/BroadcastModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { Button } from '../components/Button';
import {
  Eye, Trash2, Send, Users, QrCode, MonitorPlay,
  BookOpenText, Check, AlertCircle, LayoutDashboard,
  PlusCircle, Settings, X
} from 'lucide-react';
import { invitationsAPI } from '../utils/api';
import type { InvitationDocument } from '../types';
import ProjectDashboard, { Project } from '../components/ui/project-management-dashboard';
import { AppLayout } from '../components/layout/AppLayout';
import { APP_CONFIG } from '../constants';

export function Dashboard() {
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState<InvitationDocument[]>([]);
  const [broadcastData, setBroadcastData] = useState<InvitationDocument | null>(null);

  // Deletion state
  const [deleteTarget, setDeleteTarget] = useState<InvitationDocument | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Action Menu state
  const [actionTarget, setActionTarget] = useState<InvitationDocument | null>(null);

  useEffect(() => {
    loadInvitations();
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const loadInvitations = async () => {
    try {
      const data = await invitationsAPI.list() as any;
      setInvitations(data.invitations || []);
    } catch { }
  };

  const handleDeleteRequest = (inv: InvitationDocument) => {
    setActionTarget(null);
    setDeleteTarget(inv);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await invitationsAPI.delete(deleteTarget.id);
      setInvitations((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      setToast({ type: 'success', message: `Undangan "${deleteTarget.meta.groomName} & ${deleteTarget.meta.brideName}" berhasil dihapus.` });
      setDeleteTarget(null);
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Gagal menghapus undangan.' });
    } finally {
      setDeleting(false);
    }
  };

  const projects: Project[] = invitations.map((inv) => {
    return {
      id: inv.id,
      name: `${inv.meta.groomName || '?'} & ${inv.meta.brideName || '?'}`,
      subtitle: `/${inv.slug}`,
      date: inv.meta.eventDate ? new Date(inv.meta.eventDate).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }) : 'Tanggal belum diatur',
      status: inv.status === 'published' ? 'published' : 'draft',
      progress: inv.status === 'published' ? 100 : Math.min((inv.blocks?.length || 0) * 10, 99),
      accentColor: '#FFE500',
      participants: [
        inv.meta.heroImage || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=256&h=256'
      ]
    };
  });

  return (
    <AppLayout title={APP_CONFIG.companyName}>
      <ProjectDashboard
        projects={projects}
        persistKey="lathe-dashboard"
        allowCreate={true}
        onProjectCreate={() => navigate('/create')}
        onProjectAction={(projectId, action) => {
          const inv = invitations.find(i => i.id === projectId);
          if (!inv) return;
          if (action === 'delete') {
            handleDeleteRequest(inv);
          } else if (action === 'edit') {
            navigate(`/edit/${inv.id}`);
          } else if (action === 'open') {
            setActionTarget(inv);
          }
        }}
        onProjectClick={(projectId) => {
          const inv = invitations.find(i => i.id === projectId);
          if (inv) navigate(`/edit/${inv.id}`);
        }}
        emptyProjectsLabel="Belum ada undangan. Mulai buat undangan pertama Anda!"
      />

      {broadcastData && (
        <BroadcastModal
          isOpen={!!broadcastData}
          invite={broadcastData}
          onClose={() => setBroadcastData(null)}
        />
      )}

      {/* Modern Options Modal */}
      <AnimatePresence>
        {actionTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setActionTarget(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm rounded-xl shadow-2xl bg-lathe-surface dark:bg-lathe-ink ring-1 ring-lathe-ink/20 dark:ring-lathe-surface/20 p-5 font-sans"
            >
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-lathe-ink/10 dark:border-lathe-surface/10">
                <div>
                  <h3 className="font-bold text-lathe-ink dark:text-lathe-surface">
                    {actionTarget.meta.groomName || '?'} & {actionTarget.meta.brideName || '?'}
                  </h3>
                  <p className="text-xs text-lathe-ink/50 dark:text-lathe-surface/50 mt-0.5 font-mono">
                    /{actionTarget.slug}
                  </p>
                </div>
                <button
                  onClick={() => setActionTarget(null)}
                  className="p-1.5 rounded-lg hover:bg-lathe-ink/5 dark:hover:bg-lathe-surface/10 text-lathe-ink/60 dark:text-lathe-surface/60 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <OptionButton
                  icon={Eye}
                  label="Lihat Undangan"
                  onClick={() => { window.open(`/${actionTarget.slug}`, '_blank'); setActionTarget(null); }}
                />
                <OptionButton
                  icon={Users}
                  label="Daftar Tamu"
                  onClick={() => { navigate(`/guests/${actionTarget.slug}`); setActionTarget(null); }}
                />
                <OptionButton
                  icon={QrCode}
                  label="Scan Check-In"
                  onClick={() => { window.open(`/checkin/${actionTarget.slug}`, '_blank'); setActionTarget(null); }}
                />
                <OptionButton
                  icon={BookOpenText}
                  label="Kiosk Guest Book"
                  onClick={() => { window.open(`/kiosk/${actionTarget.slug}`, '_blank'); setActionTarget(null); }}
                />
                <OptionButton
                  icon={MonitorPlay}
                  label="Broadcast Screen"
                  onClick={() => { window.open(`/broadcast/${actionTarget.slug}`, '_blank'); setActionTarget(null); }}
                />
                <OptionButton
                  icon={Send}
                  label="WA Broadcast"
                  onClick={() => { setBroadcastData(actionTarget); setActionTarget(null); }}
                />
              </div>

              <div className="mt-4 pt-4 border-t border-lathe-ink/10 dark:border-lathe-surface/10">
                <button
                  onClick={() => { handleDeleteRequest(actionTarget); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold text-red-600 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus Undangan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Deletion Confirmation Modal */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Hapus Undangan"
        message={deleteTarget
          ? `Anda yakin ingin menghapus undangan "${deleteTarget.meta.groomName} & ${deleteTarget.meta.brideName}"? Semua data tamu dan RSVP juga akan terhapus. Tindakan ini tidak dapat dibatalkan.`
          : ''
        }
        confirmLabel="Hapus Permanen"
        variant="danger"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-2xl text-sm font-bold ${toast.type === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
              }`}
          >
            {toast.type === 'success' ? (
              <Check className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}

function OptionButton({ icon: Icon, label, onClick }: { icon: React.ElementType, label: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl ring-1 ring-lathe-ink/10 dark:ring-lathe-surface/10 bg-white dark:bg-lathe-ink/50 hover:bg-lathe-ink/5 dark:hover:bg-lathe-surface/10 hover:ring-lathe-ink/30 dark:hover:ring-lathe-surface/30 transition-all text-lathe-ink dark:text-lathe-surface"
    >
      <Icon className="w-5 h-5 opacity-70" />
      <span className="text-[10px] font-bold uppercase tracking-wide text-center leading-tight opacity-80">{label}</span>
    </button>
  );
}

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Check, AlertCircle } from 'lucide-react';
import { BuilderStepWizard } from '../components/admin/BuilderStepWizard';
import { PreviewCanvas } from '../components/admin/PreviewCanvas';
import { TopBar } from '../components/admin/TopBar';
import { PresetPicker } from '../components/admin/PresetPicker';
import { SettingsModal } from '../components/admin/SettingsModal';
import { OnboardingTooltips } from '../components/admin/OnboardingTooltips';
import { PRESETS, createBlock, defaultMeta } from '../presets';
import { DEFAULT_HERO } from '../utils/defaultImages';
import { invitationsAPI } from '../utils/api';
import type { Block, InvitationDocument, InvitationMeta, ThemeConfig } from '../types';

/**
 * Generate a URL-safe slug from names
 */
function generateSlug(groom: string, bride: string): string {
  const combined = `${groom}-${bride}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  return combined || `undangan-${Date.now().toString(36)}`;
}

export function CreateInvite() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  // Builder phases: 'preset' (first step) or 'editor' (two-column builder)
  const [phase, setPhase] = useState<'preset' | 'editor'>(isEditing ? 'editor' : 'preset');

  // Document state
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [meta, setMeta] = useState<InvitationMeta>({ ...defaultMeta });
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>({
    theme: 'elegant',
    preset: 'modern-minimal',
    layout: 'classic',
  });

  // UI state
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [saving, setSaving] = useState(false);
  const [saveToast, setSaveToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [createdId, setCreatedId] = useState<string | null>(id || null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load existing invitation for editing
  useEffect(() => {
    if (isEditing && id) {
      invitationsAPI
        .getDetail(id)
        .then((inv: any) => {
          setSlug(inv.slug);
          setStatus(inv.status);
          setMeta(inv.meta || { ...defaultMeta });
          setBlocks(inv.blocks || []);
          setThemeConfig(inv.theme_config || { theme: 'elegant', preset: '' });
          setCreatedId(inv.id);
        })
        .catch(() => navigate('/dashboard'));
    }
  }, [id, isEditing]);

  // Clear toast timer on unmount
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setSaveToast({ type, message });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setSaveToast(null), 3000);
  };

  const handlePresetSelect = (presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    const freshBlocks = preset.blocks.map((b, i) => ({
      ...b,
      id: `${b.type}-${Date.now()}-${i}`,
      sort_order: i,
    }));
    setBlocks(freshBlocks);
    setThemeConfig({ theme: preset.theme, preset: presetId, layout: preset.layout });

    // Inject sensible defaults if this is an empty/new invitation
    if (!meta.groomName && !meta.brideName) {
      setMeta({
        groomName: 'Romeo',
        brideName: 'Juliet',
        eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        eventTime: '09:00',
        venueName: 'The Grand Ballroom, Ritz-Carlton',
        googleMapsLink: 'https://maps.google.com',
        whatsappNumber: '6281234567890',
        heroImage: DEFAULT_HERO,
        audioUrl: '',
        qrisBarcode: ''
      });
      showToast('success', 'Preset & data contoh berhasil diterapkan');
    }

    // Auto-open first meaningful step
    if (freshBlocks.length > 0) {
      const firstEditable = freshBlocks.find(b => ['hero', 'couple', 'event'].includes(b.type));
      setActiveStepId(firstEditable?.id || freshBlocks[0].id);
    }

    setPhase('editor');
  };

  const applyPreset = (presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    const freshBlocks = preset.blocks.map((b, i) => ({
      ...b,
      id: `${b.type}-${Date.now()}-${i}`,
      sort_order: i,
    }));
    setBlocks(freshBlocks);
    setThemeConfig({ theme: preset.theme, preset: presetId, layout: preset.layout });

    if (!meta.groomName && !meta.brideName) {
      setMeta({
        groomName: 'Romeo',
        brideName: 'Juliet',
        eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        eventTime: '09:00',
        venueName: 'The Grand Ballroom, Ritz-Carlton',
        googleMapsLink: 'https://maps.google.com',
        whatsappNumber: '6281234567890',
        heroImage: DEFAULT_HERO,
        audioUrl: '',
        qrisBarcode: ''
      });
      showToast('success', 'Preset & data contoh berhasil diterapkan');
    }
  };

  const updateMeta = useCallback((field: string, value: any) => {
    setMeta((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateBlockConfig = useCallback(
    (blockId: string, key: string, value: any) => {
      setBlocks((prev) =>
        prev.map((b) =>
          b.id === blockId
            ? { ...b, config: { ...b.config, [key]: value } }
            : b
        )
      );
    },
    []
  );

  const toggleBlockVisibility = useCallback((blockId: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, visible: !b.visible } : b))
    );
  }, []);

  const deleteBlock = useCallback(
    (blockId: string) => {
      setBlocks((prev) =>
        prev
          .filter((b) => b.id !== blockId)
          .map((b, i) => ({ ...b, sort_order: i }))
      );
      setActiveStepId((current) => {
        if (current === blockId) return null;
        return current;
      });
    },
    []
  );

  const addBlock = useCallback(
    (type: Block['type']) => {
      const newBlock = createBlock(type, blocks.length);
      setBlocks((prev) => [...prev, newBlock]);
      setActiveStepId(newBlock.id);
    },
    [blocks.length]
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      let finalSlug = slug;
      if (!finalSlug) {
        finalSlug = generateSlug(meta.groomName, meta.brideName);
        setSlug(finalSlug);
      }

      const payload = {
        slug: finalSlug,
        status,
        meta,
        blocks,
        theme_config: themeConfig,
      };

      if (createdId) {
        await invitationsAPI.update(createdId, payload);
        showToast('success', 'Undangan berhasil disimpan');
      } else {
        const result: any = await invitationsAPI.create(payload);
        setCreatedId(result.id);
        showToast('success', 'Undangan berhasil dibuat');
        window.history.replaceState(null, '', `/edit/${result.id}`);
      }
    } catch (err: any) {
      if (err.message?.toLowerCase().includes('kuota') || err.message?.toLowerCase().includes('bayar')) {
        showToast('error', err.message);
        setTimeout(() => navigate('/billing'), 1200);
      } else {
        showToast('error', err.message || 'Gagal menyimpan undangan');
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = () => {
    setStatus((s) => (s === 'published' ? 'draft' : 'published'));
  };

  // ─── Preset picker phase ───────────────────────────────────────
  if (phase === 'preset') {
    return <PresetPicker onSelect={handlePresetSelect} />;
  }

  // ─── Builder phase ─────────────────────────────────────────────
  const previewDoc: InvitationDocument = {
    id: createdId || 'preview',
    slug: slug || 'preview',
    status,
    meta,
    blocks,
    theme_config: themeConfig,
    created_at: new Date().toISOString(),
  };

  const title = [meta.groomName, meta.brideName].filter(Boolean).join(' & ');

  return (
    <div className="relative flex h-screen overflow-hidden bg-lathe-surface dark:bg-lathe-ink text-lathe-ink dark:text-lathe-surface font-sans transition-colors">
      {/* Left: Step Wizard */}
      <BuilderStepWizard
        blocks={blocks}
        meta={meta}
        activeStepId={activeStepId}
        onSetActiveStep={setActiveStepId}
        onReorderBlocks={setBlocks}
        onToggleVisibility={toggleBlockVisibility}
        onAddBlock={addBlock}
        onUpdateBlockConfig={updateBlockConfig}
        onDeleteBlock={deleteBlock}
        onUpdateMeta={updateMeta}
      />

      {/* Right: Top bar + Preview canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar
          title={title}
          slug={slug}
          saving={saving}
          previewMode={previewMode}
          onPreviewModeChange={setPreviewMode}
          onSave={handleSave}
          onPublish={handlePublish}
          onOpenSettings={() => setSettingsOpen(true)}
          isPublished={status === 'published'}
        />
        <PreviewCanvas
          document={previewDoc}
          mode={previewMode}
          selectedBlockId={activeStepId}
          onSelectBlock={(blockId) => setActiveStepId(blockId)}
        />
      </div>

      {/* Settings drawer */}
      <SettingsModal
        open={settingsOpen}
        meta={meta}
        slug={slug}
        status={status}
        themeConfig={themeConfig}
        isEditing={!!createdId}
        onUpdateMeta={updateMeta}
        onUpdateSlug={setSlug}
        onUpdateTheme={(cfg) => setThemeConfig((prev) => ({ ...prev, ...cfg }))}
        onApplyPreset={applyPreset}
        onClose={() => setSettingsOpen(false)}
      />

      {/* Save toast */}
      <AnimatePresence>
        {saveToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium ${saveToast.type === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
              }`}
          >
            {saveToast.type === 'success' ? (
              <Check className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {saveToast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Onboarding */}
      <OnboardingTooltips active={phase === 'editor'} />
    </div>
  );
}

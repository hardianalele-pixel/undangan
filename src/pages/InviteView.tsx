import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { APP_CONFIG } from '../constants';
import { AudioPlayer } from '../components/AudioPlayer';
import { getGlobalSettings } from './Settings';
import { InvitationProvider } from '../contexts/InvitationContext';
import { BlockRenderer } from '../components/blocks/BlockRenderer';
import { invitationsAPI } from '../utils/api';
import { getThemeStyle } from '../utils/themes';
import type { InvitationDocument } from '../types';

export interface BuilderModeContext {
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string) => void;
}

interface InviteViewProps {
  previewData?: InvitationDocument;
  builderMode?: BuilderModeContext;
}

export function InviteView({ previewData, builderMode }: InviteViewProps) {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const guestName = searchParams.get('to');
  const [invite, setInvite] = useState<InvitationDocument | null>(previewData || null);
  const [loading, setLoading] = useState(!previewData);
  const [globalSettings] = useState(() => getGlobalSettings());

  useEffect(() => {
    if (previewData) {
      setInvite(previewData);
      return;
    }

    if (!slug) return;

    invitationsAPI.getPublic(slug)
      .then((data) => {
        setInvite(data as InvitationDocument);
      })
      .catch(() => {
        setInvite(null);
      })
      .finally(() => setLoading(false));
  }, [slug, previewData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lathe-surface text-lathe-ink font-sans">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-lathe-ink/20 border-t-lathe-ink rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lathe-ink/60">Memuat undangan...</p>
        </div>
      </div>
    );
  }

  if (!invite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lathe-surface text-lathe-ink font-sans p-6">
        <div className="text-center max-w-md w-full lathe-border bg-white p-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-lathe-ink/5 text-lathe-ink mb-6">
            <Heart className="w-6 h-6 opacity-40" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Undangan Tidak Ditemukan</h1>
          <p className="text-lathe-ink/60 leading-relaxed">
            Tautan yang Anda kunjungi mungkin rusak atau undangan telah dihapus.
          </p>
        </div>
      </div>
    );
  }

  const handleRsvpSubmit = async (rsvpData: any) => {
    if (previewData) return;
    const text = `Halo, saya ${rsvpData.name}. Saya ${rsvpData.attendance === 'yes' ? 'akan hadir' : 'berhalangan hadir'} di acara pernikahan Anda. Pesan: ${rsvpData.message}`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${invite.meta.whatsappNumber}?text=${encodedText}`, '_blank');
  };

  const theme = invite.theme_config?.theme || 'elegant';
  const isPreview = !!previewData;
  const themeStyle = getThemeStyle(theme);

  return (
    <InvitationProvider
      invite={invite}
      guestName={guestName}
      isPreview={isPreview}
      handleRsvpSubmit={handleRsvpSubmit}
    >
      {isPreview ? (
        <div
          className="w-full h-full relative overflow-x-hidden font-serif"
          style={{ ...themeStyle, backgroundColor: 'var(--color-lathe-surface)', color: 'var(--color-lathe-ink)' }}
        >
          <BlockRenderer
            blocks={invite.blocks || []}
            builderMode={builderMode}
          />
          {invite.meta.audioUrl && !builderMode && <AudioPlayer url={invite.meta.audioUrl} />}
          <footer className="py-8 text-center font-sans text-xs" style={{ color: 'var(--color-lathe-ink)', opacity: 0.4, backgroundColor: 'var(--color-lathe-surface)' }}>
            <p>{globalSettings.customFooter || `Sistem oleh ${APP_CONFIG.companyName}`}</p>
          </footer>
        </div>
      ) : (
        <div
          className="min-h-screen w-full relative font-serif lg:flex lg:overflow-hidden bg-lathe-surface"
          style={{ ...themeStyle, color: 'var(--color-lathe-ink)' }}
        >
          {/* Mobile Background Layer (hidden on desktop) */}
          {invite.meta.heroImage && (
            <div
              className="fixed inset-0 z-0 opacity-20 blur-3xl scale-110 lg:hidden"
              style={{ backgroundImage: `url(${invite.meta.heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
          )}
          <div className="fixed inset-0 z-0 bg-black/5 mix-blend-multiply lg:hidden" />

          {/* --- DESKTOP HERO SPLIT (Left Side) --- */}
          <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden">
            {invite.meta.heroImage ? (
              <div
                className="absolute inset-0 z-0 transition-transform duration-[20s] hover:scale-110"
                style={{ backgroundImage: `url(${invite.meta.heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
            ) : (
              <div className="absolute inset-0 z-0 bg-lathe-ink/5" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40 z-10" />
            <div className="relative z-20 text-white text-center p-12 max-w-2xl px-8 drop-shadow-md">
              <p className="text-sm tracking-[0.3em] uppercase mb-4 opacity-90 font-sans">The Wedding Of</p>
              <h1 className="text-6xl xl:text-8xl font-serif italic mb-6 leading-tight drop-shadow-lg">
                {invite.meta.groomName || 'Romeo'}<br />&amp;<br />{invite.meta.brideName || 'Juliet'}
              </h1>
              {invite.meta.eventDate && (
                <p className="text-lg xl:text-xl opacity-90 tracking-widest uppercase font-sans mt-8 border-t border-white/20 pt-8 inline-block">
                  {new Date(invite.meta.eventDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              )}
            </div>
          </div>

          {/* --- SCROLLABLE CONTENT (Right Side / Mobile) --- */}
          <div className="lg:w-[480px] xl:w-[540px] lg:h-screen lg:overflow-y-auto lg:shadow-[-20px_0_40px_rgba(0,0,0,0.15)] relative z-20 bg-lathe-surface hide-scrollbar">
            <main
              className="relative w-full max-w-md mx-auto lg:max-w-none min-h-screen shadow-2xl lg:shadow-none xl:my-0 xl:min-h-screen xl:rounded-none overflow-hidden xl:border-0 flex flex-col"
              style={{ backgroundColor: 'var(--color-lathe-surface)' }}
            >
              <div className="flex-1 relative">
                <BlockRenderer
                  blocks={invite.blocks || []}
                  builderMode={builderMode}
                />
                {invite.meta.audioUrl && <AudioPlayer url={invite.meta.audioUrl} />}
                <footer className="py-12 pb-24 text-center font-sans text-xs" style={{ color: 'var(--color-lathe-ink)', opacity: 0.4 }}>
                  <p>{globalSettings.customFooter || `Sistem oleh ${APP_CONFIG.companyName}`}</p>
                </footer>
              </div>
            </main>
          </div>
        </div>
      )}
    </InvitationProvider>
  );
}

export type BlockType =
    | 'opening'
    | 'hero'
    | 'couple'
    | 'event'
    | 'gallery'
    | 'rsvp'
    | 'gift'
    | 'story'
    | 'quote'
    | 'countdown'
    | 'location'
    | 'closing';

export interface Block {
    id: string;
    type: BlockType;
    visible: boolean;
    sort_order: number;
    config: Record<string, any>;
}

// ─── Invitation ─────────────────────────────────────────────────

export interface InvitationMeta {
    groomName: string;
    brideName: string;
    eventDate: string;
    eventTime: string;
    venueName: string;
    googleMapsLink: string;
    whatsappNumber: string;
    heroImage?: string;
    audioUrl?: string;
    qrisBarcode?: string;
    ogImage?: string;
    ogDescription?: string;
}

export interface ThemeConfig {
    theme: string;       // 'elegant' | 'catppuccin-mocha' | etc
    preset: string;      // 'modern-minimal' | 'javanese-elegant' | etc
    layout: 'classic' | 'modern' | 'ornate';
    // Decorative config
    backgroundPattern?: 'none' | 'dots' | 'lines' | 'crosses' | 'diagonal';
    frameStyle?: 'rectangle' | 'arch' | 'circle' | 'hexagon' | 'oval';
    ornamentStyle?: 'none' | 'classic' | 'floral' | 'geometric' | 'simple';
    fontPairing?: 'serif-classic' | 'script-elegant' | 'sans-modern' | 'mixed-editorial';
}

export interface InvitationDocument {
    id: string;
    slug: string;
    status: 'draft' | 'published';
    meta: InvitationMeta;
    blocks: Block[];
    theme_config: ThemeConfig;
    created_at: string;
    updated_at?: string;
}

// ─── Guests ─────────────────────────────────────────────────────

export interface Guest {
    id: string;
    invitation_id: string;
    qr_token: string;
    name: string;
    phone?: string;
    pax: number;
    is_vip: number; // 0 or 1 (SQLite boolean)
    checked_in_at?: string;
    created_at: string;
}

// ─── Guest Book ─────────────────────────────────────────────────

export interface GuestBookEntry {
    id: string;
    invitation_id: string;
    guest_id?: string;
    guest_name: string;
    message?: string;
    signature_path?: string;
    photo_path?: string;
    created_at: string;
}

// ─── Check-In Stats ─────────────────────────────────────────────

export interface CheckInStats {
    total_guests: number;
    checked_in: number;
    vip_total: number;
    vip_checked_in: number;
    total_pax: number;
}

// ─── Auth ───────────────────────────────────────────────────────

export interface AuthUser {
    id: string;
    tenant_id?: string;
    email: string;
    name: string;
}

export interface AuthState {
    user: AuthUser | null;
    token: string | null;
}

// ─── Gallery Image (for block config) ───────────────────────────

export interface GalleryImage {
    url: string;
    sort_order: number;
}

// ─── Story Item (for story block config) ────────────────────────

export interface StoryItem {
    title: string;
    date?: string;
    description: string;
    image?: string;
}

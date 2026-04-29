import type { Block, InvitationMeta, ThemeConfig, StoryItem } from './types';
import { v4 as uuidv4 } from 'uuid';
import {
    DEFAULT_HERO, DEFAULT_GROOM_PHOTO, DEFAULT_BRIDE_PHOTO,
    DEFAULT_GALLERY, ALL_PORTRAITS,
} from './utils/defaultImages';

/**
 * Generate a unique block ID
 */
function bid(): string {
    return uuidv4().slice(0, 8);
}

/**
 * Default meta template for new invitations — with asset-based defaults
 */
export const defaultMeta: InvitationMeta = {
    groomName: '',
    brideName: '',
    eventDate: '',
    eventTime: '',
    venueName: '',
    googleMapsLink: '',
    whatsappNumber: '',
    heroImage: DEFAULT_HERO,
};

/**
 * All available block types with their display names and form prompts
 */
export const BLOCK_TYPES: { type: Block['type']; name: string; prompt: string }[] = [
    { type: 'opening', name: 'Pintu Pembuka', prompt: 'Atur tampilan halaman pembuka undangan' },
    { type: 'hero', name: 'Hero / Sampul', prompt: 'Unggah foto utama dan atur tampilan sampul' },
    { type: 'couple', name: 'Profil Pasangan', prompt: 'Isi data lengkap kedua mempelai' },
    { type: 'event', name: 'Detail Acara', prompt: 'Masukkan waktu dan lokasi acara' },
    { type: 'countdown', name: 'Hitung Mundur', prompt: 'Atur label penghitung mundur' },
    { type: 'location', name: 'Lokasi & Peta', prompt: 'Tambahkan link Google Maps' },
    { type: 'gallery', name: 'Galeri Foto', prompt: 'Tambahkan foto-foto prewedding' },
    { type: 'story', name: 'Love Story', prompt: 'Ceritakan perjalanan cinta kalian' },
    { type: 'quote', name: 'Kutipan / Doa', prompt: 'Pilih kutipan ayat atau doa' },
    { type: 'gift', name: 'Tanda Kasih', prompt: 'Atur rekening atau QRIS untuk hadiah' },
    { type: 'rsvp', name: 'RSVP', prompt: 'Atur formulir konfirmasi kehadiran' },
    { type: 'closing', name: 'Penutup', prompt: 'Tulis pesan penutup undangan' },
];

/**
 * Default config values for each block type — with asset-based defaults
 */
export function defaultBlockConfig(type: Block['type']): Record<string, any> {
    switch (type) {
        case 'opening':
            return { subtitle: 'The Wedding Of', backgroundPattern: 'dots', guestName: '' };
        case 'hero':
            return { showGuestName: true, subtitle: 'Pernikahan' };
        case 'couple':
            return {
                groomFull: '', brideFull: '',
                groomParents: '', brideParents: '',
                groomPhoto: DEFAULT_GROOM_PHOTO, bridePhoto: DEFAULT_BRIDE_PHOTO,
            };
        case 'event':
            return {
                akadTime: '', akadVenue: '',
                resepsiTime: '', resepsiVenue: '',
                showAkad: true, showResepsi: true,
            };
        case 'countdown':
            return { label: 'Menuju Hari Bahagia' };
        case 'location':
            return { showMap: true };
        case 'gallery':
            return {
                images: DEFAULT_GALLERY.map((url, i) => ({ url, sort_order: i })),
                columns: 2,
            };
        case 'story':
            return {
                items: [
                    { title: 'Pertama Bertemu', date: '', description: '', image: '' },
                    { title: 'Jatuh Cinta', date: '', description: '', image: '' },
                    { title: 'Lamaran', date: '', description: '', image: '' },
                ] as StoryItem[],
            };
        case 'quote':
            return {
                text: '"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya."',
                source: 'QS. Ar-Rum: 21',
            };
        case 'gift':
            return {
                bankAccounts: [],
                showQris: true,
            };
        case 'rsvp':
            return { showMessage: true, submitLabel: 'Kirim RSVP' };
        case 'closing':
            return {
                message: 'Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.',
                prayer: '',
            };
        default:
            return {};
    }
}

/**
 * Create a new block with defaults
 */
export function createBlock(type: Block['type'], sortOrder: number): Block {
    return {
        id: bid(),
        type,
        visible: true,
        sort_order: sortOrder,
        config: defaultBlockConfig(type),
    };
}

// ─── Preset Personality ─────────────────────────────────────────

export interface PresetPersonality {
    /** Google Fonts import URL */
    fontImport: string;
    /** Display / heading font-family */
    fontDisplay: string;
    /** Body font-family */
    fontBody: string;
    /** Entry animation style */
    motionStyle: 'fade' | 'slide-up' | 'scale' | 'blur-in';
    /** CSS gradient for the preset picker card */
    cardGradient: string;
    /** Hero section layout variant */
    heroLayout: 'full-bleed' | 'arch-frame' | 'split-screen' | 'centered';
}

// ─── Presets ─────────────────────────────────────────────────────

export interface Preset {
    id: string;
    name: string;
    description: string;
    theme: string;
    layout: 'classic' | 'modern' | 'ornate';
    /** Accent/primary color for the preset card swatch */
    accent: string;
    /** Background tone for the preset card swatch */
    bg: string;
    /** Text/ink color for the preset */
    ink: string;
    /** Preview couple names for the preset picker */
    previewNames: [string, string];
    /** Decorative config applied to ThemeConfig */
    decorative: {
        backgroundPattern: ThemeConfig['backgroundPattern'];
        frameStyle: ThemeConfig['frameStyle'];
        ornamentStyle: ThemeConfig['ornamentStyle'];
        fontPairing: ThemeConfig['fontPairing'];
    };
    /** Visual personality — distinct fonts, motion, hero layout */
    personality: PresetPersonality;
    blocks: Block[];
}

/**
 * 8 distinct presets, each with a genuinely unique visual identity.
 * Every preset has unique fonts, motion, hero layout, and decorative config.
 */
export const PRESETS: Preset[] = [
    // ─── 1. Putih Klasik — Timeless European ────────────────────
    {
        id: 'putih-klasik',
        name: 'Putih Klasik',
        description: 'Desain putih bersih dengan aksen emas. Tipografi serif klasik dan bingkai lengkungan elegan.',
        theme: 'elegant',
        layout: 'classic',
        accent: '#D4AF37',
        bg: '#FAF8F3',
        ink: '#2C2520',
        previewNames: ['Adit', 'Siti'],
        decorative: {
            backgroundPattern: 'dots',
            frameStyle: 'arch',
            ornamentStyle: 'classic',
            fontPairing: 'serif-classic',
        },
        personality: {
            fontImport: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400&display=swap',
            fontDisplay: '"Cormorant Garamond", serif',
            fontBody: '"Lato", sans-serif',
            motionStyle: 'fade',
            cardGradient: 'linear-gradient(145deg, #FAF8F3 0%, #F0EBE0 50%, #E8DFD0 100%)',
            heroLayout: 'arch-frame',
        },
        blocks: [
            { ...createBlock('opening', 0), config: { subtitle: 'The Wedding Of', backgroundPattern: 'dots' } },
            { ...createBlock('hero', 1), config: { showGuestName: true, subtitle: 'Pernikahan', textStyle: 'gradient' } },
            { ...createBlock('quote', 2), config: { text: '"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya."', source: 'QS. Ar-Rum: 21' } },
            createBlock('couple', 3),
            createBlock('countdown', 4),
            createBlock('event', 5),
            { ...createBlock('gallery', 6), config: { ...defaultBlockConfig('gallery'), layout: 'carousel' } },
            createBlock('gift', 7),
            createBlock('rsvp', 8),
            createBlock('closing', 9),
        ],
    },

    // ─── 2. Jawa Keraton — Royal Javanese ────────────────────────
    {
        id: 'jawa-keraton',
        name: 'Jawa Keraton',
        description: 'Nuansa tanah liat keraton Jawa. Border batik dan ornamen tradisional yang megah.',
        theme: 'terracotta',
        layout: 'ornate',
        accent: '#C35B3C',
        bg: '#FDFBF7',
        ink: '#3B2A20',
        previewNames: ['Bagus', 'Ayu'],
        decorative: {
            backgroundPattern: 'diagonal',
            frameStyle: 'oval',
            ornamentStyle: 'floral',
            fontPairing: 'mixed-editorial',
        },
        personality: {
            fontImport: 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Mulish:wght@300;400;600&display=swap',
            fontDisplay: '"Libre Baskerville", serif',
            fontBody: '"Mulish", sans-serif',
            motionStyle: 'slide-up',
            cardGradient: 'linear-gradient(145deg, #FDFBF7 0%, #F5EDE4 50%, #E8D5C4 100%)',
            heroLayout: 'full-bleed',
        },
        blocks: [
            { ...createBlock('opening', 0), config: { subtitle: 'Undangan Pernikahan', backgroundPattern: 'diagonal' } },
            { ...createBlock('hero', 1), config: { showGuestName: true, subtitle: 'Pernikahan', textStyle: 'layered' } },
            { ...createBlock('quote', 2), config: { text: '"Witing tresno jalaran soko kulino. Cinta tumbuh karena terbiasa bersama."', source: 'Pepatah Jawa' } },
            createBlock('couple', 3),
            createBlock('event', 4),
            createBlock('story', 5),
            createBlock('gallery', 6),
            createBlock('gift', 7),
            createBlock('rsvp', 8),
            createBlock('closing', 9),
        ],
    },

    // ─── 3. Garden Sage — Rustic Botanical ──────────────────────
    {
        id: 'garden-sage',
        name: 'Garden Sage',
        description: 'Hijau sage botanical dengan nuansa alam. Bingkai lingkaran dan ornamen minimalis.',
        theme: 'sage',
        layout: 'classic',
        accent: '#6B7F67',
        bg: '#F4F7F3',
        ink: '#2A3528',
        previewNames: ['Raka', 'Bunga'],
        decorative: {
            backgroundPattern: 'dots',
            frameStyle: 'circle',
            ornamentStyle: 'simple',
            fontPairing: 'serif-classic',
        },
        personality: {
            fontImport: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Nunito+Sans:wght@300;400;600&display=swap',
            fontDisplay: '"DM Serif Display", serif',
            fontBody: '"Nunito Sans", sans-serif',
            motionStyle: 'scale',
            cardGradient: 'linear-gradient(145deg, #F4F7F3 0%, #E4EDE2 50%, #D0DFC8 100%)',
            heroLayout: 'centered',
        },
        blocks: [
            { ...createBlock('opening', 0), config: { subtitle: 'You Are Invited', backgroundPattern: 'dots' } },
            createBlock('hero', 1),
            createBlock('couple', 2),
            createBlock('story', 3),
            createBlock('location', 4),
            createBlock('countdown', 5),
            { ...createBlock('gallery', 6), config: { ...defaultBlockConfig('gallery'), layout: 'circular' } },
            createBlock('gift', 7),
            createBlock('rsvp', 8),
            createBlock('closing', 9),
        ],
    },

    // ─── 4. Navy Formal — Art Deco Luxe ─────────────────────────
    {
        id: 'navy-formal',
        name: 'Navy Formal',
        description: 'Biru tua mewah dengan aksen emas es. Geometri art deco dan tipografi sans tegas.',
        theme: 'nord',
        layout: 'modern',
        accent: '#EBCB8B',
        bg: '#242933', // Darker navy background for better contrast
        ink: '#E5E9F0', // Brighter text color
        previewNames: ['Arman', 'Diana'],
        decorative: {
            backgroundPattern: 'lines',
            frameStyle: 'hexagon',
            ornamentStyle: 'geometric',
            fontPairing: 'sans-modern',
        },
        personality: {
            fontImport: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500&display=swap',
            fontDisplay: '"Bebas Neue", sans-serif',
            fontBody: '"Inter", sans-serif',
            motionStyle: 'blur-in',
            cardGradient: 'linear-gradient(145deg, #242933 0%, #2E3440 50%, #3B4252 100%)',
            heroLayout: 'split-screen',
        },
        blocks: [
            { ...createBlock('opening', 0), config: { subtitle: 'Wedding Invitation', backgroundPattern: 'lines' } },
            createBlock('hero', 1),
            { ...createBlock('quote', 2), config: { text: '"Love is composed of a single soul inhabiting two bodies."', source: 'Aristotle' } },
            createBlock('couple', 3),
            createBlock('event', 4),
            createBlock('countdown', 5),
            createBlock('location', 6),
            createBlock('gallery', 7),
            createBlock('gift', 8),
            createBlock('rsvp', 9),
            createBlock('closing', 10),
        ],
    },

    // ─── 5. Rose Twilight — Romantic Gothic ─────────────────────
    {
        id: 'rose-twilight',
        name: 'Rose Twilight',
        description: 'Romantis dan hangat. Plum gelap dengan aksen rose dan skrip elegan.',
        theme: 'rose-pine',
        layout: 'ornate',
        accent: '#EA9A97',
        bg: '#12101B', // Darker, rich plum background
        ink: '#F2EFF7', // Brightened ink for high readability
        previewNames: ['Dian', 'Reza'],
        decorative: {
            backgroundPattern: 'crosses',
            frameStyle: 'arch',
            ornamentStyle: 'floral',
            fontPairing: 'script-elegant',
        },
        personality: {
            fontImport: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Raleway:wght@300;400;500&display=swap',
            fontDisplay: '"Playfair Display", serif',
            fontBody: '"Raleway", sans-serif',
            motionStyle: 'fade',
            cardGradient: 'linear-gradient(145deg, #12101B 0%, #191724 50%, #232136 100%)',
            heroLayout: 'arch-frame',
        },
        blocks: [
            { ...createBlock('opening', 0), config: { subtitle: 'Undangan Pernikahan', backgroundPattern: 'crosses' } },
            createBlock('hero', 1),
            createBlock('couple', 2),
            createBlock('story', 3),
            createBlock('countdown', 4),
            createBlock('event', 5),
            createBlock('gallery', 6),
            createBlock('rsvp', 7),
            createBlock('closing', 8),
        ],
    },

    // ─── 6. Emas Premium — Dark Luxe ────────────────────────────
    {
        id: 'emas-premium',
        name: 'Emas Premium',
        description: 'Dark mode premium dengan aksen emas murni. Kesan misterius dan elegan.',
        theme: 'catppuccin-mocha',
        layout: 'modern',
        accent: '#F9E2AF',
        bg: '#11111B', // Deepest dark slate/black
        ink: '#F5E0DC', // Warm, bright cream text
        previewNames: ['Farid', 'Zahra'],
        decorative: {
            backgroundPattern: 'diagonal',
            frameStyle: 'rectangle',
            ornamentStyle: 'geometric',
            fontPairing: 'sans-modern',
        },
        personality: {
            fontImport: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Montserrat:wght@300;400;500&display=swap',
            fontDisplay: '"Cinzel", serif',
            fontBody: '"Montserrat", sans-serif',
            motionStyle: 'slide-up',
            cardGradient: 'linear-gradient(145deg, #11111B 0%, #181825 50%, #1E1E2E 100%)',
            heroLayout: 'full-bleed',
        },
        blocks: [
            { ...createBlock('opening', 0), config: { subtitle: 'Wedding Celebration', backgroundPattern: 'diagonal' } },
            createBlock('hero', 1),
            { ...createBlock('quote', 2), config: { text: '"Maka nikmat Tuhanmu yang manakah yang kamu dustakan?"', source: 'QS. Ar-Rahman: 13' } },
            createBlock('couple', 3),
            createBlock('story', 4),
            createBlock('event', 5),
            createBlock('countdown', 6),
            createBlock('location', 7),
            createBlock('gallery', 8),
            createBlock('gift', 9),
            createBlock('rsvp', 10),
            createBlock('closing', 11),
        ],
    },

    // ─── 7. Rustic Autumn — Warm Countryside ────────────────────
    {
        id: 'rustic-autumn',
        name: 'Rustic Autumn',
        description: 'Hangat dan alami seperti musim gugur. Warna cokelat madu dengan aksen oranye.',
        theme: 'autumn',
        layout: 'classic',
        accent: '#C97B3D',
        bg: '#FBF5EB',
        ink: '#3D2E1E',
        previewNames: ['Galih', 'Ratna'],
        decorative: {
            backgroundPattern: 'dots',
            frameStyle: 'oval',
            ornamentStyle: 'classic',
            fontPairing: 'serif-classic',
        },
        personality: {
            fontImport: 'https://fonts.googleapis.com/css2?family=Vollkorn:ital,wght@0,400;0,600;1,400&family=Source+Sans+3:wght@300;400;600&display=swap',
            fontDisplay: '"Vollkorn", serif',
            fontBody: '"Source Sans 3", sans-serif',
            motionStyle: 'scale',
            cardGradient: 'linear-gradient(145deg, #FBF5EB 0%, #F2E8D5 50%, #E5D4B8 100%)',
            heroLayout: 'centered',
        },
        blocks: [
            { ...createBlock('opening', 0), config: { subtitle: 'Kami Mengundang Anda', backgroundPattern: 'dots' } },
            createBlock('hero', 1),
            createBlock('couple', 2),
            createBlock('countdown', 3),
            createBlock('event', 4),
            createBlock('story', 5),
            createBlock('gallery', 6),
            createBlock('gift', 7),
            createBlock('rsvp', 8),
            createBlock('closing', 9),
        ],
    },

    // ─── 8. Pastel Minimal — Clean Japanese ─────────────────────
    {
        id: 'pastel-minimal',
        name: 'Pastel Minimal',
        description: 'Desain bersih dan minimalis. Pink pastel lembut tanpa ornamen berlebihan.',
        theme: 'pastel',
        layout: 'modern',
        accent: '#D4A0A0',
        bg: '#FFF5F5',
        ink: '#4A3636',
        previewNames: ['Andi', 'Lili'],
        decorative: {
            backgroundPattern: 'none',
            frameStyle: 'circle',
            ornamentStyle: 'simple',
            fontPairing: 'sans-modern',
        },
        personality: {
            fontImport: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=DM+Sans:ital,wght@0,300;0,400;1,300&display=swap',
            fontDisplay: '"Outfit", sans-serif',
            fontBody: '"DM Sans", sans-serif',
            motionStyle: 'fade',
            cardGradient: 'linear-gradient(145deg, #FFF5F5 0%, #FFE8E8 50%, #FFD6D6 100%)',
            heroLayout: 'split-screen',
        },
        blocks: [
            { ...createBlock('opening', 0), config: { subtitle: 'Wedding Invitation', backgroundPattern: 'none' } },
            createBlock('hero', 1),
            createBlock('couple', 2),
            createBlock('event', 3),
            createBlock('countdown', 4),
            createBlock('gallery', 5),
            createBlock('rsvp', 6),
            createBlock('closing', 7),
        ],
    },
];

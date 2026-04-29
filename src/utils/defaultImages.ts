/**
 * Vite-importable default wedding photos from src/assets/.
 * Used as placeholders in presets and new invitation defaults.
 */

import potrait1 from '../assets/potrait-1.jpg';
import potrait2 from '../assets/potrait-2.jpg';
import potrait3 from '../assets/potrait-3.jpg';
import potrait4 from '../assets/potrait-4.jpg';
import lanscape1 from '../assets/lanscape-1.jpg';
import lanscape2 from '../assets/lanscape-2.jpg';
import lanscape3 from '../assets/lanscape-3.jpg';
import lanscape4 from '../assets/lanscape-4.jpg';

/** Primary hero image (portrait, couple in field) */
export const DEFAULT_HERO = potrait1;

/** Groom profile photo */
export const DEFAULT_GROOM_PHOTO = potrait3;

/** Bride profile photo */
export const DEFAULT_BRIDE_PHOTO = potrait4;

/** Default gallery images (landscape shots) */
export const DEFAULT_GALLERY = [lanscape1, lanscape2, lanscape3, lanscape4];

/** All portrait images */
export const ALL_PORTRAITS = [potrait1, potrait2, potrait3, potrait4];

/** All landscape images */
export const ALL_LANDSCAPES = [lanscape1, lanscape2, lanscape3, lanscape4];

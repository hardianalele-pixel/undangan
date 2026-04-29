/**
 * Runtime theme color registry.
 *
 * Tailwind v4's @theme resolves var() references at build time,
 * so runtime class-based theme switching doesn't work for
 * bg-lathe-surface / text-lathe-ink utilities.
 *
 * Instead, we inject CSS custom properties as inline styles
 * on the invitation wrapper. This guarantees visual theming
 * regardless of Tailwind's compilation strategy.
 */

export interface ThemeColors {
    /** Primary accent / yellow slot */
    yellow: string;
    /** Main text color */
    ink: string;
    /** Background surface */
    surface: string;
    /** Secondary accent */
    secondary: string;
}

const THEMES: Record<string, ThemeColors> = {
    elegant: {
        yellow: '#D4AF37',
        ink: '#2C2418',
        surface: '#FAF8F3',
        secondary: '#8B7355',
    },
    terracotta: {
        yellow: '#C35B3C',
        ink: '#4A3525',
        surface: '#FDFBF7',
        secondary: '#8F5B36',
    },
    sage: {
        yellow: '#8A9A86',
        ink: '#2C3B2E',
        surface: '#F9FAF8',
        secondary: '#A3B19B',
    },
    nord: {
        yellow: '#ebcb8b',
        ink: '#eceff4',
        surface: '#2e3440',
        secondary: '#81a1c1',
    },
    'rose-pine': {
        yellow: '#f6c177',
        ink: '#e0def4',
        surface: '#191724',
        secondary: '#9ccfd8',
    },
    'catppuccin-mocha': {
        yellow: '#f9e2af',
        ink: '#cdd6f4',
        surface: '#1e1e2e',
        secondary: '#89b4fa',
    },
    'catppuccin-latte': {
        yellow: '#df8e1d',
        ink: '#4c4f69',
        surface: '#eff1f5',
        secondary: '#1e66f5',
    },
    autumn: {
        yellow: '#C97B3D',
        ink: '#3D2E1E',
        surface: '#FBF5EB',
        secondary: '#A67B4F',
    },
    pastel: {
        yellow: '#D4A0A0',
        ink: '#4A3636',
        surface: '#FFF5F5',
        secondary: '#C4B0B0',
    },
};

/**
 * Returns inline CSS custom property overrides for the given theme.
 * Apply these as a `style` attribute on the invitation wrapper element.
 */
export function getThemeStyle(themeName: string): Record<string, string> {
    const colors = THEMES[themeName] || THEMES.elegant;
    return {
        '--color-base-yellow': colors.yellow,
        '--color-base-ink': colors.ink,
        '--color-base-surface': colors.surface,
        '--color-base-secondary': colors.secondary,
        '--color-lathe-yellow': colors.yellow,
        '--color-lathe-ink': colors.ink,
        '--color-lathe-surface': colors.surface,
        '--color-lathe-secondary': colors.secondary,
    };
}

/**
 * Get raw theme colors for a theme name.
 */
export function getThemeColors(themeName: string): ThemeColors {
    return THEMES[themeName] || THEMES.elegant;
}

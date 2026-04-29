import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    setTheme: () => null,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<ThemeMode>(() => {
        const saved = localStorage.getItem('lathe_theme') as ThemeMode;
        if (saved && (saved === 'light' || saved === 'dark')) {
            return saved;
        }
        return 'light'; // Default strictly to light
    });

    const setTheme = (newTheme: ThemeMode) => {
        setThemeState(newTheme);
        localStorage.setItem('lathe_theme', newTheme);
    };

    useEffect(() => {
        const root = window.document.documentElement;

        // Ensure accurate state
        root.classList.remove('light', 'dark');
        root.classList.add(theme);

    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);

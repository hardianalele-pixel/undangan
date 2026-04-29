import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, PlusCircle, Settings, LogOut,
    Hexagon, Bell, Moon, Sun, Laptop, Menu, X
} from 'lucide-react';
import { APP_CONFIG } from '../../constants';
import { clearAuth } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

export interface SidebarLink {
    id: string;
    label: string;
    href: string;
    icon?: React.ReactNode;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(" ");
};

interface AppLayoutProps {
    children: React.ReactNode;
    title: string;
}

const SIDEBAR_LINKS: SidebarLink[] = [
    { id: 'dashboard', label: 'Dasbor', href: '/', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'create', label: 'Undangan Baru', href: '/create', icon: <PlusCircle className="w-5 h-5" /> },
    { id: 'settings', label: 'Pengaturan', href: '/settings', icon: <Settings className="w-5 h-5" /> },
];

export function AppLayout({ children, title }: AppLayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, setTheme } = useTheme();

    const handleLogout = () => {
        clearAuth();
        navigate('/login');
    };

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="flex flex-col h-screen min-h-0 bg-lathe-surface dark:bg-lathe-ink text-lathe-ink dark:text-lathe-surface transition-colors duration-200 font-sans">
            {/* Header */}
            <header className={cx(
                "flex flex-shrink-0 items-center justify-between border-b border-lathe-ink/10 dark:border-lathe-surface/10",
                "px-4 sm:px-6 lg:px-8 py-4 gap-3"
            )}>
                <div className="flex items-center gap-3 min-w-0">
                    <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg bg-lathe-ink dark:bg-lathe-surface text-lathe-surface dark:text-lathe-ink shrink-0">
                        <Hexagon className="w-5 h-5" />
                    </span>
                    <h1 className="text-lg font-bold truncate">
                        {title}
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        title={`Theme: ${theme}`}
                        onClick={toggleTheme}
                        className={cx(
                            "rounded-lg ring-1 ring-lathe-ink/20 dark:ring-lathe-surface/20",
                            "bg-transparent hover:bg-lathe-ink/5 dark:hover:bg-lathe-surface/10 transition-colors",
                            "p-2"
                        )}
                    >
                        {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        <span className="sr-only">Toggle theme</span>
                    </button>

                    <button
                        className={cx(
                            "rounded-lg ring-1 ring-lathe-ink/20 dark:ring-lathe-surface/20",
                            "bg-transparent hover:bg-lathe-ink/5 dark:hover:bg-lathe-surface/10 transition-colors",
                            "p-2 hidden sm:block"
                        )}
                        aria-label="Notifications"
                    >
                        <Bell className="w-5 h-5" />
                    </button>

                    <button
                        className={cx(
                            "flex items-center rounded-lg ring-1 ring-lathe-ink/20 dark:ring-lathe-surface/20",
                            "bg-transparent hover:bg-lathe-ink/5 dark:hover:bg-lathe-surface/10 transition-colors",
                            "pl-2 pr-3 py-1.5 gap-2"
                        )}
                        aria-label="Account menu"
                    >
                        <img
                            src={`https://ui-avatars.com/api/?name=${APP_CONFIG.adminInitials}&background=1A1A1A&color=FFE500`}
                            alt=""
                            className="w-8 h-8 rounded-md object-cover border border-lathe-ink/20 dark:border-lathe-surface/20"
                        />
                        <span className="hidden sm:inline text-sm font-bold">
                            {APP_CONFIG.adminName}
                        </span>
                    </button>

                </div>
            </header>

            <div className="flex flex-1 min-h-0 overflow-hidden">
                <aside className={cx(
                    "hidden sm:flex flex-col items-center justify-between border-r border-lathe-ink/10 dark:border-lathe-surface/10 overflow-y-auto w-16",
                    "py-4 gap-3 shrink-0"
                )}>
                    <div className="flex flex-col gap-3">
                        {SIDEBAR_LINKS.map((l) => {
                            const active = location.pathname === l.href || (l.href !== '/' && location.pathname.startsWith(l.href));
                            return (
                                <NavLink
                                    key={l.id}
                                    to={l.href}
                                    className={cx(
                                        "w-11 h-11 inline-flex items-center justify-center rounded-lg transition-all",
                                        "ring-1 ring-lathe-ink/20 dark:ring-lathe-surface/20",
                                        active
                                            ? "bg-lathe-ink text-lathe-surface dark:bg-lathe-surface dark:text-lathe-ink font-bold"
                                            : "bg-transparent hover:bg-lathe-ink/5 dark:hover:bg-lathe-surface/10"
                                    )}
                                    title={l.label}
                                >
                                    {l.icon}
                                    <span className="sr-only">{l.label}</span>
                                </NavLink>
                            );
                        })}
                    </div>

                    <button
                        onClick={handleLogout}
                        className={cx(
                            "w-11 h-11 inline-flex items-center justify-center rounded-lg transition-all",
                            "ring-1 ring-lathe-ink/20 dark:ring-lathe-surface/20",
                            "bg-transparent hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:text-lathe-surface"
                        )}
                        title="Keluar"
                    >
                        <LogOut className="w-5 h-5 ml-1" />
                    </button>
                </aside>

                {/* Main page content area (Mobile bottom padding ensures content isn't hidden by tab bar) */}
                <main className="flex-1 min-w-0 flex flex-col min-h-0 overflow-y-auto bg-white/50 dark:bg-black/10 pb-16 sm:pb-0">
                    {children}
                </main>

                {/* Mobile Bottom Navigation Bar */}
                <nav className="sm:hidden fixed bottom-0 left-0 right-0 h-16 bg-lathe-surface dark:bg-lathe-ink border-t border-lathe-ink/10 dark:border-lathe-surface/10 flex items-center justify-around px-2 z-40 pb-safe">
                    {SIDEBAR_LINKS.map((l) => {
                        const active = location.pathname === l.href || (l.href !== '/' && location.pathname.startsWith(l.href));
                        return (
                            <NavLink
                                key={l.id}
                                to={l.href}
                                className={cx(
                                    "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                                    active
                                        ? "text-lathe-ink dark:text-lathe-surface font-bold"
                                        : "text-lathe-ink/40 dark:text-lathe-surface/40 hover:text-lathe-ink/80 dark:hover:text-lathe-surface/80"
                                )}
                            >
                                {l.icon}
                                <span className="text-[10px] font-medium">{l.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}

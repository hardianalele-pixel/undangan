/**
 * Aceternity UI Sidebar -- adapted for Vite + react-router-dom.
 *
 * Original: https://ui.aceternity.com/components/sidebar
 * Changes from original:
 *   - next/link -> react-router-dom NavLink
 *   - framer-motion -> motion/react
 *   - @/lib/utils cn -> ../Button cn
 *   - Removed "use client" directive (Vite, not Next.js)
 *   - Styled for Lathe Invite admin theme
 */

import React, { useState, createContext, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { cn } from '../Button';

// ─── Types ──────────────────────────────────────────────────────

export interface Links {
    label: string;
    href: string;
    icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    animate: boolean;
}

// ─── Context ────────────────────────────────────────────────────

const SidebarContext = createContext<SidebarContextProps | undefined>(
    undefined
);

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
};

export const SidebarProvider = ({
    children,
    open: openProp,
    setOpen: setOpenProp,
    animate = true,
}: {
    children: React.ReactNode;
    open?: boolean;
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    animate?: boolean;
}) => {
    const [openState, setOpenState] = useState(false);

    const open = openProp !== undefined ? openProp : openState;
    const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

    return (
        <SidebarContext.Provider value={{ open, setOpen, animate }}>
            {children}
        </SidebarContext.Provider>
    );
};

// ─── Sidebar Root ───────────────────────────────────────────────

export const Sidebar = ({
    children,
    open,
    setOpen,
    animate,
}: {
    children: React.ReactNode;
    open?: boolean;
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    animate?: boolean;
}) => {
    return (
        <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
            {children}
        </SidebarProvider>
    );
};

// ─── Sidebar Body ───────────────────────────────────────────────

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
    return (
        <>
            <DesktopSidebar {...props} />
            <MobileSidebar {...(props as React.ComponentProps<'div'>)} />
        </>
    );
};

// ─── Desktop Sidebar ────────────────────────────────────────────

export const DesktopSidebar = ({
    className,
    children,
    ...props
}: React.ComponentProps<typeof motion.div>) => {
    const { open, setOpen, animate } = useSidebar();
    return (
        <motion.div
            className={cn(
                'h-full py-4 hidden md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 w-[300px] flex-shrink-0',
                open ? 'px-4' : 'px-2 items-center',
                className
            )}
            animate={{
                width: animate ? (open ? '300px' : '60px') : '300px',
            }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            {...props}
        >
            {children}
        </motion.div>
    );
};

// ─── Mobile Sidebar ─────────────────────────────────────────────

export const MobileSidebar = ({
    className,
    children,
    ...props
}: React.ComponentProps<'div'>) => {
    const { open, setOpen } = useSidebar();
    return (
        <>
            <div
                className={cn(
                    'h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full'
                )}
                {...props}
            >
                <div className="flex justify-end z-20 w-full">
                    <Menu
                        className="text-neutral-800 dark:text-neutral-200 cursor-pointer"
                        onClick={() => setOpen(!open)}
                    />
                </div>
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ x: '-100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '-100%', opacity: 0 }}
                            transition={{
                                duration: 0.3,
                                ease: 'easeInOut',
                            }}
                            className={cn(
                                'fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between',
                                className
                            )}
                        >
                            <div
                                className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                                onClick={() => setOpen(!open)}
                            >
                                <X />
                            </div>
                            {children}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

// ─── Sidebar Link ───────────────────────────────────────────────

export function SidebarLink({
    link,
    className,
    ...props
}: {
    link: Links;
    className?: string;
    [key: string]: any;
}) {
    const { open, animate } = useSidebar();
    return (
        <NavLink
            to={link.href}
            className={({ isActive }) =>
                cn(
                    'flex items-center gap-2 group/sidebar py-2',
                    open ? 'justify-start' : 'justify-center',
                    isActive && 'font-semibold',
                    className
                )
            }
            {...props}
        >
            {link.icon}
            <motion.span
                animate={{
                    display: animate ? (open ? 'inline-block' : 'none') : 'inline-block',
                    opacity: animate ? (open ? 1 : 0) : 1,
                }}
                className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
            >
                {link.label}
            </motion.span>
        </NavLink>
    );
}

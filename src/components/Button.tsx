import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isActive?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isActive, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lathe-ink disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-lathe-ink text-lathe-surface hover:bg-lathe-ink/90': variant === 'primary',
            'bg-lathe-surface text-lathe-ink lathe-border hover:bg-lathe-ink/5': variant === 'secondary',
            'lathe-border bg-transparent hover:bg-lathe-ink/5': variant === 'outline',
            'hover:bg-lathe-ink/5': variant === 'ghost',
            'h-8 px-3 text-xs': size === 'sm',
            'h-10 px-4 py-2 text-sm': size === 'md',
            'h-12 px-8 text-base': size === 'lg',
            'lathe-signal text-lathe-ink border-none': isActive,
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

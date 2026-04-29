import React from 'react';
import { cn } from './Button';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-[10px] font-medium text-lathe-ink/50 dark:text-lathe-surface/50">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-9 w-full bg-lathe-surface dark:bg-lathe-ink px-3 py-2 text-sm border border-lathe-ink/15 dark:border-lathe-surface/15 rounded-lg text-lathe-ink dark:text-lathe-surface placeholder:text-lathe-ink/30 dark:placeholder:text-lathe-surface/30 focus:outline-none focus:border-lathe-ink/40 dark:focus:border-lathe-surface/40 transition-colors disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';


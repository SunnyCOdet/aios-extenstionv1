import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../utils';

export type ButtonProps = {
  theme?: 'light' | 'dark';
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
} & ComponentPropsWithoutRef<'button'>;

export function Button({
  theme = 'dark',
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={cn(
        'btn-modern relative overflow-hidden font-semibold transition-all duration-300 ease-out',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        sizeClasses[size],
        {
          // Primary variant - Modern gradient with glow
          'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:shadow-cyan-500/25 hover:scale-105 focus:ring-cyan-500':
            variant === 'primary' && !disabled,
          'bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-lg hover:shadow-cyan-500/25 hover:scale-105 focus:ring-cyan-500':
            variant === 'primary' && !disabled && theme === 'dark',

          // Secondary variant - Glass morphism
          'glass text-white border border-white/20 hover:border-cyan-400/50 hover:bg-white/10 hover:scale-105 focus:ring-cyan-400':
            variant === 'secondary' && !disabled,

          // Ghost variant - Transparent with hover effects
          'text-cyan-400 hover:text-white hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 hover:scale-105 focus:ring-cyan-400':
            variant === 'ghost' && !disabled,

          // Glass variant - Strong glassmorphism
          'glass-strong text-white hover:bg-white/15 hover:scale-105 focus:ring-cyan-400':
            variant === 'glass' && !disabled,

          // Danger variant - Modern red gradient
          'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg hover:shadow-red-500/25 hover:scale-105 focus:ring-red-500':
            variant === 'danger' && !disabled,

          // Disabled state
          'bg-gray-600 text-gray-400 cursor-not-allowed shadow-none': disabled,
        },
        className,
      )}
      disabled={disabled}
      {...props}>
      <span className="relative z-10">{children}</span>
    </button>
  );
}

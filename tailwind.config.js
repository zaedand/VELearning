import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                border: 'var(--border)',
                input: 'var(--input)',
                ring: 'var(--ring)',
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                primary: { DEFAULT: 'var(--primary)', foreground: 'var(--primary-foreground)' },
                secondary: { DEFAULT: 'var(--secondary)', foreground: 'var(--secondary-foreground)' },
                muted: { DEFAULT: 'var(--muted)', foreground: 'var(--muted-foreground)' },
                accent: { DEFAULT: 'var(--accent)', foreground: 'var(--accent-foreground)' },
                card: { DEFAULT: 'var(--card)', foreground: 'var(--card-foreground)' },
                popover: { DEFAULT: 'var(--popover)', foreground: 'var(--popover-foreground)' },
                destructive: { DEFAULT: 'var(--destructive)', foreground: 'var(--destructive-foreground)' },
                success: { DEFAULT: 'var(--success)', foreground: 'var(--success-foreground)' },
                'brand-orange': { DEFAULT: 'var(--brand-orange)', foreground: 'var(--brand-orange-foreground)' },
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
        },
    },
    plugins: [forms],
};

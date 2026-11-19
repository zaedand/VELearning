import { useCallback, useEffect, useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'appearance';

const prefersDark = (): boolean =>
    window.matchMedia('(prefers-color-scheme: dark)').matches;

const readStoredAppearance = (): Appearance => {
    try {
        return (localStorage.getItem(STORAGE_KEY) as Appearance | null) ?? 'system';
    } catch {
        return 'system';
    }
};

export const applyAppearance = (appearance: Appearance): void => {
    const isDark = appearance === 'dark' || (appearance === 'system' && prefersDark());
    document.documentElement.classList.toggle('dark', isDark);
};

export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>(readStoredAppearance);

    const updateAppearance = useCallback((value: Appearance) => {
        setAppearance(value);
        try {
            localStorage.setItem(STORAGE_KEY, value);
        } catch {
            // localStorage tidak tersedia; tema tetap berlaku untuk sesi ini
        }
        applyAppearance(value);
    }, []);

    useEffect(() => {
        if (appearance !== 'system') return;

        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => applyAppearance('system');

        media.addEventListener('change', handleChange);
        return () => media.removeEventListener('change', handleChange);
    }, [appearance]);

    return { appearance, updateAppearance };
}

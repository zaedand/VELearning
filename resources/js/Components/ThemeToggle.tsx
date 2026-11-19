import { Monitor, Moon, Sun } from 'lucide-react';
import { Appearance, useAppearance } from '@/hooks/use-appearance';

const options: { value: Appearance; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Terang', icon: Sun },
    { value: 'dark', label: 'Gelap', icon: Moon },
    { value: 'system', label: 'Ikuti sistem', icon: Monitor },
];

export default function ThemeToggle() {
    const { appearance, updateAppearance } = useAppearance();

    return (
        <div
            role="group"
            aria-label="Pilih tema tampilan"
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-card p-1"
        >
            {options.map(({ value, label, icon: Icon }) => (
                <button
                    key={value}
                    type="button"
                    onClick={() => updateAppearance(value)}
                    aria-pressed={appearance === value}
                    title={label}
                    className={`rounded-md p-1.5 transition-colors ${
                        appearance === value
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                >
                    <Icon className="h-4 w-4" />
                    <span className="sr-only">{label}</span>
                </button>
            ))}
        </div>
    );
}

import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Components/ThemeToggle';
import LetterGlitch from '@/Components/LetterGlitch';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { useAppearance } from '@/hooks/use-appearance';

export default function Guest({ children }: PropsWithChildren) {
    const { appearance } = useAppearance();

    const isDark =
        appearance === 'dark' ||
        (appearance === 'system' &&
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-color-scheme: dark)').matches);

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-background pt-6 sm:pt-0 overflow-hidden text-foreground">

            <div className="absolute inset-0 z-0 opacity-20 dark:opacity-40">
                <LetterGlitch
                    glitchColors={
                        isDark
                            ? ['#f59e0b', '#ea580c', '#3f3f46']
                            : ['#f59e0b', '#ea580c', '#e4e4e7']
                    }
                    glitchSpeed={60}
                    smooth={true}
                />
            </div>

            {/* Overlay Gradient agar teks tetap terbaca */}
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

            {/* Tombol Tema */}
            <div className="fixed right-4 top-4 z-50">
                <ThemeToggle />
            </div>

            {/* Logo */}
            <div className="relative z-10 mb-6">
                <Link href="/">
                    <ApplicationLogo className="h-16 w-16 text-amber-500" />
                </Link>
            </div>

            {/* Kotak Form Putih Solid */}
            <div className="relative z-10 w-full overflow-hidden bg-card px-8 py-10 shadow-2xl border border-border sm:max-w-md sm:rounded-2xl">
                {children}
            </div>
        </div>
    );
}

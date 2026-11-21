import { Head, Link, usePage } from '@inertiajs/react';
import { GraduationCap } from 'lucide-react';
import LetterGlitch from '@/Components/LetterGlitch';

export default function Welcome() {
    const { auth } = usePage().props as any;

    return (
        <>
            <Head title="Selamat Datang - E-Learning" />

            {/* Background LetterGlitch */}
            <div className="absolute inset-0 z-0">
                <LetterGlitch
                    glitchColors={['#f59e0b', '#ea580c', '#52525b']}
                    glitchSpeed={50}
                    smooth={true}
                />
            </div>

            {/* Overlay Gradient untuk meredupkan background agar teks terbaca */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90" />

            {/* Konten Utama */}
            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6 text-center">

                {/* Logo Glow Effect */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 scale-150 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full blur-3xl opacity-30 animate-pulse" />
                    <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-2 border-amber-500/30 bg-black/50 backdrop-blur-sm">
                        <GraduationCap className="h-14 w-14 text-amber-500" />
                    </div>
                </div>

                {/* Teks Sambutan */}
                <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
                    E-Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Tech</span>
                </h1>

                <p className="max-w-md text-lg text-gray-300 mb-8 leading-relaxed">
                    Yuk! Tingkatkan kemampuanmu.
                </p>

                {/* Tombol Aksi */}
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                    {auth?.user ? (
                        <Link
                            href={route('dashboard')}
                            className="flex-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3.5 text-center text-sm font-bold text-black transition-all duration-300 hover:scale-105 hover:brightness-110 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                        >
                            Masuk ke Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="flex-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3.5 text-center text-sm font-bold text-black transition-all duration-300 hover:scale-105 hover:brightness-110 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                            >
                                Masuk
                            </Link>
                            <Link
                                href={route('register')}
                                className="flex-1 rounded-lg border-2 border-white/20 bg-black/40 px-8 py-3.5 text-center text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-white/40 hover:bg-black/60"
                            >
                                Daftar
                            </Link>
                        </>
                    )}
                </div>

                {/* Footer Tema */}
                <div className="mt-16 text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} by zaedand 2026. Hak cipta dilindungi.</p>
                </div>
            </div>
        </>
    );
}

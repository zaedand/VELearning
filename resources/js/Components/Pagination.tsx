import { Link } from '@inertiajs/react';
import { PaginationLink } from '@/types/models';

const translateLabel = (label: string): string => {
    if (label.includes('Previous')) return 'Sebelumnya';
    if (label.includes('Next')) return 'Berikutnya';
    return label;
};

export default function Pagination({ links }: { links: PaginationLink[] }) {
    // Hanya ada "Sebelumnya", "1", "Berikutnya": tidak perlu ditampilkan.
    if (links.length <= 3) return null;

    const base = 'rounded-md border px-3 py-1.5 text-sm transition-colors';

    return (
        <nav aria-label="Navigasi halaman" className="flex flex-wrap items-center justify-center gap-1">
            {links.map((link, index) => {
                const label = translateLabel(link.label);

                if (!link.url) {
                    return (
                        <span key={index} className={`${base} border-border text-muted-foreground opacity-50`}>
                            {label}
                        </span>
                    );
                }

                return (
                    <Link
                        key={index}
                        href={link.url}
                        preserveScroll
                        preserveState
                        aria-current={link.active ? 'page' : undefined}
                        className={`${base} ${
                            link.active
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border bg-card text-foreground hover:bg-accent'
                        }`}
                    >
                        {label}
                    </Link>
                );
            })}
        </nav>
    );
}

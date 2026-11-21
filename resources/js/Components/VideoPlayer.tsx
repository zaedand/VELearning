import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface VideoPlayerProps {
    src: string;
    title: string;
}

export default function VideoPlayer({ src, title }: VideoPlayerProps) {
    const [failed, setFailed] = useState(false);

    if (failed) {
        return (
            <div
                role="alert"
                className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border border-border bg-card p-6 text-center"
            >
                <AlertCircle className="h-8 w-8 text-destructive" />
                <p className="text-sm font-medium text-foreground">Video tidak dapat diputar.</p>
                <p className="text-xs text-muted-foreground">Muat ulang halaman atau coba beberapa saat lagi.</p>
                <button
                    type="button"
                    onClick={() => setFailed(false)}
                    className="mt-2 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent"
                >
                    Coba lagi
                </button>
            </div>
        );
    }

    return (
        <video
            key={src}
            src={src}
            controls
            controlsList="nodownload"
            playsInline
            preload="metadata"
            aria-label={title}
            onError={(event) => {
                const mediaError = event.currentTarget.error;
                console.error('Gagal memutar video:', mediaError?.code, mediaError?.message);
                setFailed(true);
            }}
            className="aspect-video w-full rounded-lg bg-black"
        >
            Peramban Anda tidak mendukung pemutar video.
        </video>
    );
}

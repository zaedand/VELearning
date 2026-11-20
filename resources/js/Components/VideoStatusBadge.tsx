import { VideoStatus } from '@/types/models';

const config: Record<VideoStatus, { label: string; className: string }> = {
    uploading: {
        label: 'Mengunggah',
        className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200',
    },
    ready: {
        label: 'Siap',
        className: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200',
    },
    failed: {
        label: 'Gagal',
        className: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
    },
};

export default function VideoStatusBadge({ status }: { status: VideoStatus | null }) {
    if (!status) {
        return (
            <span className="inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                Belum ada video
            </span>
        );
    }

    const { label, className } = config[status];

    return (
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>{label}</span>
    );
}

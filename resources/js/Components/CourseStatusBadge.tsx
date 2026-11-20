import { CourseStatus } from '@/types/models';

const config: Record<CourseStatus, { label: string; badge: string; dot: string }> = {
    published: {
        label: 'Dipublikasikan',
        badge: 'bg-accent text-accent-foreground',
        dot: 'bg-primary',
    },
    draft: {
        label: 'Draf',
        badge: 'bg-muted text-muted-foreground',
        dot: 'bg-muted-foreground',
    },
};

export default function CourseStatusBadge({ status }: { status: CourseStatus }) {
    const { label, badge, dot } = config[status];

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
            {label}
        </span>
    );
}

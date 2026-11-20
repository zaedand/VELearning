export type UserRole = 'admin' | 'student';
export type CourseStatus = 'draft' | 'published';
export type VideoStatus = 'uploading' | 'ready' | 'failed';

export interface Lesson {
    id: number;
    title: string;
    description: string | null;
    sort_order: number;
    video_status: VideoStatus | null;
    video_original_name: string | null;
    video_size: number | null;
    duration_seconds: number | null;
    has_ready_video: boolean;
    video_failure_reason: string | null;
    has_video: boolean;
}

export interface Course {
    id: number;
    title: string;
    slug: string;
    description: string;
    status: CourseStatus;
    lessons_count?: number;
    lessons?: Lesson[];
    created_at: string;
    updated_at: string;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface Paginated<T> {
    data: T[];
    meta: {
        current_page: number;
        last_page: number;
        from: number | null;
        to: number | null;
        total: number;
        links: PaginationLink[];
    };
}

export type CourseFormData = {
    title: string;
    description: string;
    status: CourseStatus;
};

export type LessonFormData = {
    title: string;
    description: string;
};

export interface VideoRules {
    max_size_bytes: number;
    allowed_mimes: string[];
    accept: string;
}

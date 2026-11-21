import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ChevronLeft, ChevronRight, VideoOff } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import VideoPlayer from '@/Components/VideoPlayer';
import { PageProps } from '@/types';
import { StudentCourse, StudentLesson } from '@/types/models';

interface LessonSummary {
    id: number;
    title: string;
}

type ShowProps = {
    course: StudentCourse;
    lesson: StudentLesson & { stream_url: string | null };
    previous: LessonSummary | null;
    next: LessonSummary | null;
}

export default function Show({ course, lesson, previous, next }: PageProps<ShowProps>) {
    const lessons = course.lessons ?? [];

    const navButton = 'inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent';

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link
                        href={route('courses.show', course.slug)}
                        aria-label="Kembali ke detail course"
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h2 className="truncate text-xl font-semibold leading-tight text-foreground">{course.title}</h2>
                </div>
            }
        >
            <Head title={`${lesson.title} - ${course.title}`} />

            <div className="py-8">
                <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
                    <div className="space-y-4 lg:col-span-2">
                        {lesson.stream_url ? (
                            <VideoPlayer src={lesson.stream_url} title={lesson.title} />
                        ) : (
                            <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card p-6 text-center">
                                <VideoOff className="h-8 w-8 text-muted-foreground" />
                                <p className="text-sm font-medium text-foreground">Video belum tersedia.</p>
                                <p className="text-xs text-muted-foreground">
                                    Video untuk lesson ini sedang disiapkan oleh admin.
                                </p>
                            </div>
                        )}

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Lesson {lesson.sort_order}
                            </p>
                            <h1 className="mt-1 text-2xl font-bold text-foreground">{lesson.title}</h1>
                            {lesson.description && (
                                <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">
                                    {lesson.description}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
                            {previous ? (
                                <Link href={route('courses.lessons.show', [course.slug, previous.id])} className={navButton}>
                                    <ChevronLeft className="h-4 w-4" />
                                    <span className="max-w-[10rem] truncate">{previous.title}</span>
                                </Link>
                            ) : (
                                <span />
                            )}
                            {next ? (
                                <Link href={route('courses.lessons.show', [course.slug, next.id])} className={navButton}>
                                    <span className="max-w-[10rem] truncate">{next.title}</span>
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            ) : (
                                <span />
                            )}
                        </div>
                    </div>

                    <aside className="h-fit rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
                        <h2 className="mb-3 text-sm font-semibold">Daftar lesson ({lessons.length})</h2>
                        <ol className="space-y-1">
                            {lessons.map((item) => {
                                const active = item.id === lesson.id;

                                const content = (
                                    <>
                                        <span className="w-5 shrink-0 text-xs font-semibold">{item.sort_order}</span>
                                        <span className="min-w-0 flex-1 truncate text-sm">{item.title}</span>
                                        {!item.has_ready_video && (
                                            <span className="shrink-0 text-xs text-muted-foreground">Segera hadir</span>
                                        )}
                                    </>
                                );

                                return (
                                    <li key={item.id}>
                                        <Link
                                            href={route('courses.lessons.show', [course.slug, item.id])}
                                            aria-current={active ? 'page' : undefined}
                                            className={`flex items-center gap-2 rounded-md border-l-4 px-3 py-2 transition-colors ${
                                                active
                                                    ? 'border-brand-orange bg-accent font-medium text-accent-foreground'
                                                    : 'border-transparent hover:bg-muted'
                                            } ${!item.has_ready_video && !active ? 'opacity-70' : ''}`}
                                        >
                                            {content}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ol>
                    </aside>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Clock, Play } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EmptyState from '@/Components/EmptyState';
import { PageProps } from '@/types';
import { StudentCourse } from '@/types/models';

export default function Show({ course }: PageProps<{ course: StudentCourse }>) {
    const lessons = course.lessons ?? [];
    const firstPlayable = lessons.find((lesson) => lesson.has_ready_video);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link
                        href={route('courses.index')}
                        aria-label="Kembali ke katalog course"
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-foreground">Detail Course</h2>
                </div>
            }
        >
            <Head title={course.title} />

            <div className="py-8">
                <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <section className="rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm">
                        <h1 className="text-2xl font-bold">{course.title}</h1>
                        <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">{course.description}</p>

                        <div className="mt-6">
                            {firstPlayable ? (
                                <Link
                                    href={route('courses.lessons.show', [course.slug, firstPlayable.id])}
                                    className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:brightness-95"
                                >
                                    <Play className="h-4 w-4" />
                                    Mulai belajar
                                </Link>
                            ) : (
                                <p className="text-sm text-muted-foreground">Video pembelajaran belum tersedia.</p>
                            )}
                        </div>
                    </section>

                    <section className="rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold">Daftar lesson ({lessons.length})</h2>

                        {lessons.length === 0 ? (
                            <EmptyState
                                icon={Clock}
                                title="Belum ada lesson"
                                description="Lesson akan ditambahkan oleh admin."
                            />
                        ) : (
                            <ol className="divide-y divide-border">
                                {lessons.map((lesson) => {
                                    const content = (
                                        <>
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                                                {lesson.sort_order}
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate text-sm font-medium">{lesson.title}</span>
                                                {lesson.description && (
                                                    <span className="block truncate text-xs text-muted-foreground">
                                                        {lesson.description}
                                                    </span>
                                                )}
                                            </span>
                                            {lesson.has_ready_video ? (
                                                <Play className="h-4 w-4 shrink-0 text-muted-foreground" />
                                            ) : (
                                                <span className="shrink-0 text-xs text-muted-foreground">Segera hadir</span>
                                            )}
                                        </>
                                    );

                                    return (
                                        <li key={lesson.id}>
                                            {lesson.has_ready_video ? (
                                                <Link
                                                    href={route('courses.lessons.show', [course.slug, lesson.id])}
                                                    className="flex items-center gap-3 py-3 transition-colors hover:bg-accent/60"
                                                >
                                                    {content}
                                                </Link>
                                            ) : (
                                                <div className="flex items-center gap-3 py-3 opacity-70">{content}</div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ol>
                        )}
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

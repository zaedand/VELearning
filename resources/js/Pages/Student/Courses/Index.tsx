import { useEffect, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, PlayCircle, Search } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EmptyState from '@/Components/EmptyState';
import Pagination from '@/Components/Pagination';
import Skeleton from '@/Components/Skeleton';
import { PageProps } from '@/types';
import { Paginated, StudentCourse } from '@/types/models';

interface Filters {
    search: string;
}

function CourseCardSkeleton() {
    return (
        <div className="space-y-3 rounded-lg border border-border bg-card p-5">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="mt-4 h-8 w-28" />
        </div>
    );
}

export default function Index({
    courses,
    filters,
}: PageProps<{ courses: Paginated<StudentCourse>; filters: Filters }>) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (search === (filters.search ?? '')) return;

        const timer = setTimeout(() => {
            router.get(
                route('courses.index'),
                { search: search || undefined },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    onStart: () => setLoading(true),
                    onFinish: () => setLoading(false),
                },
            );
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-foreground">Katalog Course</h2>}
        >
            <Head title="Katalog Course" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="relative sm:max-w-sm">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari course..."
                            aria-label="Cari course"
                            className="block w-full rounded-md border-gray-300 pl-9 text-sm shadow-sm focus:border-ring focus:ring-ring dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                        />
                    </div>

                    {loading ? (
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <CourseCardSkeleton key={index} />
                            ))}
                        </div>
                    ) : courses.data.length === 0 ? (
                        <EmptyState
                            icon={search ? Search : BookOpen}
                            title={search ? 'Course tidak ditemukan' : 'Belum ada course'}
                            description={
                                search
                                    ? 'Coba gunakan kata kunci lain.'
                                    : 'Course akan muncul di sini setelah dipublikasikan oleh admin.'
                            }
                        />
                    ) : (
                        <>
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {courses.data.map((course) => (
                                    <article
                                        key={course.id}
                                        className="flex flex-col rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm"
                                    >
                                        <h3 className="line-clamp-2 text-base font-semibold">{course.title}</h3>
                                        <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
                                            {course.description}
                                        </p>
                                        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                                            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <PlayCircle className="h-4 w-4" />
                                                {course.lessons_count ?? 0} lesson
                                            </span>
                                            <Link
                                                href={route('courses.show', course.slug)}
                                                className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition hover:brightness-95"
                                            >
                                                Lihat course
                                            </Link>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            <Pagination links={courses.meta.links} />
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

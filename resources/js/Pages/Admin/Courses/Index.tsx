import { useEffect, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmDialog from '@/Components/ConfirmDialog';
import CourseStatusBadge from '@/Components/CourseStatusBadge';
import EmptyState from '@/Components/EmptyState';
import Pagination from '@/Components/Pagination';
import PrimaryButton from '@/Components/PrimaryButton';
import Skeleton from '@/Components/Skeleton';
import { formatDate } from '@/lib/format';
import { PageProps } from '@/types';
import { Course, CourseStatus, Paginated } from '@/types/models';

interface Filters {
    search: string;
    status: CourseStatus | null;
}

function CourseCardSkeleton() {
    return (
        <div className="space-y-3 rounded-lg border border-border bg-card p-5">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex justify-between pt-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
            </div>
        </div>
    );
}

export default function Index({ courses, filters }: PageProps<{ courses: Paginated<Course>; filters: Filters }>) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState<CourseStatus | ''>(filters.status ?? '');
    const [loading, setLoading] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
    const [deleting, setDeleting] = useState(false);

    const hasFilters = search !== '' || status !== '';

    // Cari otomatis setelah pengguna berhenti mengetik (debounce 400 ms).
    useEffect(() => {
        const unchanged = search === (filters.search ?? '') && status === (filters.status ?? '');
        if (unchanged) return;

        const timer = setTimeout(() => {
            router.get(
                route('admin.courses.index'),
                { search: search || undefined, status: status || undefined },
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
    }, [search, status]);

    const confirmDelete = () => {
        if (!courseToDelete) return;

        router.delete(route('admin.courses.destroy', courseToDelete.id), {
            preserveScroll: true,
            onStart: () => setDeleting(true),
            onFinish: () => {
                setDeleting(false);
                setCourseToDelete(null);
            },
        });
    };

    const resetFilters = () => {
        setSearch('');
        setStatus('');
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-foreground">Kelola Course</h2>}
        >
            <Head title="Kelola Course" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                            <div className="relative sm:max-w-xs sm:flex-1">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari judul course..."
                                    aria-label="Cari course"
                                    className="block w-full rounded-md border-gray-300 pl-9 text-sm shadow-sm focus:border-ring focus:ring-ring dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                />
                            </div>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as CourseStatus | '')}
                                aria-label="Filter status"
                                className="rounded-md border-gray-300 text-sm shadow-sm focus:border-ring focus:ring-ring dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                            >
                                <option value="">Semua status</option>
                                <option value="published">Dipublikasikan</option>
                                <option value="draft">Draf</option>
                            </select>
                        </div>

                        <Link href={route('admin.courses.create')}>
                            <PrimaryButton type="button" className="gap-2">
                                <Plus className="h-4 w-4" />
                                Buat course
                            </PrimaryButton>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <CourseCardSkeleton key={index} />
                            ))}
                        </div>
                    ) : courses.data.length === 0 ? (
                        hasFilters ? (
                            <EmptyState
                                icon={Search}
                                title="Course tidak ditemukan"
                                description="Tidak ada course yang cocok dengan pencarian atau filter Anda."
                                action={
                                    <button
                                        type="button"
                                        onClick={resetFilters}
                                        className="text-sm text-foreground underline"
                                    >
                                        Reset pencarian
                                    </button>
                                }
                            />
                        ) : (
                            <EmptyState
                                icon={BookOpen}
                                title="Belum ada course"
                                description="Buat course pertama Anda, lalu tambahkan lesson berupa video."
                                action={
                                    <Link href={route('admin.courses.create')}>
                                        <PrimaryButton type="button" className="gap-2">
                                            <Plus className="h-4 w-4" />
                                            Buat course
                                        </PrimaryButton>
                                    </Link>
                                }
                            />
                        )
                    ) : (
                        <>
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {courses.data.map((course) => (
                                    <article
                                        key={course.id}
                                        className="flex flex-col rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className="line-clamp-2 text-base font-semibold">{course.title}</h3>
                                            <CourseStatusBadge status={course.status} />
                                        </div>

                                        <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">
                                            {course.description}
                                        </p>

                                        <dl className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                                            <div>
                                                <dt className="sr-only">Jumlah lesson</dt>
                                                <dd>{course.lessons_count ?? 0} lesson</dd>
                                            </div>
                                            <div>
                                                <dt className="sr-only">Terakhir diperbarui</dt>
                                                <dd>Diperbarui {formatDate(course.updated_at)}</dd>
                                            </div>
                                        </dl>

                                        <div className="mt-4 flex items-center justify-end gap-2 border-t border-border pt-4">
                                            <Link
                                                href={route('admin.courses.edit', course.id)}
                                                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-foreground hover:bg-accent"
                                            >
                                                <Pencil className="h-4 w-4" />
                                                Kelola
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => setCourseToDelete(course)}
                                                aria-label={`Hapus course ${course.title}`}
                                                className="rounded-md p-2 text-destructive hover:bg-red-50 dark:hover:bg-red-950"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            <div className="flex flex-col items-center gap-3">
                                <p className="text-sm text-muted-foreground">
                                    Menampilkan {courses.meta.from}–{courses.meta.to} dari {courses.meta.total} course
                                </p>
                                <Pagination links={courses.meta.links} />
                            </div>
                        </>
                    )}
                </div>
            </div>

            <ConfirmDialog
                show={courseToDelete !== null}
                title="Hapus course?"
                description={
                    <>
                        Course <strong className="text-foreground">{courseToDelete?.title}</strong> beserta seluruh
                        lesson dan file videonya akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
                    </>
                }
                processing={deleting}
                onConfirm={confirmDelete}
                onClose={() => setCourseToDelete(null)}
            />
        </AuthenticatedLayout>
    );
}

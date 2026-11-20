import { useState } from 'react';
import { router } from '@inertiajs/react';
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2, Video } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmDialog from '@/Components/ConfirmDialog';
import EmptyState from '@/Components/EmptyState';
import LessonFormDialog from '@/Components/LessonFormDialog';
import PrimaryButton from '@/Components/PrimaryButton';
import VideoStatusBadge from '@/Components/VideoStatusBadge';
import LessonVideoUpload from '@/Components/LessonVideoUpload';
import { Course, Lesson, VideoRules } from '@/types/models';

export default function LessonManager({
    course,
    videoRules,
}: {
    course: Course;
    videoRules: VideoRules;
}) {
    const lessons = course.lessons ?? [];

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
    const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [reordering, setReordering] = useState(false);

    const iconButton =
        'rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent';

    const openCreate = () => {
        setEditingLesson(null);
        setDialogOpen(true);
    };

    const openEdit = (lesson: Lesson) => {
        setEditingLesson(lesson);
        setDialogOpen(true);
    };

    const move = (index: number, direction: -1 | 1) => {
        const target = index + direction;
        if (target < 0 || target >= lessons.length) return;

        const orderedIds = lessons.map((lesson) => lesson.id);
        [orderedIds[index], orderedIds[target]] = [orderedIds[target], orderedIds[index]];

        router.patch(
            route('admin.courses.lessons.reorder', course.id),
            { ordered_ids: orderedIds },
            {
                preserveScroll: true,
                preserveState: true,
                onStart: () => setReordering(true),
                onFinish: () => setReordering(false),
                onError: () =>
                    toast.error(
                        'Gagal mengubah urutan lesson. Muat ulang halaman lalu coba lagi.',
                    ),
            },
        );
    };

    const confirmDelete = () => {
        if (!lessonToDelete) return;

        router.delete(route('admin.lessons.destroy', lessonToDelete.id), {
            preserveScroll: true,
            preserveState: true,
            onStart: () => setDeleting(true),
            onFinish: () => {
                setDeleting(false);
                setLessonToDelete(null);
            },
        });
    };

    return (
        <section className="rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold">
                    Daftar lesson ({lessons.length})
                </h3>
                <PrimaryButton type="button" onClick={openCreate} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Tambah lesson
                </PrimaryButton>
            </div>

            {lessons.length === 0 ? (
                <EmptyState
                    icon={Video}
                    title="Belum ada lesson"
                    description="Tambahkan lesson pertama. Video pembelajaran diunggah untuk setiap lesson."
                />
            ) : (
                <ol className="divide-y divide-border">
                    {lessons.map((lesson, index) => (
                        <li key={lesson.id} className="flex items-center gap-3 py-3">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                                {lesson.sort_order}
                            </span>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">
                                    {lesson.title}
                                </p>
                                {lesson.description && (
                                    <p className="truncate text-xs text-muted-foreground">
                                        {lesson.description}
                                    </p>
                                )}
                                <LessonVideoUpload lesson={lesson} rules={videoRules} />
                            </div>

                            <div className="hidden sm:block">
                                <VideoStatusBadge status={lesson.video_status} />
                            </div>

                            <div className="flex shrink-0 items-center">
                                <button
                                    type="button"
                                    onClick={() => move(index, -1)}
                                    disabled={reordering || index === 0}
                                    aria-label={`Naikkan lesson ${lesson.title}`}
                                    className={iconButton}
                                >
                                    <ArrowUp className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => move(index, 1)}
                                    disabled={reordering || index === lessons.length - 1}
                                    aria-label={`Turunkan lesson ${lesson.title}`}
                                    className={iconButton}
                                >
                                    <ArrowDown className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => openEdit(lesson)}
                                    aria-label={`Ubah lesson ${lesson.title}`}
                                    className={iconButton}
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLessonToDelete(lesson)}
                                    aria-label={`Hapus lesson ${lesson.title}`}
                                    className="rounded-md p-1.5 text-destructive transition-colors hover:bg-red-50 dark:hover:bg-red-950"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ol>
            )}

            <LessonFormDialog
                show={dialogOpen}
                courseId={course.id}
                lesson={editingLesson}
                onClose={() => setDialogOpen(false)}
            />

            <ConfirmDialog
                show={lessonToDelete !== null}
                title="Hapus lesson?"
                description={
                    <>
                        Lesson{' '}
                        <strong className="text-foreground">
                            {lessonToDelete?.title}
                        </strong>{' '}
                        beserta file videonya akan dihapus permanen. Tindakan ini
                        tidak dapat dibatalkan.
                    </>
                }
                processing={deleting}
                onConfirm={confirmDelete}
                onClose={() => setLessonToDelete(null)}
            />
        </section>
    );
}

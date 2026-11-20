import { FormEventHandler, useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmDialog from '@/Components/ConfirmDialog';
import CourseForm from '@/Components/CourseForm';
import DangerButton from '@/Components/DangerButton';
import LessonManager from '@/Components/LessonManager';
import { PageProps } from '@/types';
import { Course, CourseFormData, VideoRules } from '@/types/models';

export default function Edit({
    course,
    videoRules,
}: PageProps<{ course: Course; videoRules: VideoRules }>) {
    const form = useForm<CourseFormData>({
        title: course.title,
        description: course.description,
        status: course.status,
    });
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        form.put(route('admin.courses.update', course.id), { preserveScroll: true });
    };

    const deleteCourse = () => {
        router.delete(route('admin.courses.destroy', course.id), {
            onStart: () => setDeleting(true),
            onFinish: () => {
                setDeleting(false);
                setConfirmingDelete(false);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link
                        href={route('admin.courses.index')}
                        aria-label="Kembali ke daftar course"
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-foreground">Kelola Course</h2>
                </div>
            }
        >
            <Head title={`Kelola ${course.title}`} />

            <div className="py-8">
                <div className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <section className="rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm">
                        <h3 className="mb-6 text-lg font-semibold">Informasi course</h3>
                        <CourseForm
                            form={form}
                            onSubmit={submit}
                            submitLabel="Simpan perubahan"
                            cancelHref={route('admin.courses.index')}
                        />
                    </section>

                    <LessonManager course={course} videoRules={videoRules} />

                    <section className="rounded-lg border border-red-200 bg-card p-6 text-card-foreground shadow-sm dark:border-red-900">
                        <h3 className="text-lg font-semibold text-destructive">Hapus course</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Menghapus course akan menghapus seluruh lesson dan file videonya secara permanen.
                        </p>
                        <div className="mt-4">
                            <DangerButton onClick={() => setConfirmingDelete(true)}>Hapus course</DangerButton>
                        </div>
                    </section>
                </div>
            </div>

            <ConfirmDialog
                show={confirmingDelete}
                title="Hapus course?"
                description={
                    <>
                        Course <strong className="text-foreground">{course.title}</strong> beserta seluruh lesson dan
                        file videonya akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
                    </>
                }
                processing={deleting}
                onConfirm={deleteCourse}
                onClose={() => setConfirmingDelete(false)}
            />
        </AuthenticatedLayout>
    );
}

import { FormEventHandler, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { Lesson, LessonFormData } from '@/types/models';

interface LessonFormDialogProps {
    show: boolean;
    courseId: number;
    lesson: Lesson | null;
    onClose: () => void;
}

export default function LessonFormDialog({ show, courseId, lesson, onClose }: LessonFormDialogProps) {
    const form = useForm<LessonFormData>({ title: '', description: '' });
    const isEditing = lesson !== null;

    // Isi ulang form setiap dialog dibuka (kosong untuk lesson baru, terisi untuk ubah).
    useEffect(() => {
        if (show) {
            form.setData({
                title: lesson?.title ?? '',
                description: lesson?.description ?? '',
            });
            form.clearErrors();
        }
    }, [show, lesson]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const options = {
            preserveScroll: true,
            // Menjaga isian form course yang belum disimpan agar tidak hilang.
            preserveState: true,
            onSuccess: () => onClose(),
        };

        if (lesson) {
            form.put(route('admin.lessons.update', lesson.id), options);
        } else {
            form.post(route('admin.courses.lessons.store', courseId), options);
        }
    };

    return (
        <Modal show={show} onClose={onClose} closeable={!form.processing} maxWidth="lg">
            <form onSubmit={submit} className="space-y-5 p-6">
                <h2 className="text-lg font-semibold text-foreground">
                    {isEditing ? 'Ubah lesson' : 'Tambah lesson'}
                </h2>

                <div>
                    <InputLabel htmlFor="lesson-title" value="Judul lesson" />
                    <TextInput
                        id="lesson-title"
                        className="mt-1 block w-full"
                        value={form.data.title}
                        onChange={(e) => form.setData('title', e.target.value)}
                        placeholder="Contoh: Pengenalan Laravel dan Struktur Proyek"
                    />
                    <InputError message={form.errors.title} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="lesson-description" value="Deskripsi (opsional)" />
                    <textarea
                        id="lesson-description"
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ring focus:ring-ring dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                        value={form.data.description}
                        onChange={(e) => form.setData('description', e.target.value)}
                        placeholder="Ringkasan singkat isi lesson ini..."
                    />
                    <InputError message={form.errors.description} className="mt-2" />
                </div>

                <div className="flex justify-end gap-3">
                    <SecondaryButton onClick={onClose} disabled={form.processing}>
                        Batal
                    </SecondaryButton>
                    <PrimaryButton disabled={form.processing}>
                        {form.processing ? 'Menyimpan...' : isEditing ? 'Simpan perubahan' : 'Tambah lesson'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}

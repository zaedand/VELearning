import { FormEventHandler } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CourseForm from '@/Components/CourseForm';
import { CourseFormData } from '@/types/models';

export default function Create() {
    const form = useForm<CourseFormData>({
        title: '',
        description: '',
        status: 'draft',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        form.post(route('admin.courses.store'));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-foreground">Buat Course Baru</h2>}
        >
            <Head title="Buat Course" />

            <div className="py-8">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm">
                        <CourseForm
                            form={form}
                            onSubmit={submit}
                            submitLabel="Simpan course"
                            cancelHref={route('admin.courses.index')}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

import { FormEventHandler } from 'react';
import { InertiaFormProps, Link } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { CourseFormData, CourseStatus } from '@/types/models';

interface CourseFormProps {
    form: InertiaFormProps<CourseFormData>;
    onSubmit: FormEventHandler;
    submitLabel: string;
    cancelHref: string;
}

const statusOptions: { value: CourseStatus; label: string; hint: string }[] = [
    { value: 'draft', label: 'Draf', hint: 'Hanya terlihat oleh admin.' },
    { value: 'published', label: 'Dipublikasikan', hint: 'Terlihat dan dapat dipelajari oleh student.' },
];

export default function CourseForm({ form, onSubmit, submitLabel, cancelHref }: CourseFormProps) {
    const { data, setData, errors, processing } = form;

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div>
                <InputLabel htmlFor="title" value="Judul course" />
                <TextInput
                    id="title"
                    className="mt-1 block w-full"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="Contoh: Dasar Pemrograman Web dengan Laravel"
                />
                <InputError message={errors.title} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="description" value="Deskripsi" />
                <textarea
                    id="description"
                    rows={5}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ring focus:ring-ring dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Jelaskan isi dan tujuan pembelajaran course ini..."
                />
                <InputError message={errors.description} className="mt-2" />
            </div>

            <fieldset>
                <legend className="text-sm font-medium text-foreground">Status publikasi</legend>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                    {statusOptions.map((option) => {
                        const selected = data.status === option.value;

                        return (
                            <label
                                key={option.value}
                                className={`flex cursor-pointer gap-3 rounded-lg border p-4 transition-colors ${
                                    selected
                                        ? 'border-primary bg-accent text-accent-foreground'
                                        : 'border-border bg-card text-card-foreground hover:bg-muted'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="status"
                                    value={option.value}
                                    checked={selected}
                                    onChange={() => setData('status', option.value)}
                                    className="mt-1 text-primary focus:ring-ring"
                                />
                                <span>
                                    <span className="block text-sm font-medium">{option.label}</span>
                                    <span className="block text-xs opacity-80">{option.hint}</span>
                                </span>
                            </label>
                        );
                    })}
                </div>
                <InputError message={errors.status} className="mt-2" />
            </fieldset>

            <div className="flex items-center gap-4">
                <PrimaryButton disabled={processing}>{processing ? 'Menyimpan...' : submitLabel}</PrimaryButton>
                <Link href={cancelHref} className="text-sm text-muted-foreground underline hover:text-foreground">
                    Batal
                </Link>
            </div>
        </form>
    );
}

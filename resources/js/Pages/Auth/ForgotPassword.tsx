import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    const inputClass = "mt-1 block w-full bg-background border-border text-foreground focus:border-amber-500 focus:ring-amber-500 placeholder-muted-foreground";

    return (
        <GuestLayout>
            <Head title="Lupa Kata Sandi" />

            <div className="mb-6 text-center text-2xl font-bold text-foreground">Lupa Kata Sandi</div>

            <div className="mb-4 text-sm text-muted-foreground">
                Lupa kata sandi? Masukkan alamat email Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi.
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-500">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" className="text-foreground" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className={inputClass}
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-6 flex items-center justify-end">
                    <PrimaryButton className="bg-amber-500 text-black hover:bg-amber-600 active:bg-amber-700" disabled={processing}>
                        Kirim Tautan Reset
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}

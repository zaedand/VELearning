import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const inputClass = "mt-1 block w-full bg-background border-border text-foreground focus:border-amber-500 focus:ring-amber-500 placeholder-muted-foreground";

    return (
        <GuestLayout>
            <Head title="Atur Ulang Kata Sandi" />

            <div className="mb-6 text-center text-2xl font-bold text-foreground">Atur Ulang Kata Sandi</div>

            <form onSubmit={submit}>
                <div>
                    {/* Perbaikan: text-gray-300 diubah menjadi text-foreground */}
                    <InputLabel htmlFor="email" value="Email" className="text-foreground" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className={inputClass}
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Kata Sandi Baru" className="text-foreground" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className={inputClass}
                        autoComplete="new-password"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="Konfirmasi Kata Sandi" className="text-foreground" />
                    <TextInput
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className={inputClass}
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="mt-6 flex items-center justify-end">
                    <PrimaryButton className="bg-amber-500 text-black hover:bg-amber-600 active:bg-amber-700" disabled={processing}>
                        Simpan Kata Sandi
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}

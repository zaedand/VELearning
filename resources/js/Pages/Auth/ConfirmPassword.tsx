import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    // Perbaikan inputClass agar dinamis mengikuti tema
    const inputClass = "mt-1 block w-full bg-background border-border text-foreground focus:border-amber-500 focus:ring-amber-500 placeholder-muted-foreground";

    return (
        <GuestLayout>
            <Head title="Konfirmasi Kata Sandi" />

            {/* Perbaikan text-white menjadi text-foreground */}
            <div className="mb-6 text-center text-2xl font-bold text-foreground">Area Aman</div>

            {/* Perbaikan text-gray-400 menjadi text-muted-foreground */}
            <div className="mb-4 text-sm text-muted-foreground leading-relaxed">
                Ini adalah area aman. Mohon konfirmasi kata sandi Anda sebelum melanjutkan.
            </div>

            <form onSubmit={submit}>
                <div className="mt-4">
                    {/* Perbaikan text-gray-300 menjadi text-foreground */}
                    <InputLabel htmlFor="password" value="Kata Sandi" className="text-foreground" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className={inputClass}
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-6 flex items-center justify-end">
                    <PrimaryButton className="bg-amber-500 text-black hover:bg-amber-600 active:bg-amber-700" disabled={processing}>
                        Konfirmasi
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}

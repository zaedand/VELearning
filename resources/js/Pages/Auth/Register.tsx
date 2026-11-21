import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const inputClass = "mt-1 block w-full bg-background border-border text-foreground focus:border-amber-500 focus:ring-amber-500 placeholder-muted-foreground";

    const linkClass = "rounded-md text-sm text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 focus:outline-none underline";

    return (
        <GuestLayout>
            <Head title="Daftar" />

            <div className="mb-6 text-center text-2xl font-bold text-foreground">Buat Akun Baru</div>

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Nama" className="text-foreground" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className={inputClass}
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" className="text-foreground" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className={inputClass}
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Kata Sandi" className="text-foreground" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className={inputClass}
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="Konfirmasi Kata Sandi" className="text-foreground" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className={inputClass}
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <Link href={route('login')} className={linkClass}>
                        Sudah punya akun?
                    </Link>

                    <PrimaryButton className="bg-amber-500 text-black hover:bg-amber-600 active:bg-amber-700" disabled={processing}>
                        Daftar
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}

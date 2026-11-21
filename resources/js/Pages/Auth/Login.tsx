import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const inputClass = "mt-1 block w-full bg-background border-border text-foreground focus:border-amber-500 focus:ring-amber-500";
    const linkClass = "rounded-md text-sm text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 focus:outline-none underline";

    return (
        <GuestLayout>
            <Head title="Masuk" />

            <div className="mb-6 text-center text-2xl font-bold text-foreground">Selamat Datang Kembali</div>

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
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
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
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', (e.target.checked || false) as false)}
                            className="border-border bg-background text-amber-500 focus:ring-amber-500 focus:ring-offset-background"
                        />
                        <span className="ms-2 text-sm text-muted-foreground">
                            Ingat saya
                        </span>
                    </label>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    {canResetPassword && (
                        <Link href={route('password.request')} className={linkClass}>
                            Lupa kata sandi?
                        </Link>
                    )}

                    <PrimaryButton className="ms-4 bg-amber-500 text-black hover:bg-amber-600 active:bg-amber-700" disabled={processing}>
                        Masuk
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}

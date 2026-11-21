import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verifikasi Email" />

            <div className="mb-6 text-center text-2xl font-bold text-foreground">Verifikasi Email</div>

            <div className="mb-4 text-sm text-muted-foreground leading-relaxed">
                Terima kasih telah mendaftar! Sebelum memulai, mohon verifikasi alamat email Anda dengan mengklik tautan yang baru saja kami kirimkan. Jika Anda tidak menerimanya, kami akan dengan senang hati mengirimkan yang baru.
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-500">
                    Tautan verifikasi baru telah dikirim ke alamat email yang Anda berikan saat pendaftaran.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <PrimaryButton className="w-full sm:w-auto bg-amber-500 text-black hover:bg-amber-600 active:bg-amber-700" disabled={processing}>
                        Kirim Ulang Email Verifikasi
                    </PrimaryButton>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="rounded-md text-sm text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 focus:outline-none underline"
                    >
                        Keluar
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}

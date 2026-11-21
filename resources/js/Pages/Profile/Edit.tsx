import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-center text-xl font-semibold leading-tight text-foreground">
                    Pengaturan Profil
                </h2>
            }
        >
            <Head title="Profil" />

            <div className="py-12">
                {/* max-w-3xl membuat kontainer lebih ramping dan ke tengah */}
                <div className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6 lg:px-8">

                    {/* Card 1: Informasi Profil */}
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="w-full"
                        />
                    </div>

                    {/* Card 2: Ubah Kata Sandi */}
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                        <UpdatePasswordForm className="w-full" />
                    </div>

                    {/* Card 3: Hapus Akun */}
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                        <DeleteUserForm className="w-full" />
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

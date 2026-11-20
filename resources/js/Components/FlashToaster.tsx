import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import toast, { Toaster } from 'react-hot-toast';
import { PageProps } from '@/types';

export default function FlashToaster() {
    const { flash } = usePage<PageProps>().props;

    useEffect(() => {
        // `id` mencegah toast ganda untuk pesan yang sama (mis. React StrictMode di mode dev).
        if (flash?.success) toast.success(flash.success, { id: flash.success });
        if (flash?.error) toast.error(flash.error, { id: flash.error });
    }, [flash]);

    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 4000,
                style: {
                    background: 'var(--card)',
                    color: 'var(--card-foreground)',
                    border: '1px solid var(--border)',
                },
                success: { iconTheme: { primary: '#16a34a', secondary: '#ffffff' } },
                error: { iconTheme: { primary: '#dc2626', secondary: '#ffffff' } },
            }}
        />
    );
}

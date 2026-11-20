import { ReactNode } from 'react';
import Modal from '@/Components/Modal';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';

interface ConfirmDialogProps {
    show: boolean;
    title: string;
    description: ReactNode;
    confirmLabel?: string;
    processing?: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

export default function ConfirmDialog({
    show,
    title,
    description,
    confirmLabel = 'Ya, hapus',
    processing = false,
    onConfirm,
    onClose,
}: ConfirmDialogProps) {
    return (
        <Modal show={show} onClose={onClose} closeable={!processing} maxWidth="md">
            <div className="p-6">
                <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                <div className="mt-2 text-sm text-muted-foreground">{description}</div>

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={onClose} disabled={processing}>
                        Batal
                    </SecondaryButton>
                    <DangerButton onClick={onConfirm} disabled={processing}>
                        {processing ? 'Menghapus...' : confirmLabel}
                    </DangerButton>
                </div>
            </div>
        </Modal>
    );
}

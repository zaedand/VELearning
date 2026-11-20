import { useCallback, useEffect, useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import toast from 'react-hot-toast';
import { formatFileSize } from '@/lib/format';
import { VideoRules } from '@/types/models';

export type UploadState = 'idle' | 'uploading' | 'processing';

export function useVideoUpload(lessonId: number, rules: VideoRules) {
    const [state, setState] = useState<UploadState>('idle');
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const cancelRef = useRef<{ cancel: () => void } | null>(null);
    const activeRef = useRef(false);

    // Jika file melebihi post_max_size di server, respons 413
    useEffect(() => {
        return router.on('invalid', (event) => {
            if (!activeRef.current) return;

            if (event.detail.response.status === 413) {
                event.preventDefault();
                const message = 'Ukuran file melebihi batas upload di server. Gunakan video yang lebih kecil.';
                setError(message);
                toast.error(message);
            }
        });
    }, []);

    const validate = (file: File): string | null => {
        if (file.type && !rules.allowed_mimes.includes(file.type)) {
            return 'Format video harus MP4 atau WebM.';
        }

        if (file.size > rules.max_size_bytes) {
            return `Ukuran video maksimal ${formatFileSize(rules.max_size_bytes)}.`;
        }

        return null;
    };

    const upload = useCallback(
        (file: File) => {
            const validationError = validate(file);

            if (validationError) {
                setError(validationError);
                return;
            }

            setError(null);
            setProgress(0);

            router.post(
                route('admin.lessons.video.store', lessonId),
                { video: file },
                {
                    forceFormData: true,
                    preserveScroll: true,
                    preserveState: true,
                    onCancelToken: (token) => {
                        cancelRef.current = token;
                    },
                    onStart: () => {
                        activeRef.current = true;
                        setState('uploading');
                    },
                    onProgress: (event) => {
                        if (event?.percentage === undefined) return;

                        setProgress(Math.round(event.percentage));

                        if (event.percentage >= 100) setState('processing');
                    },
                    onError: (errors) => {
                        setError(errors.video ?? 'Gagal mengunggah video. Silakan coba lagi.');
                    },
                    onCancel: () => {
                        setError(null);
                    },
                    onFinish: () => {
                        activeRef.current = false;
                        cancelRef.current = null;
                        setState('idle');
                        setProgress(0);
                    },
                },
            );
        },
        [lessonId, rules],
    );

    const cancel = useCallback(() => {
        cancelRef.current?.cancel();
    }, []);

    return { state, progress, error, upload, cancel };
}

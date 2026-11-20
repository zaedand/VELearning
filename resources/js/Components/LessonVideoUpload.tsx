import { ChangeEvent, useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import { Trash2, Upload } from 'lucide-react';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { useVideoUpload } from '@/hooks/use-video-upload';
import { formatFileSize } from '@/lib/format';
import { Lesson, VideoRules } from '@/types/models';

interface LessonVideoUploadProps {
    lesson: Lesson;
    rules: VideoRules;
}

export default function LessonVideoUpload({ lesson, rules }: LessonVideoUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const { state, progress, error, upload, cancel } = useVideoUpload(lesson.id, rules);
    const [confirmingRemove, setConfirmingRemove] = useState(false);
    const [removing, setRemoving] = useState(false);

    const isBusy = state !== 'idle';

    const buttonLabel =
        lesson.video_status === 'failed'
            ? 'Coba unggah lagi'
            : lesson.has_video
              ? 'Ganti video'
              : 'Unggah video';

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) upload(file);

        // Reset agar file yang sama bisa dipilih ulang.
        e.target.value = '';
    };

    const removeVideo = () => {
        router.delete(route('admin.lessons.video.destroy', lesson.id), {
            preserveScroll: true,
            preserveState: true,
            onStart: () => setRemoving(true),
            onFinish: () => {
                setRemoving(false);
                setConfirmingRemove(false);
            },
        });
    };

    return (
        <div className="mt-2">
            {isBusy ? (
                <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{state === 'processing' ? 'Memproses di server...' : `Mengunggah ${progress}%`}</span>
                        {state === 'uploading' && (
                            <button type="button" onClick={cancel} className="text-foreground underline">
                                Batalkan
                            </button>
                        )}
                    </div>
                    <div
                        role="progressbar"
                        aria-label="Progres unggah video"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={progress}
                        className="mt-1 h-2 overflow-hidden rounded-full bg-muted"
                    >
                        <div
                            className="h-full rounded-full bg-brand-gradient transition-[width] duration-200"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            ) : (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <input
                        ref={inputRef}
                        type="file"
                        accept={rules.accept}
                        onChange={handleChange}
                        className="sr-only"
                        tabIndex={-1}
                        aria-hidden="true"
                    />
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                    >
                        <Upload className="h-3.5 w-3.5" />
                        {buttonLabel}
                    </button>

                    {lesson.has_video && (
                        <button
                            type="button"
                            onClick={() => setConfirmingRemove(true)}
                            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-destructive hover:bg-red-50 dark:hover:bg-red-950"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Hapus video
                        </button>
                    )}

                    {lesson.video_status === 'ready' && lesson.video_original_name && (
                        <span className="min-w-0 truncate text-xs text-muted-foreground">
                            {lesson.video_original_name} · {formatFileSize(lesson.video_size)}
                        </span>
                    )}
                </div>
            )}

            {(error || (lesson.video_status === 'failed' && lesson.video_failure_reason && !isBusy)) && (
                <p role="alert" className="mt-1 text-xs text-destructive">
                    {error ?? lesson.video_failure_reason}
                </p>
            )}

            <ConfirmDialog
                show={confirmingRemove}
                title="Hapus video?"
                description={
                    <>
                        Video lesson <strong className="text-foreground">{lesson.title}</strong> akan dihapus permanen.
                        Anda dapat mengunggah video baru setelahnya.
                    </>
                }
                processing={removing}
                onConfirm={removeVideo}
                onClose={() => setConfirmingRemove(false)}
            />
        </div>
    );
}

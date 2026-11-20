<?php

namespace App\Services;

use App\Enums\VideoStatus;
use App\Exceptions\VideoUploadException;
use App\Models\Lesson;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;
use Throwable;

class VideoStorageService
{
    private const EXTENSIONS = [
        'video/mp4' => 'mp4',
        'video/webm' => 'webm',
    ];

    public function store(Lesson $lesson, UploadedFile $file): Lesson
    {
        $mime = $file->getMimeType();
        $extension = self::EXTENSIONS[$mime] ?? null;

        if ($extension === null) {
            throw new VideoUploadException('Format video tidak didukung. Gunakan MP4 atau WebM.');
        }

        $oldPath = $lesson->video_path;

        $lesson->update([
            'video_status' => VideoStatus::Uploading,
            'video_failure_reason' => null,
        ]);

        $newPath = null;

        try {
            $filename = Str::uuid()->toString().'.'.$extension;

            $newPath = Storage::disk($this->disk())->putFileAs(
                config('video.directory'),
                $file,
                $filename
            );

            if ($newPath === false) {
                throw new RuntimeException('Penyimpanan file video mengembalikan false.');
            }

            $lesson->update([
                'video_path' => $newPath,
                'video_original_name' => Str::limit($file->getClientOriginalName(), 250, ''),
                'video_mime' => $mime,
                'video_size' => $file->getSize(),
                'video_status' => VideoStatus::Ready,
                'video_failure_reason' => null,
            ]);
        } catch (Throwable $e) {
            report($e);

            if (is_string($newPath)) {
                $this->delete($newPath);
            }

            $lesson->update([
                'video_status' => VideoStatus::Failed,
                'video_failure_reason' => 'Video gagal disimpan. Silakan coba lagi.',
            ]);

            throw new VideoUploadException('Video gagal disimpan. Silakan coba lagi.', 0, $e);
        }

        // File lama baru dihapus setelah DB ter-update.
        if ($oldPath && $oldPath !== $newPath) {
            $this->delete($oldPath);
        }

        return $lesson;
    }

    public function remove(Lesson $lesson): void
    {
        $path = $lesson->video_path;

        $lesson->update([
            'video_path' => null,
            'video_original_name' => null,
            'video_mime' => null,
            'video_size' => null,
            'video_status' => null,
            'video_failure_reason' => null,
            'duration_seconds' => null,
        ]);

        $this->delete($path);
    }

    public function delete(?string $path): void
    {
        if (blank($path)) {
            return;
        }

        Storage::disk($this->disk())->delete($path);
    }

    private function disk(): string
    {
        return config('video.disk');
    }
}

<?php

namespace App\Services;

use App\Models\Lesson;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class VideoStreamService
{
    /**
     * Respons file video. BinaryFileResponse (Symfony) menangani header Range secara otomatis:
     * 200 untuk permintaan penuh, 206 Partial Content (+ Content-Range) untuk permintaan sebagian,
     * sehingga pemutar HTML5 dapat melakukan seek tanpa mengunduh seluruh file
     */
    public function response(Lesson $lesson): BinaryFileResponse
    {
        $disk = Storage::disk(config('video.disk'));
        $path = $lesson->video_path;

        if (blank($path) || ! $disk->exists($path)) {
            abort(404, 'Video tidak ditemukan.');
        }

        return response()->file($disk->path($path), [
            'Content-Type' => $lesson->video_mime ?: 'video/mp4',
            'Cache-Control' => 'private, max-age=0, must-revalidate',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }
}

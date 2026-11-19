<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class VideoStorageService
{
    public function delete(?string $path): void
    {
        if (blank($path)) {
            return;
        }

        Storage::disk(config('video.disk'))->delete($path);
    }
}

<?php

return [
    'disk' => env('VIDEO_DISK', 'local'),
    'directory' => 'videos',
    'allowed_mimes' => ['video/mp4', 'video/webm'],
    'max_size_kb' => (int) env('VIDEO_MAX_SIZE_KB', 204800), // 200 MB
];

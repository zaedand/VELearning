<?php

namespace App\Models;

use App\Enums\VideoStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lesson extends Model
{
    protected $fillable = [
        'course_id',
        'title',
        'description',
        'sort_order',
        'video_path',
        'video_original_name',
        'video_mime',
        'video_size',
        'video_status',
        'video_failure_reason',
        'duration_seconds',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'video_size' => 'integer',
            'duration_seconds' => 'integer',
            'video_status' => VideoStatus::class,
        ];
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function hasReadyVideo(): bool
    {
        return $this->video_status === VideoStatus::Ready && filled($this->video_path);
    }
}

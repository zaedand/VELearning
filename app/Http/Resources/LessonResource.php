<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Lesson */
class LessonResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'sort_order' => $this->sort_order,
            'video_status' => $this->video_status?->value,
            'video_original_name' => $this->video_original_name,
            'video_size' => $this->video_size,
            'duration_seconds' => $this->duration_seconds,
            'has_ready_video' => $this->hasReadyVideo(),
        ];
    }
}

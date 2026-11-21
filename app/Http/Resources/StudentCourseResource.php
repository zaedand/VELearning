<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Course */
class StudentCourseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'lessons_count' => $this->whenCounted('lessons'),
            'lessons' => StudentLessonResource::collection($this->whenLoaded('lessons')),
        ];
    }
}

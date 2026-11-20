<?php

namespace App\Services;

use App\Models\Course;
use App\Models\Lesson;
use Illuminate\Support\Facades\DB;

class LessonService
{
    public function __construct(
        private readonly VideoStorageService $videoStorage,
        private readonly LessonOrderingService $ordering,
    ) {}

    public function create(Course $course, array $data): Lesson
    {
        return DB::transaction(function () use ($course, $data) {
            // Kunci baris course (agar dua request bersamaan tidak menghasilkan sort_order yang sama).
            Course::whereKey($course->id)->lockForUpdate()->first();

            $nextOrder = (int) Lesson::where('course_id', $course->id)->max('sort_order') + 1;

            return $course->lessons()->create([
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'sort_order' => $nextOrder,
            ]);
        });
    }

    public function update(Lesson $lesson, array $data): Lesson
    {
        $lesson->update([
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
        ]);

        return $lesson;
    }

    public function delete(Lesson $lesson): void
    {
        $videoPath = $lesson->video_path;
        $courseId = $lesson->course_id;

        DB::transaction(function () use ($lesson, $courseId) {
            $lesson->delete();
            $this->ordering->normalize($courseId);
        });

        $this->videoStorage->delete($videoPath);
    }
}

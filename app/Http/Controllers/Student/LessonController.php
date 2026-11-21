<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\StudentCourseResource;
use App\Http\Resources\StudentLessonResource;
use App\Models\Course;
use App\Models\Lesson;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class LessonController extends Controller
{
    public function show(Course $course, Lesson $lesson): Response
    {
        Gate::authorize('view', $course);
        Gate::authorize('view', $lesson);

        $lessons = $course->lessons()->get()->values();
        $index = $lessons->search(fn (Lesson $item) => $item->id === $lesson->id);

        return Inertia::render('Student/Lessons/Show', [
            'course' => new StudentCourseResource($course->setRelation('lessons', $lessons)),
            'lesson' => [
                ...(new StudentLessonResource($lesson))->resolve(),
                'stream_url' => $lesson->hasReadyVideo()
                    ? route('videos.stream', $lesson, absolute: false)
                    : null,
            ],
            'previous' => $this->summary($index > 0 ? $lessons[$index - 1] : null),
            'next' => $this->summary($lessons[$index + 1] ?? null),
        ]);
    }

    private function summary(?Lesson $lesson): ?array
    {
        return $lesson ? ['id' => $lesson->id, 'title' => $lesson->title] : null;
    }
}

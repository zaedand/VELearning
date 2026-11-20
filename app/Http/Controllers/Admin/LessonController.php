<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreLessonRequest;
use App\Http\Requests\Admin\UpdateLessonRequest;
use App\Models\Course;
use App\Models\Lesson;
use App\Services\LessonService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

class LessonController extends Controller
{
    public function __construct(
        private readonly LessonService $lessons,
    ) {}

    public function store(StoreLessonRequest $request, Course $course): RedirectResponse
    {
        $this->lessons->create($course, $request->validated());

        return back()->with('success', 'Lesson berhasil ditambahkan.');
    }

    public function update(UpdateLessonRequest $request, Lesson $lesson): RedirectResponse
    {
        $this->lessons->update($lesson, $request->validated());

        return back()->with('success', 'Lesson berhasil diperbarui.');
    }

    public function destroy(Lesson $lesson): RedirectResponse
    {
        Gate::authorize('delete', $lesson);

        $this->lessons->delete($lesson);

        return back()->with('success', 'Lesson berhasil dihapus.');
    }
}

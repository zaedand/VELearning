<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CourseStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCourseRequest;
use App\Http\Requests\Admin\UpdateCourseRequest;
use App\Http\Resources\CourseResource;
use App\Models\Course;
use App\Services\CourseService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function __construct(
        private readonly CourseService $courses,
    ) {}

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Course::class);

        $search = trim((string) $request->query('search'));
        $status = CourseStatus::tryFrom((string) $request->query('status'));

        return Inertia::render('Admin/Courses/Index', [
            'courses' => CourseResource::collection(
                $this->courses->paginate($search ?: null, $status?->value)
            ),
            'filters' => [
                'search' => $search,
                'status' => $status?->value,
            ],
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Course::class);

        return Inertia::render('Admin/Courses/Create');
    }

    public function store(StoreCourseRequest $request): RedirectResponse
    {
        $course = $this->courses->create($request->validated(), $request->user());

        return redirect()
            ->route('admin.courses.edit', $course)
            ->with('success', 'Course berhasil dibuat. Silakan tambahkan lesson.');
    }

    public function edit(Course $course): Response
    {
        Gate::authorize('update', $course);

        return Inertia::render('Admin/Courses/Edit', [
            'course' => new CourseResource($course->load('lessons')),
            'videoRules' => $this->videoRules(),
        ]);
    }

    public function update(UpdateCourseRequest $request, Course $course): RedirectResponse
    {
        $this->courses->update($course, $request->validated());

        return back()->with('success', 'Course berhasil diperbarui.');
    }

    public function destroy(Course $course): RedirectResponse
    {
        Gate::authorize('delete', $course);

        $this->courses->delete($course);

        return redirect()
            ->route('admin.courses.index')
            ->with('success', 'Course berhasil dihapus.');
    }

    private function videoRules(): array
    {
        return [
            'max_size_bytes' => config('video.max_size_kb') * 1024,
            'allowed_mimes' => config('video.allowed_mimes'),
            'accept' => implode(',', config('video.allowed_mimes')),
        ];
    }
}

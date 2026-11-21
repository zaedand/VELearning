<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\StudentCourseResource;
use App\Models\Course;
use App\Services\CourseService;
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

        return Inertia::render('Student/Courses/Index', [
            'courses' => StudentCourseResource::collection(
                $this->courses->paginatePublished($search ?: null)
            ),
            'filters' => ['search' => $search],
        ]);
    }

    public function show(Course $course): Response
    {
        Gate::authorize('view', $course);

        return Inertia::render('Student/Courses/Show', [
            'course' => new StudentCourseResource($course->load('lessons')),
        ]);
    }
}

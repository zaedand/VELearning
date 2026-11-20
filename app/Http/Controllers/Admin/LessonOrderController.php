<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderLessonsRequest;
use App\Models\Course;
use App\Services\LessonOrderingService;
use Illuminate\Http\RedirectResponse;

class LessonOrderController extends Controller
{
    public function __construct(
        private readonly LessonOrderingService $ordering,
    ) {}

    public function __invoke(ReorderLessonsRequest $request, Course $course): RedirectResponse
    {
        $this->ordering->reorder($course, $request->validated('ordered_ids'));

        // Sengaja tanpa flash message: mengubah urutan berkali-kali tidak perlu memunculkan toast.
        return back();
    }
}

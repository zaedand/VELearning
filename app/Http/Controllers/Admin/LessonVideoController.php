<?php

namespace App\Http\Controllers\Admin;

use App\Exceptions\VideoUploadException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UploadLessonVideoRequest;
use App\Models\Lesson;
use App\Services\VideoStorageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

class LessonVideoController extends Controller
{
    public function __construct(
        private readonly VideoStorageService $videoStorage,
    ) {}

    public function store(UploadLessonVideoRequest $request, Lesson $lesson): RedirectResponse
    {
        try {
            $this->videoStorage->store($lesson, $request->file('video'));
        } catch (VideoUploadException $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Video berhasil diunggah.');
    }

    public function destroy(Lesson $lesson): RedirectResponse
    {
        Gate::authorize('update', $lesson);

        $this->videoStorage->remove($lesson);

        return back()->with('success', 'Video berhasil dihapus.');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Services\VideoStreamService;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class VideoStreamController extends Controller
{
    public function __construct(
        private readonly VideoStreamService $streamService,
    ) {}

    public function __invoke(Lesson $lesson): BinaryFileResponse
    {
        Gate::authorize('stream', $lesson);

        return $this->streamService->response($lesson);
    }
}

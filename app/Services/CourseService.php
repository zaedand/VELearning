<?php

namespace App\Services;

use App\Models\Course;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class CourseService
{
    public function __construct(
        private readonly VideoStorageService $videoStorage,
    ) {}

    public function paginate(?string $search, ?string $status, int $perPage = 10): LengthAwarePaginator
    {
        return Course::query()
            ->withCount('lessons')
            ->when($search, fn (Builder $query, string $term) => $query->where('title', 'like', "%{$term}%"))
            ->when($status, fn (Builder $query, string $value) => $query->where('status', $value))
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function create(array $data, User $creator): Course
    {
        return Course::create([
            ...$data,
            'created_by' => $creator->id,
        ]);
    }

    /**
     * Slug tidak diubah saat judul berubah agar URL tetap stabil.
     */
    public function update(Course $course, array $data): Course
    {
        $course->update($data);

        return $course;
    }

    public function delete(Course $course): void
    {
        $videoPaths = $course->lessons()
            ->whereNotNull('video_path')
            ->pluck('video_path');

        DB::transaction(fn () => $course->delete());

        $videoPaths->each(fn (string $path) => $this->videoStorage->delete($path));
    }
}

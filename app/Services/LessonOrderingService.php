<?php

namespace App\Services;

use App\Models\Course;
use App\Models\Lesson;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class LessonOrderingService
{
    /**
     * Terapkan urutan baru.
     *
     * @param  array<int, int|string>  $orderedIds
     */
    public function reorder(Course $course, array $orderedIds): void
    {
        DB::transaction(function () use ($course, $orderedIds) {
            $existingIds = Lesson::where('course_id', $course->id)
                ->lockForUpdate()
                ->pluck('id')
                ->map(fn ($id) => (int) $id)
                ->all();

            $givenIds = array_map('intval', $orderedIds);

            $expected = $existingIds;
            $actual = $givenIds;
            sort($expected);
            sort($actual);

            if ($expected !== $actual) {
                throw ValidationException::withMessages([
                    'ordered_ids' => 'Daftar urutan tidak sesuai dengan data saat ini. Muat ulang halaman lalu coba lagi.',
                ]);
            }

            foreach ($givenIds as $position => $id) {
                Lesson::whereKey($id)->update(['sort_order' => $position + 1]);
            }
        });
    }

    /**
     * Rapikan sort_order menjadi 1..n
     */
    public function normalize(int $courseId): void
    {
        Lesson::where('course_id', $courseId)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->pluck('id')
            ->each(fn ($id, $index) => Lesson::whereKey($id)->update(['sort_order' => $index + 1]));
    }
}

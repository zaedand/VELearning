<?php

namespace Tests\Feature\Admin;

use App\Models\Course;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LessonManagementTest extends TestCase
{
    use RefreshDatabase;

    private function makeCourse(string $title = 'Course Uji'): Course
    {
        return Course::create([
            'title' => $title,
            'description' => 'Deskripsi course.',
            'status' => 'draft',
        ]);
    }

    public function test_new_lessons_get_incremental_sort_order(): void
    {
        $admin = User::factory()->admin()->create();
        $course = $this->makeCourse();

        foreach (['A', 'B', 'C'] as $title) {
            $this->actingAs($admin)
                ->post(route('admin.courses.lessons.store', $course), ['title' => $title])
                ->assertRedirect();
        }

        $this->assertSame(
            ['A' => 1, 'B' => 2, 'C' => 3],
            $course->lessons()->pluck('sort_order', 'title')->all()
        );
    }

    public function test_lesson_title_is_required(): void
    {
        $admin = User::factory()->admin()->create();
        $course = $this->makeCourse();

        $this->actingAs($admin)
            ->post(route('admin.courses.lessons.store', $course), ['title' => ''])
            ->assertSessionHasErrors('title');
    }

    public function test_admin_can_update_lesson(): void
    {
        $admin = User::factory()->admin()->create();
        $lesson = $this->makeCourse()->lessons()->create(['title' => 'Lama', 'sort_order' => 1]);

        $this->actingAs($admin)
            ->put(route('admin.lessons.update', $lesson), ['title' => 'Baru', 'description' => 'Keterangan'])
            ->assertRedirect();

        $this->assertDatabaseHas('lessons', [
            'id' => $lesson->id,
            'title' => 'Baru',
            'description' => 'Keterangan',
        ]);
    }

    public function test_admin_can_reorder_lessons(): void
    {
        $admin = User::factory()->admin()->create();
        $course = $this->makeCourse();
        $a = $course->lessons()->create(['title' => 'A', 'sort_order' => 1]);
        $b = $course->lessons()->create(['title' => 'B', 'sort_order' => 2]);
        $c = $course->lessons()->create(['title' => 'C', 'sort_order' => 3]);

        $this->actingAs($admin)
            ->patch(route('admin.courses.lessons.reorder', $course), [
                'ordered_ids' => [$c->id, $a->id, $b->id],
            ])
            ->assertRedirect();

        $this->assertSame(['C', 'A', 'B'], $course->lessons()->pluck('title')->all());
    }

    public function test_reorder_rejects_ids_from_another_course(): void
    {
        $admin = User::factory()->admin()->create();
        $course = $this->makeCourse('Course 1');
        $other = $this->makeCourse('Course 2');
        $mine = $course->lessons()->create(['title' => 'Milik saya', 'sort_order' => 1]);
        $foreign = $other->lessons()->create(['title' => 'Milik lain', 'sort_order' => 1]);

        $this->actingAs($admin)
            ->patch(route('admin.courses.lessons.reorder', $course), [
                'ordered_ids' => [$mine->id, $foreign->id],
            ])
            ->assertSessionHasErrors('ordered_ids');

        $this->assertDatabaseHas('lessons', ['id' => $foreign->id, 'course_id' => $other->id]);
    }

    public function test_deleting_a_lesson_closes_the_gap_in_sort_order(): void
    {
        $admin = User::factory()->admin()->create();
        $course = $this->makeCourse();
        $course->lessons()->create(['title' => 'A', 'sort_order' => 1]);
        $middle = $course->lessons()->create(['title' => 'B', 'sort_order' => 2]);
        $course->lessons()->create(['title' => 'C', 'sort_order' => 3]);

        $this->actingAs($admin)
            ->delete(route('admin.lessons.destroy', $middle))
            ->assertRedirect();

        $this->assertSame(['A' => 1, 'C' => 2], $course->lessons()->pluck('sort_order', 'title')->all());
    }

    public function test_student_cannot_manage_lessons(): void
    {
        $student = User::factory()->create();
        $course = $this->makeCourse();

        $this->actingAs($student)
            ->post(route('admin.courses.lessons.store', $course), ['title' => 'Terlarang'])
            ->assertForbidden();
    }
}

<?php

namespace Tests\Feature\Admin;

use App\Models\Course;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CourseCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_cannot_access_admin_courses(): void
    {
        $student = User::factory()->create();

        $this->actingAs($student)
            ->get(route('admin.courses.index'))
            ->assertForbidden();
    }

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get(route('admin.courses.index'))
            ->assertRedirect(route('login'));
    }

    public function test_admin_can_create_course_with_generated_slug(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->post(route('admin.courses.store'), [
                'title' => 'Course Uji Coba',
                'description' => 'Deskripsi course uji coba.',
                'status' => 'draft',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('courses', [
            'title' => 'Course Uji Coba',
            'slug' => 'course-uji-coba',
            'created_by' => $admin->id,
        ]);
    }

    public function test_title_is_required(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->post(route('admin.courses.store'), [
                'title' => '',
                'description' => 'Deskripsi.',
                'status' => 'draft',
            ])
            ->assertSessionHasErrors('title');
    }

    public function test_invalid_status_is_rejected(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->post(route('admin.courses.store'), [
                'title' => 'Course',
                'description' => 'Deskripsi.',
                'status' => 'archived',
            ])
            ->assertSessionHasErrors('status');
    }

    public function test_admin_can_delete_course_and_its_lessons(): void
    {
        $admin = User::factory()->admin()->create();
        $course = Course::create([
            'title' => 'Course Dihapus',
            'description' => 'Deskripsi.',
            'status' => 'draft',
        ]);
        $course->lessons()->create(['title' => 'Lesson 1', 'sort_order' => 1]);

        $this->actingAs($admin)
            ->delete(route('admin.courses.destroy', $course))
            ->assertRedirect(route('admin.courses.index'));

        $this->assertDatabaseMissing('courses', ['id' => $course->id]);
        $this->assertDatabaseMissing('lessons', ['course_id' => $course->id]);
    }
}

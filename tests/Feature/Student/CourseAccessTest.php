<?php

namespace Tests\Feature\Student;

use App\Models\Course;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CourseAccessTest extends TestCase
{
    use RefreshDatabase;

    private function makeCourse(string $title, string $status): Course
    {
        return Course::create([
            'title' => $title,
            'description' => 'Deskripsi course.',
            'status' => $status,
        ]);
    }

    public function test_catalog_lists_only_published_courses(): void
    {
        $student = User::factory()->create();
        $this->makeCourse('Course Terbit', 'published');
        $this->makeCourse('Course Draf', 'draft');

        $this->actingAs($student)
            ->get(route('courses.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Student/Courses/Index')
                ->has('courses.data', 1)
                ->where('courses.data.0.title', 'Course Terbit'));
    }

    public function test_student_can_open_published_course(): void
    {
        $student = User::factory()->create();
        $course = $this->makeCourse('Course Terbit', 'published');

        $this->actingAs($student)
            ->get(route('courses.show', $course))
            ->assertOk();
    }

    public function test_student_cannot_open_draft_course(): void
    {
        $student = User::factory()->create();
        $course = $this->makeCourse('Course Draf', 'draft');

        $this->actingAs($student)
            ->get(route('courses.show', $course))
            ->assertForbidden();
    }

    public function test_lesson_page_exposes_stream_url_only_when_video_is_ready(): void
    {
        $student = User::factory()->create();
        $course = $this->makeCourse('Course Terbit', 'published');
        $withVideo = $course->lessons()->create([
            'title' => 'Ada video',
            'sort_order' => 1,
            'video_path' => 'videos/a.mp4',
            'video_status' => 'ready',
        ]);
        $withoutVideo = $course->lessons()->create(['title' => 'Belum ada video', 'sort_order' => 2]);

        $this->actingAs($student)
            ->get(route('courses.lessons.show', [$course, $withVideo]))
            ->assertInertia(fn (Assert $page) => $page
                ->component('Student/Lessons/Show')
                ->where('lesson.stream_url', route('videos.stream', $withVideo, absolute: false)));

        $this->actingAs($student)
            ->get(route('courses.lessons.show', [$course, $withoutVideo]))
            ->assertInertia(fn (Assert $page) => $page->where('lesson.stream_url', null));
    }

    public function test_lesson_from_another_course_returns_not_found(): void
    {
        $student = User::factory()->create();
        $course = $this->makeCourse('Course A', 'published');
        $other = $this->makeCourse('Course B', 'published');
        $foreignLesson = $other->lessons()->create(['title' => 'Milik B', 'sort_order' => 1]);

        $this->actingAs($student)
            ->get(route('courses.lessons.show', [$course, $foreignLesson]))
            ->assertNotFound();
    }

    public function test_admin_cannot_use_student_catalog(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->get(route('courses.index'))
            ->assertForbidden();
    }
}

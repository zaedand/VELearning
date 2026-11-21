<?php

namespace Tests\Feature;

use App\Enums\VideoStatus;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class VideoStreamAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    private const VIDEO_PATH = 'videos/contoh.mp4';
    private const VIDEO_SIZE = 1000;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake(config('video.disk'));
        Storage::disk(config('video.disk'))->put(self::VIDEO_PATH, str_repeat('a', self::VIDEO_SIZE));
    }

    private function makeLesson(string $courseStatus = 'published', VideoStatus $videoStatus = VideoStatus::Ready): Lesson
    {
        $course = Course::create([
            'title' => 'Course Uji',
            'description' => 'Deskripsi course.',
            'status' => $courseStatus,
        ]);

        return $course->lessons()->create([
            'title' => 'Lesson Uji',
            'sort_order' => 1,
            'video_path' => self::VIDEO_PATH,
            'video_mime' => 'video/mp4',
            'video_size' => self::VIDEO_SIZE,
            'video_status' => $videoStatus,
        ]);
    }

    public function test_guest_is_redirected_to_login(): void
    {
        $lesson = $this->makeLesson();

        $this->get(route('videos.stream', $lesson))->assertRedirect(route('login'));
    }

    public function test_student_can_stream_ready_video_of_published_course(): void
    {
        $student = User::factory()->create();
        $lesson = $this->makeLesson();

        $this->actingAs($student)
            ->get(route('videos.stream', $lesson))
            ->assertOk()
            ->assertHeader('Content-Type', 'video/mp4')
            ->assertHeader('Accept-Ranges', 'bytes');
    }

    public function test_range_request_returns_partial_content(): void
    {
        $student = User::factory()->create();
        $lesson = $this->makeLesson();

        $this->actingAs($student)
            ->get(route('videos.stream', $lesson), ['Range' => 'bytes=0-99'])
            ->assertStatus(206)
            ->assertHeader('Content-Range', 'bytes 0-99/'.self::VIDEO_SIZE);
    }

    public function test_student_cannot_stream_video_of_draft_course(): void
    {
        $student = User::factory()->create();
        $lesson = $this->makeLesson('draft');

        $this->actingAs($student)
            ->get(route('videos.stream', $lesson))
            ->assertForbidden();
    }

    public function test_student_cannot_stream_video_that_is_not_ready(): void
    {
        $student = User::factory()->create();

        foreach ([VideoStatus::Uploading, VideoStatus::Failed] as $status) {
            $lesson = $this->makeLesson('published', $status);

            $this->actingAs($student)
                ->get(route('videos.stream', $lesson))
                ->assertForbidden();
        }
    }

    public function test_admin_can_stream_video_of_draft_course(): void
    {
        $admin = User::factory()->admin()->create();
        $lesson = $this->makeLesson('draft');

        $this->actingAs($admin)
            ->get(route('videos.stream', $lesson))
            ->assertOk();
    }

    public function test_missing_file_returns_not_found(): void
    {
        $student = User::factory()->create();
        $lesson = $this->makeLesson();
        Storage::disk(config('video.disk'))->delete(self::VIDEO_PATH);

        $this->actingAs($student)
            ->get(route('videos.stream', $lesson))
            ->assertNotFound();
    }
}

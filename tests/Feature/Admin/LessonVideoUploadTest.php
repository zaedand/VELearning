<?php

namespace Tests\Feature\Admin;

use App\Enums\VideoStatus;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class LessonVideoUploadTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake(config('video.disk'));
    }

    private function makeLesson(): Lesson
    {
        $course = Course::create([
            'title' => 'Course Uji',
            'description' => 'Deskripsi course.',
            'status' => 'draft',
        ]);

        return $course->lessons()->create(['title' => 'Lesson Uji', 'sort_order' => 1]);
    }

    private function upload(User $user, Lesson $lesson, UploadedFile $file)
    {
        return $this->actingAs($user)->post(
            route('admin.lessons.video.store', $lesson),
            ['video' => $file]
        );
    }

    public function test_admin_can_upload_mp4_video(): void
    {
        $admin = User::factory()->admin()->create();
        $lesson = $this->makeLesson();

        $this->upload($admin, $lesson, UploadedFile::fake()->create('materi.mp4', 1024, 'video/mp4'))
            ->assertRedirect()
            ->assertSessionHasNoErrors();

        $lesson->refresh();

        $this->assertSame(VideoStatus::Ready, $lesson->video_status);
        $this->assertSame('materi.mp4', $lesson->video_original_name);
        $this->assertSame('video/mp4', $lesson->video_mime);
        Storage::disk(config('video.disk'))->assertExists($lesson->video_path);
    }

    public function test_stored_filename_is_uuid_and_ignores_client_filename(): void
    {
        $admin = User::factory()->admin()->create();
        $lesson = $this->makeLesson();

        $this->upload($admin, $lesson, UploadedFile::fake()->create('../../evil.mp4', 100, 'video/mp4'));

        $this->assertMatchesRegularExpression(
            '#^videos/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.mp4$#',
            $lesson->fresh()->video_path
        );
    }

    public function test_non_video_file_is_rejected(): void
    {
        $admin = User::factory()->admin()->create();
        $lesson = $this->makeLesson();

        $this->upload($admin, $lesson, UploadedFile::fake()->create('dokumen.pdf', 100, 'application/pdf'))
            ->assertSessionHasErrors('video');

        $this->assertNull($lesson->fresh()->video_status);
        $this->assertNull($lesson->fresh()->video_path);
    }

    public function test_oversized_video_is_rejected(): void
    {
        config(['video.max_size_kb' => 1024]);

        $admin = User::factory()->admin()->create();
        $lesson = $this->makeLesson();

        $this->upload($admin, $lesson, UploadedFile::fake()->create('besar.mp4', 2048, 'video/mp4'))
            ->assertSessionHasErrors('video');

        $this->assertNull($lesson->fresh()->video_path);
    }

    public function test_replacing_video_deletes_the_old_file(): void
    {
        $admin = User::factory()->admin()->create();
        $lesson = $this->makeLesson();

        $this->upload($admin, $lesson, UploadedFile::fake()->create('lama.mp4', 100, 'video/mp4'));
        $oldPath = $lesson->fresh()->video_path;

        $this->upload($admin, $lesson, UploadedFile::fake()->create('baru.webm', 100, 'video/webm'));
        $newPath = $lesson->fresh()->video_path;

        $this->assertNotSame($oldPath, $newPath);
        Storage::disk(config('video.disk'))->assertMissing($oldPath);
        Storage::disk(config('video.disk'))->assertExists($newPath);
    }

    public function test_admin_can_remove_video(): void
    {
        $admin = User::factory()->admin()->create();
        $lesson = $this->makeLesson();

        $this->upload($admin, $lesson, UploadedFile::fake()->create('materi.mp4', 100, 'video/mp4'));
        $path = $lesson->fresh()->video_path;

        $this->actingAs($admin)
            ->delete(route('admin.lessons.video.destroy', $lesson))
            ->assertRedirect();

        $lesson->refresh();
        $this->assertNull($lesson->video_path);
        $this->assertNull($lesson->video_status);
        Storage::disk(config('video.disk'))->assertMissing($path);
    }

    public function test_deleting_lesson_deletes_its_video_file(): void
    {
        $admin = User::factory()->admin()->create();
        $lesson = $this->makeLesson();

        $this->upload($admin, $lesson, UploadedFile::fake()->create('materi.mp4', 100, 'video/mp4'));
        $path = $lesson->fresh()->video_path;

        $this->actingAs($admin)->delete(route('admin.lessons.destroy', $lesson));

        Storage::disk(config('video.disk'))->assertMissing($path);
    }

    public function test_student_cannot_upload_video(): void
    {
        $student = User::factory()->create();
        $lesson = $this->makeLesson();

        $this->upload($student, $lesson, UploadedFile::fake()->create('materi.mp4', 100, 'video/mp4'))
            ->assertForbidden();

        $this->assertNull($lesson->fresh()->video_path);
    }
}

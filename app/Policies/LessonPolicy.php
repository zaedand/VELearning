<?php

namespace App\Policies;

use App\Models\Lesson;
use App\Models\User;

class LessonPolicy
{
    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, Lesson $lesson): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, Lesson $lesson): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, Lesson $lesson): bool
    {
        return $user->isAdmin() || $lesson->course->isPublished();
    }

    public function stream(User $user, Lesson $lesson): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $lesson->course->isPublished() && $lesson->hasReadyVideo();
    }
}

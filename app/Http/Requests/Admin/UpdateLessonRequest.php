<?php

namespace App\Http\Requests\Admin;

class UpdateLessonRequest extends StoreLessonRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('lesson')) ?? false;
    }
}

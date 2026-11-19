<?php

namespace App\Http\Requests\Admin;

use App\Enums\CourseStatus;
use App\Models\Course;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Course::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
            'status' => ['required', Rule::enum(CourseStatus::class)],
        ];
    }

    public function attributes(): array
    {
        return [
            'title' => 'Judul',
            'description' => 'Deskripsi',
            'status' => 'Status publikasi',
        ];
    }

    public function messages(): array
    {
        return [
            'required' => ':attribute wajib diisi.',
            'string' => ':attribute harus berupa teks.',
            'max' => ':attribute maksimal :max karakter.',
            'enum' => ':attribute tidak valid.',
        ];
    }
}

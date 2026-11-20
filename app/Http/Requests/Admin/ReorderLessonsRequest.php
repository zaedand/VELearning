<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ReorderLessonsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('course')) ?? false;
    }

    public function rules(): array
    {
        return [
            'ordered_ids' => ['required', 'array', 'min:1'],
            'ordered_ids.*' => ['required', 'integer', 'distinct'],
        ];
    }

    public function attributes(): array
    {
        return [
            'ordered_ids' => 'Urutan lesson',
            'ordered_ids.*' => 'Urutan lesson',
        ];
    }

    public function messages(): array
    {
        return [
            'required' => ':attribute wajib diisi.',
            'array' => ':attribute tidak valid.',
            'integer' => ':attribute tidak valid.',
            'distinct' => ':attribute tidak boleh duplikat.',
        ];
    }
}

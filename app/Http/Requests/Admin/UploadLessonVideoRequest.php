<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UploadLessonVideoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('lesson')) ?? false;
    }

    public function rules(): array
    {
        return [
            'video' => [
                'required',
                'file',
                'mimetypes:'.implode(',', config('video.allowed_mimes')),
                'mimes:mp4,webm',
                'max:'.config('video.max_size_kb'),
            ],
        ];
    }

    public function messages(): array
    {
        $maxMb = (int) round(config('video.max_size_kb') / 1024);

        return [
            'video.required' => 'Pilih file video terlebih dahulu.',
            'video.file' => 'Berkas yang dipilih harus berupa file.',
            'video.uploaded' => 'Video gagal diunggah. Ukuran file mungkin melebihi batas upload di server.',
            'video.mimetypes' => 'Format video harus MP4 atau WebM.',
            'video.mimes' => 'Format video harus MP4 atau WebM.',
            'video.max' => "Ukuran video maksimal {$maxMb} MB.",
        ];
    }
}

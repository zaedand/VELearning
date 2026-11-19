<?php

namespace App\Models;

use App\Enums\CourseStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Course extends Model
{
    protected $fillable = [
        'created_by',
        'title',
        'slug',
        'description',
        'status',
        'thumbnail_path',
    ];

    protected function casts(): array
    {
        return [
            'status' => CourseStatus::class,
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Course $course) {
            if (blank($course->slug)) {
                $course->slug = static::generateUniqueSlug($course->title);
            }
        });
    }

    public static function generateUniqueSlug(string $title): string
    {
        $base = Str::slug($title) ?: 'course';
        $slug = $base;
        $suffix = 2;

        while (static::where('slug', $slug)->exists()) {
            $slug = $base.'-'.$suffix++;
        }

        return $slug;
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class)->orderBy('sort_order');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', CourseStatus::Published);
    }

    public function isPublished(): bool
    {
        return $this->status === CourseStatus::Published;
    }
}

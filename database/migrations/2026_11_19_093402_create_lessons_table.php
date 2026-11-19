<?php

use App\Enums\VideoStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->unsignedInteger('sort_order');
            $table->string('video_path')->nullable();
            $table->string('video_original_name')->nullable();
            $table->string('video_mime', 100)->nullable();
            $table->unsignedBigInteger('video_size')->nullable();
            $table->enum('video_status', array_column(VideoStatus::cases(), 'value'))->nullable();
            $table->string('video_failure_reason')->nullable();
            $table->unsignedInteger('duration_seconds')->nullable();
            $table->timestamps();

            $table->index(['course_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lessons');
    }
};

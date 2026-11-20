<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardRedirectController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\CourseController;
use App\Http\Controllers\Admin\LessonController;
use App\Http\Controllers\Admin\LessonOrderController;
use App\Http\Controllers\Admin\LessonVideoController;


Route::middleware(['auth', 'role:admin'])
->prefix('admin')
->name('admin.')
->group(function () {
    Route::resource('courses', CourseController::class)->except('show');

    Route::post('courses/{course}/lessons', [LessonController::class, 'store'])
    ->name('courses.lessons.store');
    Route::patch('courses/{course}/lessons/reorder', LessonOrderController::class)
    ->name('courses.lessons.reorder');
    Route::put('lessons/{lesson}', [LessonController::class, 'update'])
    ->name('lessons.update');
    Route::delete('lessons/{lesson}', [LessonController::class, 'destroy'])
    ->name('lessons.destroy');
    Route::post('lessons/{lesson}/video', [LessonVideoController::class, 'store'])
        ->name('lessons.video.store');
    Route::delete('lessons/{lesson}/video', [LessonVideoController::class, 'destroy'])
        ->name('lessons.video.destroy');
});

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/dashboard', DashboardRedirectController::class)
    ->middleware('auth')
    ->name('dashboard');

// SEMENTARA: akan diganti controller student pada tahap area student
Route::middleware(['auth', 'role:student'])->group(function () {
    Route::get('courses', fn () => Inertia::render('Dashboard'))->name('courses.index');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

<?php
use App\Http\Controllers\DashboardRedirectController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VideoStreamController;
use App\Http\Controllers\Admin\CourseController as AdminCourseController;
use App\Http\Controllers\Admin\LessonController as AdminLessonController;
use App\Http\Controllers\Admin\LessonOrderController;
use App\Http\Controllers\Admin\LessonVideoController;
use App\Http\Controllers\Student\CourseController as StudentCourseController;
use App\Http\Controllers\Student\LessonController as StudentLessonController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

/*
|--------------------------------------------------------------------------
| Dashboard Redirect
|--------------------------------------------------------------------------
*/

Route::get('/dashboard', DashboardRedirectController::class)
    ->middleware('auth')
    ->name('dashboard');

/*
|--------------------------------------------------------------------------
| Student Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:student'])
    ->group(function () {

        // Course
        Route::get('/courses', [StudentCourseController::class, 'index'])
            ->name('courses.index');

        Route::get('/courses/{course:slug}', [StudentCourseController::class, 'show'])
            ->name('courses.show');

        // Lesson
        Route::get('/courses/{course:slug}/lessons/{lesson}', [StudentLessonController::class, 'show'])
            ->scopeBindings()
            ->name('courses.lessons.show');
    });

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        // Course Management
        Route::resource('courses', AdminCourseController::class)
            ->except(['show']);

        // Lesson Management
        Route::post('/courses/{course}/lessons', [AdminLessonController::class, 'store'])
            ->name('courses.lessons.store');

        Route::patch('/courses/{course}/lessons/reorder', LessonOrderController::class)
            ->name('courses.lessons.reorder');

        Route::put('/lessons/{lesson}', [AdminLessonController::class, 'update'])
            ->name('lessons.update');

        Route::delete('/lessons/{lesson}', [AdminLessonController::class, 'destroy'])
            ->name('lessons.destroy');

        // Lesson Video Management
        Route::post('/lessons/{lesson}/video', [LessonVideoController::class, 'store'])
            ->name('lessons.video.store');

        Route::delete('/lessons/{lesson}/video', [LessonVideoController::class, 'destroy'])
            ->name('lessons.video.destroy');
    });

/*
|--------------------------------------------------------------------------
| Video Streaming
|--------------------------------------------------------------------------
*/

Route::get('/videos/{lesson}/stream', VideoStreamController::class)
    ->middleware(['auth', 'throttle:video-stream'])
    ->name('videos.stream');

/*
|--------------------------------------------------------------------------
| Profile Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth')
    ->group(function () {

        Route::get('/profile', [ProfileController::class, 'edit'])
            ->name('profile.edit');

        Route::patch('/profile', [ProfileController::class, 'update'])
            ->name('profile.update');

        Route::delete('/profile', [ProfileController::class, 'destroy'])
            ->name('profile.destroy');
    });

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

require __DIR__.'/auth.php';

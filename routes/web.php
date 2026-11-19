<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardRedirectController;
use App\Http\Controllers\Admin\CourseController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

// admin pada tahap Course CRUD
Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::resource('courses', CourseController::class)->except('show');
    });

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

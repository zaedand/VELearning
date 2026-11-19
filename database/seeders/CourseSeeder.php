<?php

namespace Database\Seeders;

use App\Enums\CourseStatus;
use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@example.com')->firstOrFail();

        foreach ($this->courses() as $data) {
            $course = Course::create([
                'created_by' => $admin->id,
                'title' => $data['title'],
                'description' => $data['description'],
                'status' => $data['status'],
            ]);

            foreach ($data['lessons'] as $index => [$title, $description]) {
                $course->lessons()->create([
                    'title' => $title,
                    'description' => $description,
                    'sort_order' => $index + 1,
                ]);
            }
        }
    }

    private function courses(): array
    {
        return [
            [
                'title' => 'Dasar Pemrograman Web dengan Laravel',
                'description' => 'Pelajari fondasi pengembangan aplikasi web modern dengan Laravel, mulai dari routing hingga autentikasi.',
                'status' => CourseStatus::Published,
                'lessons' => [
                    ['Pengenalan Laravel dan Struktur Proyek', 'Mengenal arsitektur MVC dan struktur folder Laravel.'],
                    ['Routing dan Controller', 'Mendefinisikan route dan mengelola request melalui controller.'],
                    ['Blade Template dan Layout', 'Membuat tampilan yang dapat dipakai ulang dengan Blade.'],
                    ['Migration dan Eloquent ORM', 'Mengelola skema database dan relasi antar model.'],
                    ['Validasi Form dan Autentikasi', 'Memvalidasi input pengguna dan mengamankan halaman.'],
                ],
            ],
            [
                'title' => 'Pengantar Basis Data MySQL',
                'description' => 'Memahami konsep basis data relasional dan menulis query yang efisien dengan MySQL.',
                'status' => CourseStatus::Published,
                'lessons' => [
                    ['Konsep Dasar Basis Data', 'Memahami tabel, baris, kolom, dan kunci.'],
                    ['Membuat Tabel dan Tipe Data', 'Merancang tabel dengan tipe data yang tepat.'],
                    ['Query SELECT, WHERE, dan ORDER BY', 'Mengambil dan menyaring data dengan benar.'],
                    ['Relasi Tabel dan JOIN', 'Menggabungkan data dari beberapa tabel.'],
                ],
            ],
            [
                'title' => 'React untuk Pemula',
                'description' => 'Membangun antarmuka interaktif dengan React, komponen, dan state.',
                'status' => CourseStatus::Draft,
                'lessons' => [
                    ['Pengenalan React dan JSX', 'Memahami konsep komponen dan sintaks JSX.'],
                    ['Komponen dan Props', 'Menyusun UI dari komponen yang dapat dipakai ulang.'],
                    ['State dan Event Handling', 'Mengelola data dinamis dan interaksi pengguna.'],
                ],
            ],
        ];
    }
}

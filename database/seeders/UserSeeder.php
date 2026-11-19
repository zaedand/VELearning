<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->admin()->create([
            'name' => 'Admin Demo',
            'email' => 'admin@example.com',
        ]);

        User::factory()->create([
            'name' => 'Student Demo',
            'email' => 'student@example.com',
        ]);
    }
}

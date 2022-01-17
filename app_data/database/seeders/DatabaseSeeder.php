<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(UserSeeder::class);
        $this->call(FollowSeeder::class);
        $this->call(CategorySeeder::class);
        $this->call(HabitSeeder::class);
        $this->call(HabitDoneDaySeeder::class);
        $this->call(HabitCommentSeeder::class);
        $this->call(DiarySeeder::class);
        $this->call(DiaryCommentSeeder::class);
    }
}

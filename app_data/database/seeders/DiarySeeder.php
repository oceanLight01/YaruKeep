<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Diary;

class DiarySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Diary::factory()->count(100)->create();
    }
}

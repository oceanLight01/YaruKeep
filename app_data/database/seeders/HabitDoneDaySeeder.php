<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\HabitDoneDay;

class HabitDoneDaySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        HabitDoneDay::factory()->count(200)->create();
    }
}

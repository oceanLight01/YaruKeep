<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class HabitDoneDayFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'habit_id' => $this->faker->numberBetween(1, 20),
            'created_at' => $this->faker->dateTimeBetween($startDate = '-2 years', $endDate = 'now')->format('Y-m-d')
        ];
    }
}

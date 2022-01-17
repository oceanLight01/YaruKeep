<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class DiaryFactory extends Factory
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
            'text' => $this->faker->realText(1000),
            'created_at' => $this->faker->datetime($max = 'now', $timezone = date_default_timezone_get()),
            'updated_at' => $this->faker->datetime($max = 'now', $timezone = date_default_timezone_get()),
        ];
    }
}

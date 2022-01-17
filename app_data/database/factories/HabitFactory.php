<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class HabitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'user_id' => $this->faker->numberBetween(1, 3),
            'category_id' => $this->faker->numberBetween(1, 15),
            'title' => $this->faker->text(50),
            'description' => $this->faker->realText(300),
            'max_done_day' => $this->faker->numberBetween(1, 300),
            'created_at' => $this->faker->datetime($max = 'now', $timezone = date_default_timezone_get()),
            'updated_at' => $this->faker->datetime($max = 'now', $timezone = date_default_timezone_get()),
        ];
    }
}

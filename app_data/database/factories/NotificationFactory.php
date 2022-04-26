<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class NotificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'id' => 1,
            'type' => 'App\Notifications\FollowUserNotification',
            'notifiable_type' => 'App\Models\User',
            'notifiable_id' => 1,
            'data' => '{"user_id":1,"name":"","screen_name":"test","type":"follow_notification"}',
            'read_at' => null
        ];
    }
}

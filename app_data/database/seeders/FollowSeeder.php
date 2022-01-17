<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Provider\DateTime;
use Carbon\Carbon;

class FollowSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            [
                'user_id' => 1,
                'following_user_id' => 2,
            ],
            [
                'user_id' => 2,
                'following_user_id' => 1,
            ],
            [
                'user_id' => 3,
                'following_user_id' => 1,
            ],
            [
                'user_id' => 3,
                'following_user_id' => 2,
            ],
        ];

        foreach ($data as $data) {
            DB::table('follows')->insert([
                "user_id" => $data['user_id'],
                "following_user_id" => $data['following_user_id'],
                'created_at' => DateTime::dateTimeThisDecade(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Provider\DateTime;
use Carbon\Carbon;

class HabitCommentSeeder extends Seeder
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
                'habit_id' => 1,
                'user_id' => 2,
                'parent_id' => null,
                '_lft' => 1,
                '_rgt' => 6,
                'comment' => '私も読書始めてみようかな',
            ],
            [
                'habit_id' => 1,
                'user_id' => 1,
                'parent_id' => 1,
                '_lft' => 2,
                '_rgt' => 5,
                'comment' => '本を読むのは楽しいですよ！',
            ],
            [
                'habit_id' => 1,
                'user_id' => 2,
                'parent_id' => 2,
                '_lft' => 3,
                '_rgt' => 4,
                'comment' => '今日から少しずつ始めてみます！',
            ],
            [
                'habit_id' => 2,
                'user_id' => 3,
                'parent_id' => null,
                '_lft' => 1,
                '_rgt' => 6,
                'comment' => 'ジム行くんですね、頑張ってください！',
            ],
            [
                'habit_id' => 2,
                'user_id' => 2,
                'parent_id' => 4,
                '_lft' => 2,
                '_rgt' => 5,
                'comment' => 'ありがとうございます！',
            ],
            [
                'habit_id' => 2,
                'user_id' => 1,
                'parent_id' => 5,
                '_lft' => 3,
                '_rgt' => 4,
                'comment' => '僕も応援しています！',
            ],
        ];

        foreach ($data as $data) {
            DB::table('habit_comments')->insert([
                'habit_id' => $data['habit_id'],
                'user_id' => $data['user_id'],
                'parent_id' => $data['parent_id'],
                'comment' => $data['comment'],
                '_lft' => $data['_lft'],
                '_rgt' => $data['_rgt'],
                'created_at' => DateTime::dateTimeThisDecade(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}

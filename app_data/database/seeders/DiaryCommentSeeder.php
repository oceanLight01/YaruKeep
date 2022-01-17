<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Provider\DateTime;
use Carbon\Carbon;

class DiaryCommentSeeder extends Seeder
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
                'diary_id' => 1,
                'user_id' => 2,
                'parent_id' => null,
                '_lft' => 1,
                '_rgt' => 4,
                'comment' => '私も読書始めてみようかな',
            ],
            [
                'diary_id' => 1,
                'user_id' => 1,
                'parent_id' => 1,
                '_lft' => 2,
                '_rgt' => 3,
                'comment' => '本を読むのは楽しいですよ！',
            ],
        ];

        foreach ($data as $data) {
            DB::table('diary_comments')->insert([
                'diary_id' => $data['diary_id'],
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

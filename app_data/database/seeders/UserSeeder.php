<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Faker\Provider\DateTime;
use Carbon\Carbon;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            [
                'name' => 'oceanLight',
                'screen_name' => 'oceanLight28',
                'email' => 'example@example.com',
                'password' => Hash::make('Qwer1234'),
                'profile' => "毎日コツコツ頑張っています。\n 今は情報技術の勉強中です。",
                'created_at' => DateTime::dateTimeThisDecade(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'スター',
                'screen_name' => 'star05',
                'email' => Str::random(10).'@gmail.com',
                'password' => Hash::make('password'),
                'profile' => "一緒に頑張りましょう！",
                'created_at' => DateTime::dateTimeThisDecade(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'ビスケット',
                'screen_name' => 'sweetSugar',
                'email' => Str::random(10).'@gmail.com',
                'password' => Hash::make('password'),
                'profile' => "英語を勉強しています！ \n 毎日英単語",
                'created_at' => DateTime::dateTimeThisDecade(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}

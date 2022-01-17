<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $category = [
            'ビジネススキル',
            '自己啓発',
            'プログラミング・開発',
            'スキルアップ',
            '資格取得',
            '外国語学習',
            '読書',
            '芸術',
            'ゲーム',
            '創作',
            '趣味',
            '学習',
            '運動・スポーツ',
            '料理',
            '健康・美容'
        ];

        foreach($category as $data) {
            DB::table('categories')->insert([
                ["category" => $data],
            ]);
        }
    }
}

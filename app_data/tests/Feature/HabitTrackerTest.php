<?php

namespace Tests\Feature;

use App\Models\Habit;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class HabitTrackerTest extends TestCase
{
    use RefreshDatabase;



    public function setUp(): void
    {
        parent::setUp();

        $this->artisan('migrate:fresh', ['--seed' => true]);

        $user = User::find(1);
        $this->actingAs($user);

        $this->screen_name = $user->screen_name;

        $this->habit = Habit::factory()->create([
            'id' => 21,
            'user_id' => 1,
        ]);
    }

    /**
     * トップページ内のハビットトラッカーを取得する
     */
    public function test_fetch_top_page_habitTracker()
    {
        $this->json('GET', '/api/habits/top')
            ->assertStatus(200)
            ->assertJson([
                'following_user_habits' => Array(),
                'newest_done_habits' => Array(),
                'same_category_habits' => Array()
            ]);
    }

    /**
     * ハビットトラッカーの作成に成功する
     */
    public function test_create_habitTracker()
    {
        $this->json('POST', '/api/habits', [
            'userId' => 1,
            'title' => 'test',
            'description' => '',
            'categoryId' => 1,
            'isPrivate' => false
        ])
            ->assertStatus(201);
    }

    /**
     * ハビットトラッカーの作成に失敗する
     */
    public function test_faild_create_habitTracker()
    {
        $this->json('POST', '/api/habits', [
            'userId' => 1,
            'title' => null,
            'description' => '',
            'categoryId' => 20,
            'isPrivate' => ''
        ])
            ->assertStatus(422)
            ->assertJson([
                'message' => 'The given data was invalid.',
                'errors' => [
                    'categoryId' => [
                        0 => 'カテゴリーIDは1以上15以下にしてください。'
                    ],
                    'title' => [
                        0 => '目標の項目は必須です。'
                    ],
                    'isPrivate' => [
                        0 => '公開設定の項目は必須です。'
                    ]
                ]
            ]
        );
    }

    /**
     * ハビットトラッカーの編集に成功する
     */
    public function test_edit_habitTracker()
    {
        $this->json('PUT', '/api/habits/21', [
            'habitId' => 21,
            'userId' => 1,
            'title' => 'test2',
            'description' => 'test',
            'categoryId' => 5,
            'isPrivate' => false
        ])
            ->assertStatus(200);
    }

    /**
     * ハビットトラッカーの編集に失敗する
     */
    public function test_faild_edit_habitTracker()
    {
        $this->json('PUT', '/api/habits/21', [
            'habitId' => 21,
            'userId' => 1,
            'title' => '',
            'description' => 'test',
            'categoryId' => 20,
            'isPrivate' => null
        ])
            ->assertStatus(422)
            ->assertJson([
                'message' => 'The given data was invalid.',
                'errors' => [
                    'categoryId' => [
                        0 => 'カテゴリーIDは1以上15以下にしてください。'
                    ],
                    'title' => [
                        0 => '目標の項目は必須です。'
                    ],
                    'isPrivate' => [
                        0 => '公開設定の項目は必須です。'
                    ]
                ]
            ]
        );
    }

    /**
     * ハビットトラッカーの達成に成功する
     */
    public function test_done_habitTracker()
    {
        $this->json('POST', '/api/habits/done', [
            'userId' => 1,
            'id' => 21,
        ])
        ->assertStatus(200);
    }

    /**
     * ハビットトラッカーの達成に失敗する
     */
    public function test_faild_done_habitTracker()
    {
        $this->json('POST', '/api/habits/done', [
            'userId' => 1,
            'id' => 21,
        ]);

        $this->json('POST', '/api/habits/done', [
            'userId' => 1,
            'id' => 21,
        ])
        ->assertStatus(400)
        ->assertJson(["message" => "This habit already done."]);

        $this->json('POST', '/api/habits/done', [
            'userId' => 2,
            'id' => 21,
        ])
        ->assertStatus(403);
    }

    /**
     * ハビットトラッカーの削除に成功する
     */
    public function test_delete_habitTracker()
    {
        $this->json('DELETE', '/api/habits/21')
            ->assertStatus(204);
    }

    /**
     * ハビットトラッカーの削除に失敗する
     */
    public function test_faild_delete_habitTracker()
    {
        $this->json('DELETE', '/api/habits/100')
            ->assertStatus(400);
    }

    /**
     * ユーザのハビットトラッカーの取得に成功する
     */
    public function test_fetch_user_habitTracker()
    {
        $this->json('GET', '/api/habits/'.$this->screen_name)
            ->assertStatus(200)
            ->assertJson([
                'data' => Array(),
                'links' => Array(),
                'meta' => Array()
            ]);
    }

    /**
     * ユーザのハビットトラッカーの取得に失敗する
     */
    public function test_faild_fetch_user_habitTracker()
    {
        $this->json('GET', '/api/habits/testuser')
            ->assertStatus(400)
            ->assertJson(['message' => 'Faild get habits']);
    }

    /**
     * 個別のハビットトラッカーの取得に成功する
     */
    public function test_fetch_show_user_habitTracker()
    {
        $this->json('GET', '/api/user/'.$this->screen_name.'/habits/21')
            ->assertStatus(200);
    }

    /**
     * 個別のハビットトラッカーの取得に失敗する
     */
    public function test_faild_fetch_show_user_habitTracker()
    {
        $this->json('GET', '/api/user/'.$this->screen_name.'/habits/100')
            ->assertStatus(404)
            ->assertJson(['message' => 'not found habit data']);
    }
}
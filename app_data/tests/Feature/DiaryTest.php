<?php

namespace Tests\Feature;

use App\Models\Diary;
use App\Models\Habit;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class DiaryTest extends TestCase
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
            'is_private' => 0,
        ]);
        $this->habit = Habit::factory()->create([
            'id' => 22,
            'user_id' => 1,
            'is_private' => 0,
        ]);
        $this->habit = Habit::factory()->create([
            'id' => 23,
            'user_id' => 1,
            'is_private' => 1,
        ]);

        $this->diary = Diary::factory()->create([
            'id' => 101,
            'habit_id' => 21,
        ]);
        $this->diary = Diary::factory()->create([
            'id' => 102,
            'habit_id' => 23,
        ]);
    }

    /**
     * 日記の作成に成功する
     */
    public function test_create_diary()
    {
        $this->json('POST', '/api/diaries', [
            'habitId' => 1,
            'text' => 'test'
        ])
        ->assertStatus(200);
    }

    /**
     * 日記の作成に失敗する
     */
    public function test_fail_create_diary()
    {
        $this->json('POST', '/api/diaries', [
            'habitId' => 1,
            'text' => ''
        ])
            ->assertStatus(422)
            ->assertJson([
                'message' => 'The given data was invalid.',
                'errors' => [
                    'text' => [
                        0 => '日記の項目は必須です。'
                    ],
                ]
            ]);
    }

    /**
     * その日すでに日記を投稿している場合に再度日記を投稿すると失敗する
     */
    public function test_fail_create_diary_same_day()
    {
        $this->json('POST', '/api/diaries', [
            'habitId' => 1,
            'text' => 'test'
        ]);

        $this->json('POST', '/api/diaries', [
            'habitId' => 1,
            'text' => 'test2'
        ])
            ->assertStatus(400)
            ->assertJson(['message' => 'faild to post diary']);
    }

    /**
     * 日記の編集に成功する
     */
    public function test_edit_diary()
    {
        $this->json('PUT', '/api/diaries/101', [
            'userId' => 1,
            'text' => 'test2'
        ])
            ->assertStatus(200);
    }

    /**
     * 日記の編集に失敗する
     */
    public function test_fail_edit_diary()
    {
        $this->json('PUT', '/api/diaries/101', [
            'userId' => 2,
            'text' => 'test2'
        ])
            ->assertStatus(400)
            ->assertJson(['message' => 'failed to update']);
    }

    /**
     * 日記の削除に成功する
     */
    public function test_delete_diary()
    {
        $this->json('DELETE', '/api/diaries/101')
            ->assertStatus(204);
    }

    /**
     * 日記の削除に失敗する
     */
    public function test_fail_delete_diary()
    {
        $this->json('DELETE', '/api/diaries/200')
            ->assertStatus(400)
            ->assertJson(['message' => 'failed to delete']);
    }

    /**
     * 単体の日記を取得
     */
    public function test_fetch_one_diary()
    {
        $this->json('GET', '/api/habits/21/diaries/101')
            ->assertStatus(200);
    }

    /**
     * 単体の日記の取得に失敗する
     */
    public function test_fail_fetch_one_diary()
    {
        $this->json('GET', '/api/habits/21/diaries/200')
            ->assertStatus(404)
            ->assertJson(['message' => 'not found diary data']);
    }

    /**
     * ハビットトラッカーに投稿された日記一覧を取得
     */
    public function test_fetch_habitTracker_diaries()
    {
        $this->json('GET', '/api/habits/21/diaries')
            ->assertStatus(200);
    }

    /**
     * ハビットトラッカーに投稿された日記一覧を取得し一件も存在しない
     */
    public function test_fetch_no_habitTracker_diaries()
    {
        $this->json('GET', '/api/habits/22/diaries')
            ->assertStatus(204);
    }

    /**
     * ハビットトラッカーが非公開の場合日記を取得できない
     */
    public function test_fail_fetch_private_habitTracker_diaries()
    {
        $this->json('GET', '/api/habits/23/diaries')
            ->assertStatus(404)
            ->assertJson(['message' => 'Not found diaries']);
    }
}

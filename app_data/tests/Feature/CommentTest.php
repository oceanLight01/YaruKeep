<?php

namespace Tests\Feature;

use App\Models\Diary;
use App\Models\DiaryComment;
use App\Models\Habit;
use App\Models\HabitComment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CommentTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();

        $this->artisan('migrate:fresh', ['--seed' => true]);

        $user = User::find(1);
        $this->actingAs($user);

        $this->habit = Habit::factory()->create([
            'id' => 21,
            'is_private' => 0,
            'user_id' => 1,
        ]);
    }

    /**
     * ハビットトラッカーへのコメントの投稿に成功する
     */
    public function test_create_habitTracker_comment()
    {
        $this->json('POST', '/api/comments/habit', [
            'comment' => 'test',
            'userId' => 1,
            'itemId' => 21,
            'parentId' => null
        ])
        ->assertStatus(200);
    }

    /**
     * ハビットトラッカーへのコメントの投稿に失敗する
     */
    public function test_faild_create_habitTracker_comment()
    {
        $this->json('POST', '/api/comments/habit', [
            'comment' => '',
            'userId' => 1,
            'itemId' => 21,
            'parentId' => null
        ])
        ->assertStatus(422)
        ->assertJson([
            'message' => 'The given data was invalid.',
            'errors' => [
                'comment' => [
                    'コメントの項目は必須です。'
                ]
            ]
        ]);
    }

    /**
     * ハビットトラッカーへのコメントの削除に成功する
     */
    public function test_delete_habitTracker_comment()
    {
        $this->json('DELETE', '/api/comments/2/habit')
            ->assertStatus(200);
    }

    /**
     * ハビットトラッカーへのコメントの削除に失敗する
     */
    public function test_fail_delete_habitTracker_comment()
    {
        $this->json('DELETE', '/api/comments/1/habit')
            ->assertStatus(400)
            ->assertJson(['message' => 'faild to delete']);
    }

    /**
     * 日記へのコメントの投稿に成功する
     */
    public function test_create_diary_comment()
    {
        $this->json('POST', '/api/comments/diary', [
            'comment' => 'test',
            'userId' => 1,
            'itemId' => 21,
            'parentId' => null
        ])
        ->assertStatus(200);
    }

    /**
     * 日記へのコメントの投稿に失敗する
     */
    public function test_faild_create_diary_comment()
    {
        $this->json('POST', '/api/comments/diary', [
            'comment' => '',
            'userId' => 1,
            'itemId' => 21,
            'parentId' => null
        ])
        ->assertStatus(422)
        ->assertJson([
            'message' => 'The given data was invalid.',
            'errors' => [
                'comment' => [
                    'コメントの項目は必須です。'
                ]
            ]
        ]);
    }

    /**
     * 日記へのコメントの削除に成功する
     */
    public function test_delete_diary_comment()
    {
        $this->json('DELETE', '/api/comments/2/diary')
            ->assertStatus(200);
    }

    /**
     * ハビットトラッカーへのコメントの削除に失敗する
     */
    public function test_fail_delete_diary_comment()
    {
        $this->json('DELETE', '/api/comments/1/diary')
            ->assertStatus(400)
            ->assertJson(['message' => 'faild to delete']);
    }
}

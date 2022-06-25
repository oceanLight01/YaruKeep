<?php

namespace Tests\Feature;

use App\Models\Habit;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class SearchTest extends TestCase
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
            'title' => 'test',
            'category_id' => 5,
            'user_id' => 1,
            'is_private' => 0,
        ]);
    }

    /**
     * ハビットトラッカーの検索に成功する
     */
    public function test_search_habitTracker()
    {
        // キーワードが含まれている場合
        $this->json('POST', '/api/search', [
            'keyword' => 'test',
            'categories' => [],
            'page' => 1
        ])
        ->assertStatus(200)
        ->assertJsonStructure([
            'habits',
            'meta' => [
                'current_page',
                'from',
                'per_page',
                'to',
                'total',
            ]
        ]);

        // カテゴリーが一致している場合
        $this->json('POST', '/api/search', [
            'keyword' => '',
            'categories' => [
                "5"
            ],
            'page' => 1
        ])
        ->assertStatus(200)
        ->assertJsonStructure([
            'habits',
            'meta' => [
                'current_page',
                'from',
                'per_page',
                'to',
                'total',
            ]
        ]);;

        // キーワードが含まれていてカテゴリーが一致している場合
        $this->json('POST', '/api/search', [
            'keyword' => 'test',
            'categories' => [
                "5"
            ],
            'page' => 1
        ])
        ->assertStatus(200)
        ->assertJsonStructure([
            'habits',
            'meta' => [
                'current_page',
                'from',
                'per_page',
                'to',
                'total',
            ]
        ]);;
    }

    /**
     * ハビットトラッカーの検索に成功するが結果が無い
     */
    public function test_search_habitTracker_no_result()
    {
        $this->json('POST', '/api/search', [
            'keyword' => 'testtest',
            'categories' => [
                "10"
            ],
            'page' => 1
        ])
            ->assertStatus(204);
    }

    /**
     * ハビットトラッカーの検索に失敗する
     */
    public function test_fail_search_habitTracker()
    {
        $this->json('POST', '/api/search', [
            'keyword' => '',
            'categories' => [],
            'page' => 1
        ])
        ->assertStatus(400)
        ->assertJson(['message' => 'need value keyword or categories']);
    }
}
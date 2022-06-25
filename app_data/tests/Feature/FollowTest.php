<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class FollowTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();

        $this->artisan('migrate:fresh', ['--seed' => true]);

        $user = User::find(1);
        $this->actingAs($user);

        $this->screen_name = $user->screen_name;
    }

    /**
     * ユーザのフォローに成功する
     */
    public function test_follow_user()
    {
        $this->json('POST', '/api/follow', [
            'user_id' => 1,
            'following_user_id' => 3
        ])
        ->assertStatus(200);
    }

    /**
     * ユーザのフォローに失敗する
     */
    public function test_fail_follow_user()
    {
        $this->json('POST', '/api/follow', [
            'user_id' => 1,
            'following_user_id' => 2
        ])
            ->assertStatus(400)
            ->assertJson(['message' => 'This user has already following.']);

        $this->json('POST', '/api/follow', [
            'user_id' => 3,
            'following_user_id' => 2
        ])
            ->assertStatus(400)
            ->assertJson(['message' => 'Failed to follow user.']);
    }

    /**
     * ユーザのフォロー解除に成功する
     */
    public function test_unfollow_user()
    {
        $this->json('POST', '/api/unfollow', [
            'user_id' => 1,
            'following_user_id' => 2
        ])
        ->assertStatus(200);
    }

    /**
     * ユーザのフォロー解除に失敗する
     */
    public function test_fail_unfollow_user()
    {
        $this->json('POST', '/api/unfollow', [
            'user_id' => 1,
            'following_user_id' => 3
        ])
            ->assertStatus(400)
            ->assertJson(['message' => 'This user has already unfollowing.']);

        $this->json('POST', '/api/unfollow', [
            'user_id' => 2,
            'following_user_id' => 3
        ])
            ->assertStatus(400)
            ->assertJson(['message' => 'Failed to unfollow user.']);
    }

    /**
     * ユーザのフォロー一覧取得に成功する
     */
    public function test_fetch_following_user_list()
    {
        $this->json('GET', '/api/following/'.$this->screen_name)
            ->assertStatus(200);
    }

    /**
     * ユーザのフォロー一覧取得に失敗する
     */
    public function test_fail_fetch_following_user_list()
    {
        $this->json('GET', '/api/following/nonUser')
            ->assertStatus(400)
            ->assertJson(['message' => 'Not found user data.']);
    }

    /**
     * ユーザのフォロワー一覧取得に成功する
     */
    public function test_fetch_followed_user_list()
    {
        $this->json('GET', '/api/followed/'.$this->screen_name)
            ->assertStatus(200);
    }

    /**
     * ユーザのフォロワー一覧取得に失敗する
     */
    public function test_fail_fetch_followed_user_list()
    {
        $this->json('GET', '/api/followed/nonUser')
            ->assertStatus(400)
            ->assertJson(['message' => 'Not found user data.']);
    }
}

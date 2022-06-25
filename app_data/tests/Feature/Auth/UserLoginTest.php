<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class UserLoginTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create([
            'email' => 'example@example.com'
        ]);
    }

    /**
     * ログインが正常に完了する
     */
    public function test_login_success()
    {
        $this->json('POST', '/api/login', [
            'email' => 'example@example.com',
            'password' => 'password',
            'remember' => true
        ])
        ->assertStatus(200);

        $this->assertAuthenticatedAs($this->user);
    }

    /**
     * メールアドレスが間違っていればエラーメッセージを返す。
     */
    public function test_invalid_email()
    {
        $this->json('POST', '/api/login', [
            'email' => 'example2@example.com',
            'password' => 'password',
            'remember' => true
        ])
        ->assertStatus(422)
        ->assertJson([
            "message" => "The given data was invalid.",
            "errors" => [
                'email' => ["メールアドレスかパスワードが一致しません。"],
            ]
        ]);

        $this->assertGuest();
    }

    /**
     * パスワードが間違っていればエラーメッセージを返す。
     */
    public function test_invalid_password()
    {
        $this->json('POST', '/api/login', [
            'email' => 'example@example.com',
            'password' => 'password2',
            'remember' => true
        ])
        ->assertStatus(422)
        ->assertJson([
            "message" => "The given data was invalid.",
            "errors" => [
                'email' => ["メールアドレスかパスワードが一致しません。"],
            ]
        ]);

        $this->assertGuest();
    }
}

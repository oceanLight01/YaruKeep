<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class UserRegisterTest extends TestCase
{
    use WithFaker;
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();

        User::factory()->create([
            'screen_name' => 'testname',
            'email' => 'example@example.com'
        ]);
    }

    /**
     * ユーザ登録が正常に完了する
     */
    public function test_user_register_success()
    {
        $this->json('POST', '/api/register', [
            'name' => 'username',
            'screen_name' => 'screen_name',
            'email' => $this->faker->safeEmail,
            'password' => 'Qwer1234',
            'password_confirmation' => 'Qwer1234',
        ])
        ->assertStatus(201);
    }

    /**
     * ユーザIDが重複した際にエラーメッセージを返す
     */
    public function test_must_unique_screen_name()
    {
        $this->json('POST', '/api/register', [
            'name' => 'username',
            'screen_name' => 'testname',
            'email' => 'example2@example.com',
            'password' => 'Qwer1234',
            'password_confirmation' => 'Qwer1234',
        ])
        ->assertStatus(422)
        ->assertJson([
            "message" => "The given data was invalid.",
            "errors" => [
                'screen_name' => ["このユーザIDはすでに登録されています。"],
            ]
        ]);
    }

    /**
     * メールアドレスが重複した際にエラーメッセージを返す
     */
    public function test_must_unique_email()
    {
        $this->json('POST', '/api/register', [
            'name' => 'username',
            'screen_name' => 'testname2',
            'email' => 'example@example.com',
            'password' => 'Qwer1234',
            'password_confirmation' => 'Qwer1234',
        ])
        ->assertStatus(422)
        ->assertJson([
            "message" => "The given data was invalid.",
            "errors" => [
                'email' => ["このメールアドレスはすでに登録されています。"],
            ]
        ]);
    }
}
